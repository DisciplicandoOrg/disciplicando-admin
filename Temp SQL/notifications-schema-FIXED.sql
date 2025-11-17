-- Script para agregar columnas faltantes a la tabla notifications existente
-- Script to add missing columns to existing notifications table

-- 1. Agregar columna language si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'language'
    ) THEN
        ALTER TABLE notifications 
        ADD COLUMN language TEXT DEFAULT 'es' 
        CHECK (language IN ('es', 'en'));
        
        -- Actualizar registros existentes con idioma por defecto
        UPDATE notifications SET language = 'es' WHERE language IS NULL;
        
        -- Hacer NOT NULL después de actualizar
        ALTER TABLE notifications 
        ALTER COLUMN language SET NOT NULL;
    END IF;
END $$;

-- 2. Agregar columna updated_at si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE notifications 
        ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 3. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_notifications_target_role ON notifications(target_role);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_language ON notifications(language);
CREATE INDEX IF NOT EXISTS idx_notifications_target_country ON notifications(target_country);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_active ON notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_content_type ON notifications(content_type);

-- 4. Habilitar Row Level Security (RLS) si no está habilitado
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 5. Eliminar políticas existentes si las hay (para recrearlas)
DROP POLICY IF EXISTS "Anyone can read active notifications" ON notifications;
DROP POLICY IF EXISTS "Only admins can manage notifications" ON notifications;
DROP POLICY IF EXISTS "Users can read their notifications" ON notifications;

-- 6. Crear política para que todos puedan leer notificaciones activas
CREATE POLICY "Anyone can read active notifications"
ON notifications FOR SELECT
USING (
    is_active = true 
    AND (expires_at IS NULL OR expires_at > NOW())
);

-- 7. Crear política para que solo admins puedan crear/editar/eliminar
CREATE POLICY "Only admins can manage notifications"
ON notifications FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.uuid = auth.uid()
        AND users.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.uuid = auth.uid()
        AND users.role = 'admin'
    )
);

-- 8. Trigger para actualizar updated_at automáticamente
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

-- 9. Verificar estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

