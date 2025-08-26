"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    Users, TrendingUp, BookOpen, Award, Clock, Target,
    Mail, MessageSquare, Filter, Download, Calendar,
    ChevronRight, UserCheck, AlertCircle, CheckCircle
} from "lucide-react";

// Componente de tarjeta de estadística
function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        yellow: "bg-yellow-100 text-yellow-600",
        purple: "bg-purple-100 text-purple-600",
        red: "bg-red-100 text-red-600"
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

// Componente de tabla de progreso
function ProgressTable({ data, title, onAction }) {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Discipulador
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Serie Actual
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Progreso
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {item.discipler || "Sin asignar"}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {item.currentSeries}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {item.progress}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.status === "active" ? (
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    ) : item.status === "ready" ? (
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                            Listo para discipular
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                            Inactivo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onAction('email', item)}
                                            className="text-gray-600 hover:text-blue-600"
                                            title="Enviar email"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onAction('whatsapp', item)}
                                            className="text-gray-600 hover:text-green-600"
                                            title="Enviar WhatsApp"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onAction('view', item)}
                                            className="text-gray-600 hover:text-purple-600"
                                            title="Ver detalles"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ReportsPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");

    // Estados para los datos
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDisciples: 0,
        totalDisciplers: 0,
        totalAdmins: 0,
        activeSeries: 0,
        totalLessons: 0,
        avgProgress: 0,
        readyToDisciple: 0,
        needsAttention: 0,
        completedThisMonth: 0
    });

    const [disciplesProgress, setDisciplesProgress] = useState([]);
    const [readyToBeDiscipiers, setReadyToBeDiscipiers] = useState([]);
    const [needsAttentionList, setNeedsAttentionList] = useState([]);
    const [seriesStats, setSeriesStats] = useState([]);
    const [allProgressData, setAllProgressData] = useState([]); // Agregar este estado
    const [users, setUsers] = useState([]); // Agregar estado para users
    const [series, setSeries] = useState([]); // Agregar estado para series
    const [selectedSeriesFilter, setSelectedSeriesFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [dateRange, setDateRange] = useState("month"); // week, month, year

    useEffect(() => {
        fetchAllData();
    }, [dateRange]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Obtener usuarios
            const { data: users, error: usersError } = await supabase
                .from("users")
                .select("*");

            if (usersError) throw usersError;

            // Guardar users en el estado
            setUsers(users || []);

            // Obtener series y lecciones
            const { data: series, error: seriesError } = await supabase
                .from("series")
                .select(`
                    *,
                    bloques (
                        *,
                        lecciones (*)
                    )
                `)
                .eq("is_active", true)
                .order("orden", { ascending: true });

            if (seriesError) throw seriesError;

            // Guardar series en el estado
            setSeries(series || []);

            // Obtener la información de discipuladores para cada discípulo
            const disciplerMap = {};
            users?.forEach(user => {
                if (user.discipler_id) {
                    const discipler = users.find(u => u.id === user.discipler_id);
                    if (discipler) {
                        disciplerMap[user.id] = discipler;
                    }
                }
            });

            // Calcular estadísticas
            const disciples = users?.filter(u => u.role === "disciple" || u.role === "discipulo") || [];
            const disciplers = users?.filter(u => u.role === "disciplicador" || u.role === "discipler") || [];
            const admins = users?.filter(u => u.role === "admin") || [];

            // Calcular total de lecciones y crear mapa de lecciones
            let totalLessonsCount = 0;
            const lessonNumberMap = {}; // Mapa de número de lección a información

            series?.forEach(s => {
                s.bloques?.forEach(b => {
                    b.lecciones?.forEach(l => {
                        totalLessonsCount++;
                        if (l.numero) {
                            lessonNumberMap[l.numero] = {
                                leccion: l,
                                bloque: b,
                                serie: s
                            };
                        }
                    });
                });
            });

            // Para la primera serie, contar cuántas lecciones tiene
            const firstSeries = series?.find(s => s.orden === 1);
            const firstSeriesLessonsCount = firstSeries?.bloques?.reduce((acc, b) =>
                acc + (b.lecciones?.length || 0), 0
            ) || 0;

            // Procesar datos de progreso basado en current_lesson
            let progressData = disciples.map(d => {
                const currentLessonNumber = d.current_lesson || 0;

                // Calcular progreso basado en el número de lección actual
                // Si current_lesson = 4, significa que completó 3 lecciones (1, 2, 3)
                const completedLessons = currentLessonNumber > 0 ? currentLessonNumber - 1 : 0;

                // Buscar información de la lección actual
                const currentLessonInfo = lessonNumberMap[currentLessonNumber];
                const currentSerieName = currentLessonInfo?.serie?.nombre || d.current_series || "No iniciado";

                // Calcular si completó la primera serie
                // Asumiendo que si está en una lección mayor al total de la primera serie, la completó
                const firstSeriesCompleted = firstSeriesLessonsCount > 0 &&
                    currentLessonNumber > firstSeriesLessonsCount;

                // Calcular porcentaje de progreso
                // Para simplificar, usamos el progreso sobre el total de lecciones de la primera serie
                let progressPercentage = 0;
                if (firstSeriesLessonsCount > 0) {
                    if (firstSeriesCompleted) {
                        progressPercentage = 100;
                    } else {
                        progressPercentage = Math.round((completedLessons / firstSeriesLessonsCount) * 100);
                    }
                }

                // Determinar estado
                let status = "inactive";
                if (currentLessonNumber === 0) {
                    status = "inactive";
                } else if (firstSeriesCompleted) {
                    status = "ready";
                } else if (currentLessonNumber > 0) {
                    status = "active";
                }

                // Calcular última actividad (usar updated_at si existe, si no created_at)
                const lastActivity = d.updated_at || d.created_at;

                return {
                    id: d.id,
                    name: d.name || d.username || d.email || "Sin nombre",
                    email: d.email || "",
                    phone: d.phone || "",
                    discipler: disciplerMap[d.id]?.name || disciplerMap[d.id]?.username || "Sin asignar",
                    discipler_id: d.discipler_id,
                    currentSeries: currentSerieName,
                    currentLesson: currentLessonNumber,
                    progress: progressPercentage,
                    status: status,
                    lastActivity: lastActivity,
                    firstSeriesCompleted: firstSeriesCompleted,
                    totalLessonsCompleted: completedLessons
                };
            });

            // Obtener progreso de las tablas nuevas si existen datos
            const { data: seriesProgress } = await supabase
                .from("user_series_progress")
                .select("*");

            const { data: lessonProgress } = await supabase
                .from("user_lesson_progress")
                .select("*");

            // Si hay datos en las tablas nuevas, combinar con los datos de current_lesson
            if (seriesProgress && seriesProgress.length > 0) {
                progressData = progressData.map(d => {
                    const userProgress = seriesProgress.find(sp => sp.user_id === d.id);
                    if (userProgress) {
                        // Si hay datos nuevos, usarlos
                        return {
                            ...d,
                            progress: userProgress.progress_percentage || d.progress,
                            lastActivity: userProgress.updated_at || d.lastActivity
                        };
                    }
                    return d;
                });
            }

            // Filtrar los que están listos para ser discipuladores
            const readyList = progressData.filter(p => p.firstSeriesCompleted || p.status === "ready");

            // Filtrar los que necesitan atención - LÓGICA MEJORADA
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const attentionList = progressData.filter(p => {
                const lastActivity = new Date(p.lastActivity);

                // Criterios para necesitar atención:
                // 1. Tiene discipulador pero nunca empezó (current_lesson = 0)
                // 2. Empezó pero lleva más de 7 días sin actividad
                // 3. Lleva más de 30 días en la misma lección (estancado)
                // 4. Muy poco progreso después de mucho tiempo (< 20% después de 30 días)

                const daysSinceCreated = Math.floor((new Date() - new Date(p.lastActivity)) / (1000 * 60 * 60 * 24));

                return (
                    // Tiene discipulador pero nunca empezó
                    (p.discipler_id && p.currentLesson === 0) ||
                    // Empezó pero inactivo por más de 7 días
                    (p.currentLesson > 0 && p.currentLesson < firstSeriesLessonsCount && lastActivity < sevenDaysAgo) ||
                    // Muy poco progreso después de 30 días
                    (p.progress < 20 && daysSinceCreated > 30 && p.currentLesson > 0)
                );
            });

            // Calcular completadas este mes (basado en current_lesson cambios)
            const thisMonthStart = new Date();
            thisMonthStart.setDate(1);

            // Por ahora estimamos basado en los que tienen progreso
            const completedThisMonth = progressData.filter(p => p.currentLesson > 3).length;

            // Calcular progreso promedio (solo de usuarios activos)
            const activeUsers = progressData.filter(p => p.currentLesson > 0);
            const avgProgress = activeUsers.length > 0
                ? Math.round(activeUsers.reduce((acc, p) => acc + p.progress, 0) / activeUsers.length)
                : 0;

            // Estadísticas por serie (estimadas basado en current_lesson)
            const seriesStats = series?.map(s => {
                // Estimar cuántos están en cada serie basado en el rango de lecciones
                let startLesson = 1;
                let endLesson = 0;

                // Calcular rango de lecciones para esta serie
                for (let i = 0; i < series.indexOf(s); i++) {
                    startLesson += series[i].bloques?.reduce((acc, b) =>
                        acc + (b.lecciones?.length || 0), 0
                    ) || 0;
                }
                endLesson = startLesson + (s.bloques?.reduce((acc, b) =>
                    acc + (b.lecciones?.length || 0), 0
                ) || 0) - 1;

                // Contar usuarios en este rango
                const usersInSerie = progressData.filter(p =>
                    p.currentLesson >= startLesson && p.currentLesson <= endLesson
                );

                const completedSerie = progressData.filter(p =>
                    p.currentLesson > endLesson
                );

                const avgProgressInSerie = usersInSerie.length > 0 ?
                    Math.round(usersInSerie.reduce((acc, p) => {
                        const lessonInSerie = p.currentLesson - startLesson + 1;
                        const totalInSerie = endLesson - startLesson + 1;
                        return acc + (lessonInSerie / totalInSerie * 100);
                    }, 0) / usersInSerie.length) : 0;

                return {
                    id: s.id,
                    nombre: s.nombre,
                    active: usersInSerie.length,
                    completed: completedSerie.length,
                    avgProgress: avgProgressInSerie,
                    totalLessons: s.bloques?.reduce((acc, b) => acc + (b.lecciones?.length || 0), 0) || 0,
                    startLesson,
                    endLesson
                };
            }) || [];

            // Obtener solicitudes de aprobación pendientes
            const { data: approvals } = await supabase
                .from("approval_requests")
                .select("*")
                .eq("status", "pending");

            setStats({
                totalUsers: users?.length || 0,
                totalDisciples: disciples.length,
                totalDisciplers: disciplers.length,
                totalAdmins: admins.length,
                activeSeries: series?.length || 0,
                totalLessons: totalLessonsCount,
                avgProgress: avgProgress,
                readyToDisciple: readyList.length,
                needsAttention: attentionList.length,
                completedThisMonth: completedThisMonth,
                pendingApprovals: approvals?.length || 0
            });

            setDisciplesProgress(progressData);
            setReadyToBeDiscipiers(readyList);
            setNeedsAttentionList(attentionList);
            setSeriesStats(seriesStats);

            // IMPORTANTE: Guardar allProgressData para uso en progreso avanzado
            setAllProgressData(allProgressData || []);

        } catch (error) {
            console.error("Error cargando datos:", error);
            alert("Error cargando reportes. Ver consola para detalles.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (action, user) => {
        switch (action) {
            case 'email':
                window.location.href = `mailto:${user.email}?subject=Disciplicando - Mensaje de tu discipulador`;
                break;
            case 'whatsapp':
                if (user.phone) {
                    window.open(`https://wa.me/${user.phone.replace(/\D/g, '')}`, '_blank');
                } else {
                    alert("Este usuario no tiene número de WhatsApp registrado");
                }
                break;
            case 'view':
                // Aquí podrías navegar a una vista detallada
                console.log("Ver detalles de:", user);
                break;
        }
    };

    const exportToCSV = () => {
        // Función simple para exportar datos
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Nombre,Email,Teléfono,Discipulador,Progreso,Estado\n"
            + disciplesProgress.map(d =>
                `${d.name},${d.email},${d.phone || ''},${d.discipler || ''},${d.progress}%,${d.status}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reporte_discipulos_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: TrendingUp },
        { id: "progress", label: "Progreso Serie 1", icon: Target },
        { id: "ready", label: "Disciplicadores", icon: Award },
        { id: "attention", label: "Necesitan Atención", icon: AlertCircle },
        { id: "advanced", label: "Progreso Avanzado", icon: BookOpen },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold">Reportes</h2>
                    <p className="text-gray-600">Análisis y métricas del discipulado</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mes</option>
                        <option value="year">Este Año</option>
                        <option value="all">Todo</option>
                    </select>

                    {/* Menú de exportación mejorado */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            <Download className="w-4 h-4" />
                            Exportar ▼
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <button
                                    onClick={() => {
                                        exportToCSV(disciplesProgress, "todos_discipulos");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Todos los Discípulos
                                </button>
                                <button
                                    onClick={() => {
                                        exportToCSV(readyToBeDiscipiers, "disciplicadores");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Solo Disciplicadores
                                </button>
                                <button
                                    onClick={() => {
                                        exportToCSV(needsAttentionList, "necesitan_atencion");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Necesitan Atención
                                </button>
                                <button
                                    onClick={() => {
                                        const activeOnly = disciplesProgress.filter(d => d.status === "active");
                                        exportToCSV(activeOnly, "discipulos_activos");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Solo Activos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Cargando reportes...</p>
                </div>
            ) : (
                <>
                    {/* Dashboard Tab */}
                    {activeTab === "dashboard" && (
                        <div className="space-y-6">
                            {/* Estadísticas principales con tooltips explicativos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative group">
                                    <StatCard
                                        title="Total Usuarios"
                                        value={stats.totalUsers}
                                        subtitle={`${stats.totalAdmins} admins, ${stats.totalDisciplers} discipuladores`}
                                        icon={Users}
                                        color="blue"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        Total de usuarios registrados en el sistema
                                    </div>
                                </div>
                                <div className="relative group">
                                    <StatCard
                                        title="Discípulos Activos"
                                        value={stats.totalDisciples}
                                        subtitle={`${stats.avgProgress}% progreso promedio`}
                                        icon={UserCheck}
                                        color="green"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        Usuarios con rol 'discípulo' que tienen progreso &gt; 0
                                    </div>
                                </div>
                                <div className="relative group">
                                    <StatCard
                                        title="Disciplicadores"
                                        value={stats.readyToDisciple}
                                        subtitle="Completaron primera serie"
                                        icon={Award}
                                        color="purple"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        Usuarios que completaron Serie 1 (certificados)
                                    </div>
                                </div>
                                <div className="relative group">
                                    <StatCard
                                        title="Necesitan Atención"
                                        value={stats.needsAttention}
                                        subtitle="Inactivos o bajo progreso"
                                        icon={AlertCircle}
                                        color="red"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        Inactivos &gt;7 días o progreso &lt;20% después de 30 días
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas de contenido */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    title="Series Activas"
                                    value={stats.activeSeries}
                                    subtitle={`${stats.totalLessons} lecciones totales`}
                                    icon={BookOpen}
                                    color="blue"
                                />
                                <StatCard
                                    title="Completadas Este Mes"
                                    value={stats.completedThisMonth}
                                    subtitle="Lecciones terminadas"
                                    icon={CheckCircle}
                                    color="green"
                                />
                                <StatCard
                                    title="Tiempo Promedio"
                                    value="3.5"
                                    subtitle="Días por lección"
                                    icon={Clock}
                                    color="yellow"
                                />
                            </div>

                            {/* Gráfico de progreso general */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="font-semibold text-lg mb-4">Progreso General por Serie</h3>
                                {seriesStats && seriesStats.length > 0 ? (
                                    <div className="space-y-4">
                                        {seriesStats.map((serie, index) => {
                                            const colors = ["blue", "green", "purple", "yellow", "red"];
                                            const color = colors[index % colors.length];
                                            return (
                                                <div key={serie.id}>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-medium">
                                                            {serie.nombre}
                                                        </span>
                                                        <div className="flex gap-4 text-xs text-gray-600">
                                                            <span>{serie.active} activos</span>
                                                            <span>{serie.completed} completados</span>
                                                            <span>{serie.avgProgress}% promedio</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`bg-${color}-600 h-2 rounded-full transition-all duration-500`}
                                                            style={{ width: `${serie.avgProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {serie.totalLessons} lecciones totales
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        No hay datos de progreso disponibles aún
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Progress Tab */}
                    {activeTab === "progress" && (
                        <ProgressTable
                            data={disciplesProgress}
                            title="Progreso de Todos los Discípulos"
                            onAction={handleAction}
                        />
                    )}

                    {/* Ready Tab - DISCIPLICADORES */}
                    {activeTab === "ready" && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    🎉 Estos usuarios han completado la primera serie y están certificados como disciplicadores.
                                </p>
                            </div>
                            {readyToBeDiscipiers.length > 0 ? (
                                <ProgressTable
                                    data={readyToBeDiscipiers}
                                    title="Disciplicadores Certificados"
                                    onAction={handleAction}
                                />
                            ) : (
                                <div className="bg-white rounded-lg shadow p-8 text-center">
                                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500">
                                        No hay usuarios que hayan completado la primera serie aún.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Los usuarios aparecerán aquí cuando completen todas las lecciones de "Fundamentos De Nuestra Fe"
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attention Tab */}
                    {activeTab === "attention" && (
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Estos discípulos necesitan motivación o seguimiento adicional.
                                </p>
                            </div>
                            <ProgressTable
                                data={needsAttentionList}
                                title="Requieren Atención"
                                onAction={handleAction}
                            />
                        </div>
                    )}

                    {/* Advanced Progress Tab - NUEVO */}
                    {activeTab === "advanced" && (
                        <div className="space-y-6">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="text-sm text-purple-800">
                                    📚 Vista completa del progreso en todas las series, incluyendo series opcionales y avanzadas.
                                </p>
                            </div>

                            {/* Filtros */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="flex gap-4 items-center">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Filtrar por Serie
                                        </label>
                                        <select
                                            className="px-3 py-2 border rounded-md"
                                            value={selectedSeriesFilter}
                                            onChange={(e) => setSelectedSeriesFilter(e.target.value)}
                                        >
                                            <option value="all">Todas las Series</option>
                                            {series?.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.nombre} ({s.bloques?.reduce((acc, b) =>
                                                        acc + (b.lecciones?.length || 0), 0
                                                    )} lecciones)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Filtrar por Rol
                                        </label>
                                        <select
                                            className="px-3 py-2 border rounded-md"
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                        >
                                            <option value="all">Todos</option>
                                            <option value="disciple">Solo Discípulos</option>
                                            <option value="discipler">Discipuladores Estudiando</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Vista por Series */}
                            {series?.filter(serie => {
                                // Aplicar filtro de serie
                                if (selectedSeriesFilter !== "all" && serie.id !== selectedSeriesFilter) {
                                    return false;
                                }
                                return true;
                            }).map(serie => {
                                // Calcular usuarios en esta serie basado en el rango de lecciones
                                const serieInfo = seriesStats?.find(s => s.id === serie.id);

                                // Usar allProgressData si existe y tiene datos, sino usar disciplesProgress
                                const dataToFilter = (allProgressData && allProgressData.length > 0)
                                    ? allProgressData
                                    : disciplesProgress || [];

                                // Filtrar usuarios según los criterios
                                let usersInSerie = [];

                                if (dataToFilter && dataToFilter.length > 0) {
                                    usersInSerie = dataToFilter.filter(d => {
                                        if (!d) return false; // Verificar que d existe

                                        // Verificar si está en el rango de lecciones de esta serie
                                        if (serieInfo) {
                                            const inRange = d.currentLesson >= serieInfo.startLesson &&
                                                d.currentLesson <= serieInfo.endLesson;
                                            if (!inRange) return false;
                                        }

                                        // Aplicar filtro de rol
                                        if (roleFilter === "disciple" && d.isDiscipulador) return false;
                                        if (roleFilter === "discipler" && !d.isDiscipulador) return false;

                                        return true;
                                    });
                                }

                                // Si no hay usuarios y hay filtros activos, no mostrar la serie
                                if (usersInSerie.length === 0 && (selectedSeriesFilter !== "all" || roleFilter !== "all")) {
                                    return null;
                                }

                                return (
                                    <div key={serie.id} className="bg-white rounded-lg shadow">
                                        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                                        <BookOpen className="w-5 h-5 text-purple-600" />
                                                        {serie.nombre}
                                                        {serie.orden === 1 && (
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                                Requerida
                                                            </span>
                                                        )}
                                                        {serie.orden === 2 && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                Requerida para Discipular
                                                            </span>
                                                        )}
                                                        {serie.orden > 2 && (
                                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                                                Opcional
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {serie.bloques?.length || 0} bloques •
                                                        {serie.bloques?.reduce((acc, b) =>
                                                            acc + (b.lecciones?.length || 0), 0
                                                        )} lecciones totales
                                                        {serieInfo && (
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                (Lecciones {serieInfo.startLesson}-{serieInfo.endLesson})
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-purple-600">
                                                        {usersInSerie.length}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        usuarios activos
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {usersInSerie.length > 0 ? (
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {usersInSerie.map(user => {
                                                        const isDiscipulador = user.isDiscipulador || false;

                                                        return (
                                                            <div key={user.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <p className="font-medium text-sm">
                                                                            {user.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {user.email}
                                                                        </p>
                                                                    </div>
                                                                    {isDiscipulador && (
                                                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                                            Discipulador
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <div className="flex justify-between text-xs mb-1">
                                                                            <span>Lección {user.currentLesson}</span>
                                                                            <span>{user.progress}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                                                                style={{ width: `${user.progress}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-between text-xs">
                                                                        <span className="text-gray-600">
                                                                            Discipulador: {user.discipler || "N/A"}
                                                                        </span>
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => handleAction('email', user)}
                                                                                className="text-blue-600 hover:text-blue-800"
                                                                            >
                                                                                <Mail className="w-3 h-3" />
                                                                            </button>
                                                                            {user.phone && (
                                                                                <button
                                                                                    onClick={() => handleAction('whatsapp', user)}
                                                                                    className="text-green-600 hover:text-green-800"
                                                                                >
                                                                                    <MessageSquare className="w-3 h-3" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-gray-500">
                                                <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                <p>No hay usuarios activos en esta serie</p>
                                                {selectedSeriesFilter === "all" && roleFilter === "all" && (
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Los usuarios aparecerán aquí cuando comiencen las lecciones {serieInfo?.startLesson}-{serieInfo?.endLesson}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Modal de Detalles del Usuario */}
            {showDetailsModal && selectedUserDetails && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold">Detalles del Discípulo</h2>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedUserDetails(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Información Personal */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-blue-600">Información Personal</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="font-medium">Nombre:</span>
                                        <p className="text-gray-700">{selectedUserDetails.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span>
                                        <p className="text-gray-700">{selectedUserDetails.email || "No registrado"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Teléfono:</span>
                                        <p className="text-gray-700">{selectedUserDetails.phone || "No registrado"}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">Discipulador:</span>
                                        <p className="text-gray-700">{selectedUserDetails.discipler}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progreso Académico */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-green-600">Progreso Académico</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Serie Actual: {selectedUserDetails.currentSeries}</span>
                                            <span className="text-sm">{selectedUserDetails.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-green-600 h-3 rounded-full"
                                                style={{ width: `${selectedUserDetails.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium">Lección Actual:</span>
                                            <p className="text-gray-700">Lección {selectedUserDetails.currentLesson}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Lecciones Completadas:</span>
                                            <p className="text-gray-700">{selectedUserDetails.totalLessonsCompleted}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Estado:</span>
                                            <p className="text-gray-700">
                                                {selectedUserDetails.status === "ready" ? "Disciplicador" :
                                                    selectedUserDetails.status === "active" ? "Activo" : "Inactivo"}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Última Actividad:</span>
                                            <p className="text-gray-700">
                                                {new Date(selectedUserDetails.lastActivity).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Disponibles */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-purple-600">Acciones Rápidas</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            handleAction('email', selectedUserDetails);
                                            setShowDetailsModal(false);
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Enviar Email
                                    </button>
                                    {selectedUserDetails.phone && (
                                        <button
                                            onClick={() => {
                                                handleAction('whatsapp', selectedUserDetails);
                                                setShowDetailsModal(false);
                                            }}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            WhatsApp
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            // Aquí podrías navegar a la página de edición del usuario
                                            alert("Función de edición próximamente");
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Promover a Disciplicador
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Función para enviar motivación
                                            const message = `Hola ${selectedUserDetails.name}, ¡sigue adelante con tu estudio! Estás en ${selectedUserDetails.progress}% de progreso.`;
                                            if (selectedUserDetails.phone) {
                                                const cleanPhone = selectedUserDetails.phone.replace(/\D/g, '');
                                                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        Enviar Motivación
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}