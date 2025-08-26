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
        userManagement: "Gestión Usuarios",
        logout: "Salir",

        // Dashboard
        dashboardTitle: "Dashboard Dinámico",
        dashboardSubtitle: "Panel con datos reales de Disciplicando",
        totalUsers: "Total Usuarios",
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
        users_title: "Gestión de Usuarios",
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
        lessons: "lecciones",
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
        userManagement: "Manage Users",
        logout: "Logout",

        // Dashboard
        dashboardTitle: "Dynamic Dashboard",
        dashboardSubtitle: "Panel with real Disciplicando data",
        totalUsers: "Total Users",
        disciplers: "Disciplers",
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
        lessons: "lessons",
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
        // Carga preferencia guardada o detecta por navegador
        const stored = typeof window !== "undefined" ? localStorage.getItem("admin_lang") : null;
        if (stored === "en" || stored === "es") {
            setLangState(stored);
        } else {
            const guess =
                typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("en")
                    ? "en"
                    : "es";
            setLangState(guess);
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