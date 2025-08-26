// app/protected/layout.js
import AdminLayoutClient from "../AdminLayoutClient";

export default function ProtectedLayout({ children }) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}