# 🎯 Disciplicando Admin

**Panel de administración completo para la plataforma Disciplicando**

Un sistema integral de gestión diseñado para administrar todos los aspectos de la plataforma de discipulado cristiano, desde la gestión de usuarios hasta la creación de contenido bíblico interactivo.

---

## 📖 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Arquitectura y Flujo](#-arquitectura-y-flujo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Guía de Instalación](#-guía-de-instalación)
- [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [Deployment](#-deployment)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Contribución](#-contribución)

---

## 🎯 Descripción General

**Disciplicando Admin** es el panel de control central que permite a los administradores gestionar completamente la plataforma Disciplicando. Este sistema proporciona herramientas poderosas para:

- **Gestionar usuarios** y sus relaciones de discipulado
- **Crear y editar contenido bíblico** interactivo
- **Asignar estudios** a usuarios específicos
- **Monitorear el progreso** de los discípulos
- **Generar reportes** y estadísticas
- **Configurar el sistema** completo

La aplicación está construida con **Next.js 15** y utiliza **Supabase** como backend, proporcionando una experiencia de administración moderna, segura y eficiente.

---

## 🚀 Características Principales

### 📊 Dashboard Dinámico
- **Vista general del sistema** con métricas en tiempo real
- Estadísticas de usuarios (total, discipuladores, discípulos, aprobados, pendientes)
- Accesos rápidos a todas las secciones principales
- Actualización automática de datos
- Interfaz responsive y moderna

### 👥 Gestión de Usuarios

#### Vista de Usuarios (`/users`)
- Lista completa de todos los usuarios del sistema
- Filtros avanzados por rol, estado de aprobación, y más
- Búsqueda en tiempo real
- Visualización detallada del progreso de cada usuario
- Modal de progreso con estadísticas completas:
  - Lecciones completadas
  - Series completadas
  - Puntuaciones de quizzes
  - Videos vistos

#### Agregar y Validar Usuarios (`/user-management`)
- **Agregar nuevos usuarios** manualmente al sistema
- **Validar usuarios pendientes** de aprobación
- Asignar roles (admin, discipulador, discípulo)
- Establecer relaciones de discipulado (asignar discipulador)
- Validar lecciones completadas por usuarios
- Generar tokens de invitación para nuevos usuarios
- Gestión completa de perfiles de usuario

### 🌳 Árbol de Discipulado (`/discipleship-tree`)
- **Visualización jerárquica** de todas las relaciones de discipulado
- Vista expandible/colapsable del árbol completo
- Indicadores de progreso por usuario
- Navegación intuitiva con zoom y controles
- Muestra:
  - Estructura completa de discipuladores y discípulos
  - Progreso de lecciones por usuario
  - Roles y estados de cada miembro

### 🔄 Reasignación de Discípulos (`/assignments/reassign`)
- **Sistema drag-and-drop** para mover discípulos entre discipuladores
- Interfaz visual intuitiva
- Validación antes de confirmar cambios
- Actualización en tiempo real de las relaciones

### 📚 Gestión de Contenido

#### Series (`/series`)
- Crear y editar series de estudios bíblicos
- Organización jerárquica: Series → Bloques → Lecciones
- Soporte multi-idioma (Español/Inglés)
- Activar/desactivar series
- Ordenamiento personalizado

#### Estudios Bíblicos (`/bible-studies`)
- **Editor completo de estudios bíblicos** interactivos
- Formato Markdown con soporte para:
  - Secciones dinámicas
  - Textos bíblicos
  - Preguntas de reflexión
  - Textareas para respuestas del usuario
  - Contenido multi-idioma
- Vista previa en tiempo real
- Validación de contenido
- Gestión de metadatos (título, referencia bíblica, etc.)

#### Guías Bíblicas (`/bible-guides`)
- Administración de guías en formato PDF
- Subida y gestión de archivos PDF
- Organización por series y temas
- Metadatos completos:
  - Título y descripción
  - Fecha de publicación
  - Texto bíblico relacionado
  - Temas y etiquetas
  - Idioma
- Activar/desactivar guías
- Descarga directa de PDFs

#### Quizzes (`/quizzes`)
- Gestión de evaluaciones y quizzes
- Asociación con lecciones
- Control de puntuaciones

### 📈 Reportes (`/reports`)
- Generación de reportes del sistema
- Estadísticas y análisis
- Exportación de datos
- Visualización tabular de información

### ⚙️ Configuración (`/settings`)
Panel completo de configuración con múltiples secciones:

#### General
- Nombre de la aplicación
- Zona horaria
- Idioma por defecto

#### Seguridad
- Políticas de contraseñas
- Autenticación de dos factores
- Timeout de sesión
- Longitud mínima de contraseña

#### Sesión
- Tiempo de inactividad
- Tiempo máximo de sesión
- Tiempo de advertencia

#### Base de Datos
- Respaldos automáticos
- Frecuencia de respaldos
- Días de retención

#### Notificaciones
- Email (SendGrid)
- SMS (Twilio)
- WhatsApp (Twilio)
- Push notifications

#### Apariencia
- Color primario
- Modo oscuro
- Logo personalizado

---

## 🏗️ Arquitectura y Flujo

### Flujo de Autenticación

```
1. Usuario accede a la aplicación
   ↓
2. Middleware verifica si la ruta es pública o protegida
   ↓
3. Si es protegida:
   - Verifica si hay sesión activa (cookies)
   - Si no hay sesión → Redirige a /login
   - Si hay sesión → Verifica permisos de admin
   ↓
4. Verificación de Admin:
   - Llama a la función RPC 'me_is_admin()' en Supabase
   - Si no es admin → Redirige a /403
   - Si es admin → Permite acceso
   ↓
5. Renderiza el componente protegido con AdminLayoutClient
```

### Estructura de Clientes

La aplicación utiliza dos tipos de clientes de Supabase:

1. **Cliente del Navegador** (`supabaseClient.js`)
   - Para componentes Client Components
   - Singleton pattern para reutilización
   - Usa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Cliente del Servidor** (`supabaseServer.js`)
   - Para Server Components y API Routes
   - Maneja cookies del request
   - Compatible con Next.js 15 (usa `await cookies()`)

### Middleware de Protección

El middleware (`middleware.js`) protege todas las rutas excepto:
- `/login` - Página de inicio de sesión
- `/403` - Página de acceso denegado
- `/public/*` - Rutas públicas
- `/api/public/*` - APIs públicas
- `/study/*` - Viewer público de estudios

### Layout y Navegación

```
RootLayout (app/layout.js)
  └── ProtectedLayout (app/(protected)/layout.js)
       └── AdminLayoutClient
            ├── Sidebar (navegación principal)
            ├── Header (con selector de idioma)
            └── Children (contenido de la página)
```

---

## 📁 Estructura del Proyecto

```
disciplicando-admin/
├── app/                          # Aplicación Next.js 15 (App Router)
│   ├── (protected)/              # Grupo de rutas protegidas
│   │   ├── assignments/          # Asignaciones
│   │   │   ├── page.js           # Lista de asignaciones
│   │   │   └── reassign/          # Reasignación de discípulos
│   │   │       └── ReassignClient.js
│   │   ├── bible-guides/         # Gestión de guías PDF
│   │   │   └── page.js
│   │   ├── bible-studies/        # Estudios bíblicos
│   │   │   ├── page.js           # Lista de estudios
│   │   │   ├── StudyEditor.js    # Editor de estudios
│   │   │   └── editor/[id]/      # Editor por ID
│   │   ├── dashboard/            # Dashboard principal
│   │   │   └── page.js
│   │   ├── discipleship-tree/   # Árbol de discipulado
│   │   │   ├── page.js
│   │   │   └── DiscipleshipTree.js
│   │   ├── quizzes/              # Gestión de quizzes
│   │   │   └── page.js
│   │   ├── reports/              # Reportes
│   │   │   ├── page.js
│   │   │   └── ReportsClient.jsx
│   │   ├── series/               # Gestión de series
│   │   │   └── page.js
│   │   ├── settings/             # Configuración
│   │   │   └── page.js
│   │   ├── user-management/      # Agregar/Validar usuarios
│   │   │   └── page.js
│   │   ├── users/                # Vista de usuarios
│   │   │   ├── page.js
│   │   │   ├── UsersClient.js
│   │   │   └── userProgressModal.js
│   │   ├── layout.js             # Layout de rutas protegidas
│   │   └── page.js               # Redirección al dashboard
│   ├── api/                      # API Routes
│   │   ├── bible-study/          # APIs de estudios bíblicos
│   │   ├── import-studies/       # Importar estudios
│   │   ├── public/               # APIs públicas
│   │   └── viewer/               # Viewer de estudios
│   ├── bible-study/              # Viewer público de estudios
│   │   └── viewer/[id]/
│   ├── login/                    # Página de login
│   │   └── page.js
│   ├── 403/                      # Página de acceso denegado
│   │   └── page.js
│   ├── reset-password/           # Reset de contraseña
│   │   └── page.js
│   ├── AdminLayoutClient.jsx    # Layout principal del admin
│   ├── DashboardClient.js        # Cliente del dashboard
│   ├── i18n.js                   # Sistema de internacionalización
│   ├── layout.js                 # Root layout
│   └── page.js                   # Página raíz (redirige a /dashboard)
│
├── components/                    # Componentes reutilizables
│   └── BibleStudy/
│       └── StudyRenderer.js      # Renderizador de estudios
│
├── lib/                          # Utilidades y helpers
│   ├── supabaseClient.js         # Cliente Supabase (navegador)
│   ├── supabaseServer.js         # Cliente Supabase (servidor)
│   ├── supabaseServerAuth.js     # Cliente Supabase (auth)
│   ├── bibleStudies.js           # Utilidades de estudios
│   └── version.js                 # Control de versiones
│
├── content/                      # Contenido estático
│   └── bible-studies/            # Estudios en Markdown
│
├── public/                       # Archivos estáticos
│   ├── logo-admin.png
│   └── ...
│
├── middleware.js                 # Middleware de autenticación
├── next.config.mjs              # Configuración de Next.js
├── tailwind.config.js            # Configuración de Tailwind
├── package.json                  # Dependencias
├── .env.example                  # Ejemplo de variables de entorno
├── .gitignore                    # Archivos ignorados por Git
├── README.md                     # Este archivo
└── SECURITY.md                   # Documentación de seguridad
```

---

## 🔧 Guía de Instalación

### Requisitos Previos

- **Node.js** 18 o superior
- **npm**, **yarn**, **pnpm** o **bun**
- Cuenta de **Supabase** con proyecto configurado
- Acceso de **administrador** a la base de datos
- Las políticas **RLS (Row Level Security)** configuradas en Supabase

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/DisciplicandoOrg/disciplicando-admin.git
cd disciplicando-admin
```

### Paso 2: Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Obtén estos valores desde:**
- Dashboard de Supabase → Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key

### Paso 4: Ejecutar en Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Paso 5: Iniciar Sesión

1. Accede a `/login`
2. Ingresa las credenciales de un usuario con rol `admin`
3. El sistema verificará automáticamente los permisos
4. Serás redirigido al dashboard

---

## 📚 Módulos y Funcionalidades Detalladas

### 1. Dashboard (`/dashboard`)

**Propósito**: Vista general del sistema con métricas clave.

**Características**:
- **Métricas principales**:
  - Total de usuarios
  - Discipuladores activos
  - Discípulos en formación
  - Usuarios aprobados vs pendientes
- **Estado del sistema**:
  - Usuarios registrados
  - Pendientes de aprobación
  - Listos para usar
- **Accesos rápidos** a todas las secciones
- **Actualización manual** de datos
- **Información del usuario** actual

### 2. Gestión de Usuarios

#### Vista de Usuarios (`/users`)

**Funcionalidades**:
- Lista completa con paginación
- **Filtros**:
  - Por rol (admin, discipulador, discípulo)
  - Por estado de aprobación
  - Por búsqueda de texto
- **Modal de progreso**:
  - Series completadas
  - Lecciones completadas
  - Puntuación promedio de quizzes
  - Videos vistos
  - Progreso detallado por serie

#### Agregar y Validar (`/user-management`)

**Pestaña: Agregar Usuario**
- Formulario completo de registro
- Campos:
  - Nombre completo
  - Email
  - Teléfono
  - Rol
  - Género
  - Discipulador asignado
  - Notas
- Generación automática de token de invitación
- Enlace de registro único

**Pestaña: Validar Usuarios**
- Lista de usuarios pendientes
- Aprobar/Rechazar usuarios
- Validar lecciones completadas
- Asignar series y bloques completados
- Actualizar progreso manualmente

### 3. Árbol de Discipulado (`/discipleship-tree`)

**Visualización**:
- Estructura jerárquica completa
- Nodos expandibles/colapsables
- Indicadores visuales de progreso
- Colores por rol:
  - Admin: Púrpura
  - Discipulador: Azul
  - Discípulo: Verde

**Funcionalidades**:
- Expandir/Colapsar todo
- Zoom in/out
- Navegación intuitiva
- Estadísticas por usuario

### 4. Reasignación (`/assignments/reassign`)

**Sistema Drag-and-Drop**:
1. Selecciona un discípulo
2. Arrástralo al nuevo discipulador
3. Confirma el cambio
4. El sistema actualiza la relación en la base de datos

**Validaciones**:
- No permite asignar a sí mismo
- Verifica que el destino sea un discipulador válido
- Muestra confirmación antes de aplicar cambios

### 5. Series (`/series`)

**Gestión completa**:
- Crear nuevas series
- Editar series existentes
- Activar/Desactivar series
- Organizar por orden
- Soporte multi-idioma:
  - Nombre en español e inglés
  - Descripción en ambos idiomas

**Estructura**:
```
Serie
  └── Bloques
       └── Lecciones
```

### 6. Estudios Bíblicos (`/bible-studies`)

**Editor completo** con:

**Metadatos**:
- Título de la lección (ES/EN)
- Número de lección
- Título del estudio (ES/EN)
- Referencia bíblica (ES/EN)
- Texto bíblico completo (ES/EN)

**Secciones dinámicas**:
- Introducción (obligatoria)
- Secciones personalizadas (ilimitadas)
- Conclusión (obligatoria)

**Características del editor**:
- Vista previa en tiempo real
- Validación de contenido
- Guardado automático
- Soporte Markdown completo
- Textareas para respuestas del usuario
- Preguntas de reflexión

**Formato de sección**:
```markdown
## section1

::es
### Título en español
Contenido en español...
[textarea:section1]
::

::en
### Title in English
Content in English...
[textarea:section1]
::
```

### 7. Guías Bíblicas (`/bible-guides`)

**Gestión de PDFs**:
- Subir archivos PDF
- Metadatos completos:
  - Título
  - Descripción
  - Fecha de publicación
  - Texto bíblico relacionado
  - Serie (opcional)
  - Temas (tags separados por comas)
  - Idioma (ES/EN)
- Activar/Desactivar guías
- Descarga directa
- Vista expandida con detalles completos

### 8. Reportes (`/reports`)

**Generación de reportes**:
- Tablas dinámicas
- Exportación de datos
- Estadísticas del sistema
- Filtros y búsqueda

### 9. Configuración (`/settings`)

**Secciones configurables**:

1. **General**
   - Nombre de la app
   - Zona horaria (USA/LATAM)
   - Idioma por defecto

2. **Seguridad**
   - Autenticación de dos factores
   - Timeout de sesión
   - Políticas de contraseñas
   - Longitud mínima
   - Caracteres especiales requeridos

3. **Sesión**
   - Tiempo de inactividad (minutos)
   - Tiempo máximo de sesión (horas)
   - Tiempo de advertencia (minutos)

4. **Base de Datos**
   - Respaldos automáticos
   - Frecuencia (diario/semanal/mensual)
   - Días de retención

5. **Notificaciones**
   - Email (SendGrid)
   - SMS (Twilio)
   - WhatsApp (Twilio)
   - Push notifications

6. **Apariencia**
   - Color primario (picker)
   - Modo oscuro
   - Logo personalizado

**Nota**: La configuración se guarda en `localStorage` actualmente. Para cambios permanentes, se debe configurar en Supabase.

---

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación

1. **Login** (`/login`)
   - Usuario ingresa email y contraseña
   - Autenticación con Supabase Auth
   - Verificación de rol admin mediante RPC `me_is_admin()`
   - Si no es admin → cierra sesión y muestra error
   - Si es admin → redirige al dashboard

2. **Middleware de Protección**
   - Intercepta todas las rutas
   - Verifica sesión activa
   - Verifica permisos de admin
   - Redirige según corresponda

3. **Verificación en Server Components**
   - Cada página protegida verifica:
     - Sesión activa
     - Permisos de admin
   - Si falla → redirige a `/login` o `/403`

### Medidas de Seguridad

1. **Row Level Security (RLS)**
   - Todas las tablas en Supabase tienen políticas RLS
   - Los usuarios solo pueden acceder a sus propios datos
   - Los admins tienen acceso completo mediante políticas específicas

2. **Variables de Entorno**
   - Todas las credenciales están en variables de entorno
   - `.env*` está en `.gitignore`
   - No hay credenciales hardcodeadas

3. **Middleware de Autenticación**
   - Protege todas las rutas automáticamente
   - Verificación doble: sesión + permisos

4. **Verificación de Admin**
   - Función RPC `me_is_admin()` en Supabase
   - Verifica el rol del usuario en la base de datos
   - No se puede falsificar desde el cliente

### Variables de Entorno Seguras

Las variables `NEXT_PUBLIC_*` son públicas por diseño, pero son seguras porque:
- La `ANON_KEY` de Supabase está diseñada para ser pública
- Las políticas RLS protegen los datos
- Solo usuarios autenticados con permisos pueden acceder
- El middleware verifica permisos adicionales

---

## 🚢 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio**:
   - Ve a [Vercel](https://vercel.com)
   - Importa el repositorio de GitHub
   - Vercel detectará automáticamente Next.js

2. **Configurar variables de entorno**:
   - En el dashboard de Vercel → Settings → Environment Variables
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**:
   - Vercel desplegará automáticamente
   - Cada push a `main` desplegará una nueva versión

### Netlify

1. **Conectar repositorio**:
   - Ve a [Netlify](https://netlify.com)
   - Importa el repositorio

2. **Configurar build**:
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Variables de entorno**:
   - Site settings → Environment variables
   - Agrega las mismas variables que en Vercel

### Variables de Entorno en Producción

Asegúrate de configurar:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework de React con App Router
- **React 18** - Biblioteca de UI
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos modernos

### Backend
- **Supabase** - Backend como servicio (BaaS)
  - Autenticación
  - Base de datos PostgreSQL
  - Storage para archivos
  - Row Level Security (RLS)

### Utilidades
- **@supabase/ssr** - Cliente Supabase para SSR
- **@supabase/supabase-js** - SDK de Supabase
- **gray-matter** - Parsing de frontmatter
- **remark** - Procesamiento de Markdown
- **html2pdf.js** - Generación de PDFs

### Desarrollo
- **ESLint** - Linter de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de CSS

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

---

## 🌍 Internacionalización (i18n)

La aplicación soporta **español** e **inglés** completamente.

**Sistema de traducción**:
- Archivo centralizado: `app/i18n.js`
- Hook `useLang()` para acceder a traducciones
- Cambio de idioma en tiempo real
- Persistencia en `localStorage`

**Uso**:
```javascript
import { useLang } from "@/app/i18n";

function MyComponent() {
    const { t, lang, setLang } = useLang();
    
    return (
        <div>
            <h1>{t("dashboard")}</h1>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
                Cambiar idioma
            </button>
        </div>
    );
}
```

---

## 🔄 Flujo de Trabajo Típico

### Agregar un Nuevo Usuario

1. Ir a `/user-management`
2. Pestaña "Agregar Usuario"
3. Completar formulario:
   - Nombre, email, teléfono
   - Seleccionar rol
   - Asignar discipulador
4. Guardar → Se genera token de invitación
5. Enviar enlace de registro al usuario
6. Usuario se registra y queda pendiente
7. Ir a pestaña "Validar Usuarios"
8. Aprobar usuario
9. Usuario puede acceder a la app

### Crear un Estudio Bíblico

1. Ir a `/bible-studies`
2. Click en "Nuevo Estudio" o editar existente
3. Completar metadatos:
   - Título de lección (ES/EN)
   - Referencia bíblica
   - Texto bíblico
4. Agregar secciones:
   - Introducción (automática)
   - Secciones personalizadas
   - Conclusión (automática)
5. Escribir contenido en Markdown
6. Agregar textareas para respuestas
7. Vista previa
8. Guardar

### Asignar Estudios a Usuarios

1. Ir a `/assignments`
2. Seleccionar usuario
3. Seleccionar serie/bloque/lección
4. Asignar
5. Usuario verá el estudio en su app

### Reasignar un Discípulo

1. Ir a `/assignments/reassign`
2. Buscar discípulo actual
3. Arrastrar a nuevo discipulador
4. Confirmar cambio
5. Relación actualizada

---

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- Verifica que el email y contraseña sean correctos
- Asegúrate de que el usuario existe en Supabase

### Error: "Not an admin"
- El usuario debe tener rol `admin` en la tabla `users`
- Verifica la función RPC `me_is_admin()` en Supabase

### Error: "Failed to fetch"
- Verifica las variables de entorno
- Asegúrate de que `NEXT_PUBLIC_SUPABASE_URL` es correcta
- Verifica la conexión a internet

### Las políticas RLS bloquean el acceso
- Verifica las políticas RLS en Supabase
- Asegúrate de que hay políticas para usuarios admin
- Revisa los logs de Supabase para más detalles

---

## 📄 Licencia

Este proyecto es parte de la organización **DisciplicandoOrg**.

---

## 🤝 Contribución

Este es un proyecto privado de la organización DisciplicandoOrg. Para contribuir:

1. Contacta a los administradores del proyecto
2. Obtén acceso al repositorio
3. Crea una rama para tu feature
4. Realiza tus cambios
5. Abre un Pull Request

---

## 📞 Soporte

Para soporte o preguntas:
- Abre un issue en el repositorio
- Contacta a los administradores del proyecto

---

## ✅ Checklist de Seguridad

Antes de hacer el repositorio público, verifica:

- ✅ Variables de entorno configuradas correctamente
- ✅ `.env*` está en `.gitignore`
- ✅ No hay credenciales hardcodeadas en el código
- ✅ Las políticas RLS están configuradas en Supabase
- ✅ El middleware verifica permisos de admin
- ✅ Todas las rutas protegidas están correctamente configuradas

Ver más detalles en [SECURITY.md](./SECURITY.md)

---

**Desarrollado con ❤️ para DisciplicandoOrg**
