// app/users/page.js - Con AdminLayoutClient incluido
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServerAuth";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // 1) Requiere sesión
    const {
        data: { user },
        error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
        redirect("/login");
    }

    // 2) Requiere admin usando la RPC me_is_admin()
    const { data: isAdmin, error: adminErr } = await supabase.rpc("me_is_admin");

    if (adminErr) {
        redirect("/403");
    }

    if (!isAdmin) {
        redirect("/403");
    }

    // 3) Autorizado -> renderiza con AdminLayoutClient
    return <UsersClient />;
}