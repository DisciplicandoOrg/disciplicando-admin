// app/discipleship-tree/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServerAuth";
import DiscipleshipTree from "./DiscipleshipTree";

export const metadata = {
    title: "Árbol de Discipulado | Admin Disciplicando",
};

export default async function DiscipleshipTreePage() {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // 1) Verificar sesión
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
        redirect("/login");
    }

    // 2) Verificar permisos de admin
    const { data: isAdmin, error: adminErr } = await supabase.rpc("me_is_admin");
    if (adminErr || !isAdmin) {
        redirect("/403");
    }

    // 3) Renderizar componente
    return <DiscipleshipTree />;
}