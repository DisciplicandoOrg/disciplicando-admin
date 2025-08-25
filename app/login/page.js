"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Eye, EyeOff, Mail, Lock, Globe, AlertCircle, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");
    const [language, setLanguage] = useState("es");
    const [initialLoading, setInitialLoading] = useState(true);

    const texts = {
        es: {
            title: "Iniciar Sesión",
            subtitle: "Panel de Administración Disciplicando",
            email: "Correo electrónico",
            password: "Contraseña",
            login: "Iniciar Sesión",
            forgotPassword: "¿Olvidaste tu contraseña?",
            resetPassword: "Restablecer Contraseña",
            resetEmailPlaceholder: "Ingresa tu correo electrónico",
            sendReset: "Enviar enlace de restablecimiento",
            backToLogin: "Volver al inicio de sesión",
            resetSent: "Se ha enviado un enlace de restablecimiento a tu correo electrónico",
            invalidCredentials: "Credenciales inválidas",
            networkError: "Error de conexión. Inténtalo de nuevo.",
            noAccount: "¿No tienes cuenta? Contacta al administrador.",
            notAdmin: "No tienes permisos de administrador",
            loading: "Cargando...",
            loggingIn: "Iniciando sesión...",
            checkingPermissions: "Verificando permisos...",
            secureAccess: "Acceso Seguro"
        },
        en: {
            title: "Sign In",
            subtitle: "Disciplicando Administration Panel",
            email: "Email address",
            password: "Password",
            login: "Sign In",
            forgotPassword: "Forgot your password?",
            resetPassword: "Reset Password",
            resetEmailPlaceholder: "Enter your email address",
            sendReset: "Send reset link",
            backToLogin: "Back to sign in",
            resetSent: "A reset link has been sent to your email address",
            invalidCredentials: "Invalid credentials",
            networkError: "Connection error. Please try again.",
            noAccount: "Don't have an account? Contact the administrator.",
            notAdmin: "You don't have administrator permissions",
            loading: "Loading...",
            loggingIn: "Signing in...",
            checkingPermissions: "Checking permissions...",
            secureAccess: "Secure Access"
        }
    };

    const t = texts[language];

    useEffect(() => {
        // Detectar idioma guardado
        const savedLang = localStorage.getItem('disciplicando-language') || 'es';
        setLanguage(savedLang);

        // Verificar si ya está autenticado
        const checkAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (user) {
                    // Si hay usuario, verificar si es admin
                    const { data: isAdmin, error: adminError } = await supabase.rpc('me_is_admin');

                    if (!adminError && isAdmin) {
                        // Si es admin, redirigir al dashboard
                        router.push('/');
                        return;
                    } else {
                        // Si no es admin, cerrar sesión
                        await supabase.auth.signOut();
                    }
                }
            } catch (err) {
                console.error('Error checking auth:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        checkAuth();
    }, [supabase, router]);

    const handleLanguageToggle = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        localStorage.setItem('disciplicando-language', newLang);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Paso 1: Autenticar con Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                console.error('Auth error:', error);
                setError(error.message === 'Invalid login credentials' ? t.invalidCredentials : error.message);
                return;
            }

            if (data.user) {
                // Paso 2: Verificar si es admin
                setError(t.checkingPermissions);

                const { data: isAdmin, error: adminError } = await supabase.rpc('me_is_admin');

                if (adminError) {
                    console.error('Admin check error:', adminError);
                    await supabase.auth.signOut();
                    setError("Error al verificar permisos: " + adminError.message);
                    return;
                }

                if (!isAdmin) {
                    await supabase.auth.signOut();
                    setError(t.notAdmin);
                    return;
                }

                // Paso 3: Éxito - redirigir al dashboard
                router.push('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(t.networkError);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setError("");
        setResetMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setResetMessage(t.resetSent);
                setTimeout(() => {
                    setShowResetPassword(false);
                    setResetMessage("");
                    setResetEmail("");
                }, 3000);
            }
        } catch (err) {
            setError(t.networkError);
        } finally {
            setResetLoading(false);
        }
    };

    // Mostrar spinner mientras verifica autenticación inicial
    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <img
                        src="/logo-admin.png"
                        alt="Logo Disciplicando"
                        width="64"
                        height="64"
                        className="mx-auto mb-4 animate-pulse"
                    />
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">{t.loading}</p>
                </div>
            </div>
        );
    }

    if (showResetPassword) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        {/* Logo principal en reset password */}
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 p-3">
                            <img
                                src="/logo-admin.png"
                                alt="Logo Disciplicando"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{t.resetPassword}</h1>
                        <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">{t.secureAccess}</span>
                        </div>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.email}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder={t.resetEmailPlaceholder}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {resetMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                {resetMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={resetLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {resetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {resetLoading ? "Enviando..." : t.sendReset}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowResetPassword(false)}
                            className="w-full text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {t.backToLogin}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    {/* Logo principal */}
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-4 p-3 shadow-lg">
                        <img
                            src="/logo-admin.png"
                            alt="Logo Disciplicando Admin"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                    <p className="text-gray-600 mt-2">{t.subtitle}</p>

                    {/* Indicador de seguridad con candado */}
                    <div className="flex items-center justify-center gap-2 mt-3 text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">{t.secureAccess}</span>
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={handleLanguageToggle}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 border border-gray-200 transition-colors"
                    >
                        <Globe className="w-4 h-4" />
                        <span>{language === 'es' ? 'ES' : 'EN'}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.email}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="admin@disciplicando.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.password}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? t.loggingIn : t.login}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setShowResetPassword(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            disabled={loading}
                        >
                            {t.forgotPassword}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        {t.noAccount}
                    </p>
                </form>
            </div>
        </div>
    );
}