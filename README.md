# 🎯 Disciplicando Admin / Disciplicando Admin

**Panel de administración completo para la plataforma Disciplicando**  
**Complete administration panel for the Disciplicando platform**

Un sistema integral de gestión diseñado para administrar todos los aspectos de la plataforma de discipulado cristiano, desde la gestión de usuarios hasta la creación de contenido bíblico interactivo.

A comprehensive management system designed to administer all aspects of the Christian discipleship platform, from user management to interactive biblical content creation.

---

## 📖 Tabla de Contenidos / Table of Contents

### Español
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

### English
- [General Description](#-general-description)
- [Main Features](#-main-features)
- [Architecture and Flow](#-architecture-and-flow)
- [Project Structure](#-project-structure)
- [Installation Guide](#-installation-guide)
- [Modules and Functionalities](#-modules-and-functionalities)
- [Authentication and Security](#-authentication-and-security)
- [Deployment](#-deployment-1)
- [Technologies Used](#-technologies-used)
- [Contribution](#-contribution)

---

## 🎯 Descripción General / General Description

### 🇪🇸 Español

**Disciplicando Admin** es el panel de control central que permite a los administradores gestionar completamente la plataforma Disciplicando. Este sistema proporciona herramientas poderosas para:

- **Gestionar usuarios** y sus relaciones de discipulado
- **Crear y editar contenido bíblico** interactivo
- **Asignar estudios** a usuarios específicos
- **Monitorear el progreso** de los discípulos
- **Generar reportes** y estadísticas
- **Configurar el sistema** completo

La aplicación está construida con **Next.js 15** y utiliza **Supabase** como backend, proporcionando una experiencia de administración moderna, segura y eficiente.

### 🇺🇸 English

**Disciplicando Admin** is the central control panel that allows administrators to completely manage the Disciplicando platform. This system provides powerful tools for:

- **Managing users** and their discipleship relationships
- **Creating and editing interactive biblical content**
- **Assigning studies** to specific users
- **Monitoring the progress** of disciples
- **Generating reports** and statistics
- **Configuring the entire system**

The application is built with **Next.js 15** and uses **Supabase** as the backend, providing a modern, secure, and efficient administration experience.

---

## 🚀 Características Principales / Main Features

### 📊 Dashboard Dinámico / Dynamic Dashboard

#### 🇪🇸 Español
- **Vista general del sistema** con métricas en tiempo real
- Estadísticas de usuarios (total, discipuladores, discípulos, aprobados, pendientes)
- Accesos rápidos a todas las secciones principales
- Actualización automática de datos
- Interfaz responsive y moderna

#### 🇺🇸 English
- **System overview** with real-time metrics
- User statistics (total, disciplers, disciples, approved, pending)
- Quick access to all main sections
- Automatic data updates
- Responsive and modern interface

### 👥 Gestión de Usuarios / User Management

#### Vista de Usuarios / Users View (`/users`)

##### 🇪🇸 Español
- Lista completa de todos los usuarios del sistema
- Filtros avanzados por rol, estado de aprobación, y más
- Búsqueda en tiempo real
- Visualización detallada del progreso de cada usuario
- Modal de progreso con estadísticas completas:
  - Lecciones completadas
  - Series completadas
  - Puntuaciones de quizzes
  - Videos vistos

##### 🇺🇸 English
- Complete list of all system users
- Advanced filters by role, approval status, and more
- Real-time search
- Detailed progress visualization for each user
- Progress modal with complete statistics:
  - Completed lessons
  - Completed series
  - Quiz scores
  - Videos watched

#### Agregar y Validar Usuarios / Add and Validate Users (`/user-management`)

##### 🇪🇸 Español
- **Agregar nuevos usuarios** manualmente al sistema
- **Validar usuarios pendientes** de aprobación
- Asignar roles (admin, discipulador, discípulo)
- Establecer relaciones de discipulado (asignar discipulador)
- Validar lecciones completadas por usuarios
- Generar tokens de invitación para nuevos usuarios
- Gestión completa de perfiles de usuario

##### 🇺🇸 English
- **Add new users** manually to the system
- **Validate pending users** awaiting approval
- Assign roles (admin, discipler, disciple)
- Establish discipleship relationships (assign discipler)
- Validate lessons completed by users
- Generate invitation tokens for new users
- Complete user profile management

### 🌳 Árbol de Discipulado / Discipleship Tree (`/discipleship-tree`)

#### 🇪🇸 Español
- **Visualización jerárquica** de todas las relaciones de discipulado
- Vista expandible/colapsable del árbol completo
- Indicadores de progreso por usuario
- Navegación intuitiva con zoom y controles
- Muestra:
  - Estructura completa de discipuladores y discípulos
  - Progreso de lecciones por usuario
  - Roles y estados de cada miembro

#### 🇺🇸 English
- **Hierarchical visualization** of all discipleship relationships
- Expandable/collapsible view of the complete tree
- Progress indicators per user
- Intuitive navigation with zoom and controls
- Displays:
  - Complete structure of disciplers and disciples
  - Lesson progress per user
  - Roles and status of each member

### 🔄 Reasignación de Discípulos / Reassign Disciples (`/assignments/reassign`)

#### 🇪🇸 Español
- **Sistema drag-and-drop** para mover discípulos entre discipuladores
- Interfaz visual intuitiva
- Validación antes de confirmar cambios
- Actualización en tiempo real de las relaciones

#### 🇺🇸 English
- **Drag-and-drop system** to move disciples between disciplers
- Intuitive visual interface
- Validation before confirming changes
- Real-time relationship updates

### 📚 Gestión de Contenido / Content Management

#### Series (`/series`)

##### 🇪🇸 Español
- Crear y editar series de estudios bíblicos
- Organización jerárquica: Series → Bloques → Lecciones
- Soporte multi-idioma (Español/Inglés)
- Activar/desactivar series
- Ordenamiento personalizado

##### 🇺🇸 English
- Create and edit biblical study series
- Hierarchical organization: Series → Blocks → Lessons
- Multi-language support (Spanish/English)
- Activate/deactivate series
- Custom ordering

#### Estudios Bíblicos / Bible Studies (`/bible-studies`)

##### 🇪🇸 Español
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

##### 🇺🇸 English
- **Complete editor for interactive biblical studies**
- Markdown format with support for:
  - Dynamic sections
  - Biblical texts
  - Reflection questions
  - Textareas for user responses
  - Multi-language content
- Real-time preview
- Content validation
- Metadata management (title, biblical reference, etc.)

#### Guías Bíblicas / Bible Guides (`/bible-guides`)

##### 🇪🇸 Español
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

##### 🇺🇸 English
- PDF guide management
- PDF file upload and management
- Organization by series and topics
- Complete metadata:
  - Title and description
  - Publication date
  - Related biblical text
  - Topics and tags
  - Language
- Activate/deactivate guides
- Direct PDF downloads

#### Quizzes (`/quizzes`)

##### 🇪🇸 Español
- Gestión de evaluaciones y quizzes
- Asociación con lecciones
- Control de puntuaciones

##### 🇺🇸 English
- Quiz and assessment management
- Association with lessons
- Score control

### 📈 Reportes / Reports (`/reports`)

#### 🇪🇸 Español
- Generación de reportes del sistema
- Estadísticas y análisis
- Exportación de datos
- Visualización tabular de información

#### 🇺🇸 English
- System report generation
- Statistics and analysis
- Data export
- Tabular information visualization

### ⚙️ Configuración / Settings (`/settings`)

#### 🇪🇸 Español
Panel completo de configuración con múltiples secciones:

**General**
- Nombre de la aplicación
- Zona horaria
- Idioma por defecto

**Seguridad**
- Políticas de contraseñas
- Autenticación de dos factores
- Timeout de sesión
- Longitud mínima de contraseña

**Sesión**
- Tiempo de inactividad
- Tiempo máximo de sesión
- Tiempo de advertencia

**Base de Datos**
- Respaldos automáticos
- Frecuencia de respaldos
- Días de retención

**Notificaciones**
- Email (SendGrid)
- SMS (Twilio)
- WhatsApp (Twilio)
- Push notifications

**Apariencia**
- Color primario
- Modo oscuro
- Logo personalizado

#### 🇺🇸 English
Complete configuration panel with multiple sections:

**General**
- Application name
- Timezone
- Default language

**Security**
- Password policies
- Two-factor authentication
- Session timeout
- Minimum password length

**Session**
- Inactivity time
- Maximum session time
- Warning time

**Database**
- Automatic backups
- Backup frequency
- Retention days

**Notifications**
- Email (SendGrid)
- SMS (Twilio)
- WhatsApp (Twilio)
- Push notifications

**Appearance**
- Primary color
- Dark mode
- Custom logo

---

## 🏗️ Arquitectura y Flujo / Architecture and Flow

### Flujo de Autenticación / Authentication Flow

#### 🇪🇸 Español

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

#### 🇺🇸 English

```
1. User accesses the application
   ↓
2. Middleware checks if route is public or protected
   ↓
3. If protected:
   - Checks for active session (cookies)
   - If no session → Redirects to /login
   - If session exists → Verifies admin permissions
   ↓
4. Admin Verification:
   - Calls RPC function 'me_is_admin()' in Supabase
   - If not admin → Redirects to /403
   - If admin → Allows access
   ↓
5. Renders protected component with AdminLayoutClient
```

### Estructura de Clientes / Client Structure

#### 🇪🇸 Español

La aplicación utiliza dos tipos de clientes de Supabase:

1. **Cliente del Navegador** (`supabaseClient.js`)
   - Para componentes Client Components
   - Singleton pattern para reutilización
   - Usa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Cliente del Servidor** (`supabaseServer.js`)
   - Para Server Components y API Routes
   - Maneja cookies del request
   - Compatible con Next.js 15 (usa `await cookies()`)

#### 🇺🇸 English

The application uses two types of Supabase clients:

1. **Browser Client** (`supabaseClient.js`)
   - For Client Components
   - Singleton pattern for reuse
   - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Server Client** (`supabaseServer.js`)
   - For Server Components and API Routes
   - Handles request cookies
   - Compatible with Next.js 15 (uses `await cookies()`)

### Middleware de Protección / Protection Middleware

#### 🇪🇸 Español

El middleware (`middleware.js`) protege todas las rutas excepto:
- `/login` - Página de inicio de sesión
- `/403` - Página de acceso denegado
- `/public/*` - Rutas públicas
- `/api/public/*` - APIs públicas
- `/study/*` - Viewer público de estudios

#### 🇺🇸 English

The middleware (`middleware.js`) protects all routes except:
- `/login` - Login page
- `/403` - Access denied page
- `/public/*` - Public routes
- `/api/public/*` - Public APIs
- `/study/*` - Public study viewer

---

## 📁 Estructura del Proyecto / Project Structure

```
disciplicando-admin/
├── app/                          # Next.js 15 Application (App Router)
│   ├── (protected)/              # Protected route group
│   │   ├── assignments/          # Assignments
│   │   │   ├── page.js           # Assignment list
│   │   │   └── reassign/         # Reassign disciples
│   │   │       └── ReassignClient.js
│   │   ├── bible-guides/         # PDF guide management
│   │   │   └── page.js
│   │   ├── bible-studies/         # Bible studies
│   │   │   ├── page.js           # Study list
│   │   │   ├── StudyEditor.js    # Study editor
│   │   │   └── editor/[id]/     # Editor by ID
│   │   ├── dashboard/            # Main dashboard
│   │   │   └── page.js
│   │   ├── discipleship-tree/   # Discipleship tree
│   │   │   ├── page.js
│   │   │   └── DiscipleshipTree.js
│   │   ├── quizzes/              # Quiz management
│   │   │   └── page.js
│   │   ├── reports/              # Reports
│   │   │   ├── page.js
│   │   │   └── ReportsClient.jsx
│   │   ├── series/              # Series management
│   │   │   └── page.js
│   │   ├── settings/            # Settings
│   │   │   └── page.js
│   │   ├── user-management/     # Add/Validate users
│   │   │   └── page.js
│   │   ├── users/               # User view
│   │   │   ├── page.js
│   │   │   ├── UsersClient.js
│   │   │   └── userProgressModal.js
│   │   ├── layout.js            # Protected routes layout
│   │   └── page.js             # Redirect to dashboard
│   ├── api/                     # API Routes
│   │   ├── bible-study/         # Bible study APIs
│   │   ├── import-studies/      # Import studies
│   │   ├── public/              # Public APIs
│   │   └── viewer/              # Study viewer
│   ├── bible-study/             # Public study viewer
│   │   └── viewer/[id]/
│   ├── login/                   # Login page
│   │   └── page.js
│   ├── 403/                     # Access denied page
│   │   └── page.js
│   ├── reset-password/          # Password reset
│   │   └── page.js
│   ├── AdminLayoutClient.jsx    # Main admin layout
│   ├── DashboardClient.js       # Dashboard client
│   ├── i18n.js                  # Internationalization system
│   ├── layout.js                # Root layout
│   └── page.js                  # Root page (redirects to /dashboard)
│
├── components/                   # Reusable components
│   └── BibleStudy/
│       └── StudyRenderer.js     # Study renderer
│
├── lib/                         # Utilities and helpers
│   ├── supabaseClient.js        # Supabase client (browser)
│   ├── supabaseServer.js        # Supabase client (server)
│   ├── supabaseServerAuth.js    # Supabase client (auth)
│   ├── bibleStudies.js          # Study utilities
│   └── version.js               # Version control
│
├── content/                     # Static content
│   └── bible-studies/          # Studies in Markdown
│
├── public/                      # Static files
│   ├── logo-admin.png
│   └── ...
│
├── middleware.js                # Authentication middleware
├── next.config.mjs             # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── package.json                 # Dependencies
├── .env.example                 # Environment variables example
├── .gitignore                   # Git ignored files
├── README.md                    # This file
└── SECURITY.md                  # Security documentation
```

---

## 🔧 Guía de Instalación / Installation Guide

### Requisitos Previos / Prerequisites

#### 🇪🇸 Español
- **Node.js** 18 o superior
- **npm**, **yarn**, **pnpm** o **bun**
- Cuenta de **Supabase** con proyecto configurado
- Acceso de **administrador** a la base de datos
- Las políticas **RLS (Row Level Security)** configuradas en Supabase

#### 🇺🇸 English
- **Node.js** 18 or higher
- **npm**, **yarn**, **pnpm** or **bun**
- **Supabase** account with configured project
- **Administrator** access to the database
- **RLS (Row Level Security)** policies configured in Supabase

### Paso 1: Clonar el Repositorio / Step 1: Clone Repository

```bash
git clone https://github.com/DisciplicandoOrg/disciplicando-admin.git
cd disciplicando-admin
```

### Paso 2: Instalar Dependencias / Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Paso 3: Configurar Variables de Entorno / Step 3: Configure Environment Variables

#### 🇪🇸 Español
Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Obtén estos valores desde:**
- Dashboard de Supabase → Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key

#### 🇺🇸 English
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Get these values from:**
- Supabase Dashboard → Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key

### Paso 4: Ejecutar en Desarrollo / Step 4: Run in Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

#### 🇪🇸 Español
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

#### 🇺🇸 English
The application will be available at [http://localhost:3000](http://localhost:3000)

### Paso 5: Iniciar Sesión / Step 5: Login

#### 🇪🇸 Español
1. Accede a `/login`
2. Ingresa las credenciales de un usuario con rol `admin`
3. El sistema verificará automáticamente los permisos
4. Serás redirigido al dashboard

#### 🇺🇸 English
1. Navigate to `/login`
2. Enter credentials for a user with `admin` role
3. The system will automatically verify permissions
4. You will be redirected to the dashboard

---

## 📚 Módulos y Funcionalidades Detalladas / Detailed Modules and Functionalities

### 1. Dashboard (`/dashboard`)

#### 🇪🇸 Español

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

#### 🇺🇸 English

**Purpose**: System overview with key metrics.

**Features**:
- **Main metrics**:
  - Total users
  - Active disciplers
  - Disciples in training
  - Approved vs pending users
- **System status**:
  - Registered users
  - Pending approval
  - Ready to use
- **Quick access** to all sections
- **Manual data** refresh
- **Current user** information

### 2. Gestión de Usuarios / User Management

#### Vista de Usuarios / Users View (`/users`)

##### 🇪🇸 Español
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

##### 🇺🇸 English
- Complete list with pagination
- **Filters**:
  - By role (admin, discipler, disciple)
  - By approval status
  - By text search
- **Progress modal**:
  - Completed series
  - Completed lessons
  - Average quiz scores
  - Videos watched
  - Detailed progress by series

#### Agregar y Validar / Add and Validate (`/user-management`)

##### 🇪🇸 Español
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

##### 🇺🇸 English
**Tab: Add User**
- Complete registration form
- Fields:
  - Full name
  - Email
  - Phone
  - Role
  - Gender
  - Assigned discipler
  - Notes
- Automatic invitation token generation
- Unique registration link

**Tab: Validate Users**
- List of pending users
- Approve/Reject users
- Validate completed lessons
- Assign completed series and blocks
- Manually update progress

### 3. Árbol de Discipulado / Discipleship Tree (`/discipleship-tree`)

#### 🇪🇸 Español
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

#### 🇺🇸 English
- Complete hierarchical structure
- Expandable/collapsible nodes
- Visual progress indicators
- Colors by role:
  - Admin: Purple
  - Discipler: Blue
  - Disciple: Green

**Features**:
- Expand/Collapse all
- Zoom in/out
- Intuitive navigation
- Statistics per user

### 4. Reasignación / Reassignment (`/assignments/reassign`)

#### 🇪🇸 Español
**Sistema Drag-and-Drop**:
1. Selecciona un discípulo
2. Arrástralo al nuevo discipulador
3. Confirma el cambio
4. El sistema actualiza la relación en la base de datos

**Validaciones**:
- No permite asignar a sí mismo
- Verifica que el destino sea un discipulador válido
- Muestra confirmación antes de aplicar cambios

#### 🇺🇸 English
**Drag-and-Drop System**:
1. Select a disciple
2. Drag to the new discipler
3. Confirm the change
4. System updates the relationship in the database

**Validations**:
- Does not allow self-assignment
- Verifies destination is a valid discipler
- Shows confirmation before applying changes

### 5. Series (`/series`)

#### 🇪🇸 Español
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

#### 🇺🇸 English
- Create new series
- Edit existing series
- Activate/Deactivate series
- Organize by order
- Multi-language support:
  - Name in Spanish and English
  - Description in both languages

**Structure**:
```
Series
  └── Blocks
       └── Lessons
```

### 6. Estudios Bíblicos / Bible Studies (`/bible-studies`)

#### 🇪🇸 Español
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

#### 🇺🇸 English
**Complete editor** with:

**Metadata**:
- Lesson title (ES/EN)
- Lesson number
- Study title (ES/EN)
- Biblical reference (ES/EN)
- Complete biblical text (ES/EN)

**Dynamic sections**:
- Introduction (required)
- Custom sections (unlimited)
- Conclusion (required)

**Editor features**:
- Real-time preview
- Content validation
- Auto-save
- Full Markdown support
- Textareas for user responses
- Reflection questions

**Section format**:
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

### 7. Guías Bíblicas / Bible Guides (`/bible-guides`)

#### 🇪🇸 Español
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

#### 🇺🇸 English
- Upload PDF files
- Complete metadata:
  - Title
  - Description
  - Publication date
  - Related biblical text
  - Series (optional)
  - Topics (comma-separated tags)
  - Language (ES/EN)
- Activate/Deactivate guides
- Direct download
- Expanded view with complete details

### 8. Reportes / Reports (`/reports`)

#### 🇪🇸 Español
- Tablas dinámicas
- Exportación de datos
- Estadísticas del sistema
- Filtros y búsqueda

#### 🇺🇸 English
- Dynamic tables
- Data export
- System statistics
- Filters and search

### 9. Configuración / Settings (`/settings`)

#### 🇪🇸 Español
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

#### 🇺🇸 English
**Configurable sections**:

1. **General**
   - App name
   - Timezone (USA/LATAM)
   - Default language

2. **Security**
   - Two-factor authentication
   - Session timeout
   - Password policies
   - Minimum length
   - Special characters required

3. **Session**
   - Inactivity time (minutes)
   - Maximum session time (hours)
   - Warning time (minutes)

4. **Database**
   - Automatic backups
   - Frequency (daily/weekly/monthly)
   - Retention days

5. **Notifications**
   - Email (SendGrid)
   - SMS (Twilio)
   - WhatsApp (Twilio)
   - Push notifications

6. **Appearance**
   - Primary color (picker)
   - Dark mode
   - Custom logo

**Note**: Settings are currently saved in `localStorage`. For permanent changes, configure in Supabase.

---

## 🔐 Autenticación y Seguridad / Authentication and Security

### Flujo de Autenticación / Authentication Flow

#### 🇪🇸 Español

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

#### 🇺🇸 English

1. **Login** (`/login`)
   - User enters email and password
   - Authentication with Supabase Auth
   - Admin role verification via RPC `me_is_admin()`
   - If not admin → logs out and shows error
   - If admin → redirects to dashboard

2. **Protection Middleware**
   - Intercepts all routes
   - Verifies active session
   - Verifies admin permissions
   - Redirects accordingly

3. **Verification in Server Components**
   - Each protected page verifies:
     - Active session
     - Admin permissions
   - If fails → redirects to `/login` or `/403`

### Medidas de Seguridad / Security Measures

#### 🇪🇸 Español

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

#### 🇺🇸 English

1. **Row Level Security (RLS)**
   - All tables in Supabase have RLS policies
   - Users can only access their own data
   - Admins have full access through specific policies

2. **Environment Variables**
   - All credentials are in environment variables
   - `.env*` is in `.gitignore`
   - No hardcoded credentials

3. **Authentication Middleware**
   - Automatically protects all routes
   - Double verification: session + permissions

4. **Admin Verification**
   - RPC function `me_is_admin()` in Supabase
   - Verifies user role in database
   - Cannot be falsified from client

### Variables de Entorno Seguras / Secure Environment Variables

#### 🇪🇸 Español
Las variables `NEXT_PUBLIC_*` son públicas por diseño, pero son seguras porque:
- La `ANON_KEY` de Supabase está diseñada para ser pública
- Las políticas RLS protegen los datos
- Solo usuarios autenticados con permisos pueden acceder
- El middleware verifica permisos adicionales

#### 🇺🇸 English
The `NEXT_PUBLIC_*` variables are public by design, but they are secure because:
- Supabase's `ANON_KEY` is designed to be public
- RLS policies protect the data
- Only authenticated users with permissions can access
- Middleware verifies additional permissions

---

## 🚢 Deployment

### Vercel (Recomendado / Recommended)

#### 🇪🇸 Español

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

#### 🇺🇸 English

1. **Connect repository**:
   - Go to [Vercel](https://vercel.com)
   - Import GitHub repository
   - Vercel will automatically detect Next.js

2. **Configure environment variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**:
   - Vercel will automatically deploy
   - Each push to `main` will deploy a new version

### Netlify

#### 🇪🇸 Español

1. **Conectar repositorio**:
   - Ve a [Netlify](https://netlify.com)
   - Importa el repositorio

2. **Configurar build**:
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Variables de entorno**:
   - Site settings → Environment variables
   - Agrega las mismas variables que en Vercel

#### 🇺🇸 English

1. **Connect repository**:
   - Go to [Netlify](https://netlify.com)
   - Import repository

2. **Configure build**:
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Environment variables**:
   - Site settings → Environment variables
   - Add the same variables as Vercel

### Variables de Entorno en Producción / Environment Variables in Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🛠️ Tecnologías Utilizadas / Technologies Used

### Frontend

#### 🇪🇸 Español
- **Next.js 15** - Framework de React con App Router
- **React 18** - Biblioteca de UI
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos modernos

#### 🇺🇸 English
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **Lucide React** - Modern icons

### Backend

#### 🇪🇸 Español
- **Supabase** - Backend como servicio (BaaS)
  - Autenticación
  - Base de datos PostgreSQL
  - Storage para archivos
  - Row Level Security (RLS)

#### 🇺🇸 English
- **Supabase** - Backend as a Service (BaaS)
  - Authentication
  - PostgreSQL database
  - File storage
  - Row Level Security (RLS)

### Utilidades / Utilities

#### 🇪🇸 Español
- **@supabase/ssr** - Cliente Supabase para SSR
- **@supabase/supabase-js** - SDK de Supabase
- **gray-matter** - Parsing de frontmatter
- **remark** - Procesamiento de Markdown
- **html2pdf.js** - Generación de PDFs

#### 🇺🇸 English
- **@supabase/ssr** - Supabase client for SSR
- **@supabase/supabase-js** - Supabase SDK
- **gray-matter** - Frontmatter parsing
- **remark** - Markdown processing
- **html2pdf.js** - PDF generation

### Desarrollo / Development

#### 🇪🇸 Español
- **ESLint** - Linter de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de CSS

#### 🇺🇸 English
- **ESLint** - Code linter
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS compatibility

---

## 📝 Scripts Disponibles / Available Scripts

```bash
# Desarrollo / Development
npm run dev          # Inicia servidor de desarrollo / Starts development server

# Producción / Production
npm run build        # Construye la aplicación / Builds the application
npm run start        # Inicia servidor de producción / Starts production server

# Calidad de código / Code Quality
npm run lint         # Ejecuta ESLint / Runs ESLint
```

---

## 🌍 Internacionalización (i18n)

### 🇪🇸 Español

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

### 🇺🇸 English

The application fully supports **Spanish** and **English**.

**Translation system**:
- Centralized file: `app/i18n.js`
- `useLang()` hook to access translations
- Real-time language switching
- Persistence in `localStorage`

**Usage**:
```javascript
import { useLang } from "@/app/i18n";

function MyComponent() {
    const { t, lang, setLang } = useLang();
    
    return (
        <div>
            <h1>{t("dashboard")}</h1>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>
                Change language
            </button>
        </div>
    );
}
```

---

## 🔄 Flujo de Trabajo Típico / Typical Workflow

### Agregar un Nuevo Usuario / Add a New User

#### 🇪🇸 Español

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

#### 🇺🇸 English

1. Go to `/user-management`
2. "Add User" tab
3. Complete form:
   - Name, email, phone
   - Select role
   - Assign discipler
4. Save → Invitation token is generated
5. Send registration link to user
6. User registers and is pending
7. Go to "Validate Users" tab
8. Approve user
9. User can access the app

### Crear un Estudio Bíblico / Create a Bible Study

#### 🇪🇸 Español

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

#### 🇺🇸 English

1. Go to `/bible-studies`
2. Click "New Study" or edit existing
3. Complete metadata:
   - Lesson title (ES/EN)
   - Biblical reference
   - Biblical text
4. Add sections:
   - Introduction (automatic)
   - Custom sections
   - Conclusion (automatic)
5. Write content in Markdown
6. Add textareas for responses
7. Preview
8. Save

### Asignar Estudios a Usuarios / Assign Studies to Users

#### 🇪🇸 Español

1. Ir a `/assignments`
2. Seleccionar usuario
3. Seleccionar serie/bloque/lección
4. Asignar
5. Usuario verá el estudio en su app

#### 🇺🇸 English

1. Go to `/assignments`
2. Select user
3. Select series/block/lesson
4. Assign
5. User will see the study in their app

### Reasignar un Discípulo / Reassign a Disciple

#### 🇪🇸 Español

1. Ir a `/assignments/reassign`
2. Buscar discípulo actual
3. Arrastrar a nuevo discipulador
4. Confirmar cambio
5. Relación actualizada

#### 🇺🇸 English

1. Go to `/assignments/reassign`
2. Find current disciple
3. Drag to new discipler
4. Confirm change
5. Relationship updated

---

## 🐛 Troubleshooting

### Error: "Invalid login credentials"

#### 🇪🇸 Español
- Verifica que el email y contraseña sean correctos
- Asegúrate de que el usuario existe en Supabase

#### 🇺🇸 English
- Verify email and password are correct
- Ensure user exists in Supabase

### Error: "Not an admin"

#### 🇪🇸 Español
- El usuario debe tener rol `admin` en la tabla `users`
- Verifica la función RPC `me_is_admin()` en Supabase

#### 🇺🇸 English
- User must have `admin` role in `users` table
- Verify RPC function `me_is_admin()` in Supabase

### Error: "Failed to fetch"

#### 🇪🇸 Español
- Verifica las variables de entorno
- Asegúrate de que `NEXT_PUBLIC_SUPABASE_URL` es correcta
- Verifica la conexión a internet

#### 🇺🇸 English
- Verify environment variables
- Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check internet connection

### Las políticas RLS bloquean el acceso / RLS policies block access

#### 🇪🇸 Español
- Verifica las políticas RLS en Supabase
- Asegúrate de que hay políticas para usuarios admin
- Revisa los logs de Supabase para más detalles

#### 🇺🇸 English
- Verify RLS policies in Supabase
- Ensure there are policies for admin users
- Check Supabase logs for more details

---

## 📄 Licencia / License

#### 🇪🇸 Español
Este proyecto es parte de la organización **DisciplicandoOrg**.

#### 🇺🇸 English
This project is part of the **DisciplicandoOrg** organization.

---

## 🤝 Contribución / Contribution

#### 🇪🇸 Español
Este es un proyecto privado de la organización DisciplicandoOrg. Para contribuir:

1. Contacta a los administradores del proyecto
2. Obtén acceso al repositorio
3. Crea una rama para tu feature
4. Realiza tus cambios
5. Abre un Pull Request

#### 🇺🇸 English
This is a private project of the DisciplicandoOrg organization. To contribute:

1. Contact project administrators
2. Get repository access
3. Create a branch for your feature
4. Make your changes
5. Open a Pull Request

---

## 📞 Soporte / Support

#### 🇪🇸 Español
Para soporte o preguntas:
- Abre un issue en el repositorio
- Contacta a los administradores del proyecto

#### 🇺🇸 English
For support or questions:
- Open an issue in the repository
- Contact project administrators

---

## ✅ Checklist de Seguridad / Security Checklist

#### 🇪🇸 Español
Antes de hacer el repositorio público, verifica:

- ✅ Variables de entorno configuradas correctamente
- ✅ `.env*` está en `.gitignore`
- ✅ No hay credenciales hardcodeadas en el código
- ✅ Las políticas RLS están configuradas en Supabase
- ✅ El middleware verifica permisos de admin
- ✅ Todas las rutas protegidas están correctamente configuradas

Ver más detalles en [SECURITY.md](./SECURITY.md)

#### 🇺🇸 English
Before making the repository public, verify:

- ✅ Environment variables configured correctly
- ✅ `.env*` is in `.gitignore`
- ✅ No hardcoded credentials in code
- ✅ RLS policies configured in Supabase
- ✅ Middleware verifies admin permissions
- ✅ All protected routes are correctly configured

See more details in [SECURITY.md](./SECURITY.md)

---

**Desarrollado con ❤️ para DisciplicandoOrg**  
**Developed with ❤️ for DisciplicandoOrg**
