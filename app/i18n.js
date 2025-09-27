"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Diccionario completo de textos ES/EN */
const M = {
    es: {
        // Títulos principales
        app_title: "Admin Disciplicando",
        language: "Idioma",
        spanish: "Español",
        english: "Inglés",

        // Navegación
        panel: "Panel de administración",
        home: "Inicio",
        dashboard: "Dashboard",
        users: "Usuarios",
        reassign: "Reasignar discípulo",
        series: "Series",
        reports: "Reportes",
        settings: "Configuración",
        discipleshipTree: "Árbol de Discipulado",
        userManagement: "Agregar y Validar",
        logout: "Salir",

        // Dashboard
        dashboardTitle: "Dashboard Dinámico",
        dashboardSubtitle: "Panel con datos reales de Disciplicando",
        totalUsers: "Total Usuarios",
        admins: "Administradores",
        disciplers: "Disciplicadores",
        disciples: "Discípulos",
        approved: "Aprobados",
        pending: "Pendientes",
        registeredUsers: "Usuarios registrados",
        activeLeaders: "Líderes activos",
        inTraining: "En formación",
        systemStatus: "Estado Actual del Sistema",
        registeredInPlatform: "Registrados en la plataforma",
        pendingApproval: "Pendientes de Aprobación",
        requireAttention: "Requieren atención",
        approvedUsers: "Usuarios Aprobados",
        readyToUse: "Listos para usar la app",
        quickActions: "Acciones Rápidas",
        hierarchicalView: "Vista jerárquica con progreso",
        manageUsers: "Administrar Usuarios",
        viewAndApprove: "Ver y aprobar usuarios",
        moveDisciples: "Mover discípulos",
        manageContent: "Gestionar contenido",
        statistics: "Estadísticas",
        updated: "Actualizado",
        update: "Actualizar",
        refresh: "Actualizar",
        admin: "Admin",
        loggingOut: "Saliendo...",
        exit: "Salir",

        // Árbol de Discipulado
        discipleshipTreeTitle: "Árbol de Discipulado",
        discipleshipTreeSubtitle: "Vista jerárquica con progreso de lecciones",
        expandAll: "Expandir Todo",
        collapseAll: "Colapsar Todo",
        zoom: "Zoom",
        heightAdjusted: "altura ajustada",
        progressLegend: "Leyenda de Progreso",
        excellent: "Excelente",
        good: "Bueno",
        regular: "Regular",
        needsAttention: "Necesita Atención",
        noName: "Sin nombre",
        disciple_singular: "discípulo",
        disciples_plural: "discípulos",
        noDisciplersFound: "No se encontraron disciplicadores",
        loading: "Cargando",
        loadingTree: "Cargando árbol de discipulado...",

        // Adicionales para Árbol de Discipulado
        discipler: "Disciplicador",
        disciple: "Discípulo",

        // Usuarios
        users_title: "Administrador de Usuarios",
        users_subtitle: "Administra usuarios, roles y permisos",
        all: "Todos",
        leaders: "Disciplicadores",
        disciples: "Discípulos",
        loading: "Cargando…",
        no_leaders: "No hay disciplicadores.",
        unassigned: "Discípulos sin mentor asignado",
        none: "Ninguno.",
        edit: "Editar",
        save: "Guardar",
        saving: "Guardando…",
        cancel: "Cancelar",
        approve: "Aprobar",
        reject: "Rechazar",
        viewProgress: "Ver Progreso",
        email: "Email",
        phone: "Teléfono",
        rol: "Rol",
        id: "ID",
        disciples_count: "discípulo(s)",
        users_sub: "Administra usuarios, busca y edita datos de contacto y rol.",
        search_ph: "Buscar nombre, email, teléfono o rol…",
        no_results: "No hay resultados.",
        no_name: "(sin nombre)",
        tree_title: "Árbol de discipulado (referencia)",
        tree_sub: "Estructura actual por disciplicador → discípulos.",
        error_save: "Error guardando usuario: ",
        notApproved: "No Aprobados",
        approved: "Aprovado",
        onlyAdmins: "Solo Admins",
        onlyDisciplers: "Solo Disciplicadores",
        onlyDisciples: "Solo Discípulos",
        usersList: "Lista de Usuarios",
        loadingUsers: "Cargando usuarios...",
        noUsersFound: "No se encontraron usuarios",
        noPhone: "Sin teléfono",
        noEmail: "Sin email",
        registered: "Registrado",
        approvedOn: "Aprobado",

        // Adicionales para Admin Users
        editUser: "Editar Usuario",
        userProgress: "Progreso del Usuario",
        changeRole: "Cambiar Rol",
        searchPlaceholder: "Buscar por nombre, username, email, teléfono...",
        filterAll: "Todos",
        filterPending: "No Aprobados",
        filterApproved: "Aprobados",
        filterAdmins: "Solo Admins",
        filterDisciplers: "Solo Disciplicadores",
        filterDisciples: "Solo Discípulos",
        total: "Total",
        withoutMentor: "Sin mentor",
        completed: "Completó",
        quizAverage: "Quiz Promedio",
        videosSeen: "Videos Vistos",
        noProgress: "No hay prograso registrado aún",

        // User Management (Agregar y Validar)
        addNewUser: "Agregar Nuevo Usuario",
        validateCompetencies: "Validar Competencias",
        forProvenDisciplers: "Para disciplicadores probados",
        importMultiple: "Importar Múltiples",
        fromCSVExcel: "Desde CSV o Excel",
        allUsers: "Todos los Usuarios",
        allStates: "Todos los estados",
        validated: "Validados",
        noValidated: "Si Validar",
        lesson: "Lección",
        progress: "Progreso",
        dateAdded: "Fecha Ingreso",
        user: "Usuario",

        // Modal Agregar Usuario
        basicInfo: "Información Básica",
        fullName: "Nombre Completo",
        assignment: "Asignación",
        selectDiscipler: "Seleccionar disciplicador...",
        canAssignLater: "Puedes asignarlo después si no estás seguro",
        validationForProven: "Validación para Disciplicador Probado",
        provenDisciplerText: "Si esta persona ya es un disciplicador con experiencia, puedes validar automáticamente la Serie 1.",
        validateSeries1: "Validar Serie 1 completa (Certificación como Disciplicador)",
        notes: "Notas",
        notesOptional: "Notas (Opcional)",
        notesPlaceholder: "Ej: Pastor de iglesia local, 10 años de experiencia...",
        invitationMethod: "Método de Invitación",
        sendEmailInvite: "Enviar invitación por email",
        sendWhatsAppInvite: "Enviar invitación por WhatsApp",
        createDirectly: "Crear cuenta directamente (sin invitación)",
        addUser: "Agregar Usuario",

        // Modal Validar Competencias
        selectUser: "Seleccionar Usuario",
        selectUserPlaceholder: "Seleccionar...",
        currentLesson: "Lección actual",
        validateCompletesSeries: "Validar Series Completas",
        certificationLevel: "Nivel de Certificación",
        noCertification: "Sin certificación",
        certifiedDiscipler: "Disciplicador Certificado",
        advancedDiscipler: "Disciplicador Avanzado",
        masterDiscipler: "Disciplicador Master",
        certificationNote1: "Completó Serie 1",
        certificationNote2: "Completó Series 1 y 2",
        certificationNote3: "Completó todas las series",
        validationNotes: "Notas de Validación",
        validationNotesPlaceholder: "Ej: Pastor con 15 años de experiencia, ya ha discipulado a 20+ personas...",
        validateCompetencies: "Validar Competencias",

        // Tips
        tipsTitle: "Tips para la Gestión de Usuarios",
        tip1: "Para disciplicadores experimentados:",
        tip1Text: "Usa 'Validar Competencias' para marcar la Serie 1 como completa automáticamente.",
        tip2: "Invitaciones:",
        tip2Text: "Los usuarios recibirán un link único para crear su contraseña y acceder por primera vez.",
        tip3: "Asignación flexible:",
        tip3Text: "Puedes crear usuarios sin asignar disciplicador inmediatamente y hacerlo después en 'Reasignar'.",
        tip4: "Importación masiva:",
        tip4Text: "Para agregar muchos usuarios a la vez, usa la opción de importar desde CSV con formato: nombre, email, teléfono, rol.",

        // Reassign (Reasignar)
        reassignDisciples: "Reasignar Discípulos",
        reassignSubtitle: "Arrastra y suelta discípulos entre disciplicadores para reasignarlos",
        dragAndDrop: "Arrastra y suelta para reasignar",
        withoutAssigned: "Sin Asignar",
        confirmReassignment: "Confirmar Reasignación",
        confirmReassignText: "¿Estás seguro de que quieres reasignar a:",
        from: "De",
        to: "A",
        confirming: "Confirmando...",
        reassigning: "Reasignando...",
        disciplersWithDisciples: "Disciplicadores y sus Discípulos",
        noDisciplersAvailable: "No hay disciplicadores disponibles",
        dropHereToAssign: "Suelta aquí para asignar",
        searchDisciples: "Buscar discípulos por nombre o email...",
        assigned: "Asignados",

        // Series
        seriesTitle: "Series de Estudio",
        seriesSubtitle: "Gestiona las series, bloques y lecciones",
        newSeries: "Nueva Serie",
        editSeries: "Editar Serie",
        newBlock: "Nuevo Bloque",
        editBlock: "Editar Bloque",
        newLesson: "Nueva Lección",
        editLesson: "Editar Lección",
        blocks: "Bloques",
        lessons: "Lecciones",
        totalLessons: "lecciones totales",
        totalBlocks: "bloques",
        inactive: "Inactiva",
        active: "Activa",
        addBlock: "Agregar Bloque",
        noBlocks: "No hay bloques en esta serie",
        addLesson: "Agregar Lección",
        noLessons: "No hay lecciones en este bloque",

        // Series - adicionales
        loadingSeries: "Cargando series...",
        spanish: "Español",
        english: "Inglés",
        seriesName: "Nombre",
        seriesDescription: "Descripción",
        blockName: "Nombre",
        lessonTitle: "Título",
        lessonNumber: "Número de lección",
        lessonResources: "Recursos de la Lección",
        videoUrl: "URL del Video (YouTube no listado)",
        podcastUrl: "URL del Podcast (Audio)",
        studyUrl: "URL del Estudio Bíblico",
        quizUrl: "URL del Quiz/Cuestionario",
        minScoreToPass: "% Mínimo para aprobar quiz",
        additionalNotes: "Notas o contenido adicional (opcional)",

        // Series - lecturas adicionales
        lessonText1: "El discípulo tendrá acceso a estos 4 recursos. Si alguno no está disponible, se mostrará deshabilitado.",
        lessonText2: "Video explicativo de la lección.",
        lessonText3: "Versión en audio/podcast para quienes prefieran escuchar. Opcional - se mostró la gris y no está disponible.",
        lessonText4: "Estudio escrito que pueden completar, imprimir o enviar por email",
        lessonText5a: "Evaluación final - requiere",
        lessonText5b: "para aprobar y notificar al disciplicador.",

        // Página de Reportes - COMPLETO
        reports: "Reportes",
        reports_subtitle: "Análisis y métricas del discipulado",
        this_week: "Esta Semana",
        this_month: "Este Mes",
        this_year: "Este Año",
        all_time: "Todo",
        export_btn: "Exportar",
        export_all_disciples: "Todos los Discípulos",
        export_disciplers_only: "Solo Disciplicadores",
        export_needs_attention: "Necesitan Atención",
        export_active_only: "Solo Activos",

        // Tabs de reportes
        dashboard_tab: "Dashboard",
        progress_series1_tab: "Progreso Serie 1",
        disciplers_tab: "Disciplicadores",
        needs_attention_tab: "Necesitan Atención",
        advanced_progress_tab: "Progreso Avanzado",

        // Estadísticas del dashboard
        total_users_stat: "Total Usuarios",
        registered_users_desc: "Usuarios registrados",
        active_disciples_stat: "Discípulos Activos",
        avg_progress_desc: "progreso promedio",
        certified_disciplers_stat: "Disciplicadores",
        completed_first_series: "Completaron primera serie",
        needs_attention_count: "Necesitan Atención",
        inactive_or_low: "Inactivos o bajo progreso",
        active_series_stat: "Series Activas",
        total_lessons_desc: "lecciones totales",
        completed_this_month_stat: "Completadas Este Mes",
        lessons_finished_desc: "Lecciones terminadas",
        avg_time_stat: "Tiempo Promedio",
        days_per_lesson_desc: "Días por lección",

        // Columnas de tabla
        name_column: "Nombre",
        discipler_column: "Disciplicador",
        current_series_column: "Serie Actual",
        progress_column: "Progreso",
        status_column: "Estado",
        actions_column: "Acciones",

        // Estados
        status_active: "Activo",
        status_ready: "Listo para discipular",
        status_inactive: "Inactivo",
        not_assigned: "Sin asignar",

        // Sección de progreso
        overall_progress_title: "Progreso General por Serie",
        active_users_count: "activos",
        completed_users_count: "completados",
        average_text: "promedio",
        no_progress_available: "No hay datos de progreso disponibles aún",
        all_disciples_title: "Progreso de Todos los Discípulos",

        // Sección certificados
        certified_message: "🎉 Estos usuarios han completado la primera serie y están certificados como disciplicadores.",
        certified_disciplers_title: "Disciplicadores Certificados",
        no_certified_yet: "No hay usuarios que hayan completado la primera serie aún.",
        users_will_appear: "Los usuarios aparecerán aquí cuando completen todas las lecciones de \"Fundamentos De Nuestra Fe\"",

        // Sección atención
        attention_message: "⚠️ Estos discípulos necesitan motivación o seguimiento adicional.",
        require_attention_title: "Requieren Atención",

        // Sección avanzada
        advanced_view_message: "📚 Vista completa del progreso en todas las series, incluyendo series opcionales y avanzadas.",
        filter_by_series: "Filtrar por Serie",
        filter_by_role: "Filtrar por Rol",
        all_series_option: "Todas las Series",
        all_roles_option: "Todos",
        disciples_only_option: "Solo Discípulos",
        studying_disciplers_option: "Disciplicadores Estudiando",
        required_label: "Requerida",
        required_for_discipling: "Requerida para Discipular",
        optional_label: "Opcional",
        blocks_text: "bloques",
        lessons_range: "Lecciones",
        active_users_text: "usuarios activos",
        no_active_in_series: "No hay usuarios activos en esta serie",
        users_appear_when: "Los usuarios aparecerán aquí cuando comiencen las lecciones",

        // Leyenda
        progress_legend: "Leyenda de Progreso:",
        excellent_level: "Excelente",
        good_level: "Bueno",
        regular_level: "Regular",
        needs_attention_level: "Necesita Atención",

        // Cargando
        loading_reports_text: "Cargando reportes...",

        // Comunes
        yes: "Sí",
        no: "No",
        and: "y",
        confirm: "Confirmar",
        delete: "Eliminar",
        close: "Cerrar",
        search: "Buscar",
        filter: "Filtrar",
        actions: "Acciones",
        status: "Estado",
        active: "Activo",
        name: "Nombre",
        description: "Descripción",
        order: "Orden",
        createdAt: "Creado",
        updatedAt: "Actualizado",

        // Configuración - Sesión
        sessionSettings: "Configuración de Sesión",
        sessionTimeout: "Tiempo de sesión",
        inactivityTimeout: "Tiempo de inactividad (minutos)",
        inactivityTimeoutDesc: "Cerrar sesión automáticamente después de este tiempo sin actividad",
        maxSessionTime: "Duración máxima de sesión (horas)",
        maxSessionTimeDesc: "Tiempo máximo que una sesión puede estar activa",
        warningTime: "Aviso antes de cerrar (minutos)",
        warningTimeDesc: "Mostrar advertencia antes de cerrar sesión automáticamente",
        sessionNote: "Nota: Estos ajustes son locales. Para cambios permanentes, configurar JWT en Supabase.",

        // Confirmaciones
        confirmLogout: "¿Estás seguro de que quieres cerrar sesión?",
        confirmDelete: "¿Estás seguro de eliminar este elemento?",
        confirmReject: "¿Estás seguro de rechazar este usuario?",

        // Configuración - Títulos principales
        settings: "Configuración",
        settingsSubtitle: "Administra todos los aspectos de tu aplicación",

        // Secciones de configuración
        generalSection: "General",
        generalSectionDesc: "Configuración básica de la aplicación: nombre, zona horaria, idioma principal",
        securitySection: "Seguridad",
        securitySectionDesc: "Control de acceso, autenticación, políticas de contraseñas y permisos",
        databaseSection: "Base de Datos",
        databaseSectionDesc: "Respaldos automáticos, mantenimiento y optimización de datos",
        notificationsSection: "Notificaciones",
        notificationsSectionDesc: "Configurar qué tipos de notificaciones enviar y cuándo",
        communicationsSection: "Comunicaciones",
        communicationsSectionDesc: "Proveedores de email, SMS y WhatsApp para enviar mensajes",
        appearanceSection: "Apariencia",
        appearanceSectionDesc: "Personalización visual: colores, logos, temas",

        // General
        generalConfig: "Configuración General",
        generalConfigDesc: "Ajustes básicos que afectan a toda la aplicación",
        appName: "Nombre de la Aplicación",
        appNameDesc: "Aparece en emails y notificaciones",
        mainLanguage: "Idioma Principal",
        mainLanguageDesc: "Idioma por defecto para nuevos usuarios",
        timezone: "Zona Horaria",
        timezoneDesc: "Afecta horarios de reportes y notificaciones automáticas",
        timezonesTip: "Tip sobre zonas horarias",
        timezonesTipText: "Memphis está en zona Central (CST/CDT). Honduras también usa CST pero sin horario de verano. La mayoría de Centroamérica está en CST permanente.",

        // Zonas horarias
        unitedStates: "Estados Unidos",
        latinAmerica: "Latinoamérica",
        eastern: "Este",
        central: "Central",
        mountain: "Montaña",
        pacific: "Pacífico",

        // Seguridad
        securityConfig: "Configuración de Seguridad",
        securityConfigDesc: "Protege las cuentas y datos de tus usuarios",
        authentication: "Autenticación",
        requireTwoFactor: "Requerir autenticación de dos factores para admins",
        sessionTime: "Tiempo de sesión (minutos)",
        sessionTimeDesc: "Cierra sesión tras inactividad",
        passwordPolicies: "Políticas de Contraseñas",
        minPasswordLength: "Longitud mínima",
        requireSpecialChars: "Requerir caracteres especiales (!@#$%)",
        accessLevels: "Niveles de acceso actuales",
        adminAccess: "Control total del sistema",
        disciplerAccess: "Gestiona sus discípulos",
        discipleAccess: "Solo ve su progreso",

        // Base de datos
        databaseTitle: "Base de Datos",
        databaseDesc: "Respaldos y mantenimiento de datos",
        autoBackups: "Respaldos Automáticos",
        enableAutoBackup: "Activar respaldos automáticos",
        backupFrequency: "Frecuencia de respaldo",
        hourly: "Cada hora",
        daily: "Diario",
        weekly: "Semanal",
        monthly: "Mensual",
        retentionDays: "Retención de respaldos (días)",
        retentionDesc: "Los respaldos más antiguos se eliminarán automáticamente",
        manualActions: "Acciones Manuales",
        downloadBackup: "Descargar Respaldo",
        restoreBackup: "Restaurar Respaldo",
        supabaseInfo: "Información de Supabase",
        supabaseInfoText: "Tu base de datos está alojada en Supabase con respaldos automáticos diarios incluidos. Los respaldos adicionales aquí son para mayor seguridad.",

        // Notificaciones
        notificationsTitle: "Notificaciones",
        notificationsDesc: "Configura cuándo y cómo notificar a los usuarios",
        notificationChannels: "Canales de Notificación",
        emailChannel: "Email",
        smsChannel: "SMS",
        whatsappChannel: "WhatsApp",
        pushChannel: "Notificaciones Push (App móvil)",
        notificationTypes: "Tipos de Notificaciones",
        newLessonAvailable: "Nueva lección disponible",
        activityReminder: "Recordatorio de actividad pendiente",
        lessonCompleted: "Felicitación por completar lección",
        messageFromDiscipler: "Mensaje del disciplicador",
        weeklyProgressSummary: "Resumen semanal de progreso",

        // Comunicaciones
        communicationProviders: "Proveedores de Comunicación",
        communicationProvidersDesc: "Servicios externos para enviar mensajes",
        emailProvider: "Proveedor",
        apiKey: "API Key",
        customSMTP: "SMTP Personalizado",
        smsWhatsapp: "SMS y WhatsApp",
        accountSID: "Account SID",
        authToken: "Auth Token",
        whatsappBusinessNumber: "Número de WhatsApp Business",
        whatsappBusinessNumberDesc: "Debe estar verificado en WhatsApp Business API",

        // Apariencia
        appearanceTitle: "Apariencia",
        appearanceDesc: "Personaliza el aspecto visual de la aplicación",
        theme: "Tema",
        darkMode: "Modo oscuro",
        primaryColor: "Color principal",
        logo: "Logo",
        changeLogo: "Cambiar Logo",
        logoRecommendation: "Recomendado: 512x512px, formato PNG con fondo transparente",

        // Botones y acciones
        saveChanges: "Guardar Cambios",
        saving: "Guardando...",
        saved: "Guardado",
        changesWillApply: "Los cambios se aplicarán inmediatamente",

        // Comunes de configuración
        minutes: "minutos",
        hours: "horas",
        days: "días",
        enabled: "Activado",
        disabled: "Desactivado",
        select: "Seleccionar",
        configure: "Configurar",
        test: "Probar",
        testConnection: "Probar conexión",

        quizzes: "Quizzes",
        manageQuizzes: "Gestionar evaluaciones",

        // Estudios Biblicos
        bible_studies: "Estudios Bíblicos",
        interactive_guides: "Guías Interactivas",
        bible_studies_subtitle: "Gestiona las guías de estudio interactivas para cada lección",
        create_new_study: "Crear Nuevo Estudio",
        total_lessons: "Total Lecciones",
        with_study: "Con Estudio",
        pending_studies: "Pendientes",
        bilingual: "Bilingüe",
        search_lesson: "Buscar lección por título o número...",
        expand_all: "Expandir Todo",
        collapse_all: "Colapsar Todo",
        main_series: "Serie Principal",
        series_word: "Serie",
        lessons_word: "lecciones",
        with_study_count: "con estudio",
        no_lessons_series: "No hay lecciones en esta serie",
        study_complete: "Completo",
        study_external: "Externo",
        no_study: "Sin estudio",
        create_study: "Crear/Editar Estudio",
        study_preview: "Vista Previa del Estudio",

    },

    en: {
        // Main titles
        app_title: "Disciplicando Admin",
        language: "Language",
        spanish: "Spanish",
        english: "English",

        // Navigation
        panel: "Admin Panel",
        home: "Home",
        dashboard: "Dashboard",
        users: "Users",
        reassign: "Reassign disciple",
        series: "Series",
        reports: "Reports",
        settings: "Settings",
        discipleshipTree: "Discipleship Tree",
        userManagement: "Add & Validate",
        logout: "Logout",

        // Dashboard
        dashboardTitle: "Dynamic Dashboard",
        dashboardSubtitle: "Panel with real Disciplicando data",
        totalUsers: "Total Users",
        admins: "Admins",
        disciplers: "Disciplyers",
        disciples: "Disciples",
        approved: "Approved",
        pending: "Pending",
        registeredUsers: "Registered users",
        activeLeaders: "Active leaders",
        inTraining: "In training",
        systemStatus: "Current System Status",
        registeredInPlatform: "Registered in platform",
        pendingApproval: "Pending Approval",
        requireAttention: "Require attention",
        approvedUsers: "Approved Users",
        readyToUse: "Ready to use the app",
        quickActions: "Quick Actions",
        hierarchicalView: "Hierarchical view with progress",
        manageUsers: "Manage Users",
        viewAndApprove: "View and approve users",
        moveDisciples: "Move disciples",
        manageContent: "Manage content",
        statistics: "Statistics",
        updated: "Updated",
        update: "Update",
        refresh: "Refresh",
        admin: "Admin",
        loggingOut: "Logging out...",
        exit: "Exit",

        // Discipleship Tree
        discipleshipTreeTitle: "Discipleship Tree",
        discipleshipTreeSubtitle: "Hierarchical view with lesson progress",
        expandAll: "Expand All",
        collapseAll: "Collapse All",
        zoom: "Zoom",
        heightAdjusted: "height adjusted",
        progressLegend: "Progress Legend",
        excellent: "Excellent",
        good: "Good",
        regular: "Regular",
        needsAttention: "Needs Attention",
        noName: "No name",
        disciple_singular: "disciple",
        disciples_plural: "disciples",
        noDisciplersFound: "No disciplers found",
        loading: "Loading",
        loadingTree: "Loading discipleship tree...",

        // Additional for Discipleship Tree
        discipler: "Disciplyer",
        disciple: "Disciple",

        // Users
        users_title: "User Management",
        users_subtitle: "Manage users, roles and permissions",
        all: "All",
        leaders: "Disciplers",
        disciples: "Disciples",
        loading: "Loading…",
        no_leaders: "No disciplers.",
        unassigned: "Disciples without mentor",
        none: "None.",
        edit: "Edit",
        save: "Save",
        saving: "Saving…",
        cancel: "Cancel",
        approve: "Approve",
        reject: "Reject",
        viewProgress: "View Progress",
        email: "Email",
        phone: "Phone",
        rol: "Role",
        id: "ID",
        disciples_count: "disciple(s)",
        users_sub: "Manage users, search and edit contact/role info.",
        search_ph: "Search name, email, phone or role…",
        no_results: "No results.",
        no_name: "(no name)",
        tree_title: "Discipleship tree (reference)",
        tree_sub: "Current structure by discipler → disciples.",
        error_save: "Error saving user: ",
        notApproved: "Not Approved",
        approved: "Approved",
        onlyAdmins: "Admins Only",
        onlyDisciplers: "Disciplers Only",
        onlyDisciples: "Disciples Only",
        usersList: "Users List",
        loadingUsers: "Loading users...",
        noUsersFound: "No users found",
        noPhone: "No phone",
        noEmail: "No email",
        registered: "Registered",
        approvedOn: "Approved on",

        // Additional for Admin Users
        editUser: "Edit User",
        userProgress: "User Progress",
        changeRole: "Change Role",
        searchPlaceholder: "Search by name, username, email, phone...",
        filterAll: "All",
        filterPending: "Not Approved",
        filterApproved: "Approved",
        filterAdmins: "Admins Only",
        filterDisciplers: "Disciplers Only",
        filterDisciples: "Disciples Only",
        total: "Total",
        withoutMentor: "Without mentor",
        completed: "Completed",
        quizAverage: "Quiz Average",
        videosSeen: "Videos Seen",
        noProgress: "No progress recorded yet",

        // User Management (Add & Validate)
        addNewUser: "Add New User",
        validateCompetencies: "Validate Competencies",
        forProvenDisciplers: "For proven disciplers",
        importMultiple: "Import Multiple",
        fromCSVExcel: "From CSV or Excel",
        allUsers: "All Users",
        allStates: "All states",
        validated: "Validated",
        noValidated: "Unvalidated",
        lesson: "Lesson",
        progress: "Progress",
        dateAdded: "Date Added",
        user: "User",

        // Add User Modal
        basicInfo: "Basic Information",
        fullName: "Full Name",
        assignment: "Assignment",
        selectDiscipler: "Select discipler...",
        canAssignLater: "You can assign later if not sure",
        validationForProven: "Validation for Proven Discipler",
        provenDisciplerText: "If this person is already an experienced discipler, you can automatically validate Series 1.",
        validateSeries1: "Validate complete Series 1 (Certification as Discipler)",
        notes: "Notes",
        notesOptional: "Notes (Optional)",
        notesPlaceholder: "E.g.: Local church pastor, 10 years of experience...",
        invitationMethod: "Invitation Method",
        sendEmailInvite: "Send email invitation",
        sendWhatsAppInvite: "Send WhatsApp invitation",
        createDirectly: "Create account directly (no invitation)",
        addUser: "Add User",

        // Validate Competencies Modal
        selectUser: "Select User",
        selectUserPlaceholder: "Select...",
        currentLesson: "Current lesson",
        validateCompletesSeries: "Validate Complete Series",
        certificationLevel: "Certification Level",
        noCertification: "No certification",
        certifiedDiscipler: "Certified Discipler",
        advancedDiscipler: "Advanced Discipler",
        masterDiscipler: "Master Discipler",
        certificationNote1: "Completed Series 1",
        certificationNote2: "Completed Series 1 and 2",
        certificationNote3: "Completed all series",
        validationNotes: "Validation Notes",
        validationNotesPlaceholder: "E.g.: Pastor with 15 years of experience, has discipled 20+ people...",
        validateCompetencies: "Validate Competencies",

        // Tips
        tipsTitle: "Tips for User Management",
        tip1: "For experienced disciplers:",
        tip1Text: "Use 'Validate Competencies' to automatically mark Series 1 as complete.",
        tip2: "Invitations:",
        tip2Text: "Users will receive a unique link to create their password and access for the first time.",
        tip3: "Flexible assignment:",
        tip3Text: "You can create users without assigning a discipler immediately and do it later in 'Reassign'.",
        tip4: "Bulk import:",
        tip4Text: "To add many users at once, use the import from CSV option with format: name, email, phone, role.",

        // Reassign
        reassignDisciples: "Reassign Disciples",
        reassignSubtitle: "Drag and drop disciples between disciplers to reassign them",
        dragAndDrop: "Drag and drop to reassign",
        withoutAssigned: "Unassigned",
        confirmReassignment: "Confirm Reassignment",
        confirmReassignText: "Are you sure you want to reassign:",
        from: "From",
        to: "To",
        confirming: "Confirming...",
        reassigning: "Reassigning...",
        disciplersWithDisciples: "Disciplers and their Disciples",
        noDisciplersAvailable: "No disciplers available",
        dropHereToAssign: "Drop here to assign",
        searchDisciples: "Search disciples by name or email...",
        assigned: "Assigned",

        // Series
        seriesTitle: "Study Series",
        seriesSubtitle: "Manage series, blocks and lessons",
        newSeries: "New Series",
        editSeries: "Edit Series",
        newBlock: "New Block",
        editBlock: "Edit Block",
        newLesson: "New Lesson",
        editLesson: "Edit Lesson",
        blocks: "Blocks",
        lessons: "Lessons",
        totalLessons: "total lessons",
        totalBlocks: "total blocks",
        inactive: "Inactive",
        active: "Active",
        addBlock: "Add Block",
        noBlocks: "No blocks in this series",
        addLesson: "Add Lesson",
        noLessons: "No lessons in this block",

        // Series - additional
        loadingSeries: "Loading series...",
        spanish: "Spanish",
        english: "English",
        seriesName: "Name",
        seriesDescription: "Description",
        blockName: "Name",
        lessonTitle: "Title",
        lessonNumber: "Lesson number",
        lessonResources: "Lesson Resources",
        videoUrl: "Video URL (Unlisted YouTube)",
        podcastUrl: "Podcast URL (Audio)",
        studyUrl: "Bible Study URL",
        quizUrl: "Quiz/Questionnaire URL",
        minScoreToPass: "Minimum % to pass quiz",
        additionalNotes: "Additional notes or content (optional)",

        // Series - additional text
        lessonText1: "The disciple will have access to these 4 resources. If one is not available, it will be disabled.",
        lessonText2: "Lesson (video format).",
        lessonText3: "Lesson (audio/podcast).",
        lessonText4: "Lesson PDF format (downloadable, email)",
        lessonText5a: "Final evaluation - ",
        lessonText5b: "or greater required to pass and notify the disciplyer",

        // Reports Page - COMPLETE
        reports: "Reports",
        reports_subtitle: "Analysis and discipleship metrics",
        this_week: "This Week",
        this_month: "This Month",
        this_year: "This Year",
        all_time: "All",
        export_btn: "Export",
        export_all_disciples: "All Disciples",
        export_disciplers_only: "Disciplers Only",
        export_needs_attention: "Need Attention",
        export_active_only: "Active Only",

        // Report tabs
        dashboard_tab: "Dashboard",
        progress_series1_tab: "Series 1 Progress",
        disciplers_tab: "Disciplyers",
        needs_attention_tab: "Need Attention",
        advanced_progress_tab: "Advanced Progress",

        // Dashboard stats
        total_users_stat: "Total Users",
        registered_users_desc: "Registered users",
        active_disciples_stat: "Active Disciples",
        avg_progress_desc: "average progress",
        certified_disciplers_stat: "Disciplyers",
        completed_first_series: "Completed first series",
        needs_attention_count: "Need Attention",
        inactive_or_low: "Inactive or low progress",
        active_series_stat: "Active Series",
        total_lessons_desc: "total lessons",
        completed_this_month_stat: "Completed This Month",
        lessons_finished_desc: "Lessons completed",
        avg_time_stat: "Average Time",
        days_per_lesson_desc: "Days per lesson",

        // Table columns
        name_column: "Name",
        discipler_column: "Disciplyer",
        current_series_column: "Current Series",
        progress_column: "Progress",
        status_column: "Status",
        actions_column: "Actions",

        // Status labels
        status_active: "Active",
        status_ready: "Ready to disciple",
        status_inactive: "Inactive",
        not_assigned: "Not assigned",

        // Progress section
        overall_progress_title: "Overall Progress by Series",
        active_users_count: "active",
        completed_users_count: "completed",
        average_text: "average",
        no_progress_available: "No progress data available yet",
        all_disciples_title: "All Disciples Progress",

        // Certified section
        certified_message: "🎉 These users have completed the first series and are certified as disciplers.",
        certified_disciplers_title: "Certified Disciplers",
        no_certified_yet: "No users have completed the first series yet.",
        users_will_appear: "Users will appear here when they complete all lessons from \"Foundations of Our Faith\"",

        // Attention section
        attention_message: "⚠️ These disciples need additional motivation or follow-up.",
        require_attention_title: "Require Attention",

        // Advanced section
        advanced_view_message: "📚 Complete view of progress across all series, including optional and advanced series.",
        filter_by_series: "Filter by Series",
        filter_by_role: "Filter by Role",
        all_series_option: "All Series",
        all_roles_option: "All",
        disciples_only_option: "Disciples Only",
        studying_disciplers_option: "Studying Disciplers",
        required_label: "Required",
        required_for_discipling: "Required to Disciple",
        optional_label: "Optional",
        blocks_text: "blocks",
        lessons_range: "Lessons",
        active_users_text: "active users",
        no_active_in_series: "No active users in this series",
        users_appear_when: "Users will appear here when they start lessons",

        // Legend
        progress_legend: "Progress Legend:",
        excellent_level: "Excellent",
        good_level: "Good",
        regular_level: "Regular",
        needs_attention_level: "Needs Attention",

        // Loading
        loading_reports_text: "Loading reports...",

        // Common
        yes: "Yes",
        no: "No",
        and: "and",
        confirm: "Confirm",
        delete: "Delete",
        close: "Close",
        search: "Search",
        filter: "Filter",
        actions: "Actions",
        status: "Status",
        active: "Active",
        name: "Name",
        description: "Description",
        order: "Order",
        createdAt: "Created",
        updatedAt: "Updated",

        // Settings - Session
        sessionSettings: "Session Settings",
        sessionTimeout: "Session Timeout",
        inactivityTimeout: "Inactivity timeout (minutes)",
        inactivityTimeoutDesc: "Automatically logout after this time without activity",
        maxSessionTime: "Maximum session duration (hours)",
        maxSessionTimeDesc: "Maximum time a session can be active",
        warningTime: "Warning before logout (minutes)",
        warningTimeDesc: "Show warning before automatic logout",
        sessionNote: "Note: These settings are local. For permanent changes, configure JWT in Supabase.",

        // Confirmations
        confirmLogout: "Are you sure you want to logout?",
        confirmDelete: "Are you sure you want to delete this item?",
        confirmReject: "Are you sure you want to reject this user?",

        // Settings - Main titles
        settings: "Settings",
        settingsSubtitle: "Manage all aspects of your application",

        // Settings sections
        generalSection: "General",
        generalSectionDesc: "Basic application settings: name, timezone, main language",
        securitySection: "Security",
        securitySectionDesc: "Access control, authentication, password policies and permissions",
        databaseSection: "Database",
        databaseSectionDesc: "Automatic backups, maintenance and data optimization",
        notificationsSection: "Notifications",
        notificationsSectionDesc: "Configure what notifications to send and when",
        communicationsSection: "Communications",
        communicationsSectionDesc: "Email, SMS and WhatsApp providers for sending messages",
        appearanceSection: "Appearance",
        appearanceSectionDesc: "Visual customization: colors, logos, themes",

        // General
        generalConfig: "General Settings",
        generalConfigDesc: "Basic settings that affect the entire application",
        appName: "Application Name",
        appNameDesc: "Appears in emails and notifications",
        mainLanguage: "Main Language",
        mainLanguageDesc: "Default language for new users",
        timezone: "Timezone",
        timezoneDesc: "Affects report schedules and automatic notifications",
        timezonesTip: "Timezone tip",
        timezonesTipText: "Memphis is in Central Time (CST/CDT). Honduras also uses CST but without daylight saving time. Most of Central America is on permanent CST.",

        // Timezones
        unitedStates: "United States",
        latinAmerica: "Latin America",
        eastern: "Eastern",
        central: "Central",
        mountain: "Mountain",
        pacific: "Pacific",

        // Security
        securityConfig: "Security Settings",
        securityConfigDesc: "Protect your users' accounts and data",
        authentication: "Authentication",
        requireTwoFactor: "Require two-factor authentication for admins",
        sessionTime: "Session time (minutes)",
        sessionTimeDesc: "Auto-logout after inactivity",
        passwordPolicies: "Password Policies",
        minPasswordLength: "Minimum length",
        requireSpecialChars: "Require special characters (!@#$%)",
        accessLevels: "Current access levels",
        adminAccess: "Full system control",
        disciplerAccess: "Manages their disciples",
        discipleAccess: "Only sees their progress",

        // Database
        databaseTitle: "Database",
        databaseDesc: "Backups and data maintenance",
        autoBackups: "Automatic Backups",
        enableAutoBackup: "Enable automatic backups",
        backupFrequency: "Backup frequency",
        hourly: "Hourly",
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        retentionDays: "Backup retention (days)",
        retentionDesc: "Older backups will be automatically deleted",
        manualActions: "Manual Actions",
        downloadBackup: "Download Backup",
        restoreBackup: "Restore Backup",
        supabaseInfo: "Supabase Information",
        supabaseInfoText: "Your database is hosted on Supabase with included daily automatic backups. Additional backups here are for extra security.",

        // Notifications
        notificationsTitle: "Notifications",
        notificationsDesc: "Configure when and how to notify users",
        notificationChannels: "Notification Channels",
        emailChannel: "Email",
        smsChannel: "SMS",
        whatsappChannel: "WhatsApp",
        pushChannel: "Push Notifications (Mobile App)",
        notificationTypes: "Notification Types",
        newLessonAvailable: "New lesson available",
        activityReminder: "Pending activity reminder",
        lessonCompleted: "Congratulations for completing lesson",
        messageFromDiscipler: "Message from discipler",
        weeklyProgressSummary: "Weekly progress summary",

        // Communications
        communicationProviders: "Communication Providers",
        communicationProvidersDesc: "External services for sending messages",
        emailProvider: "Provider",
        apiKey: "API Key",
        customSMTP: "Custom SMTP",
        smsWhatsapp: "SMS and WhatsApp",
        accountSID: "Account SID",
        authToken: "Auth Token",
        whatsappBusinessNumber: "WhatsApp Business Number",
        whatsappBusinessNumberDesc: "Must be verified in WhatsApp Business API",

        // Appearance
        appearanceTitle: "Appearance",
        appearanceDesc: "Customize the visual appearance of the application",
        theme: "Theme",
        darkMode: "Dark mode",
        primaryColor: "Primary color",
        logo: "Logo",
        changeLogo: "Change Logo",
        logoRecommendation: "Recommended: 512x512px, PNG format with transparent background",

        // Buttons and actions
        saveChanges: "Save Changes",
        saving: "Saving...",
        saved: "Saved",
        changesWillApply: "Changes will apply immediately",

        // Common settings terms
        minutes: "minutes",
        hours: "hours",
        days: "days",
        enabled: "Enabled",
        disabled: "Disabled",
        select: "Select",
        configure: "Configure",
        test: "Test",
        testConnection: "Test connection",

        quizzes: "Quizzes",
        manageQuizzes: "Manage assessments",

        // Bible Studies
        bible_studies: "Bible Studies",
        interactive_guides: "Interactive Guides",
        bible_studies_subtitle: "Manage interactive study guides for each lesson",
        create_new_study: "Create New Study",
        total_lessons: "Total Lessons",
        with_study: "With Study",
        pending_studies: "Pending",
        bilingual: "Bilingual",
        search_lesson: "Search lesson by title or number...",
        expand_all: "Expand All",
        collapse_all: "Collapse All",
        main_series: "Main Series",
        series_word: "Series",
        lessons_word: "lessons",
        with_study_count: "with study",
        no_lessons_series: "No lessons in this series",
        study_complete: "Complete",
        study_external: "External",
        no_study: "No study",
        create_study: "Create/Edit Study",
        study_preview: "Study Preview",

    },
};

const LangCtx = createContext({ lang: "es", setLang: () => { }, t: (k) => k });

export function LangProvider({ children }) {
    const [lang, setLangState] = useState("es");

    useEffect(() => {
        // Primero intenta obtener el idioma guardado del login o admin
        const stored = typeof window !== "undefined" ? localStorage.getItem("admin_lang") : null;

        if (stored === "en" || stored === "es") {
            // Si hay un idioma guardado, úsalo
            setLangState(stored);
        } else {
            // Si no hay idioma guardado, detecta por navegador
            const browserLang = typeof navigator !== "undefined" &&
                navigator.language?.toLowerCase().startsWith("en") ? "en" : "es";

            // Guarda el idioma detectado
            if (typeof window !== "undefined") {
                localStorage.setItem("admin_lang", browserLang);
            }

            setLangState(browserLang);
        }
    }, []);

    const setLang = (v) => {
        setLangState(v);
        if (typeof window !== "undefined") localStorage.setItem("admin_lang", v);
    };

    const t = (key) => (M[lang] && M[lang][key]) || key;
    const value = useMemo(() => ({ lang, setLang, t }), [lang]);

    return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export default LangProvider;

export function LanguageSwitcher({ className = "" }) {
    const { lang, setLang, t } = useLang();
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-sm text-neutral-600">{t("language")}:</span>
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
            >
                <option value="es">{t("spanish")}</option>
                <option value="en">{t("english")}</option>
            </select>
        </div>
    );
}