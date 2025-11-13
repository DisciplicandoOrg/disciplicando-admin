# Disciplicando Admin

Panel de administración para la plataforma Disciplicando. Esta aplicación permite gestionar usuarios, estudios bíblicos, asignaciones, reportes y toda la configuración del sistema.

## 🚀 Características

- **Gestión de Usuarios**: Crear, editar y administrar usuarios del sistema
- **Estudios Bíblicos**: Editor completo para crear y gestionar estudios bíblicos
- **Guías Bíblicas**: Administración de guías en formato PDF
- **Asignaciones**: Sistema de asignación de estudios a usuarios
- **Árbol de Discipulado**: Visualización y gestión de relaciones de discipulado
- **Reportes**: Generación de reportes y estadísticas
- **Configuración**: Panel completo de configuración del sistema
- **Multi-idioma**: Soporte para español e inglés

## 📋 Requisitos Previos

- Node.js 18+ 
- npm, yarn, pnpm o bun
- Cuenta de Supabase con proyecto configurado
- Acceso de administrador a la base de datos

## 🔧 Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/DisciplicandoOrg/disciplicando-admin.git
cd disciplicando-admin
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

**Nota de Seguridad**: 
- Las variables `NEXT_PUBLIC_*` son públicas por diseño y están diseñadas para ser expuestas en el cliente
- La `ANON_KEY` de Supabase es segura porque las políticas RLS (Row Level Security) protegen los datos
- La seguridad se maneja a través de:
  1. Row Level Security (RLS) en Supabase
  2. Middleware de autenticación en Next.js
  3. Verificación de permisos de admin en el backend

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
disciplicando-admin/
├── app/                    # Rutas y páginas de Next.js
│   ├── (protected)/        # Rutas protegidas que requieren autenticación
│   ├── api/                # API routes
│   └── login/              # Página de login
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades y clientes de Supabase
│   ├── supabaseClient.js   # Cliente de Supabase para el navegador
│   └── supabaseServer.js   # Cliente de Supabase para el servidor
├── middleware.js           # Middleware de autenticación
└── public/                 # Archivos estáticos
```

## 🔐 Seguridad

Este proyecto está diseñado para ser público en GitHub. Las siguientes medidas de seguridad están implementadas:

1. **Variables de Entorno**: Todas las credenciales sensibles están en variables de entorno
2. **Row Level Security**: Las políticas RLS en Supabase protegen los datos
3. **Middleware de Autenticación**: Todas las rutas protegidas verifican autenticación y permisos de admin
4. **Sin Credenciales Hardcodeadas**: No hay credenciales, API keys o tokens en el código

### Checklist de Seguridad antes de hacer público:

- ✅ Variables de entorno configuradas correctamente
- ✅ `.env*` está en `.gitignore`
- ✅ No hay credenciales hardcodeadas en el código
- ✅ Las políticas RLS están configuradas en Supabase
- ✅ El middleware verifica permisos de admin

## 🚢 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en el dashboard de Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Vercel detectará automáticamente Next.js y desplegará la aplicación

### Netlify

1. Conecta tu repositorio de GitHub a Netlify
2. Configura las variables de entorno en el dashboard de Netlify
3. Configura el build command: `npm run build`
4. Configura el publish directory: `.next`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **Supabase** - Backend como servicio (BaaS)
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **React** - Biblioteca de UI

## 📄 Licencia

Este proyecto es parte de la organización DisciplicandoOrg.

## 🤝 Contribuir

Este es un proyecto privado de la organización DisciplicandoOrg. Para contribuir, contacta a los administradores del proyecto.

## ⚠️ Notas Importantes

- Este proyecto requiere acceso de administrador a la base de datos de Supabase
- Asegúrate de que las políticas RLS estén correctamente configuradas antes de usar en producción
- El middleware verifica permisos de admin para todas las rutas protegidas
- Las variables de entorno `NEXT_PUBLIC_*` son públicas por diseño y están seguras cuando se usan con RLS
