// app/protected/assignments/reassign/page.js
import ReassignClient from "./ReassignClient";

export default function ReassignPage() {
    // Si el layout de (protected) ya maneja la autenticación,
    // podemos ir directo al componente cliente
    return <ReassignClient />;
}