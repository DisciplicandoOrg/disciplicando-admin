"use client";

import { useState, useEffect, useMemo } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Users,
    User,
    Crown,
    GraduationCap,
    BookOpen,
    TreePine
} from 'lucide-react';
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function DiscipleshipTree() {
    const supabase = useMemo(() => createSupabaseBrowserClient(), []);
    const [users, setUsers] = useState([]);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(new Set());
    const [zoom, setZoom] = useState(100);

    // Cargar datos reales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Cargar usuarios
                const { data: usersData, error: usersError } = await supabase
                    .from('users')
                    .select('id, uuid, name, email, role, discipler_id')
                    .is('deleted_at', null)
                    .order('name');

                if (usersError) {
                    console.error('Error cargando usuarios:', usersError);
                    return;
                }

                // Cargar progreso de lecciones
                const { data: progressData, error: progressError } = await supabase
                    .from('lesson_progress')
                    .select('user_uuid, lesson_id, completed_at');

                if (progressError) {
                    console.warn('No se pudo cargar progreso:', progressError);
                }

                setUsers(usersData || []);
                setProgress(progressData || []);
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [supabase]);

    // Construir árbol de jerarquía
    const tree = useMemo(() => {
        const userMap = new Map(users.map(u => [u.uuid, u]));
        const childrenMap = new Map();

        // Inicializar mapa de hijos
        users.forEach(user => {
            childrenMap.set(user.uuid, []);
        });

        // Construir relaciones padre-hijo
        users.forEach(user => {
            if (user.discipler_id && childrenMap.has(user.discipler_id)) {
                childrenMap.get(user.discipler_id).push(user);
            }
        });

        // Encontrar raíces (discipuladores sin discipler_id o con discipler_id que no existe)
        const roots = users.filter(user =>
            user.role === 'discipulador' ||
            user.role === 'disciplicador' ||
            user.role === 'admin'
        ).filter(user =>
            !user.discipler_id || !userMap.has(user.discipler_id)
        );

        return { roots, childrenMap, userMap };
    }, [users]);

    // Calcular estadísticas de progreso
    const getProgressStats = (userUuid) => {
        const userProgress = progress.filter(p => p.user_uuid === userUuid);
        const completed = userProgress.filter(p => p.completed_at).length;
        const total = userProgress.length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    // Toggle expansión
    const toggleExpanded = (userUuid) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(userUuid)) {
            newExpanded.delete(userUuid);
        } else {
            newExpanded.add(userUuid);
        }
        setExpanded(newExpanded);
    };

    // Expandir/Colapsar todo
    const expandAll = () => {
        setExpanded(new Set(users.map(u => u.uuid)));
    };

    const collapseAll = () => {
        setExpanded(new Set());
    };

    // Componente para renderizar un nodo del árbol
    const TreeNode = ({ user, level = 0, childrenMap }) => {
        const children = childrenMap.get(user.uuid) || [];
        const isExpanded = expanded.has(user.uuid);
        const hasChildren = children.length > 0;
        const stats = getProgressStats(user.uuid);

        const getRoleIcon = (role) => {
            switch (role) {
                case 'admin': return <Crown className="w-4 h-4 text-red-500" />;
                case 'discipulador':
                case 'disciplicador':
                    return <GraduationCap className="w-4 h-4 text-blue-500" />;
                default: return <User className="w-4 h-4 text-green-500" />;
            }
        };

        const getRoleLabel = (role) => {
            switch (role) {
                case 'admin': return 'Admin';
                case 'discipulador':
                case 'disciplicador':
                    return 'Disciplicador';
                default: return 'Discípulo';
            }
        };

        const getProgressColor = (percentage) => {
            if (percentage >= 80) return 'bg-green-500';
            if (percentage >= 50) return 'bg-yellow-500';
            if (percentage >= 20) return 'bg-orange-500';
            return 'bg-red-500';
        };

        return (
            <div className="select-none">
                <div
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    style={{ marginLeft: `${level * 24}px` }}
                    onClick={() => hasChildren && toggleExpanded(user.uuid)}
                >
                    {/* Icono de expansión */}
                    <div className="w-5 h-5 flex items-center justify-center">
                        {hasChildren ? (
                            isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            )
                        ) : (
                            <div className="w-4 h-4" />
                        )}
                    </div>

                    {/* Icono del rol */}
                    {getRoleIcon(user.role)}

                    {/* Información del usuario */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                                {user.name || 'Sin nombre'}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                {getRoleLabel(user.role)}
                            </span>
                            {hasChildren && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    {children.length} discípulo{children.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {user.email}
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    {stats.total > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <BookOpen className="w-3 h-3" />
                                <span>{stats.completed}/{stats.total}</span>
                            </div>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getProgressColor(stats.percentage)} transition-all duration-300`}
                                    style={{ width: `${stats.percentage}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-600 w-8">
                                {stats.percentage}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Hijos */}
                {hasChildren && isExpanded && (
                    <div className="ml-4 border-l border-gray-200">
                        {children
                            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                            .map(child => (
                                <TreeNode
                                    key={child.uuid}
                                    user={child}
                                    level={level + 1}
                                    childrenMap={childrenMap}
                                />
                            ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando árbol de discipulado...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <TreePine className="w-8 h-8 text-green-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Árbol de Discipulado</h1>
                        <p className="text-gray-600">Vista jerárquica con progreso de lecciones</p>
                    </div>
                </div>

                {/* Leyenda MOVIDA ARRIBA */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Leyenda de Progreso:</h3>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-2 bg-green-500 rounded"></div>
                            <span>80-100% Excelente</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-2 bg-yellow-500 rounded"></div>
                            <span>50-79% Bueno</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-2 bg-orange-500 rounded"></div>
                            <span>20-49% Regular</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-2 bg-red-500 rounded"></div>
                            <span>0-19% Necesita Atención</span>
                        </div>
                    </div>
                </div>

                {/* Controles */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                            Expandir Todo
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                        >
                            Colapsar Todo
                        </button>
                    </div>

                    {/* Control de zoom */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Zoom:</span>
                        <input
                            type="range"
                            min="50"
                            max="150"
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-20"
                        />
                        <span className="text-sm text-gray-600 w-10">{zoom}%</span>
                    </div>

                    {/* Estadísticas de roles */}
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4 text-red-500" />
                            <span>Admin</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span>Disciplicador</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-green-500" />
                            <span>Discípulo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Árbol con contenedor que se ajusta al zoom */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div
                    className="p-4 overflow-auto"
                    style={{
                        maxHeight: '70vh',
                        minHeight: '400px'
                    }}
                >
                    <div
                        style={{
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top left',
                            width: `${100 * (100 / zoom)}%` // Ajusta el ancho para compensar el scale
                        }}
                    >
                        {tree.roots.length > 0 ? (
                            <div className="space-y-2">
                                {tree.roots
                                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                                    .map(root => (
                                        <TreeNode
                                            key={root.uuid}
                                            user={root}
                                            level={0}
                                            childrenMap={tree.childrenMap}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <TreePine className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No se encontraron discipuladores</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}