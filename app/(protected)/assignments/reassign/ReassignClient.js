"use client";

import { useState, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    Users, Search, ChevronRight, UserCheck, UserX,
    ArrowRight, Check, X, AlertCircle, Loader2,
    User, Mail, Phone, Calendar, Shield
} from "lucide-react";
import { useLang } from "@/app/i18n";


// Componente de Badge
const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        admin: "bg-purple-100 text-purple-800",
        disciplicador: "bg-blue-100 text-blue-800",
        discipulo: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800"
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
};

// Componente de Usuario (draggable)
const DiscipleCard = ({ disciple, isDragging, onDragStart, onDragEnd }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, disciple)}
            onDragEnd={onDragEnd}
            className={`p-3 bg-white rounded-lg border cursor-move transition-all ${isDragging
                ? 'opacity-50 border-blue-400 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                        {disciple.name || disciple.username || 'Sin nombre'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{disciple.email}</p>
                </div>
            </div>
        </div>
    );
};

// Componente de Disciplicador (drop zone)
const DisciplerZone = ({ discipler, disciples, onDrop, isDragOver, onDragOver, onDragLeave, isExpanded, onToggle, t }) => {
    const isLeader = discipler.role === 'discipulador' || discipler.role === 'discipuladora' ||
        discipler.role === 'discipler' || discipler.role === 'admin';

    return (
        <div
            className={`bg-white rounded-xl border-2 transition-all ${isDragOver
                ? 'border-blue-400 bg-blue-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 shadow-sm'
                }`}
            onDrop={(e) => onDrop(e, discipler)}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            {/* Header del disciplicador */}
            <div
                className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                onClick={() => onToggle(discipler.id)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ChevronRight
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''
                                }`}
                        />
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {discipler.name || discipler.username || t("noName")}
                            </h3>
                            <p className="text-sm text-gray-500">{discipler.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={discipler.role === 'admin' ? 'admin' : 'disciplicador'}>
                            {discipler.role === 'admin' ? t("admin") : t("discipler")}
                        </Badge>
                        <Badge variant="default">
                            {disciples.length} {disciples.length === 1 ? t("disciple_singular") : t("disciples_plural")}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Lista de discípulos */}
            {isExpanded && (
                <div className={`p-4 min-h-[100px] ${isDragOver ? 'bg-blue-50' : ''}`}>
                    {disciples.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <UserX className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">{t("withoutAssigned")}</p>
                            {isDragOver && (
                                <p className="text-sm text-blue-600 mt-2">
                                    {t("dropHereToAssign")}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {disciples.map((disciple) => (
                                <DiscipleCard
                                    key={disciple.id}
                                    disciple={disciple}
                                    isDragging={false}
                                    onDragStart={(e, d) => { }}
                                    onDragEnd={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Modal de confirmación
const ConfirmModal = ({ isOpen, onClose, onConfirm, disciple, fromDiscipler, toDiscipler, loading, t }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold">{t("confirmReassignment")}</h2>
                </div>

                <div className="space-y-4 mb-6">
                    <p className="text-gray-600">
                        {t("confirmReassignText")}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium">{disciple?.name || disciple?.email}</p>
                        <p className="text-sm text-gray-500">{disciple?.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">{t("from")}:</p>
                            <p className="font-medium">{fromDiscipler?.name || 'Sin asignar'}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">{t("to")}:</p>
                            <p className="font-medium">{toDiscipler?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("reassigning")}
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                {t("confirm")}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente principal
export default function ReassignClient() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [draggedDisciple, setDraggedDisciple] = useState(null);
    const [dragOverDiscipler, setDragOverDiscipler] = useState(null);
    const [expandedDisciplers, setExpandedDisciplers] = useState({});
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        disciple: null,
        fromDiscipler: null,
        toDiscipler: null
    });

    const { t } = useLang();

    // Cargar usuarios
    useEffect(() => {
        fetchUsers();
    }, [supabase]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .is("deleted_at", null)
                .order("name", { ascending: true });

            if (error) throw error;
            setUsers(data || []);

            // Auto-expandir disciplicadores con discípulos
            const expandedMap = {};
            data?.forEach(user => {
                if (isLeaderRole(user.role)) {
                    const hasDisciples = data.some(d => d.discipler_id === user.uuid || d.discipler_id === user.id);
                    if (hasDisciples) {
                        expandedMap[user.id] = true;
                    }
                }
            });
            setExpandedDisciplers(expandedMap);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            alert("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    // Helper: verificar si es líder
    const isLeaderRole = (role) => {
        const roleLower = (role || "").toLowerCase();
        return roleLower === 'admin' ||
            roleLower === 'discipulador' ||
            roleLower === 'discipuladora' ||
            roleLower === 'disciplicador' ||
            roleLower === 'disciplicadora' ||
            roleLower === 'discipler' ||
            roleLower === 'disciplyer';
    };

    // Filtrar y organizar usuarios
    const { disciplers, disciplesMap, unassignedDisciples } = useMemo(() => {
        const disciplers = users.filter(u => isLeaderRole(u.role));
        const disciplesMap = new Map();
        const unassigned = [];

        // Inicializar map para cada disciplicador
        disciplers.forEach(d => {
            disciplesMap.set(d.id, []);
        });

        // Asignar discípulos a sus disciplicadores
        users.forEach(user => {
            const roleLower = (user.role || "").toLowerCase();
            if (roleLower === 'discipulo' || roleLower === 'discipula' || roleLower === 'disciple' || !user.role) {
                if (user.discipler_id) {
                    // Buscar por uuid o id
                    const discipler = disciplers.find(d =>
                        d.uuid === user.discipler_id ||
                        d.id === user.discipler_id
                    );
                    if (discipler) {
                        disciplesMap.get(discipler.id).push(user);
                    } else {
                        unassigned.push(user);
                    }
                } else {
                    unassigned.push(user);
                }
            }
        });

        // Aplicar filtro de búsqueda
        const query = searchQuery.toLowerCase();
        if (query) {
            disciplesMap.forEach((disciples, disciplerId) => {
                disciplesMap.set(
                    disciplerId,
                    disciples.filter(d =>
                        (d.name || "").toLowerCase().includes(query) ||
                        (d.email || "").toLowerCase().includes(query) ||
                        (d.username || "").toLowerCase().includes(query)
                    )
                );
            });
        }

        return { disciplers, disciplesMap, unassignedDisciples: unassigned };
    }, [users, searchQuery]);

    // Handlers de drag & drop
    const handleDragStart = (e, disciple) => {
        setDraggedDisciple(disciple);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
        setDraggedDisciple(null);
        setDragOverDiscipler(null);
    };

    const handleDragOver = (e, disciplerId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverDiscipler(disciplerId);
    };

    const handleDragLeave = () => {
        setDragOverDiscipler(null);
    };

    const handleDrop = (e, toDiscipler) => {
        e.preventDefault();
        setDragOverDiscipler(null);

        if (!draggedDisciple) return;

        // Encontrar el disciplicador actual
        const fromDiscipler = disciplers.find(d =>
            d.uuid === draggedDisciple.discipler_id ||
            d.id === draggedDisciple.discipler_id
        );

        // Mostrar modal de confirmación
        setConfirmModal({
            isOpen: true,
            disciple: draggedDisciple,
            fromDiscipler,
            toDiscipler
        });
    };

    const handleConfirmReassign = async () => {
        setSaving(true);
        try {
            const { disciple, toDiscipler } = confirmModal;

            // Actualizar en la base de datos
            const { error } = await supabase
                .from("users")
                .update({
                    discipler_id: toDiscipler.uuid || toDiscipler.id
                })
                .eq("id", disciple.id);

            if (error) throw error;

            // Actualizar estado local
            await fetchUsers();

            // Cerrar modal
            setConfirmModal({
                isOpen: false,
                disciple: null,
                fromDiscipler: null,
                toDiscipler: null
            });

            // Mensaje de éxito (opcional)
            // alert("Reasignación exitosa");
        } catch (error) {
            console.error("Error reasignando:", error);
            alert("Error al reasignar discípulo");
        } finally {
            setSaving(false);
            setDraggedDisciple(null);
        }
    };

    const toggleDiscipler = (disciplerId) => {
        setExpandedDisciplers(prev => ({
            ...prev,
            [disciplerId]: !prev[disciplerId]
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t("reassignDisciples")}</h1>
                <p className="text-gray-600 mt-1">
                    {t("reassignSubtitle")}
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">{t("disciplers")}</p>
                    <p className="text-2xl font-bold">{disciplers.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">{t("assigned")}</p>
                    <p className="text-2xl font-bold">
                        {users.filter(u => u.discipler_id && !isLeaderRole(u.role)).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">{t("withoutAssigned")}</p>
                    <p className="text-2xl font-bold">{unassignedDisciples.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">{t("totalUsers")}</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder={t("searchDisciples")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Sección de no asignados */}
            {unassignedDisciples.length > 0 && (
                <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-4">
                    <h2 className="text-lg font-semibold text-yellow-900 mb-3">
                        {t("withoutAssigned")} ({unassignedDisciples.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {unassignedDisciples.map((disciple) => (
                            <DiscipleCard
                                key={disciple.id}
                                disciple={disciple}
                                isDragging={draggedDisciple?.id === disciple.id}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Lista de disciplicadores */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">{t("disciplersWithDisciples")}</h2>
                {disciplers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">{t("noDisciplersAvailable")}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {disciplers.map((discipler) => (
                            <DisciplerZone
                                key={discipler.id}
                                discipler={discipler}
                                disciples={disciplesMap.get(discipler.id) || []}
                                onDrop={handleDrop}
                                isDragOver={dragOverDiscipler === discipler.id}
                                onDragOver={(e) => handleDragOver(e, discipler.id)}
                                onDragLeave={handleDragLeave}
                                isExpanded={expandedDisciplers[discipler.id]}
                                onToggle={toggleDiscipler}
                                t={t}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, disciple: null, fromDiscipler: null, toDiscipler: null })}
                onConfirm={handleConfirmReassign}
                disciple={confirmModal.disciple}
                fromDiscipler={confirmModal.fromDiscipler}
                toDiscipler={confirmModal.toDiscipler}
                loading={saving}
                t={t}
            />
        </div>
    );
}