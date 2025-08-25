// app/page.js
import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirigir automáticamente al dashboard dentro de (protected)
  redirect("/dashboard");
}