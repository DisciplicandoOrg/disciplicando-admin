"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    Users, Search, ChevronRight, UserCheck, UserX,
    ArrowRight, Check, X, AlertCircle, Loader2,
    User, Mail, Phone, Calendar, Shield,
    TreePine, UserPlus, BarChart3, BookOpenText,
    RefreshCw, LogOut, CheckCircle, Star, Clock, Shuffle
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
            console.log("🔄 DASHBOARD - Cargando datos...");

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

            console.log("✅ Datos obtenidos:", usersData);

            if (usersData) {
                // Análisis de roles para debugging
                const roleAnalysis = usersData.reduce((acc, user) => {
                    const roleValue = user.role || 'null/undefined';
                    acc[roleValue] = (acc[roleValue] || 0) + 1;
                    return acc;
                }, {});
                console.log("📊 Análisis de roles:", roleAnalysis);

                const newStats = {
                    totalUsers: usersData.length,
                    // CORREGIDO: Buscar "disciplicador" en español
                    discipuladores: usersData.filter(u =>
                        u.role === 'disciplicador' ||
                        u.role === 'disciplicadora' ||
                        u.role === 'discipulador' || // Por si hay typos
                        u.role === 'discipuladora' || // Por si hay typos
                        u.role === 'discipler' || // Por si hay algunos en inglés
                        u.role === 'disciplyer'      // Por si hay algunos en inglés
                    ).length,
                    // CORREGIDO: Buscar "discipulo" en español
                    discipulos: usersData.filter(u =>
                        u.role === 'discipulo' ||
                        u.role === 'disciple' ||
                        !u.role  // Los que no tienen rol también son discípulos
                    ).length,
                    admins: usersData.filter(u => u.role === 'admin').length,
                    approved: usersData.filter(u => u.approved === true).length,
                    pending: usersData.filter(u => u.approved !== true).length
                };

                setStats(newStats);
                console.log("📊 Estadísticas calculadas:", newStats);
            }

            setLastUpdated(new Date());
        } catch (err) {
            console.error("💥 Error general:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
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
        // Contenedor principal con márgenes y espaciado mejorado
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header mejorado con usuario y logout */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🚀</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Dashboard Dinámico</h1>
                                <p className="text-gray-600">Panel con datos reales de Disciplicando</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Info del usuario */}
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">Admin</p>
                                    <p className="text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-gray-500 hidden sm:block">
                                    Actualizado: {lastUpdated.toLocaleTimeString()}
                                </div>

                                <button
                                    onClick={fetchData}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">Actualizar</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className={`w-4 h-4 ${loggingOut ? 'animate-pulse' : ''}`} />
                                    <span className="hidden sm:inline">
                                        {loggingOut ? 'Saliendo...' : 'Salir'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métricas principales con mejor espaciado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Usuarios"
                        value={stats.totalUsers}
                        subtitle="Usuarios registrados"
                        icon={Users}
                        color="blue"
                        loading={loading}
                    />

                    <MetricCard
                        title="Disciplicadores"
                        value={stats.discipuladores}
                        subtitle="Líderes activos"
                        icon={UserCheck}
                        color="green"
                        loading={loading}
                    />

                    <MetricCard
                        title="Discípulos"
                        value={stats.discipulos}
                        subtitle="En formación"
                        icon={Users}
                        color="purple"
                        loading={loading}
                    />

                    <MetricCard
                        title="Aprobados"
                        value={stats.approved}
                        subtitle={`${stats.pending} pendientes`}
                        icon={CheckCircle}
                        color="emerald"
                        loading={loading}
                    />
                </div>

                {/* Estado actual con gradiente mejorado */}
                <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-lg border shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Estado Actual del Sistema</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="font-semibold text-blue-800">Total de Usuarios</p>
                            </div>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                            <p className="text-sm text-blue-600 mt-1">Registrados en la plataforma</p>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-yellow-600 text-sm font-bold">⏳</span>
                                </div>
                                <p className="font-semibold text-yellow-800">Pendientes de Aprobación</p>
                            </div>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            <p className="text-sm text-yellow-600 mt-1">Requieren atención</p>
                        </div>

                        <div className="p-6 bg-white rounded-xl shadow-sm border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="font-semibold text-green-800">Usuarios Aprobados</p>
                            </div>
                            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                            <p className="text-sm text-green-600 mt-1">Listos para usar la app</p>
                        </div>
                    </div>
                </div>

                {/* Enlaces rápidos mejorados */}
                <div className="bg-white rounded-lg border shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">🔗</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <a
                            href="/discipleship-tree"
                            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50"
                        >
                            <TreePine className="w-11 h-11 text-green-600" />
                            <div>
                                <p className="font-medium">Árbol de Discipulado</p>
                                <p className="text-sm text-gray-600">Vista jerárquica con progreso</p>
                            </div>
                        </a>

                        <a
                            href="/users"
                            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-green-700 hover:bg-green-50"
                        >
                            <UserPlus className="w-8 h-8 text-green-800" />
                            <div>
                                <p className="font-medium">Usuarios</p>
                                <p className="text-sm text-gray-600">Administrar Usuarios</p>
                            </div>
                        </a>

                        <a
                            href="/user-management"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Gestionar Usuarios</p>
                                <p className="text-sm text-gray-600">Ver y aprobar usuarios</p>
                            </div>
                        </a>

                        <a
                            href="/assignments/reassign"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <Shuffle className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Reasignar</p>
                                <p className="text-sm text-gray-600">Mover discípulos</p>
                            </div>
                        </a>

                        <a
                            href="/series"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <BookOpenText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Series</p>
                                <p className="text-sm text-gray-600">Gestionar contenido</p>
                            </div>
                        </a>

                        <a
                            href="/reports"
                            className="group flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <BarChart3 className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Reportes</p>
                                <p className="text-sm text-gray-600">Estadísticas</p>
                            </div>
                        </a>

                    </div>
                </div>

                {/* Footer con info adicional */}
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                        Dashboard Dinámico - Disciplicando Admin Panel
                        <span className="mx-2">•</span>
                        Datos actualizados en tiempo real
                    </p>
                </div>
            </div>
        </div>
    );
}