"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    X, BookOpen, CheckCircle, Clock, Award, TrendingUp,
    Check, XCircle, Edit2, User, Mail, Phone, Shield,
    UserCheck, UserX, ChevronDown, ChevronRight
} from "lucide-react";

import { useLang } from "@/app/i18n";

// Si tu campo de relación se llama distinto, cámbialo aquí:
const DISCIPLER_FIELD = "discipler_id";

// Modal de Progreso de Usuario
const UserProgressModal = ({ user, isOpen, onClose, supabase, t }) => {
    const [loading, setLoading] = useState(false);
    const [progressData, setProgressData] = useState({
        series: [],
        stats: {
            totalLessons: 0,
            completedLessons: 0,
            averageQuizScore: 0,
            totalVideosWatched: 0
        }
    });

    useEffect(() => {
        if (isOpen && user) {
            fetchUserProgress();
        }
    }, [isOpen, user]);

    const fetchUserProgress = async () => {
        if (!user || !supabase) return;

        setLoading(true);
        try {
            const { data: lessons, error } = await supabase
                .from('lesson_progress')
                .select(`
                    *,
                    lecciones (
                        id,
                        titulo,
                        numero,
                        bloques (
                            id,
                            nombre,
                            series (
                                id,
                                nombre
                            )
                        )
                    )
                `)
                .eq('user_uuid', user.id);

            if (!error && lessons) {
                const stats = {
                    totalLessons: lessons.length,
                    completedLessons: lessons.filter(l => l.status === 'completed').length,
                    averageQuizScore: lessons.reduce((acc, l) => acc + (l.quiz_best || 0), 0) / (lessons.length || 1),
                    totalVideosWatched: lessons.filter(l => l.video_views > 0).length
                };

                const seriesMap = new Map();
                lessons.forEach(lesson => {
                    if (lesson.lecciones?.bloques?.series) {
                        const serieId = lesson.lecciones.bloques.series.id;
                        if (!seriesMap.has(serieId)) {
                            seriesMap.set(serieId, {
                                ...lesson.lecciones.bloques.series,
                                lessons: []
                            });
                        }
                        seriesMap.get(serieId).lessons.push(lesson);
                    }
                });

                setProgressData({
                    series: Array.from(seriesMap.values()),
                    stats
                });
            }
        } catch (error) {
            console.error('Error cargando progreso:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{t("userProgress")}</h2>
                            <p className="text-blue-100">{user?.name || user?.email}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">{("loading")}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">{t("lessons")}</p>
                                            <p className="text-xl font-bold">
                                                {progressData.stats.completedLessons}/{progressData.stats.totalLessons}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">{t("completed")}</p>
                                            <p className="text-xl font-bold">
                                                {progressData.stats.totalLessons > 0
                                                    ? Math.round((progressData.stats.completedLessons / progressData.stats.totalLessons) * 100)
                                                    : 0}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-8 h-8 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">{t("quizAverage")}</p>
                                            <p className="text-xl font-bold">
                                                {Math.round(progressData.stats.averageQuizScore)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-8 h-8 text-orange-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">{t("videosSeen")}</p>
                                            <p className="text-xl font-bold">
                                                {progressData.stats.totalVideosWatched}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t("userProgress")}</h3>
                                {progressData.series.length > 0 ? (
                                    <div className="space-y-3">
                                        {progressData.series.map((serie) => {
                                            const completed = serie.lessons.filter(l => l.status === 'completed').length;
                                            const total = serie.lessons.length;
                                            const percentage = total > 0 ? (completed / total) * 100 : 0;

                                            return (
                                                <div key={serie.id} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-medium">{serie.nombre}</h4>
                                                        <span className="text-sm text-gray-600">
                                                            {completed}/{total} lecciones
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        {t("noProgress")}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Modal de Edición de Usuario
const EditUserModal = ({ user, isOpen, onClose, onSave, loading, t, normalizeRole }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'disciple'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'disciple'
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t("editUser")}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("name")}
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("email")}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("phone")}
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("role")}
                        </label>

                        <select
                            value={normalizeRole(formData.role)} // Normalizar el valor mostrado
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="discipulo">{t("disciple")}</option>
                            <option value="discipulador">{t("discipler")}</option>
                            <option value="admin">{t("admin")}</option>
                        </select>

                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componentes auxiliares
const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        admin: "bg-purple-100 text-purple-800",
        disciplicador: "bg-blue-100 text-blue-800"
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
};

// Tarjeta de Usuario
function UserCard({ user, onEdit, onApprove, onReject, onViewProgress, onChangeRole, loading, t, normalizeRole }) {
    const [isOpen, setIsOpen] = useState(false);
    const isPending = !user.approved; // Cambio: usar approved en lugar de status

    const getRoleBadgeVariant = (role) => {
        const roleLower = (role || "").toLowerCase();
        if (roleLower === 'admin') return 'admin';
        if (roleLower === 'disciplicador' ||
            roleLower === 'disciplicadora' ||
            roleLower === 'discipulador' ||
            roleLower === 'discipuladora' ||
            roleLower === 'discipler' ||
            roleLower === 'disciplyer') return 'disciplicador';
        return 'default';
    };

    // Función helper para mostrar el rol correctamente
    const getRoleDisplay = (role) => {
        const roleLower = (role || "").toLowerCase();
        if (roleLower === 'admin') return 'Admin';
        if (roleLower === 'disciplicador' ||
            roleLower === 'disciplicadora' ||
            roleLower === 'discipulador' ||
            roleLower === 'discipuladora' ||
            roleLower === 'discipler' ||
            roleLower === 'disciplyer') return 'Disciplicador';
        if (roleLower === 'discipulo' ||
            roleLower === 'discipula' ||
            roleLower === 'disciple') return 'Discípulo';
        return 'Sin rol';
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div
                className="p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h3
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onViewProgress(user);
                                }}
                            >
                                {user.name || user.username || 'Sin nombre'}
                            </h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isPending && <Badge variant="pending">{t("notApproved")}</Badge>}
                        {user.approved && <Badge variant="approved">{t("approved")}</Badge>}
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleDisplay(user.role)}
                        </Badge>
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-3 space-y-2">
                        {user.username && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>@{user.username}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email || 'Sin email'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone || 'Sin teléfono'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Shield className="w-4 h-4" />
                            <span>ID: {user.id}</span>
                        </div>
                        {user.created_at && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{t("registered")}: {new Date(user.created_at).toLocaleDateString('es-ES')}</span>
                            </div>
                        )}
                        {user.approved && user.approved_at && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>{t("approvedOn")}: {new Date(user.approved_at).toLocaleDateString('es-ES')}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {isPending && (
                            <>
                                <button
                                    onClick={() => onApprove(user)}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    {t("approve")}
                                </button>
                                <button
                                    onClick={() => onReject(user)}
                                    disabled={loading}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    <UserX className="w-4 h-4" />
                                    {t("reject")}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => onEdit(user)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                            <Edit2 className="w-4 h-4" />
                            {t("edit")}
                        </button>

                        <button
                            onClick={() => onViewProgress(user)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                        >
                            <TrendingUp className="w-4 h-4" />
                            {t("viewProgress")}
                        </button>

                        {user.role !== 'admin' && (

                            <select
                                value={normalizeRole(user.role)} // Normalizar el valor mostrado
                                onChange={(e) => onChangeRole(user, e.target.value)}
                                disabled={loading}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <option value="discipulo">{t("disciple")}</option>
                                <option value="discipulador">{t("discipler")}</option>
                                <option value="admin">{t("admin")}</option>
                            </select>

                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Vista de Árbol
function TreeView({ leaders, childrenMap, onEdit, onViewProgress, onApprove, onReject, onChangeRole, loading, t }) {
    const [open, setOpen] = useState({});

    return (
        <div className="space-y-2">
            {leaders.map((leader) => {
                const disciples = childrenMap.get(String(leader.id)) || [];
                const isOpen = !!open[leader.id];

                return (
                    <div key={leader.id} className="bg-white rounded-lg border border-gray-200">
                        <div
                            className="p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => setOpen(prev => ({ ...prev, [leader.id]: !isOpen }))}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">
                                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </span>
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3
                                            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewProgress(leader);
                                            }}
                                        >
                                            {leader.name || 'Sin nombre'}
                                        </h3>
                                        <p className="text-sm text-gray-500">{leader.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={leader.role === 'admin' ? 'admin' : 'disciplicador'}>
                                        {leader.role === 'admin' ? 'Admin' : 'Disciplicador'}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        {disciples.length} discípulos
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(leader);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isOpen && (
                            <div className="border-t border-gray-100">
                                {disciples.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No tiene discípulos asignados
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-2">
                                        {disciples.map((disciple) => (

                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                onEdit={handleEdit}
                                                onApprove={handleApprove}
                                                onReject={handleReject}
                                                onViewProgress={handleViewProgress}
                                                onChangeRole={handleChangeRole}
                                                loading={actionLoading}
                                                t={t}
                                                normalizeRole={normalizeRole}  // Agregar esta línea
                                            />

                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function UsersClient() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const { t } = useLang();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Función para normalizar roles antes de guardar en la base de datos
    const normalizeRole = (role) => {
        const roleLower = (role || "").toLowerCase();

        // Si es alguna variante de admin
        if (roleLower === 'admin' || roleLower === 'administrador') {
            return 'admin';
        }

        // Si es alguna variante de disciplicador
        if (roleLower === 'disciplicador' ||
            roleLower === 'disciplicadora' ||
            roleLower === 'discipulador' ||
            roleLower === 'discipuladora' ||
            roleLower === 'discipler' ||
            roleLower === 'disciplyer') {
            return 'discipulador';
        }

        // Por defecto es discípulo
        return 'discipulo';
    };

    useEffect(() => {
        let alive = true;

        const fetchAll = async () => {
            setLoading(true);
            try {
                // Usar los campos correctos de tu tabla
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .is("deleted_at", null) // Excluir usuarios eliminados
                    .order("created_at", { ascending: false });

                if (!alive) return;

                if (error) {
                    console.error("Error cargando usuarios:", error);
                    alert(`Error cargando usuarios: ${error.message}`);
                } else {
                    // console.log("Usuarios cargados:", data);

                    // Analizar los roles para debugging
                    if (data && data.length > 0) {
                        const roleAnalysis = data.reduce((acc, user) => {
                            const roleValue = user.role || 'null/undefined';
                            acc[roleValue] = (acc[roleValue] || 0) + 1;
                            return acc;
                        }, {});
                        // console.log("Análisis de roles:", roleAnalysis);
                        // console.log("Muestra de usuarios:", data.slice(0, 5).map(u => ({
                        //    name: u.name,
                        //   role: u.role,
                        //   approved: u.approved
                        // })));
                    }

                    setUsers(data || []);
                }
            } catch (err) {
                console.error("Error en fetchAll:", err);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchAll();

        const ch = supabase
            .channel("users-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "users" },
                fetchAll
            )
            .subscribe();

        return () => {
            alive = false;
            ch.unsubscribe();
        };
    }, [supabase]);

    const filtered = useMemo(() => {
        let result = users;

        // Filtrar por búsqueda
        const q = query.trim().toLowerCase();
        if (q) {
            result = result.filter((u) =>
                `${u.name || ""} ${u.username || ""} ${u.email || ""} ${u.phone || ""} ${u.role || ""}`
                    .toLowerCase()
                    .includes(q)
            );
        }

        // Filtrar por tipo - CORREGIDO: incluir todas las variantes
        if (filter === "pending") {
            result = result.filter(u => !u.approved);
        } else if (filter === "approved") {
            result = result.filter(u => u.approved);
        } else if (filter === "admins") {
            result = result.filter(u => u.role === "admin");
        } else if (filter === "disciplicadores") {
            // Incluir TODAS las variantes posibles de disciplicador/discipulador
            result = result.filter(u => {
                const role = (u.role || "").toLowerCase();
                return role === "disciplicador" ||
                    role === "disciplicadora" ||
                    role === "discipulador" ||
                    role === "discipuladora" ||
                    role === "discipler" ||
                    role === "disciplyer";
            });
        } else if (filter === "disciples") {
            // Los discípulos tienen role = "discipulo" o "discipula"
            result = result.filter(u => {
                const role = (u.role || "").toLowerCase();
                return role === "discipulo" || role === "discipula" || role === "disciple";
            });
        }

        return result;
    }, [users, query, filter]);

    const counts = useMemo(() => {
        const total = users.length;
        const pending = users.filter((u) => !u.approved).length;
        const approved = users.filter((u) => u.approved).length;
        const admins = users.filter((u) => u.role === "admin").length;

        // CORREGIDO: contar todas las variantes de disciplicador/discipulador
        const disciplicadores = users.filter((u) => {
            const role = (u.role || "").toLowerCase();
            return role === "disciplicador" ||
                role === "disciplicadora" ||
                role === "discipulador" ||
                role === "discipuladora" ||
                role === "discipler" ||
                role === "disciplyer";
        }).length;

        // CORREGIDO: contar discípulos con sus variantes
        const disciples = users.filter((u) => {
            const role = (u.role || "").toLowerCase();
            return role === "discipulo" || role === "discipula" || role === "disciple";
        }).length;

        return { total, pending, approved, admins, disciplicadores, disciples };
    }, [users]);

    const handleApprove = async (user) => {
        setActionLoading(true);
        const { error } = await supabase
            .from("users")
            .update({
                approved: true,
                approved_at: new Date().toISOString(),
                // Si tienes el ID del admin actual, puedes agregarlo aquí
                // approved_by: currentAdminId
            })
            .eq("id", user.id);

        if (error) {
            console.error("Error aprobando usuario:", error);
            alert("Error al aprobar usuario");
        }
        setActionLoading(false);
    };

    const handleReject = async (user) => {
        if (!confirm("¿Estás seguro de rechazar este usuario?")) return;

        setActionLoading(true);
        const { error } = await supabase
            .from("users")
            .update({
                approved: false,
                deleted_at: new Date().toISOString()
            })
            .eq("id", user.id);

        if (error) {
            console.error("Error rechazando usuario:", error);
            alert("Error al rechazar usuario");
        }
        setActionLoading(false);
    };

    const handleChangeRole = async (user, newRole) => {
        setActionLoading(true);

        // Normalizar el rol antes de guardar
        const normalizedRole = normalizeRole(newRole);

        const { error } = await supabase
            .from("users")
            .update({ role: normalizedRole })
            .eq("id", user.id);

        if (error) {
            console.error("Error cambiando rol:", error);
            alert("Error al cambiar rol");
        }
        setActionLoading(false);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (formData) => {
        setActionLoading(true);

        // Normalizar el rol antes de guardar
        const dataToSave = {
            ...formData,
            role: normalizeRole(formData.role)
        };

        const { error } = await supabase
            .from("users")
            .update(dataToSave)
            .eq("id", editingUser.id);

        if (error) {
            console.error("Error actualizando usuario:", error);
            alert("Error al actualizar usuario");
        } else {
            setShowEditModal(false);
            setEditingUser(null);
            // Recargar usuarios para ver los cambios
            window.location.reload();
        }
        setActionLoading(false);
    };

    const handleViewProgress = (user) => {
        setSelectedUser(user);
        setShowProgressModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t("users_title")}</h1>
                <p className="text-gray-600 mt-1">{t("users_subtitle")}</p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">{t("total")}</p>
                    <p className="text-2xl font-bold">{counts.total}</p>
                </div>
                {counts.pending > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-yellow-800">{t("pending")}</p>
                        <p className="text-2xl font-bold text-yellow-900">{counts.pending}</p>
                    </div>
                )}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-800">{t("admin")}</p>
                    <p className="text-2xl font-bold text-purple-900">{counts.admins}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-800">{t("disciplers")}</p>
                    <p className="text-2xl font-bold text-blue-900">{counts.disciplicadores}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-800">{t("disciples")}</p>
                    <p className="text-2xl font-bold text-green-900">{counts.disciples}</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">{t("filterAll")}</option>
                    <option value="pending">{t("filterPending")}</option>
                    <option value="approved">{t("filterApproved")}</option>
                    <option value="admins">{t("filterAdmins")}</option>
                    <option value="disciplicadores">{t("filterDisciplers")}</option>
                    <option value="disciples">{t("filterDisciples")}</option>
                </select>
            </div>

            {/* Lista de usuarios */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">{t("usersList")}</h2>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">{t("loadingUsers")}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {t("noUsersFound")}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((user) => (

                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={handleEdit}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onViewProgress={handleViewProgress}
                                onChangeRole={handleChangeRole}
                                loading={actionLoading}
                                t={t}
                                normalizeRole={normalizeRole}  // Agregar esta línea
                            />

                        ))}
                    </div>
                )}
            </div>

            {/* Modales */}
            <EditUserModal
                user={editingUser}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                }}
                onSave={handleSaveEdit}
                loading={actionLoading}
                t={t}
                normalizeRole={normalizeRole}  // Agregar esta línea
            />

            <UserProgressModal
                user={selectedUser}
                isOpen={showProgressModal}
                onClose={() => {
                    setShowProgressModal(false);
                    setSelectedUser(null);
                }}
                supabase={supabase}
                t={t}
            />
        </div>
    );
}