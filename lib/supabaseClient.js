"use client";

import { createBrowserClient } from "@supabase/ssr";

// Singleton del cliente de Supabase en el navegador
let browserClient;

/**
 * Devuelve SIEMPRE la misma instancia de Supabase del lado del navegador.
 * Úsala en componentes Client (Login, AdminLayoutClient, Users, etc).
 */
export function createSupabaseBrowserClient() {
    if (!browserClient) {
        browserClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
    }
    return browserClient;
}

/**
 * Función alternativa con el nombre que usabas originalmente
 */
export function getSupabaseBrowserClient() {
    return createSupabaseBrowserClient();
}

// Exportación por defecto
export default createSupabaseBrowserClient;

// (opcional) atajo por si te gusta usar una instancia directa
export const supabaseBrowser = createSupabaseBrowserClient();