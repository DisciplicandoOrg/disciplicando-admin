"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    Users, TrendingUp, BookOpen, Award, Clock, Target,
    Mail, MessageSquare, Filter, Download, Calendar,
    ChevronRight, UserCheck, AlertCircle, CheckCircle
} from "lucide-react";

import { useLang } from "@/app/i18n";

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

export default function ReportsPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const { t } = useLang();
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
    const [allProgressData, setAllProgressData] = useState([]);
    const [users, setUsers] = useState([]);
    const [series, setSeries] = useState([]);
    const [selectedSeriesFilter, setSelectedSeriesFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [dateRange, setDateRange] = useState("month");

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
                                    {t("name_column")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t("discipler_column")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t("current_series_column")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t("progress_column")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t("status_column")}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    {t("actions_column")}
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
                                        {item.discipler || t("not_assigned")}
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
                                                {t("status_active")}
                                            </span>
                                        ) : item.status === "ready" ? (
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {t("status_ready")}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                {t("status_inactive")}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onAction('email', item)}
                                                className="text-gray-600 hover:text-blue-600"
                                                title={t("send_email")}
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onAction('whatsapp', item)}
                                                className="text-gray-600 hover:text-green-600"
                                                title="WhatsApp"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onAction('view', item)}
                                                className="text-gray-600 hover:text-purple-600"
                                                title={t("view_details_log")}
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
            const lessonNumberMap = {};

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
                const completedLessons = currentLessonNumber > 0 ? currentLessonNumber - 1 : 0;
                const currentLessonInfo = lessonNumberMap[currentLessonNumber];
                const currentSerieName = currentLessonInfo?.serie?.nombre || d.current_series || t("not_assigned");
                const firstSeriesCompleted = firstSeriesLessonsCount > 0 &&
                    currentLessonNumber > firstSeriesLessonsCount;

                let progressPercentage = 0;
                if (firstSeriesLessonsCount > 0) {
                    if (firstSeriesCompleted) {
                        progressPercentage = 100;
                    } else {
                        progressPercentage = Math.round((completedLessons / firstSeriesLessonsCount) * 100);
                    }
                }

                let status = "inactive";
                if (currentLessonNumber === 0) {
                    status = "inactive";
                } else if (firstSeriesCompleted) {
                    status = "ready";
                } else if (currentLessonNumber > 0) {
                    status = "active";
                }

                const lastActivity = d.updated_at || d.created_at;

                return {
                    id: d.id,
                    name: d.name || d.username || d.email || t("no_name"),
                    email: d.email || "",
                    phone: d.phone || "",
                    discipler: disciplerMap[d.id]?.name || disciplerMap[d.id]?.username || t("not_assigned"),
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

            // Filtrar los que necesitan atención
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const attentionList = progressData.filter(p => {
                const lastActivity = new Date(p.lastActivity);
                const daysSinceCreated = Math.floor((new Date() - new Date(p.lastActivity)) / (1000 * 60 * 60 * 24));

                return (
                    (p.discipler_id && p.currentLesson === 0) ||
                    (p.currentLesson > 0 && p.currentLesson < firstSeriesLessonsCount && lastActivity < sevenDaysAgo) ||
                    (p.progress < 20 && daysSinceCreated > 30 && p.currentLesson > 0)
                );
            });

            // Calcular completadas este mes
            const thisMonthStart = new Date();
            thisMonthStart.setDate(1);
            const completedThisMonth = progressData.filter(p => p.currentLesson > 3).length;

            // Calcular progreso promedio
            const activeUsers = progressData.filter(p => p.currentLesson > 0);
            const avgProgress = activeUsers.length > 0
                ? Math.round(activeUsers.reduce((acc, p) => acc + p.progress, 0) / activeUsers.length)
                : 0;

            // Estadísticas por serie
            const seriesStats = series?.map(s => {
                let startLesson = 1;
                let endLesson = 0;

                for (let i = 0; i < series.indexOf(s); i++) {
                    startLesson += series[i].bloques?.reduce((acc, b) =>
                        acc + (b.lecciones?.length || 0), 0
                    ) || 0;
                }
                endLesson = startLesson + (s.bloques?.reduce((acc, b) =>
                    acc + (b.lecciones?.length || 0), 0
                ) || 0) - 1;

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
            setAllProgressData(allProgressData || []);

        } catch (error) {
            console.error("Error cargando datos:", error);
            alert(t("error_loading_reports"));
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
                    alert(t("no_whatsapp_number"));
                }
                break;
            case 'view':
                console.log(t("view_details_log"), user);
                break;
        }
    };

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + `${t("csv_name")},${t("csv_email")},${t("csv_phone")},${t("csv_discipler")},${t("csv_progress")},${t("csv_status")}\n`
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
        { id: "dashboard", label: t("dashboard_tab"), icon: TrendingUp },
        { id: "progress", label: t("progress_series1_tab"), icon: Target },
        { id: "ready", label: t("disciplers_tab"), icon: Award },
        { id: "attention", label: t("needs_attention_tab"), icon: AlertCircle },
        { id: "advanced", label: t("advanced_progress_tab"), icon: BookOpen },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold">{t("reports")}</h2>
                    <p className="text-gray-600">{t("reports_subtitle")}</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="week">{t("this_week")}</option>
                        <option value="month">{t("this_month")}</option>
                        <option value="year">{t("this_year")}</option>
                        <option value="all">{t("all_time")}</option>
                    </select>

                    {/* Menú de exportación */}
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            <Download className="w-4 h-4" />
                            {t("export_btn")} ▼
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
                                    {t("export_all_disciples")}
                                </button>
                                <button
                                    onClick={() => {
                                        exportToCSV(readyToBeDiscipiers, "disciplicadores");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    {t("export_disciplers_only")}
                                </button>
                                <button
                                    onClick={() => {
                                        exportToCSV(needsAttentionList, "necesitan_atencion");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    {t("export_needs_attention")}
                                </button>
                                <button
                                    onClick={() => {
                                        const activeOnly = disciplesProgress.filter(d => d.status === "active");
                                        exportToCSV(activeOnly, "discipulos_activos");
                                        setShowExportMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    {t("export_active_only")}
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
                    <p className="text-gray-500">{t("loading_reports_text")}</p>
                </div>
            ) : (
                <>
                    {/* Dashboard Tab */}
                    {activeTab === "dashboard" && (
                        <div className="space-y-6">
                            {/* Estadísticas principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative group">
                                    <StatCard
                                        title={t("total_users_stat")}
                                        value={stats.totalUsers}
                                        subtitle={`${stats.totalAdmins} admins, ${stats.totalDisciplers} ${t("disciplers")}`}
                                        icon={Users}
                                        color="blue"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        {t("tooltip_total_users")}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <StatCard
                                        title={t("active_disciples_stat")}
                                        value={stats.totalDisciples}
                                        subtitle={`${stats.avgProgress}% ${t("avg_progress_desc")}`}
                                        icon={UserCheck}
                                        color="green"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        {t("tooltip_active_disciples")}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <StatCard
                                        title={t("certified_disciplers_stat")}
                                        value={stats.readyToDisciple}
                                        subtitle={t("completed_first_series")}
                                        icon={Award}
                                        color="purple"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        {t("tooltip_certified")}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <StatCard
                                        title={t("needs_attention_count")}
                                        value={stats.needsAttention}
                                        subtitle={t("inactive_or_low")}
                                        icon={AlertCircle}
                                        color="red"
                                    />
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded whitespace-nowrap z-10">
                                        {t("tooltip_needs_attention")}
                                    </div>
                                </div>
                            </div>

                            {/* Estadísticas de contenido */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    title={t("active_series_stat")}
                                    value={stats.activeSeries}
                                    subtitle={`${stats.totalLessons} ${t("total_lessons_desc")}`}
                                    icon={BookOpen}
                                    color="blue"
                                />
                                <StatCard
                                    title={t("completed_this_month_stat")}
                                    value={stats.completedThisMonth}
                                    subtitle={t("lessons_finished_desc")}
                                    icon={CheckCircle}
                                    color="green"
                                />
                                <StatCard
                                    title={t("avg_time_stat")}
                                    value="3.5"
                                    subtitle={t("days_per_lesson_desc")}
                                    icon={Clock}
                                    color="yellow"
                                />
                            </div>

                            {/* Gráfico de progreso general */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="font-semibold text-lg mb-4">{t("overall_progress_title")}</h3>
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
                                                            <span>{serie.active} {t("active_users_count")}</span>
                                                            <span>{serie.completed} {t("completed_users_count")}</span>
                                                            <span>{serie.avgProgress}% {t("average_text")}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`bg-${color}-600 h-2 rounded-full transition-all duration-500`}
                                                            style={{ width: `${serie.avgProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {serie.totalLessons} {t("total_lessons_desc")}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        {t("no_progress_available")}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Progress Tab */}
                    {activeTab === "progress" && (
                        <ProgressTable
                            data={disciplesProgress}
                            title={t("all_disciples_title")}
                            onAction={handleAction}
                        />
                    )}

                    {/* Ready Tab */}
                    {activeTab === "ready" && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    {t("certified_message")}
                                </p>
                            </div>
                            {readyToBeDiscipiers.length > 0 ? (
                                <ProgressTable
                                    data={readyToBeDiscipiers}
                                    title={t("certified_disciplers_title")}
                                    onAction={handleAction}
                                />
                            ) : (
                                <div className="bg-white rounded-lg shadow p-8 text-center">
                                    <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500">
                                        {t("no_certified_yet")}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {t("users_will_appear")}
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
                                    {t("attention_message")}
                                </p>
                            </div>
                            <ProgressTable
                                data={needsAttentionList}
                                title={t("require_attention_title")}
                                onAction={handleAction}
                            />
                        </div>
                    )}

                    {/* Advanced Progress Tab */}
                    {activeTab === "advanced" && (
                        <div className="space-y-6">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <p className="text-sm text-purple-800">
                                    {t("advanced_view_message")}
                                </p>
                            </div>

                            {/* Filtros */}
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="flex gap-4 items-center">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("filter_by_series")}
                                        </label>
                                        <select
                                            className="px-3 py-2 border rounded-md"
                                            value={selectedSeriesFilter}
                                            onChange={(e) => setSelectedSeriesFilter(e.target.value)}
                                        >
                                            <option value="all">{t("all_series_option")}</option>
                                            {series?.map(s => (
                                                <option key={s.id} value={s.id}>
                                                    {s.nombre} ({s.bloques?.reduce((acc, b) =>
                                                        acc + (b.lecciones?.length || 0), 0
                                                    )} {t("lessons")})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("filter_by_role")}
                                        </label>
                                        <select
                                            className="px-3 py-2 border rounded-md"
                                            value={roleFilter}
                                            onChange={(e) => setRoleFilter(e.target.value)}
                                        >
                                            <option value="all">{t("all_roles_option")}</option>
                                            <option value="disciple">{t("disciples_only_option")}</option>
                                            <option value="discipler">{t("studying_disciplers_option")}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Vista por Series */}
                            {series?.filter(serie => {
                                if (selectedSeriesFilter !== "all" && serie.id !== selectedSeriesFilter) {
                                    return false;
                                }
                                return true;
                            }).map(serie => {
                                const serieInfo = seriesStats?.find(s => s.id === serie.id);
                                const dataToFilter = (allProgressData && allProgressData.length > 0)
                                    ? allProgressData
                                    : disciplesProgress || [];

                                let usersInSerie = [];

                                if (dataToFilter && dataToFilter.length > 0) {
                                    usersInSerie = dataToFilter.filter(d => {
                                        if (!d) return false;

                                        if (serieInfo) {
                                            const inRange = d.currentLesson >= serieInfo.startLesson &&
                                                d.currentLesson <= serieInfo.endLesson;
                                            if (!inRange) return false;
                                        }

                                        if (roleFilter === "disciple" && d.isDiscipulador) return false;
                                        if (roleFilter === "discipler" && !d.isDiscipulador) return false;

                                        return true;
                                    });
                                }

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
                                                                {t("required_label")}
                                                            </span>
                                                        )}
                                                        {serie.orden === 2 && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                {t("required_for_discipling")}
                                                            </span>
                                                        )}
                                                        {serie.orden > 2 && (
                                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                                                {t("optional_label")}
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {serie.bloques?.length || 0} {t("blocks_text")} •
                                                        {serie.bloques?.reduce((acc, b) =>
                                                            acc + (b.lecciones?.length || 0), 0
                                                        )} {t("total_lessons_desc")}
                                                        {serieInfo && (
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                ({t("lessons_range")} {serieInfo.startLesson}-{serieInfo.endLesson})
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-purple-600">
                                                        {usersInSerie.length}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {t("active_users_text")}
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
                                                                            {t("discipler")}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div>
                                                                        <div className="flex justify-between text-xs mb-1">
                                                                            <span>{t("lesson")} {user.currentLesson}</span>
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
                                                                            {t("discipler")}: {user.discipler || "N/A"}
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
                                                <p>{t("no_active_in_series")}</p>
                                                {selectedSeriesFilter === "all" && roleFilter === "all" && (
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {t("users_appear_when")} {serieInfo?.startLesson}-{serieInfo?.endLesson}
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
                            <h2 className="text-xl font-bold">{t("user_details_title")}</h2>
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
                                <h3 className="font-semibold mb-3 text-blue-600">{t("personal_info")}</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="font-medium">{t("name")}:</span>
                                        <p className="text-gray-700">{selectedUserDetails.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">{t("email")}:</span>
                                        <p className="text-gray-700">{selectedUserDetails.email || t("no_registered")}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">{t("phone")}:</span>
                                        <p className="text-gray-700">{selectedUserDetails.phone || t("no_registered")}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium">{t("discipler")}:</span>
                                        <p className="text-gray-700">{selectedUserDetails.discipler}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progreso Académico */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-green-600">{t("academic_progress")}</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{t("current_series")}: {selectedUserDetails.currentSeries}</span>
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
                                            <span className="font-medium">{t("current_lesson")}:</span>
                                            <p className="text-gray-700">{t("lesson")} {selectedUserDetails.currentLesson}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t("lessons_completed")}:</span>
                                            <p className="text-gray-700">{selectedUserDetails.totalLessonsCompleted}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t("status")}:</span>
                                            <p className="text-gray-700">
                                                {selectedUserDetails.status === "ready" ? t("discipler") :
                                                    selectedUserDetails.status === "active" ? t("status_active") : t("status_inactive")}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t("last_activity")}:</span>
                                            <p className="text-gray-700">
                                                {new Date(selectedUserDetails.lastActivity).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Disponibles */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold mb-3 text-purple-600">{t("quick_actions")}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            handleAction('email', selectedUserDetails);
                                            setShowDetailsModal(false);
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Mail className="w-4 h-4" />
                                        {t("send_email")}
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
                                            alert(t("edit_function_soon"));
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        {t("promote_discipler")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const message = `Hola ${selectedUserDetails.name}, ¡sigue adelante con tu estudio! Estás en ${selectedUserDetails.progress}% de progreso.`;
                                            if (selectedUserDetails.phone) {
                                                const cleanPhone = selectedUserDetails.phone.replace(/\D/g, '');
                                                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                            }
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        {t("send_motivation")}
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