"use client";

import { useState, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useLang } from "@/app/i18n";
import {
    Bell,
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    Calendar,
    Users,
    Globe,
    Star,
    X,
    Save,
    AlertCircle,
    CheckCircle,
    Video,
    FileText,
    Music,
    User,
    UserCheck,
    Clock,
    MapPin
} from "lucide-react";

export default function NotificationsManager() {
    const supabase = useMemo(() => createSupabaseBrowserClient(), []);
    const { t } = useLang();

    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [audienceFilter, setAudienceFilter] = useState("all");
    const [countryFilter, setCountryFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [languageFilter, setLanguageFilter] = useState("all");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "text", // text, video, audio
        audience: "all", // all, disciples, disciplers
        priority: "normal", // low, normal, high, urgent
        expires_at: "",
        country: "",
        language: "es", // es, en
        video_url: "",
        audio_url: "",
        assigned_users: []
    });

    // Load notifications and users
    useEffect(() => {
        fetchNotifications();
        fetchUsers();
    }, [supabase]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            alert(t("errorLoadingNotifications") || "Error cargando notificaciones");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("id, uuid, name, email, role, country")
                .is("deleted_at", null)
                .order("name");

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) {
                throw new Error("Usuario no autenticado");
            }

            // Mapear prioridad de texto a número
            const priorityMap = {
                "low": 1,
                "normal": 2,
                "high": 3,
                "urgent": 4
            };

            const notificationData = {
                title: formData.title,
                message: formData.message,
                content_type: formData.type, // type → content_type
                target_role: formData.audience, // audience → target_role (puede ser "all", "disciples", "disciplers")
                priority: priorityMap[formData.priority] || 2, // Convertir a integer
                expires_at: formData.expires_at || null,
                target_country: formData.country || null, // country → target_country
                language: formData.language || "es",
                media_url: formData.type === "video" ? formData.video_url :
                    formData.type === "audio" ? formData.audio_url : null, // Un solo campo media_url
                created_by: user.id,
                is_active: true,
                target_user_id: formData.assigned_users.length === 1 ? formData.assigned_users[0] : null
            };

            if (editingNotification) {
                // Update existing notification
                const { error } = await supabase
                    .from("notifications")
                    .update(notificationData)
                    .eq("id", editingNotification.id);

                if (error) throw error;

                // Si hay múltiples usuarios asignados, necesitamos crear registros en notification_reads
                // Si solo hay uno, ya está en target_user_id
                if (formData.assigned_users.length > 1) {
                    // Delete existing assignments
                    await supabase
                        .from("notification_reads")
                        .delete()
                        .eq("notification_id", editingNotification.id);

                    // Create new assignments (as unread)
                    const assignments = formData.assigned_users.map(userId => ({
                        notification_id: editingNotification.id,
                        user_id: userId,
                        read: false
                    }));

                    await supabase
                        .from("notification_reads")
                        .insert(assignments);
                } else if (formData.assigned_users.length === 0) {
                    // Si no hay usuarios asignados, limpiar notification_reads
                    await supabase
                        .from("notification_reads")
                        .delete()
                        .eq("notification_id", editingNotification.id);
                }
            } else {
                // Create new notification
                const { data: newNotification, error } = await supabase
                    .from("notifications")
                    .insert([notificationData])
                    .select()
                    .single();

                if (error) throw error;

                // Si hay múltiples usuarios asignados, crear registros en notification_reads
                // Si solo hay uno, ya está en target_user_id
                if (formData.assigned_users.length > 1) {
                    const assignments = formData.assigned_users.map(userId => ({
                        notification_id: newNotification.id,
                        user_id: userId,
                        read: false
                    }));

                    await supabase
                        .from("notification_reads")
                        .insert(assignments);
                }
            }

            setShowModal(false);
            resetForm();
            fetchNotifications();
            alert(t("notificationSaved") || "Notificación guardada exitosamente");
        } catch (error) {
            console.error("Error saving notification:", error);
            const errorMessage = error.message || error.toString();
            console.error("Full error details:", error);
            alert(
                (t("errorSavingNotification") || "Error guardando notificación") +
                ": " + errorMessage +
                "\n\nRevisa la consola para más detalles."
            );
        }
    };

    const handleEdit = (notification) => {
        setEditingNotification(notification);

        // Mapear prioridad de número a texto
        const priorityTextMap = {
            1: "low",
            2: "normal",
            3: "high",
            4: "urgent"
        };

        // Determinar tipo de contenido
        let contentType = notification.content_type || "text";
        let videoUrl = "";
        let audioUrl = "";
        if (contentType === "video" && notification.media_url) {
            videoUrl = notification.media_url;
        } else if (contentType === "audio" && notification.media_url) {
            audioUrl = notification.media_url;
        }

        // Determinar audiencia (target_role puede ser "all", "disciples", "disciplers")
        const audience = notification.target_role || "all";

        // Obtener usuarios asignados
        const assignedUsers = notification.target_user_id ? [notification.target_user_id] : [];

        setFormData({
            title: notification.title || "",
            message: notification.message || "",
            type: contentType,
            audience: audience,
            priority: priorityTextMap[notification.priority] || "normal",
            expires_at: notification.expires_at ? notification.expires_at.split("T")[0] : "",
            country: notification.target_country || "",
            language: notification.language || "es",
            video_url: videoUrl,
            audio_url: audioUrl,
            assigned_users: assignedUsers
        });
        setShowModal(true);
    };

    const handleDelete = async (notification) => {
        if (!confirm(t("confirmDeleteNotification") || `¿Eliminar notificación "${notification.title}"?`)) {
            return;
        }

        try {
            // Delete notification reads first
            await supabase
                .from("notification_reads")
                .delete()
                .eq("notification_id", notification.id);

            // Delete notification
            const { error } = await supabase
                .from("notifications")
                .delete()
                .eq("id", notification.id);

            if (error) throw error;

            fetchNotifications();
            alert(t("notificationDeleted") || "Notificación eliminada");
        } catch (error) {
            console.error("Error deleting notification:", error);
            alert(t("errorDeletingNotification") || "Error eliminando notificación: " + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            message: "",
            type: "text",
            audience: "all",
            priority: "normal",
            expires_at: "",
            country: "",
            language: "es",
            video_url: "",
            audio_url: "",
            assigned_users: []
        });
        setEditingNotification(null);
    };

    // Filter notifications
    const filteredNotifications = useMemo(() => {
        return notifications.filter(notification => {
            // Search filter
            if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !notification.message?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Audience filter (target_role)
            if (audienceFilter !== "all") {
                const notificationAudience = notification.target_role || "all";
                if (notificationAudience !== audienceFilter) {
                    return false;
                }
            }

            // Country filter (target_country)
            if (countryFilter !== "all" && notification.target_country !== countryFilter) {
                return false;
            }

            // Priority filter (convertir integer a texto para comparar)
            if (priorityFilter !== "all") {
                const priorityMap = {
                    "low": 1,
                    "normal": 2,
                    "high": 3,
                    "urgent": 4
                };
                if (notification.priority !== priorityMap[priorityFilter]) {
                    return false;
                }
            }

            // Language filter
            if (languageFilter !== "all" && notification.language !== languageFilter) {
                return false;
            }

            return true;
        });
    }, [notifications, searchQuery, audienceFilter, countryFilter, priorityFilter, languageFilter]);

    // Get unique countries from users and notifications
    const countries = useMemo(() => {
        const countrySet = new Set();
        // De usuarios
        users.forEach(user => {
            if (user.country) countrySet.add(user.country);
        });
        // De notificaciones existentes
        notifications.forEach(notification => {
            if (notification.target_country) countrySet.add(notification.target_country);
        });
        return Array.from(countrySet).sort();
    }, [users, notifications]);

    // Get priority badge color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent": return "bg-red-100 text-red-700 border-red-300";
            case "high": return "bg-orange-100 text-orange-700 border-orange-300";
            case "normal": return "bg-blue-100 text-blue-700 border-blue-300";
            case "low": return "bg-gray-100 text-gray-700 border-gray-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    // Get type icon
    const getTypeIcon = (contentType) => {
        switch (contentType) {
            case "video": return <Video className="w-4 h-4" />;
            case "audio": return <Music className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    // Get priority text from integer
    const getPriorityText = (priorityInt) => {
        const priorityMap = {
            1: "low",
            2: "normal",
            3: "high",
            4: "urgent"
        };
        return priorityMap[priorityInt] || "normal";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t("loading") || "Cargando..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t("notificationsManagement") || "Gestión de Notificaciones"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {t("notificationsManagementDesc") || "Crea, edita y gestiona notificaciones para los usuarios"}
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    {t("newNotification") || "Nueva Notificación"}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={t("searchNotifications") || "Buscar notificaciones..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Audience Filter */}
                    <select
                        value={audienceFilter}
                        onChange={(e) => setAudienceFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">{t("allAudience") || "Toda la audiencia"}</option>
                        <option value="disciples">{t("disciples") || "Discípulos"}</option>
                        <option value="disciplers">{t("disciplers") || "Discipuladores"}</option>
                    </select>

                    {/* Country Filter */}
                    <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">{t("allCountries") || "Todos los países"}</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">{t("allPriorities") || "Todas las prioridades"}</option>
                        <option value="urgent">{t("urgent") || "Urgente"}</option>
                        <option value="high">{t("high") || "Alta"}</option>
                        <option value="normal">{t("normal") || "Normal"}</option>
                        <option value="low">{t("low") || "Baja"}</option>
                    </select>

                    {/* Language Filter */}
                    <select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">{t("allLanguages") || "Todos los idiomas"}</option>
                        <option value="es">{t("spanish") || "Español"}</option>
                        <option value="en">{t("english") || "Inglés"}</option>
                    </select>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {t("notificationsList") || "Lista de Notificaciones"} ({filteredNotifications.length})
                    </h2>
                </div>

                {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t("noNotifications") || "No hay notificaciones"}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredNotifications.map(notification => (
                            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(notification.content_type)}
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {notification.title}
                                                </h3>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(getPriorityText(notification.priority))}`}>
                                                {t(getPriorityText(notification.priority)) || getPriorityText(notification.priority)}
                                            </span>
                                            {notification.is_active === false && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-600">
                                                    {t("inactive") || "Inactiva"}
                                                </span>
                                            )}
                                        </div>

                                        {notification.message && (
                                            <p className="text-gray-600 mb-2 line-clamp-2">
                                                {notification.message}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                                            {notification.language && (
                                                <span className="flex items-center gap-1">
                                                    <Globe className="w-4 h-4" />
                                                    {notification.language === "es" ? "🇪🇸" : "🇺🇸"} {notification.language === "es" ? t("spanish") : t("english")}
                                                </span>
                                            )}
                                            {notification.target_role && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {notification.target_role === "disciples" ? t("disciples") : t("disciplers")}
                                                </span>
                                            )}
                                            {notification.target_country && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {notification.target_country}
                                                </span>
                                            )}
                                            {notification.expires_at && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {t("expires") || "Expira"}: {new Date(notification.expires_at).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(notification)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title={t("edit") || "Editar"}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(notification)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title={t("delete") || "Eliminar"}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => {
                            setShowModal(false);
                            resetForm();
                        }}></div>
                        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                                <h3 className="text-xl font-semibold">
                                    {editingNotification ? t("editNotification") : t("newNotification")}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("title")} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={t("notificationTitlePlaceholder") || "Título de la notificación"}
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("message")} *
                                    </label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={t("notificationMessagePlaceholder") || "Mensaje de la notificación"}
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("type")} *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="text">{t("text") || "Texto"}</option>
                                        <option value="video">{t("video") || "Video"}</option>
                                        <option value="audio">{t("audio") || "Audio"}</option>
                                    </select>
                                </div>

                                {/* Video URL (if type is video) */}
                                {formData.type === "video" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("videoUrl") || "URL del Video"}
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.video_url}
                                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}

                                {/* Audio URL (if type is audio) */}
                                {formData.type === "audio" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("audioUrl") || "URL del Audio"}
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.audio_url}
                                            onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://..."
                                        />
                                    </div>
                                )}

                                {/* Audience */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("audience")} *
                                    </label>
                                    <select
                                        required
                                        value={formData.audience}
                                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">{t("allAudience") || "Toda la audiencia"}</option>
                                        <option value="disciples">{t("disciples") || "Discípulos"}</option>
                                        <option value="disciplers">{t("disciplers") || "Discipuladores"}</option>
                                    </select>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("priority")} *
                                    </label>
                                    <select
                                        required
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="low">{t("low") || "Baja"}</option>
                                        <option value="normal">{t("normal") || "Normal"}</option>
                                        <option value="high">{t("high") || "Alta"}</option>
                                        <option value="urgent">{t("urgent") || "Urgente"}</option>
                                    </select>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("language")} *
                                    </label>
                                    <select
                                        required
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="es">🇪🇸 {t("spanish") || "Español"}</option>
                                        <option value="en">🇺🇸 {t("english") || "Inglés"}</option>
                                    </select>
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("country")} ({t("optional") || "Opcional"})
                                    </label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">{t("allCountries") || "Todos los países"}</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Expiration Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("expirationDate")} ({t("optional") || "Opcional"})
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.expires_at}
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Assigned Users */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("assignToUsers") || "Asignar a usuarios específicos"} ({t("optional") || "Opcional"})
                                    </label>
                                    <select
                                        multiple
                                        value={formData.assigned_users}
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                                            setFormData({ ...formData, assigned_users: selected });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                                    >
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name || user.email} ({user.role || "discípulo"})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t("selectMultipleUsers") || "Mantén presionado Ctrl/Cmd para seleccionar múltiples usuarios"}
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        {t("save") || "Guardar"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        {t("cancel") || "Cancelar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

