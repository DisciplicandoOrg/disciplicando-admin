"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useLang } from "@/app/i18n"; // Importar useLang
import {
    Users, Search, ChevronRight, UserCheck, UserX,
    ArrowRight, Check, X, AlertCircle, Loader2,
    User, Mail, Phone, Calendar, Shield, BookOpen,
    TreePine, UserPlus, BarChart3, BookOpenText,
    RefreshCw, LogOut, CheckCircle, Star, Clock, Shuffle, HelpCircle, BookMarked
} from "lucide-react";

const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue", loading = false }) => (
    <div className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className="flex items-baseline gap-2">
                    {loading ? (
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        <p className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-600' :
                            color === 'green' ? 'text-green-600' :
                                color === 'purple' ? 'text-purple-600' :
                                    color === 'emerald' ? 'text-emerald-600' :
                                        'text-blue-600'
                            }`}>{value}</p>
                    )}
                </div>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color === 'blue' ? 'bg-blue-100' :
                color === 'green' ? 'bg-green-100' :
                    color === 'purple' ? 'bg-purple-100' :
                        color === 'emerald' ? 'bg-emerald-100' :
                            'bg-blue-100'
                }`}>
                <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' :
                    color === 'green' ? 'text-green-600' :
                        color === 'purple' ? 'text-purple-600' :
                            color === 'emerald' ? 'text-emerald-600' :
                                'text-blue-600'
                    }`} />
            </div>
        </div>
    </div>
);

export default function DashboardClient() {
    const router = useRouter();
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const { t } = useLang(); // Obtener función de traducción

    const [stats, setStats] = useState({
        totalUsers: 0,
        discipuladores: 0,
        discipulos: 0,
        admins: 0,
        approved: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [user, setUser] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            // console.log("🔄 DASHBOARD - Cargando datos...");

            // Obtener info del usuario actual
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('role, approved, created_at, name, email')
                .is('deleted_at', null);

            if (usersError) {
                console.error("❌ Error:", usersError);
                return;
            }

            // console.log("✅ Datos obtenidos:", usersData);

            if (usersData) {
                const newStats = {
                    totalUsers: usersData.length,
                    discipuladores: usersData.filter(u =>
                        u.role === 'disciplicador' ||
                        u.role === 'disciplicadora' ||
                        u.role === 'discipulador' ||
                        u.role === 'discipuladora' ||
                        u.role === 'discipler' ||
                        u.role === 'disciplyer'
                    ).length,
                    discipulos: usersData.filter(u =>
                        u.role === 'discipulo' ||
                        u.role === 'disciple' ||
                        !u.role
                    ).length,
                    admins: usersData.filter(u => u.role === 'admin').length,
                    approved: usersData.filter(u => u.approved === true).length,
                    pending: usersData.filter(u => u.approved !== true).length
                };

                setStats(newStats);
                // console.log("📊 Estadísticas calculadas:", newStats);
            }

            setLastUpdated(new Date());
        } catch (err) {
            console.error("💥 Error general:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!confirm(t('confirmLogout'))) {
            return;
        }

        try {
            setLoggingOut(true);
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión. Inténtalo de nuevo.');
        } finally {
            setLoggingOut(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [supabase]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🚀</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{t("dashboardTitle")}</h1>
                                <p className="text-gray-600">{t("panel")}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Info del usuario */}
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{t("admin")}</p>
                                    <p className="text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-gray-500 hidden sm:block">
                                    {t("updated")}: {lastUpdated.toLocaleTimeString()}
                                </div>

                                <button
                                    onClick={fetchData}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">{t("refresh")}</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    title={t("logout")}
                                >
                                    <LogOut className={`w-4 h-4 ${loggingOut ? 'animate-pulse' : ''}`} />
                                    <span className="hidden sm:inline">
                                        {loggingOut ? t("loading") : t("logout")}
                                    </span>

                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <MetricCard
                        title={t("totalUsers")}
                        value={stats.totalUsers}
                        subtitle={t("registeredUsers")}
                        icon={Users}
                        color="blue"
                        loading={loading}
                    />

                    <MetricCard
                        title={t("disciplers")}
                        value={stats.discipuladores}
                        subtitle={t("activeLeaders")}
                        icon={UserCheck}
                        color="green"
                        loading={loading}
                    />

                    <MetricCard
                        title={t("disciples")}
                        value={stats.discipulos}
                        subtitle={t("inTraining")}
                        icon={Users}
                        color="purple"
                        loading={loading}
                    />

                    <MetricCard
                        title={t("approved")}
                        value={stats.approved}
                        subtitle={`${stats.pending} ${t("pending")}`}
                        icon={CheckCircle}
                        color="emerald"
                        loading={loading}
                    />

                </div>

                {/* Estado actual */}
                <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-lg border shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{t("systemStatus")}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="font-semibold text-blue-800">{t("totalUsers")}</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                            <p className="text-sm text-blue-600 mt-1">{t("registeredInPlatform")}</p>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-yellow-600 text-sm font-bold">⏳</span>
                                </div>
                                <p className="font-semibold text-yellow-800">{t("pendingApproval")}</p>
                            </div>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            <p className="text-sm text-yellow-600 mt-1">{t("requireAttention")}</p>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="font-semibold text-green-800">{t("approvedUsers")}</p>
                            </div>
                            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                            <p className="text-sm text-green-600 mt-1">{t("readyToUse")}</p>
                        </div>
                    </div>
                </div>

                {/* Enlaces rápidos */}
                <div className="bg-white rounded-lg border shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🔗</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{t("quickActions")}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Boton del Arbol de Discipulado*/}
                        <a
                            href="/discipleship-tree"
                            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50"
                        >
                            <TreePine className="w-11 h-11 text-green-600" />
                            <div>
                                <p className="font-medium">{t("discipleshipTree")}</p>
                                <p className="text-sm text-gray-600">{t("hierarchicalView")}</p>
                            </div>
                        </a>

                        {/* Boton de Usuarios*/}
                        <a
                            href="/users"
                            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-green-700 hover:bg-green-50"
                        >
                            <UserPlus className="w-8 h-8 text-green-800" />
                            <div>
                                <p className="font-medium">{t("users")}</p>
                                <p className="text-sm text-gray-600">{t("manageUsers")}</p>
                            </div>
                        </a>

                        {/* Boton para Agregar y Validar usuarios*/}
                        <a
                            href="/user-management"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("userManagement")}</p>
                                <p className="text-sm text-gray-600">{t("viewAndApprove")}</p>
                            </div>
                        </a>

                        {/* Boton de Reasignar*/}
                        <a
                            href="/assignments/reassign"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Shuffle className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("reassign")}</p>
                                <p className="text-sm text-gray-600">{t("moveDisciples")}</p>
                            </div>
                        </a>

                        {/* Boton de Series*/}
                        <a
                            href="/series"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <BookOpenText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("series")}</p>
                                <p className="text-sm text-gray-600">{t("manageContent")}</p>
                            </div>
                        </a>

                        {/* Boton Guías de Estudio*/}
                        <a
                            href="/bible-studies"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("bible_studies")}</p>
                                <p className="text-sm text-gray-600">{t("interactive_guides")}</p>
                            </div>
                        </a>


                        {/* Boton de Quizzes*/}
                        <a
                            href="/quizzes"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                <HelpCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("quizzes") || "Quizzes"}</p>
                                <p className="text-sm text-gray-600">{t("manageQuizzes") || "Gestionar evaluaciones"}</p>
                            </div>
                        </a>


                        {/* Boton de Guías De Estudio*/}
                        <a
                            href="/bible-guides"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <BookMarked className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("bible_guides")}</p>
                                <p className="text-sm text-gray-600">{t("bible_guides_dashboard")}</p>
                            </div>
                        </a>

                        {/* Boton de Reportes*/}
                        <a
                            href="/reports"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <BarChart3 className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{t("reports")}</p>
                                <p className="text-sm text-gray-600">{t("statistics")}</p>
                            </div>
                        </a>

                    </div>
                </div>

                {/* Footer */}
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                        {t("dashboardTitle")} - {t("app_title")}
                        <span className="mx-2">•</span>
                        {t("updated")}: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}