// app/(protected)/notifications/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServerAuth";
import NotificationsManager from "@/components/NotificationsManager";

export default async function NotificationsPage() {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // 1) Requiere sesión
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) redirect("/login");

    // 2) Requiere admin
    const { data: isAdmin, error: adminErr } = await supabase.rpc("me_is_admin");
    if (adminErr || !isAdmin) redirect("/403");

    // 3) Renderiza el componente
    return <NotificationsManager />;
}

