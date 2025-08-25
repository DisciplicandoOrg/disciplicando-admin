"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** Diccionario de textos ES/EN */
const M = {
    es: {
        app_title: "Admin Disciplicando",
        language: "Idioma",
        spanish: "Español",
        english: "Inglés",
        panel: "Panel de administración",
        home: "Inicio",
        users: "Usuarios",
        reassign: "Reasignar discípulo",
        series: "Series",
        reports: "Reportes",

        // Sección Usuarios
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


    },
    en: {
        app_title: "Disciplicando Admin",
        language: "Language",
        spanish: "Spanish",
        english: "English",
        panel: "Admin Panel",
        home: "Home",
        users: "Users",
        reassign: "Reassign disciple",
        series: "Series",
        reports: "Reports",

        // Users section
        all: "All",
        leaders: "Disciplicadores", // Cambia a "Mentors" si prefieres
        disciples: "Disciples",
        loading: "Loading…",
        no_leaders: "No leaders.",
        unassigned: "Disciples without mentor",
        none: "None.",
        edit: "Edit",
        save: "Save",
        saving: "Saving…",
        cancel: "Cancel",
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
        tree_sub: "Current structure by disciplicador → disciples.",
        error_save: "Error saving user: ",

    },
};

const LangCtx = createContext({ lang: "es", setLang: () => { }, t: (k) => k });

export function LangProvider({ children }) {
    const [lang, setLangState] = useState("es");

    useEffect(() => {
        // carga preferencia guardada o deduce por navegador
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

export function LanguageSwitcher() {
    const { lang, setLang, t } = useLang();
    return (
        <div className="flex items-center gap-2">
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