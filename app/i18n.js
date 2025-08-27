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
        users: "Admin Usuarios",
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
        pending: "pendientes",
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
        role: "Rol",
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
        blocks: "bloques",
        lessons: "Lecciones",
        totalLessons: "lecciones totales",
        inactive: "Inactiva",
        active: "Activa",
        addBlock: "Agregar Bloque",
        noBlocks: "No hay bloques en esta serie",
        addLesson: "Agregar Lección",
        noLessons: "No hay lecciones en este bloque",

        // Reportes
        reportsTitle: "Reportes",
        reportsSubtitle: "Análisis y métricas del discipulado",
        thisWeek: "Esta Semana",
        thisMonth: "Este Mes",
        thisYear: "Este Año",
        allTime: "Todo",
        export: "Exportar",
        exportAll: "Todos los Discípulos",
        exportDisciplers: "Solo Disciplicadores",
        exportNeedAttention: "Necesitan Atención",
        exportActive: "Solo Activos",
        dashboardTab: "Dashboard",
        progressTab: "Progreso Serie 1",
        disciplersTab: "Disciplicadores",
        attentionTab: "Necesitan Atención",
        advancedTab: "Progreso Avanzado",

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
        users: "Admin Users",
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
        pending: "pending",
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
        role: "Role",
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
        blocks: "blocks",
        lessons: "Lessons",
        totalLessons: "total lessons",
        inactive: "Inactive",
        active: "Active",
        addBlock: "Add Block",
        noBlocks: "No blocks in this series",
        addLesson: "Add Lesson",
        noLessons: "No lessons in this block",

        // Reports
        reportsTitle: "Reports",
        reportsSubtitle: "Discipleship analysis and metrics",
        thisWeek: "This Week",
        thisMonth: "This Month",
        thisYear: "This Year",
        allTime: "All Time",
        export: "Export",
        exportAll: "All Disciples",
        exportDisciplers: "Disciplers Only",
        exportNeedAttention: "Need Attention",
        exportActive: "Active Only",
        dashboardTab: "Dashboard",
        progressTab: "Series 1 Progress",
        disciplersTab: "Disciplers",
        attentionTab: "Need Attention",
        advancedTab: "Advanced Progress",

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