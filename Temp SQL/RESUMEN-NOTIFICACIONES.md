# 📋 Resumen: Sistema de Gestión de Notificaciones

## ✅ Lo que ya está implementado en disciplicando-admin

### Componente creado
- **Ubicación**: `components/NotificationsManager.jsx`
- **Ruta**: `/notifications`
- **Funcionalidades completas**:
  - ✅ Crear notificaciones (texto, video, audio)
  - ✅ Editar notificaciones existentes
  - ✅ Eliminar notificaciones
  - ✅ Filtrar por audiencia (todos, discípulos, discipuladores)
  - ✅ Filtrar por país
  - ✅ Filtrar por prioridad (baja, normal, alta, urgente)
  - ✅ Filtrar por idioma (español, inglés)
  - ✅ Asignar a usuarios específicos
  - ✅ Establecer fechas de expiración
  - ✅ Campo de idioma (es/en) - **NUEVO**

### Estructura de la tabla `notifications` (actual)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único |
| `title` | TEXT | Título de la notificación |
| `message` | TEXT | Mensaje de la notificación |
| `content_type` | TEXT | 'text', 'video', 'audio' |
| `target_role` | TEXT | 'all', 'disciples', 'disciplers' (NOT NULL) |
| `target_user_id` | UUID | Usuario específico (opcional) |
| `target_country` | TEXT | País específico (opcional) |
| `priority` | INTEGER | 1=baja, 2=normal, 3=alta, 4=urgente |
| `language` | TEXT | 'es' o 'en' (agregado) |
| `media_url` | TEXT | URL para video o audio |
| `is_active` | BOOLEAN | Si está activa |
| `expires_at` | TIMESTAMPTZ | Fecha de expiración (opcional) |
| `created_by` | UUID | ID del admin que la creó |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización (agregado) |

### Tabla `notification_reads` (para estado de lectura)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `notification_id` | UUID | ID de la notificación |
| `user_id` | UUID | ID del usuario |
| `read` | BOOLEAN | Si está leída |
| `read_at` | TIMESTAMPTZ | Fecha de lectura |

### Mapeo de datos que hace el admin

**Al crear/editar:**
```javascript
{
  title: "Título",
  message: "Mensaje",
  content_type: "text" | "video" | "audio",
  target_role: "all" | "disciples" | "disciplers",  // NOT NULL
  priority: 1 | 2 | 3 | 4,  // integer (1=baja, 2=normal, 3=alta, 4=urgente)
  language: "es" | "en",  // NUEVO
  target_country: "País" | null,
  media_url: "URL" | null,  // Para video o audio
  target_user_id: UUID | null,  // Si hay 1 usuario específico
  is_active: true,
  expires_at: TIMESTAMPTZ | null
}
```

**Asignación de usuarios:**
- Si hay **1 usuario**: se guarda en `target_user_id`
- Si hay **múltiples usuarios**: se crean registros en `notification_reads` (como no leídos)
- Si no hay usuarios: `target_user_id = null` y se limpia `notification_reads`

## 🔄 Lo que necesita implementarse en disciplicando-app

### 1. Visualización de notificaciones
- Mostrar lista de notificaciones del usuario
- Ordenar por prioridad (urgente primero)
- Filtrar por:
  - Idioma del usuario
  - Rol del usuario (si `target_role` no es "all")
  - País del usuario (si `target_country` está definido)
  - Notificaciones activas (`is_active = true`)
  - Notificaciones no expiradas (`expires_at IS NULL OR expires_at > NOW()`)
  - Notificaciones asignadas al usuario (`target_user_id = user.id`)

### 2. Indicador de no leído (punto rojo)
- Mostrar punto rojo si `read = false` en `notification_reads`
- O si no existe registro en `notification_reads` y `target_user_id = user.id`
- O si `target_role` coincide con el rol del usuario

### 3. Marcar como leída
- Cuando el usuario abre/ve la notificación:
  - Crear o actualizar registro en `notification_reads`
  - `read = true`
  - `read_at = NOW()`
  - El punto rojo desaparece

### 4. Reproducción de contenido
- **Texto**: Mostrar título y mensaje
- **Video**: Usar el reproductor de video de la app con `media_url`
- **Audio**: Usar el reproductor de audio de la app con `media_url`

### 5. Prioridades visuales
- **Urgente (4)**: Rojo, destacado, aparece primero
- **Alta (3)**: Naranja, más visible
- **Normal (2)**: Azul, estándar
- **Baja (1)**: Gris, menos prominente

## 📝 Queries SQL útiles para la app

### Obtener notificaciones para un usuario
```sql
SELECT n.*
FROM notifications n
WHERE n.is_active = true
  AND (n.expires_at IS NULL OR n.expires_at > NOW())
  AND (
    -- Audiencia general
    n.target_role = 'all'
    OR
    -- Audiencia por rol
    (n.target_role = 'disciples' AND u.role = 'discipulo')
    OR
    (n.target_role = 'disciplers' AND u.role IN ('discipulador', 'disciplicador'))
    OR
    -- Usuario específico
    n.target_user_id = u.uuid
    OR
    -- Asignado en notification_reads
    EXISTS (
      SELECT 1 FROM notification_reads nr
      WHERE nr.notification_id = n.id
      AND nr.user_id = u.uuid
    )
  )
  -- Idioma del usuario
  AND n.language = u.language_preference  -- o el campo que uses para idioma
  -- País (si aplica)
  AND (n.target_country IS NULL OR n.target_country = u.country)
ORDER BY n.priority DESC, n.created_at DESC;
```

### Verificar si está leída
```sql
SELECT read, read_at
FROM notification_reads
WHERE notification_id = :notification_id
  AND user_id = :user_id;
```

### Marcar como leída
```sql
INSERT INTO notification_reads (notification_id, user_id, read, read_at)
VALUES (:notification_id, :user_id, true, NOW())
ON CONFLICT (notification_id, user_id)  -- si hay constraint único
DO UPDATE SET read = true, read_at = NOW();
```

## 🎯 Funcionalidades clave a implementar

1. **Componente de visualización** (similar al que ya tienes)
   - Lista de notificaciones
   - Indicador de no leído (punto rojo)
   - Badge de prioridad con colores
   - Filtros básicos

2. **Lógica de asignación**
   - Verificar si la notificación aplica al usuario:
     - `target_role` coincide con su rol
     - `target_user_id` es su ID
     - Existe en `notification_reads`
     - `target_country` coincide (si aplica)

3. **Reproductores**
   - Integrar con los reproductores de video/audio existentes
   - Usar `media_url` para cargar el contenido

4. **Estado de lectura**
   - Al abrir notificación → marcar como leída
   - Actualizar UI (quitar punto rojo)

## 📌 Notas importantes

- El campo `language` es nuevo y debe agregarse a la tabla si no existe
- El campo `updated_at` también es nuevo
- Ver archivo `Temp SQL/notifications-schema-FIXED.sql` para el script SQL
- Las prioridades son números (1-4), no texto
- `target_role` es NOT NULL, puede ser "all", "disciples", o "disciplers"
- `media_url` se usa tanto para video como para audio (depende de `content_type`)

## 🔗 Archivos de referencia

- Componente admin: `components/NotificationsManager.jsx`
- SQL schema: `Temp SQL/notifications-schema-FIXED.sql`
- Traducciones: Ya están en `app/i18n.js` (ES/EN)

---

**Listo para implementar en disciplicando-app** 🚀

