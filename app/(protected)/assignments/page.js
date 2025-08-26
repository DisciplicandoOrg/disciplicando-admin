// app/assignments/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AssignmentsClient from "./AssignmentsClient";
import { createSupabaseServerClient } from "@/lib/supabaseServerAuth";

export default async function AssignmentsPage() {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    // 1) Requiere sesión
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) redirect("/login");

    // 2) Requiere admin
    const { data: isAdmin, error: adminErr } = await supabase.rpc("me_is_admin");
    if (adminErr || !isAdmin) redirect("/403");

    // 3) Renderiza UI cliente
    return <AssignmentsClient />;
}