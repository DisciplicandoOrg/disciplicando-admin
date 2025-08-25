// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Admin | Disciplicando",
  description: "Panel de administración de Disciplicando"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}