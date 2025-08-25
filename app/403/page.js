"use client";

import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
    const router = useRouter();

    const handleGoToLogin = () => {
        // Método más directo para ir al login
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldX className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">403</h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Acceso Denegado</h2>
                <p className="text-gray-600 mb-8">
                    No tienes permisos para acceder a esta página. Solo los administradores pueden usar este panel.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleGoToLogin}
                        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Login
                    </button>

                    <a
                        href="/login"
                        className="block w-full text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                        O haz clic aquí para ir al login
                    </a>
                </div>
            </div>
        </div>
    );
}