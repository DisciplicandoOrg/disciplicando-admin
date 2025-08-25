// /lib/supabaseServer.js
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Crea un cliente de Supabase ligado a las cookies del request actual.
 * IMPORTANTE en Next 15: cookies() debe usarse con await.
 */
export async function createSupabaseServerClient() {
    const cookieStore = await cookies(); // <- AQUI el await requerido en Next 15

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value;
                },
                set(name, value, options) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // En edge/SSR sin respuesta mutable, ignorar
                    }
                },
                remove(name, options) {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch {
                        // idem
                    }
                },
            },
        }
    );
}

export async function getServerSession() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return { session: null, error };
    return { session: data.session, error: null };
}

export const getSupabaseServerClient = createSupabaseServerClient;
export default createSupabaseServerClient;