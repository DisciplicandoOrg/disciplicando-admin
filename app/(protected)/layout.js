// app/protected/layout.js
import AdminLayoutClient from "../AdminLayoutClient";

import { LangProvider } from "../i18n";

export default function ProtectedLayout({ children }) {
    return (
        <LangProvider>
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </LangProvider>
    );
}