-- Estructura esperada de la tabla notifications
-- Expected structure for notifications table

-- Para verificar la estructura actual, ejecuta en Supabase SQL Editor:
-- To verify current structure, run in Supabase SQL Editor:
/*
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;
*/

-- Script para crear/actualizar la tabla notifications con todas las columnas necesarias
-- Script to create/update notifications table with all required columns

-- Si la tabla ya existe, primero verifica qué columnas tiene
-- If table already exists, first check what columns it has

-- Crear tabla si no existe / Create table if not exists
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'video', 'audio')),
    audience TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all', 'disciples', 'disciplers')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en')),
    expires_at TIMESTAMPTZ,
    country TEXT,
    video_url TEXT,
    audio_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agregar columna language si no existe (para tablas existentes)
-- Add language column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'language'
    ) THEN
        ALTER TABLE notifications 
        ADD COLUMN language TEXT NOT NULL DEFAULT 'es' 
        CHECK (language IN ('es', 'en'));
    END IF;
END $$;

-- Crear índices para mejorar el rendimiento
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_audience ON notifications(audience);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_language ON notifications(language);
CREATE INDEX IF NOT EXISTS idx_notifications_country ON notifications(country);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Habilitar Row Level Security (RLS)
-- Enable Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan leer notificaciones activas
-- Policy for everyone to read active notifications
CREATE POLICY IF NOT EXISTS "Anyone can read active notifications"
ON notifications FOR SELECT
USING (
    (expires_at IS NULL OR expires_at > NOW())
);

-- Política para que solo admins puedan crear/editar/eliminar
-- Policy for only admins to create/edit/delete
CREATE POLICY IF NOT EXISTS "Only admins can manage notifications"
ON notifications FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.uuid = auth.uid()
        AND users.role = 'admin'
    )
);

-- Trigger para actualizar updated_at automáticamente
-- Trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON notifications;
CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Verificar estructura final
-- Verify final structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

