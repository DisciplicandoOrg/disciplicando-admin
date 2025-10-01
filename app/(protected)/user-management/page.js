"use client"

import { useLang } from "@/app/i18n";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

import React, { useState, useEffect, useMemo } from "react";
import {
    UserPlus, Users, Award, CheckCircle, AlertCircle,
    ChevronRight, Save, Search, Filter, Mail, Phone,
    Shield, BookOpen, Star, Clock, Calendar,
    ChevronDown, X, Check, Edit, Trash2, Eye,
    Upload, Download, RefreshCw
} from "lucide-react";


// Componentes UI básicos
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
        {children}
    </div>
);

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors";
    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3"
    };
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "hover:bg-gray-100"
    };
    return (
        <button
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Input = ({ className = "", ...props }) => (
    <input
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
    />
);

const Select = ({ className = "", children, ...props }) => (
    <select
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
    >
        {children}
    </select>
);

const Textarea = ({ className = "", ...props }) => (
    <textarea
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
    />
);

const Badge = ({ children, variant = "default" }) => {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        success: "bg-green-100 text-green-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700"
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl"
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                <div className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full`}>
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState("add");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showValidateModal, setShowValidateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { t } = useLang();

    const supabase = useMemo(() => getSupabaseBrowserClient(), []);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Form states
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "discipulo",
        gender: "",
        discipler_id: "",
        validated_lessons: [],
        notes: ""
    });

    const [validation, setValidation] = useState({
        user_id: "",
        series_completed: [],
        blocks_completed: [],
        lessons_completed: [],
        certification_level: "none",
        notes: ""
    });

    // Datos de ejemplo (en producción vendrían de Supabase)
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [disciplers, setDisciplers] = useState([]);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Agregar estos estados al inicio con los demás useState:
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importData, setImportData] = useState([]);
    const [importPreview, setImportPreview] = useState([]);
    const [importErrors, setImportErrors] = useState([]);
    const [importing, setImporting] = useState(false);

    const [showEditProgressModal, setShowEditProgressModal] = useState(false);
    const [editingProgress, setEditingProgress] = useState(null);


    // Cargar disciplicadores reales de la base de datos
    // Cargar series de la base de datos
    useEffect(() => {
        const fetchDisciplers = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, uid, uuid, name, username') // ← Traer AMBOS
                    .in('role', ['discipulador', 'admin'])
                    .is('deleted_at', null)
                    .order('name', { ascending: true });

                if (error) {
                    console.error('Error cargando disciplicadores:', error);
                    return;
                }

                console.log('✅ Disciplicadores cargados:', data);
                setDisciplers(data || []);
            } catch (err) {
                console.error('Error general cargando disciplicadores:', err);
            }
        };

        fetchDisciplers();
    }, [supabase]);

    // Cargar todos los usuarios de la base de datos
    useEffect(() => {

        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select(`
                    id,
                    uuid,
                    name,
                    username,
                    email,
                    phone,
                    role,
                    approved,
                    created_at,
                    discipler_id,
                    current_lesson,
                    current_series
                `)
                    .is('deleted_at', null)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error cargando usuarios:', error);
                    return;
                }

                console.log('Usuarios cargados:', data);

                // Procesar los datos para agregar información del disciplicador
                const processedUsers = data?.map(user => {
                    // Buscar el disciplicador por uuid
                    const discipler = data.find(d => d.uuid === user.discipler_id);

                    return {
                        ...user,
                        discipler: discipler?.name || null,
                        validated: user.approved || false,
                        joined_date: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : null
                    };
                }) || [];

                setUsers(processedUsers);

            } catch (err) {
                console.error('Error general cargando usuarios:', err);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();

    }, [supabase]);


    // Cargar series de la base de datos
    // Cargar series de la base de datos
    // Cargar series de la base de datos
    useEffect(() => {
        const fetchSeries = async () => {
            setLoadingSeries(true);
            try {
                const { data, error } = await supabase
                    .from('series')
                    .select(`
                    id,
                    nombre,
                    orden,
                    bloques (
                        id,
                        lecciones (id)
                    )
                `)
                    .eq('is_active', true)
                    .order('orden', { ascending: true });

                if (error) {
                    console.error('❌ Error cargando series:', error);
                    console.error('❌ Mensaje:', error.message);
                    console.error('❌ Código:', error.code);
                    return;
                }

                // Procesar para contar bloques y lecciones
                const processedSeries = data?.map(s => ({
                    id: s.id,              // UUID (para user_series_progress)
                    name: s.nombre,        // Nombre de la serie
                    orden: s.orden,        // INTEGER (para users.current_series)
                    blocks: s.bloques?.length || 0,
                    lessons: s.bloques?.reduce((total, b) =>
                        total + (b.lecciones?.length || 0), 0
                    ) || 0
                })) || [];

                console.log('✅ Series cargadas correctamente:', processedSeries);
                setSeries(processedSeries);
            } catch (err) {
                console.error('❌ Error general cargando series:', err);
            } finally {
                setLoadingSeries(false);
            }
        };

        fetchSeries();
    }, [supabase]);

    const [series, setSeries] = useState([]);
    const [loadingSeries, setLoadingSeries] = useState(false);

    // Filtrar usuarios según búsqueda y filtros
    const filteredUsers = useMemo(() => {
        let filtered = users;

        // Filtro por búsqueda
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                (u.name?.toLowerCase().includes(query)) ||
                (u.username?.toLowerCase().includes(query)) ||
                (u.email?.toLowerCase().includes(query)) ||
                (u.phone?.includes(query))
            );
        }

        // Filtro por rol
        if (roleFilter !== "all") {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        // Filtro por estado
        if (statusFilter !== "all") {
            if (statusFilter === "validated") {
                filtered = filtered.filter(u => u.validated === true);
            } else if (statusFilter === "pending") {
                filtered = filtered.filter(u => u.validated === false);
            }
        }

        return filtered;
    }, [users, searchQuery, roleFilter, statusFilter]);

    const handleAddUser = async () => {
        try {
            // Validar campos requeridos
            if (!newUser.name || !newUser.email) {
                alert(t("requiredFieldsMissing") || "Por favor completa todos los campos requeridos");
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUser.email)) {
                alert(t("invalidEmail") || "Por favor ingresa un email válido");
                return;
            }

            // Verificar si el email ya existe
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id')
                .eq('email', newUser.email)
                .maybeSingle();

            if (existingUser) {
                alert(t("emailAlreadyExists") || "Este email ya está registrado");
                return;
            }

            // Función mejorada para generar username
            const generateUniqueUsername = async (fullName) => {
                // Normalizar y limpiar el nombre
                const normalized = fullName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                    .replace(/[^a-z0-9\s]/g, ""); // Solo letras, números y espacios

                const parts = normalized.trim().split(/\s+/).filter(p => p.length > 0);

                let baseUsername;

                if (parts.length === 1) {
                    // Solo un nombre: "juan"
                    baseUsername = parts[0];
                } else if (parts.length === 2) {
                    // Dos partes: "juan.perez"
                    baseUsername = `${parts[0]}.${parts[1]}`;
                } else if (parts.length === 3) {
                    // Tres partes (nombre nombre apellido): "juan.carlos.perez"
                    baseUsername = `${parts[0]}.${parts[parts.length - 1]}`;
                } else {
                    // Cuatro o más partes (nombre nombre apellido apellido): "juan.perez.lopez"
                    baseUsername = `${parts[0]}.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
                }

                // Verificar si el username ya existe
                let finalUsername = baseUsername;
                let counter = 1;

                while (true) {
                    const { data: existing } = await supabase
                        .from('users')
                        .select('id')
                        .eq('username', finalUsername)
                        .maybeSingle();

                    if (!existing) {
                        break; // Username disponible
                    }

                    // Si existe, agregar número
                    finalUsername = `${baseUsername}${counter}`;
                    counter++;

                    // Límite de seguridad
                    if (counter > 100) {
                        throw new Error("No se pudo generar un username único");
                    }
                }

                return finalUsername;
            };

            console.log('Generando username...');
            const username = await generateUniqueUsername(newUser.name);
            console.log('Username generado:', username);

            // Normalizar el rol a los 3 valores permitidos
            const normalizeRole = (role) => {
                const roleLower = (role || '').toLowerCase();
                if (roleLower === 'admin') return 'admin';
                if (roleLower.includes('discipl')) {
                    // Si contiene 'discipl' puede ser: discipler, disciplicador, disciplicadora, etc.
                    return 'discipulador';
                }
                // Por defecto es discípulo
                return 'discipulo';
            };

            // Normalizar el género a M o F
            const normalizeGender = (gender) => {
                if (!gender) return null;
                const genderLower = gender.toLowerCase();
                if (genderLower === 'male' || genderLower === 'masculino') return 'M';
                if (genderLower === 'female' || genderLower === 'femenino') return 'F';
                return null; // Para "other" o "prefer_not_say"
            };

            // Preparar datos del usuario
            // Buscar el uuid del disciplicador seleccionado
            let disciplerUuid = null;
            if (newUser.role === 'discipulo' && newUser.discipler_id) {
                const selectedDiscipler = disciplers.find(d => d.id === parseInt(newUser.discipler_id));
                disciplerUuid = selectedDiscipler?.uuid || null;
            }

            const userData = {
                name: newUser.name.trim(),
                username: username,
                email: newUser.email.trim().toLowerCase(),
                phone: newUser.phone?.trim() || null,
                role: normalizeRole(newUser.role),
                gender: normalizeGender(newUser.gender),
                approved: true,
                approved_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                discipler_id: disciplerUuid,
                current_series: 1,
                current_lesson: 1
            };

            console.log('Intentando insertar usuario:', userData);

            // Insertar usuario en la base de datos
            const { data: insertedUser, error: insertError } = await supabase
                .from('users')
                .insert([userData])
                .select()
                .single();

            if (insertError) {
                console.error('Error insertando usuario:', insertError);
                alert(t("errorAddingUser") || "Error al agregar usuario: " + insertError.message);
                return;
            }

            console.log('Usuario agregado exitosamente:', insertedUser);

            // Generar token de invitación único
            const invitationToken = btoa(`${insertedUser.id}-${Date.now()}`);
            const invitationLink = `${window.location.origin}/register?token=${invitationToken}`;

            // Guardar el token en la tabla de invitaciones (si existe)
            // Por ahora solo lo mostramos

            // Mostrar mensaje de éxito con el link
            const invitationMethod = document.querySelector('input[name="invite"]:checked')?.value || 'email';

            alert(
                `Usuario agregado exitosamente!\n\n` +
                `Nombre: ${insertedUser.name}\n` +
                `Username: ${insertedUser.username}\n` +
                `Email: ${insertedUser.email}\n\n` +
                `LINK DE INVITACIÓN:\n` +
                `${invitationLink}\n\n` +
                `Método seleccionado: ${invitationMethod}\n\n` +
                `Copia este link y envíalo manualmente para probar.`
            );

            // También lo mostramos en consola para copiar fácilmente
            console.log('Link de invitación:', invitationLink);
            console.log('Token:', invitationToken);


            // Mostrar mensaje de éxito con el username generado
            alert(
                `Usuario agregado exitosamente!\n\n` +
                `Nombre: ${insertedUser.name}\n` +
                `Username: ${insertedUser.username}\n` +
                `Email: ${insertedUser.email}\n\n` +
                `El usuario recibirá una invitación para crear su contraseña.`
            );

            // Cerrar modal
            setShowAddModal(false);

            // Resetear formulario
            setNewUser({
                name: "",
                email: "",
                phone: "",
                role: "discipulo",
                gender: "",
                discipler_id: "",
                validated_lessons: [],
                notes: ""
            });

            // Recargar la lista de usuarios sin refrescar la página
            const { data: updatedUsers } = await supabase
                .from('users')
                .select('*')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (updatedUsers) {
                const processed = updatedUsers.map(u => ({
                    ...u,
                    validated: u.approved || false,
                    joined_date: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : null
                }));
                setUsers(processed);
            }

        } catch (error) {
            console.error('Error general:', error);
            alert(t("unexpectedError") || "Ocurrió un error inesperado: " + error.message);
        }
    };



    const handleValidateUser = async () => {
        if (!validation.user_id) {
            alert("Por favor selecciona un usuario");
            return;
        }

        try {
            console.log('Validando competencias para usuario:', validation.user_id);
            console.log('Series a marcar como completadas:', validation.series_completed);

            // 1. Marcar series como completadas
            for (const serieId of validation.series_completed) {
                const serie = series.find(s => s.id === serieId);
                if (!serie) continue;

                console.log(`Procesando serie: ${serie.name}`);

                // Marcar serie completa
                const { error: seriesProgressError } = await supabase
                    .from('user_series_progress')
                    .upsert({
                        user_id: selectedUser.id,
                        serie_id: serieId,
                        progress_percentage: 100,
                        is_completed: true,
                        completed_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'user_id,serie_id'
                    });

                if (seriesProgressError) {
                    console.error('Error actualizando series_progress:', seriesProgressError);
                    continue;
                }

                // 2. Obtener lecciones de esta serie CON bloque_id
                const { data: seriesData, error: seriesError } = await supabase
                    .from('series')
                    .select(`
                    bloques (
                        id,
                        lecciones (
                            id,
                            numero
                        )
                    )
                `)
                    .eq('id', serieId)
                    .single();

                if (seriesError) {
                    console.error('Error obteniendo lecciones:', seriesError);
                    continue;
                }

                // 3. Aplanar lecciones MANTENIENDO el bloque_id
                const allLessons = seriesData?.bloques?.flatMap(bloque =>
                    (bloque.lecciones || []).map(leccion => ({
                        ...leccion,
                        bloque_id: bloque.id  // ← MANTENER referencia al bloque
                    }))
                ) || [];

                console.log(`Marcando ${allLessons.length} lecciones como completadas`);

                // 4. Marcar cada lección como completada
                for (const leccion of allLessons) {
                    const { error: lessonProgressError } = await supabase
                        .from('user_lesson_progress')
                        .upsert({
                            user_id: selectedUser.id,
                            leccion_id: leccion.id,
                            serie_id: serieId,
                            bloque_id: leccion.bloque_id,  // ← INCLUIR bloque_id
                            is_completed: true,
                            completed_at: new Date().toISOString(),
                            video_completed: true,
                            video_completed_at: new Date().toISOString(),
                            estudio_completed: true,
                            estudio_completed_at: new Date().toISOString(),
                            quiz_completed: true,
                            quiz_completed_at: new Date().toISOString(),
                            quiz_passed: true,
                            quiz_score: 100,
                            updated_at: new Date().toISOString()
                        }, {
                            onConflict: 'user_id,leccion_id'
                        });

                    if (lessonProgressError) {
                        console.error(`Error en lección ${leccion.id}:`, lessonProgressError);
                    }
                }
            }


            // 5. NUEVA LÓGICA: Calcular siguiente serie y lección correctamente
            // 5. LÓGICA CORREGIDA: Usar IDs numéricos en lugar de UUIDs
            // 5. LÓGICA CORREGIDA: Usar orden en lugar de id
            if (validation.series_completed.length > 0) {
                const completedSeriesOrdered = series
                    .filter(s => validation.series_completed.includes(s.id))
                    .sort((a, b) => a.orden - b.orden);

                const lastCompletedSerie = completedSeriesOrdered[completedSeriesOrdered.length - 1];
                const nextSerie = series.find(s => s.orden === lastCompletedSerie.orden + 1);

                let nextLesson = 1;
                let nextSeriesOrden = null;  // ← Cambiar a orden

                if (nextSerie) {
                    console.log(`Siguiente serie encontrada: ${nextSerie.name}`);

                    const { data: nextSerieData } = await supabase
                        .from('series')
                        .select(`
                bloques (
                    orden,
                    lecciones (numero)
                )
            `)
                        .eq('id', nextSerie.id)
                        .single();

                    const firstBlock = nextSerieData?.bloques?.sort((a, b) => a.orden - b.orden)[0];
                    const firstLesson = firstBlock?.lecciones?.sort((a, b) => a.numero - b.numero)[0];

                    nextLesson = firstLesson?.numero || 1;
                    nextSeriesOrden = nextSerie.orden;  // ← Usar orden (integer)

                } else {
                    console.log('Completó todas las series disponibles');
                    nextLesson = null;
                    nextSeriesOrden = lastCompletedSerie.orden;  // ← Usar orden
                }

                const updateData = {
                    current_lesson: nextLesson,
                    current_series: nextSeriesOrden  // ← Ahora es integer
                };

                console.log('Actualizando usuario con:', updateData);

                const { error: updateUserError } = await supabase
                    .from('users')
                    .update(updateData)
                    .eq('id', selectedUser.id);

                if (updateUserError) {
                    console.error('Error actualizando usuario:', updateUserError);
                } else {
                    console.log('Usuario actualizado exitosamente');
                }
            }


            alert('Competencias validadas exitosamente');
            setShowValidateModal(false);

            // Reset
            setValidation({
                user_id: "",
                series_completed: [],
                blocks_completed: [],
                lessons_completed: [],
                certification_level: "none",
                notes: ""
            });
            setSelectedUser(null);

            // Recargar usuarios
            const { data: updatedUsers } = await supabase
                .from('users')
                .select('*')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (updatedUsers) {
                const processed = updatedUsers.map(u => ({
                    ...u,
                    validated: u.approved || false,
                    joined_date: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : null
                }));
                setUsers(processed);
            }

        } catch (error) {
            console.error('Error general validando competencias:', error);
            alert('Error al validar competencias: ' + error.message);
        }
    };



    const renderAddUserModal = () => (
        <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title={t("addNewUser")}
            size="lg"
        >
            <div className="space-y-6">
                {/* Información Básica */}
                <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {t("basicInfo")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("fullName")} *
                            </label>
                            <Input
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                placeholder="Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email *
                            </label>
                            <Input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="juan@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("phone")} *
                            </label>
                            <Input
                                value={newUser.phone}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                placeholder="+1 (901) 555-0123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Rol *
                            </label>

                            <Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="discipulo">{t("disciple")}</option>
                                <option value="discipulador">{t("discipler")}</option>
                                <option value="admin">{t("admin")}</option>
                            </Select>

                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Género
                            </label>

                            <Select
                                value={newUser.gender || ""}
                                onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                            </Select>

                        </div>


                    </div>
                </div>

                {/* Asignación */}
                {newUser.role === 'discipulo' && (
                    <div>
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t("assignment") || "Asignación"}
                        </h4>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("discipler") || "Disciplicador"}
                            </label>

                            <Select
                                value={newUser.discipler_id}
                                onChange={(e) => setNewUser({ ...newUser, discipler_id: e.target.value })}
                            >
                                <option value="">{t("selectDiscipler") || "Seleccionar disciplicador"}...</option>
                                {disciplers.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.name} ({d.username})
                                    </option>
                                ))}
                            </Select>

                            <p className="text-xs text-gray-500 mt-1">
                                {t("canAssignLater") || "Puedes asignarlo después si no estás seguro"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Validación Rápida para Disciplicadores Probados */}
                {(newUser.role === "discipler" || newUser.role === "admin") && (
                    <Card className="p-4 bg-amber-50 border-amber-200">
                        <h4 className="font-medium mb-3 flex items-center gap-2 text-amber-900">
                            <Award className="w-4 h-4" />
                            {t("validationForProven")}
                        </h4>
                        <p className="text-sm text-amber-700 mb-3">
                            {t("provenDisciplerText")}
                        </p>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="rounded"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setNewUser({
                                            ...newUser,
                                            validated_lessons: ["serie1_complete"]
                                        });
                                    } else {
                                        setNewUser({ ...newUser, validated_lessons: [] });
                                    }
                                }}
                            />
                            <span className="text-sm">
                                {t("validateSeries1")}
                            </span>
                        </label>
                    </Card>
                )}

                {/* Notas */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t("notesOptional")}
                    </label>
                    <Textarea
                        value={newUser.notes}
                        onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                        placeholder={t("notesPlaceholder")}
                        rows={3}
                    />
                </div>

                {/* Método de Invitación */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-medium mb-3 text-blue-900">
                        {t("invitationMethod")}
                    </h4>
                    <div className="space-y-2">

                        <label className="flex items-center gap-3">
                            <input type="radio" name="invite" defaultChecked value="email" />
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{t("sendEmailInvite") || "Enviar invitación por email"}</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="radio" name="invite" value="whatsapp" />
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{t("sendWhatsAppInvite") || "Enviar invitación por WhatsApp"}</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="radio" name="invite" value="direct" />
                            <UserPlus className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{t("createDirectly") || "Crear cuenta directamente (sin invitación)"}</span>
                        </label>

                    </div>
                </Card>

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="secondary"
                        onClick={() => setShowAddModal(false)}
                    >
                        {t("cancel")}
                    </Button>
                    <Button onClick={handleAddUser}>
                        <UserPlus className="w-4 h-4" />
                        {t("addUser")}
                    </Button>
                </div>
            </div>
        </Modal>
    );


    const renderValidateModal = () => (
        <Modal
            isOpen={showValidateModal}
            onClose={() => setShowValidateModal(false)}
            title={t("validateCompetencies") || "Validar Competencias"}
            size="lg"
        >
            <div className="space-y-6">
                {/* Selección de Usuario */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t("selectUser") || "Seleccionar Usuario"}
                    </label>
                    <Select
                        value={validation.user_id}
                        onChange={(e) => {
                            setValidation({ ...validation, user_id: e.target.value });
                            const user = users.find(u => u.id === parseInt(e.target.value));
                            setSelectedUser(user);
                        }}
                    >
                        <option value="">{t("selectUserPlaceholder") || "Seleccionar..."}...</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>
                                {u.name} - {u.email}
                            </option>
                        ))}
                    </Select>
                </div>

                {selectedUser && (
                    <>
                        {/* Info del Usuario */}
                        <Card className="p-4 bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-medium">{selectedUser.name}</h4>
                                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Badge variant={selectedUser.role === 'discipulador' ? 'success' : 'info'}>
                                            {selectedUser.role === 'discipulador' ? 'Disciplicador' : 'Discípulo'}
                                        </Badge>
                                        {selectedUser.current_lesson && (
                                            <span className="text-sm text-gray-500">
                                                {t("currentLesson") || "Lección actual"}: {selectedUser.current_lesson}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Calendar className="w-5 h-5 text-gray-400" />
                            </div>
                        </Card>

                        {/* Validación por Series */}
                        <div>
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Validar Series Completas
                            </h4>

                            {loadingSeries ? (
                                <p className="text-gray-500">Cargando series...</p>
                            ) : series.length === 0 ? (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800">No hay series disponibles</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {series.map(s => (
                                        <label
                                            key={s.id}
                                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mt-1 rounded"
                                                checked={validation.series_completed.includes(s.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setValidation({
                                                            ...validation,
                                                            series_completed: [...validation.series_completed, s.id]
                                                        });
                                                    } else {
                                                        setValidation({
                                                            ...validation,
                                                            series_completed: validation.series_completed.filter(id => id !== s.id)
                                                        });
                                                    }
                                                }}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{s.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {s.blocks} bloques • {s.lessons} lecciones
                                                </div>
                                            </div>
                                            {validation.series_completed.includes(s.id) && (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notas de Validación */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Notas de Validación
                            </label>
                            <Textarea
                                value={validation.notes}
                                onChange={(e) => setValidation({ ...validation, notes: e.target.value })}
                                placeholder="Ej: Pastor con 15 años de experiencia, ya ha discipulado a 20+ personas..."
                                rows={3}
                            />
                        </div>
                    </>
                )}

                {/* Botones */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="secondary"
                        onClick={() => setShowValidateModal(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleValidateUser}
                        disabled={!validation.user_id || validation.series_completed.length === 0}
                        variant="success"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Validar Competencias
                    </Button>
                </div>
            </div>
        </Modal>
    );



    const renderUsersList = () => (
        <div className="space-y-4">

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder={t("searchPlaceholder") || "Buscar por nombre, email, teléfono..."}
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Select
                    className="md:w-48"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">{t("allUsers") || "Todos los roles"}</option>
                    <option value="admin">{t("admins") || "Administradores"}</option>
                    <option value="discipulador">{t("disciplers") || "Disciplicadores"}</option>
                    <option value="discipulo">{t("disciples") || "Discípulos"}</option>
                </Select>
                <Select
                    className="md:w-48"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t("allStates") || "Todos los estados"}</option>
                    <option value="validated">{t("validated") || "Validados"}</option>
                    <option value="pending">{t("pending") || "Pendientes"}</option>
                </Select>
            </div>


            {/* Users Table */}

            {loadingUsers ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando usuarios...</p>
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("user")}
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("rol")}
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("status")}
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("progress")}
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("dateAdded")}
                                    </th>
                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t("actions")}
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.name || 'Sin nombre'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email || 'Sin email'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <Badge variant={
                                                user.role === 'admin' ? 'danger' :
                                                    user.role === 'discipulador' ? 'success' : 'info'
                                            }>
                                                {user.role === 'admin' ? t("admin") :
                                                    user.role === 'discipulador' ? t("discipler") :
                                                        t("disciple")}
                                            </Badge>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {user.validated ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span className="text-sm text-green-700">{t("validated")}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-500">{t("pending")}</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {user.role === 'discipulador' ? (
                                                <div className="text-sm">
                                                    <div className="font-medium">{user.current_series || 0} series</div>
                                                    <div className="text-gray-500 text-xs">
                                                        Mentor: {user.discipler || 'Sin asignar'}
                                                    </div>
                                                </div>
                                            ) : user.role === 'discipulo' ? (
                                                <div className="text-sm">
                                                    <div className="font-medium">Lección {user.current_lesson || 0}</div>
                                                    <div className="text-gray-500 text-xs">
                                                        {user.discipler || 'Sin asignar'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">—</span>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {user.joined_date || 'N/A'}
                                        </td>


                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Ver detalles */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Editar */}
                                                <button
                                                    onClick={async () => {
                                                        // Cargar datos frescos del usuario desde la DB
                                                        const { data: freshUser, error } = await supabase
                                                            .from('users')
                                                            .select('*')
                                                            .eq('id', user.id)
                                                            .single();

                                                        if (error) {
                                                            console.error('Error cargando usuario:', error);
                                                            alert('Error al cargar datos del usuario');
                                                            return;
                                                        }

                                                        setEditingUser(freshUser);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                    title="Editar usuario"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                {/* Validar competencias (solo si NO está validado) */}
                                                {!user.validated && (
                                                    <button
                                                        onClick={() => {
                                                            setValidation({ ...validation, user_id: user.id });
                                                            setSelectedUser(user);
                                                            setShowValidateModal(true);
                                                        }}
                                                        className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                                        title="Validar competencias"
                                                    >
                                                        <Award className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {/* Enviar email */}
                                                <button
                                                    onClick={() => {
                                                        window.location.href = `mailto:${user.email}?subject=Mensaje desde Disciplicando`;
                                                    }}
                                                    className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Enviar email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </button>

                                                {/* Eliminar (solo admins, no el usuario actual) */}
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Eliminar usuario"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        {filteredUsers.length === 0 && !loadingUsers && (
                            <div className="text-center py-8 text-gray-500">
                                <p>{t("no_results") || "No se encontraron resultados"}</p>
                                {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setRoleFilter("all");
                                            setStatusFilter("all");
                                        }}
                                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        )}

                    </div>
                </Card>
            )}
        </div>
    );

    const handleDeleteUser = async (user) => {
        if (!confirm(`¿Estás seguro de eliminar a ${user.name}?\n\nEsta acción NO se puede deshacer.`)) {
            return;
        }

        try {
            // Soft delete - marcar como eliminado
            const { error } = await supabase
                .from('users')
                .update({
                    deleted_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            alert('Usuario eliminado exitosamente');

            // Recargar usuarios
            const { data: updatedUsers } = await supabase
                .from('users')
                .select('*')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (updatedUsers) {
                const processed = updatedUsers.map(u => ({
                    ...u,
                    validated: u.approved || false,
                    joined_date: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : null
                }));
                setUsers(processed);
            }
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            alert('Error al eliminar usuario: ' + error.message);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;

        // Validar campos requeridos
        if (!editingUser.name || !editingUser.email || !editingUser.username) {
            alert('Por favor completa todos los campos requeridos (nombre, email, username)');
            return;
        }

        try {
            // Preparar datos para actualizar
            const updateData = {
                name: editingUser.name.trim(),
                username: editingUser.username.trim(),
                email: editingUser.email.trim().toLowerCase(),
                phone: editingUser.phone?.trim() || null,
                role: editingUser.role,
                gender: editingUser.gender || null,
                approved: editingUser.approved || false,
                // discipler_id para TODOS los roles (discípulo Y disciplicador)
                discipler_id: editingUser.role !== 'admin' ? (editingUser.discipler_id || null) : null
            };

            // Si cambió a aprobado y no tenía fecha, agregar fecha de aprobación
            if (editingUser.approved && !editingUser.approved_at) {
                updateData.approved_at = new Date().toISOString();
            }

            // Actualizar en Supabase
            const { error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', editingUser.id);

            if (error) throw error;

            alert('Usuario actualizado exitosamente');
            setShowEditModal(false);
            setEditingUser(null);

            // Recargar usuarios
            const { data: updatedUsers } = await supabase
                .from('users')
                .select('*')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (updatedUsers) {
                const processed = updatedUsers.map(u => ({
                    ...u,
                    validated: u.approved || false,
                    joined_date: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : null
                }));
                setUsers(processed);
            }
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            alert('Error al actualizar usuario: ' + error.message);
        }
    };

    const fixEncoding = (text) => {
        if (!text) return text;

        // Mapa de caracteres mal codificados a correctos
        const replacements = {
            'Ã©': 'é',
            'Ã¡': 'á',
            'Ã­': 'í',
            'Ã³': 'ó',
            'Ãº': 'ú',
            'Ã±': 'ñ',
            'Ã‰': 'É',
            'Ã': 'Á',
            'Ã': 'Í',
            'Ã"': 'Ó',
            'Ãš': 'Ú',
            'Ã': 'Ñ'
        };

        let fixed = text;
        for (const [wrong, correct] of Object.entries(replacements)) {
            fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
        }

        return fixed;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImportFile(file);
        setImportErrors([]);

        try {
            // Importar la librería
            const XLSX = await import('xlsx');

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = event.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                    console.log('Datos leídos del archivo:', jsonData);

                    // Validar y procesar datos
                    const processed = jsonData.map((row, index) => {
                        const errors = [];

                        // Validar campos requeridos
                        if (!row.nombre && !row.name) errors.push('Falta nombre');
                        if (!row.email) errors.push('Falta email');

                        // Validar formato de email
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (row.email && !emailRegex.test(row.email)) {
                            errors.push('Email inválido');
                        }

                        return {
                            rowNumber: index + 2, // +2 porque row 1 es header
                            nombre: row.nombre || row.name || '',
                            email: row.email?.toLowerCase() || '',
                            telefono: row.telefono || row.phone || row.teléfono ?
                                String(row.telefono || row.phone || row.teléfono) : '',
                            rol: row.rol || row.role || 'discipulo',
                            genero: row.genero || row.gender || row.género || '',
                            disciplicador: row.disciplicador || row.discipler || row.mentor || '',
                            errors: errors,
                            valid: errors.length === 0
                        };
                    });

                    setImportData(processed);
                    setImportPreview(processed.slice(0, 10)); // Mostrar primeros 10

                    const totalErrors = processed.filter(p => !p.valid).length;
                    if (totalErrors > 0) {
                        setImportErrors([`${totalErrors} filas tienen errores`]);
                    }
                } catch (err) {
                    console.error('Error procesando archivo:', err);
                    setImportErrors(['Error al procesar el archivo. Verifica el formato.']);
                }
            };

            reader.readAsBinaryString(file);
        } catch (error) {
            console.error('Error cargando archivo:', error);
            setImportErrors(['Error al cargar el archivo.']);
        }
    };


    const handleImportUsers = async () => {
        if (importData.length === 0) {
            alert('No hay datos para importar');
            return {
                rowNumber: index + 2,
                nombre: fixEncoding(row.nombre || row.name || ''),
                email: row.email?.toLowerCase() || '',
                telefono: row.telefono || row.phone || row.teléfono ?
                    String(row.telefono || row.phone || row.teléfono) : '',
                rol: row.rol || row.role || 'discipulo',
                genero: row.genero || row.gender || row.género || '',
                disciplicador: fixEncoding(row.disciplicador || row.discipler || row.mentor || ''),
                errors: errors,
                valid: errors.length === 0
            };
        }

        const validData = importData.filter(d => d.valid);
        if (validData.length === 0) {
            alert('No hay filas válidas para importar');
            return;
        }

        if (!confirm(`¿Importar ${validData.length} usuarios?\n\nEsto creará las cuentas inmediatamente.`)) {
            return;
        }

        setImporting(true);

        try {
            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (const userData of validData) {
                try {
                    // Generar username único
                    const generateUsername = async (name) => {
                        const normalized = name.toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-z0-9\s]/g, "");

                        const parts = normalized.trim().split(/\s+/).filter(p => p.length > 0);
                        let baseUsername;

                        if (parts.length === 1) baseUsername = parts[0];
                        else if (parts.length === 2) baseUsername = `${parts[0]}.${parts[1]}`;
                        else baseUsername = `${parts[0]}.${parts[parts.length - 1]}`;

                        let finalUsername = baseUsername;
                        let counter = 1;

                        while (counter < 100) {
                            const { data } = await supabase
                                .from('users')
                                .select('id')
                                .eq('username', finalUsername)
                                .maybeSingle();

                            if (!data) break;
                            finalUsername = `${baseUsername}${counter}`;
                            counter++;
                        }

                        return finalUsername;
                    };

                    const username = await generateUsername(userData.nombre);

                    // Buscar disciplicador por nombre si se especificó
                    let disciplerUuid = null;
                    if (userData.disciplicador) {
                        const { data: discipler } = await supabase
                            .from('users')
                            .select('uid, uuid')
                            .ilike('name', `%${userData.disciplicador}%`)
                            .in('role', ['discipulador', 'admin'])
                            .maybeSingle();

                        disciplerUuid = discipler?.uid || discipler?.uuid || null;
                    }

                    // Normalizar rol y género
                    const normalizeRole = (role) => {
                        const r = (role || '').toLowerCase();
                        if (r === 'admin') return 'admin';
                        if (r.includes('discipl')) return 'discipulador';
                        return 'discipulo';
                    };

                    const normalizeGender = (gender) => {
                        const g = (gender || '').toLowerCase();
                        if (g === 'masculino' || g === 'm' || g === 'male') return 'M';
                        if (g === 'femenino' || g === 'f' || g === 'female') return 'F';
                        return null;
                    };

                    // Insertar usuario
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert({
                            name: fixEncoding(userData.nombre.trim()),
                            username: username,
                            email: userData.email.trim(),
                            phone: userData.telefono ? String(userData.telefono).trim() : null,
                            role: normalizeRole(userData.rol),
                            gender: normalizeGender(userData.genero),
                            discipler_id: disciplerUuid,
                            approved: true,
                            approved_at: new Date().toISOString(),
                            created_at: new Date().toISOString(),
                            current_series: 1,
                            current_lesson: 1
                        });

                    if (insertError) throw insertError;
                    successCount++;

                } catch (err) {
                    console.error(`Error en fila ${userData.rowNumber}:`, err);
                    errors.push(`Fila ${userData.rowNumber}: ${err.message}`);
                    errorCount++;
                }
            }

            alert(
                `Importación completada:\n\n` +
                `✅ ${successCount} usuarios creados\n` +
                `❌ ${errorCount} errores\n\n` +
                (errors.length > 0 ? `Errores:\n${errors.slice(0, 5).join('\n')}` : '')
            );

            setShowImportModal(false);
            setImportFile(null);
            setImportData([]);
            setImportPreview([]);

            // Recargar usuarios
            const { data: updatedUsers } = await supabase
                .from('users')
                .select('*')
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (updatedUsers) {
                const processed = updatedUsers.map(u => ({
                    ...u,
                    validated: u.approved || false,
                    joined_date: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : null
                }));
                setUsers(processed);
            }

        } catch (error) {
            console.error('Error general en importación:', error);
            alert('Error durante la importación: ' + error.message);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t("userManagement")}
                    </h1>
                    <p className="text-gray-600">
                        {t("addNewUser")} y {t("validateCompetencies").toLowerCase()}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="p-4">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium">{t("addNewUser")}</div>
                                    <div className="text-sm text-gray-500">{t("disciples")} o {t("discipler").toLowerCase()}</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </button>
                    </Card>

                    <Card className="p-4">
                        <button
                            onClick={() => setShowValidateModal(true)}
                            className="w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-medium">{t("validateCompetencies")}</div>
                                    <div className="text-sm text-gray-500">{t("forProvenDisciplers")}</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </button>
                    </Card>

                    <Card className="p-4">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Importar Múltiples</div>
                                    <div className="text-sm text-gray-500">Desde CSV o Excel</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </button>
                    </Card>

                </div>

                {/* Main Content */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">{t("allUsers")}</h2>
                        {renderUsersList()}
                    </div>
                </Card>

                {/* Modals */}
                {renderAddUserModal()}
                {renderValidateModal()}

                {/* Modal de Detalles del Usuario */}
                {showDetailsModal && selectedUser && (
                    <Modal
                        isOpen={showDetailsModal}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedUser(null);
                        }}
                        title={`Detalles de ${selectedUser.name}`}
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre Completo
                                    </label>
                                    <p className="text-gray-900">{selectedUser.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <p className="text-gray-900">{selectedUser.username || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <p className="text-gray-900">{selectedUser.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol
                                    </label>
                                    <Badge variant={
                                        selectedUser.role === 'admin' ? 'danger' :
                                            selectedUser.role === 'discipulador' ? 'success' : 'info'
                                    }>
                                        {selectedUser.role === 'admin' ? 'Admin' :
                                            selectedUser.role === 'discipulador' ? 'Disciplicador' :
                                                'Discípulo'}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    {selectedUser.validated ? (
                                        <Badge variant="success">Validado</Badge>
                                    ) : (
                                        <Badge variant="warning">Pendiente</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Progreso Académico */}
                            {/* Progreso Académico */}
                            {(selectedUser.role === 'discipulo' || selectedUser.role === 'discipulador') && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Progreso Académico
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Serie Actual
                                            </label>
                                            <p className="text-gray-900">
                                                {selectedUser.current_series ? `Serie ${selectedUser.current_series}` : 'No iniciado'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Lección Actual
                                            </label>
                                            <p className="text-gray-900">
                                                {selectedUser.current_lesson ? `Lección ${selectedUser.current_lesson}` : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {selectedUser.role === 'discipulador' ? 'Mentor Asignado' : 'Disciplicador'}
                                            </label>
                                            <p className="text-gray-900">
                                                {selectedUser.discipler || 'Sin asignar'}
                                            </p>
                                            {selectedUser.role === 'discipulador' && selectedUser.discipler && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Quien lo mentorea a él/ella
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Editar Progreso Manualmente */}
                            {(selectedUser.role === 'discipulo' || selectedUser.role === 'discipulador') && (
                                <div className="border-t pt-4">
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            setShowEditProgressModal(true);
                                            setEditingProgress({
                                                user_id: selectedUser.id,
                                                user_name: selectedUser.name,
                                                current_series: selectedUser.current_series || 1,
                                                current_lesson: selectedUser.current_lesson || 1
                                            });
                                        }}
                                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar Progreso Manualmente
                                    </button>
                                </div>
                            )}

                            {/* Información de Sistema */}
                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Información del Sistema
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Registro
                                        </label>
                                        <p className="text-gray-900">{selectedUser.joined_date || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ID de Usuario
                                        </label>
                                        <p className="text-gray-900 font-mono text-xs">{selectedUser.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Rápidas */}
                            <div className="border-t pt-4">
                                <h4 className="font-medium mb-3">Acciones Rápidas</h4>
                                <div className="flex gap-2">

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={async () => {
                                            // Cargar datos frescos
                                            const { data: freshUser, error } = await supabase
                                                .from('users')
                                                .select('*')
                                                .eq('id', selectedUser.id)
                                                .single();

                                            if (error) {
                                                console.error('Error cargando usuario:', error);
                                                alert('Error al cargar datos del usuario');
                                                return;
                                            }

                                            setShowDetailsModal(false);
                                            setEditingUser(freshUser);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            window.location.href = `mailto:${selectedUser.email}`;
                                        }}
                                    >
                                        <Mail className="w-4 h-4" />
                                        Enviar Email
                                    </Button>
                                    {!selectedUser.validated && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                setValidation({ ...validation, user_id: selectedUser.id });
                                                setShowValidateModal(true);
                                            }}
                                        >
                                            <Award className="w-4 h-4" />
                                            Validar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Modal de Editar Usuario */}
                {showEditModal && editingUser && (
                    <Modal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditingUser(null);
                        }}
                        title={`Editar Usuario: ${editingUser.name}`}
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Información Básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Nombre Completo *
                                    </label>
                                    <Input
                                        value={editingUser.name || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Username *
                                    </label>
                                    <Input
                                        value={editingUser.username || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                        placeholder="juan.perez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email *
                                    </label>
                                    <Input
                                        type="email"
                                        value={editingUser.email || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        placeholder="juan@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Teléfono
                                    </label>
                                    <Input
                                        value={editingUser.phone || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                        placeholder="+1 (901) 555-0123"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Rol *
                                    </label>
                                    <Select
                                        value={editingUser.role || 'discipulo'}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    >
                                        <option value="discipulo">Discípulo</option>
                                        <option value="discipulador">Disciplicador</option>
                                        <option value="admin">Admin</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Género
                                    </label>
                                    <Select
                                        value={editingUser.gender || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, gender: e.target.value })}
                                    >
                                        <option value="">No especificado</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </Select>
                                    {editingUser.gender && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Actual: {editingUser.gender === 'M' ? 'Masculino' : editingUser.gender === 'F' ? 'Femenino' : 'No especificado'}
                                        </p>
                                    )}
                                </div>

                            </div>


                            {/* Asignación de Disciplicador - PARA TODOS menos admins */}
                            {editingUser.role !== 'admin' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Disciplicador Asignado
                                        {editingUser.role === 'discipulador' && (
                                            <span className="text-xs text-gray-500 ml-2">
                                                (Quien lo mentorea a él/ella)
                                            </span>
                                        )}
                                    </label>

                                    <Select
                                        value={editingUser.discipler_id || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, discipler_id: e.target.value })}
                                    >
                                        <option value="">Sin asignar</option>
                                        {disciplers.map(d => (
                                            <option key={d.id} value={d.uid || d.uuid}>
                                                {d.name} ({d.username})
                                            </option>
                                        ))}
                                    </Select>

                                    {editingUser.discipler_id && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Actual: {disciplers.find(d => (d.uid || d.uuid) === editingUser.discipler_id)?.name || 'Cargando...'}
                                        </p>
                                    )}

                                    {editingUser.role === 'discipulador' && (
                                        <p className="text-xs text-blue-600 mt-2">
                                            💡 Este disciplicador también tiene un mentor que lo guía
                                        </p>
                                    )}
                                </div>
                            )}



                            {/* Estado de Validación */}
                            <div className="border-t pt-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingUser.approved || false}
                                        onChange={(e) => setEditingUser({ ...editingUser, approved: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium">Usuario Aprobado/Validado</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-7">
                                    Los usuarios deben estar aprobados para acceder al sistema
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingUser(null);
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveEdit}>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}


                {/* Modal de Importar Múltiples Usuarios */}
                <Modal
                    isOpen={showImportModal}
                    onClose={() => {
                        setShowImportModal(false);
                        setImportFile(null);
                        setImportData([]);
                        setImportPreview([]);
                        setImportErrors([]);
                    }}
                    title="Importar Múltiples Usuarios"
                    size="xl"
                >
                    <div className="space-y-6">
                        {/* Instrucciones */}
                        <Card className="p-4 bg-blue-50 border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-2">
                                📋 Formato del Archivo
                            </h4>
                            <p className="text-sm text-blue-800 mb-3">
                                El archivo debe ser CSV o Excel (.xlsx) con las siguientes columnas:
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                                <div><strong>nombre</strong> o <strong>name</strong> * (requerido)</div>
                                <div><strong>email</strong> * (requerido)</div>
                                <div><strong>telefono</strong> o <strong>phone</strong> (opcional)</div>
                                <div><strong>rol</strong> o <strong>role</strong> (discipulo/discipulador/admin)</div>
                                <div><strong>genero</strong> o <strong>gender</strong> (M/F)</div>
                                <div><strong>disciplicador</strong> o <strong>mentor</strong> (nombre del mentor)</div>
                            </div>
                            <p className="text-xs text-blue-700 mt-3">
                                * Los campos marcados son obligatorios
                            </p>
                        </Card>

                        {/* Descargar Plantilla */}
                        <div className="flex gap-3">

                            <Button
                                variant="secondary"
                                onClick={() => {
                                    const csvContent = '\uFEFF' + `nombre,email,telefono,rol,genero,disciplicador
Juan Pérez,juan.perez@example.com,+1234567890,discipulo,M,Mario Maldonado
María García,maria.garcia@example.com,+1234567891,discipulo,F,Mario Maldonado
Carlos López,carlos.lopez@example.com,+1234567892,discipulador,M,Mario Maldonado`;

                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'plantilla_usuarios.csv';
                                    a.click();
                                }}
                            >
                                <Download className="w-4 h-4" />
                                Descargar Plantilla CSV
                            </Button>

                        </div>

                        {/* Subir Archivo */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Seleccionar Archivo
                            </label>
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {importFile && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Archivo: {importFile.name} ({importData.length} filas)
                                </p>
                            )}
                        </div>

                        {/* Errores */}
                        {importErrors.length > 0 && (
                            <Card className="p-4 bg-red-50 border-red-200">
                                <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Errores Encontrados
                                </h4>
                                <ul className="text-sm text-red-800 space-y-1">
                                    {importErrors.map((error, i) => (
                                        <li key={i}>• {error}</li>
                                    ))}
                                </ul>
                            </Card>
                        )}

                        {/* Preview */}
                        {importPreview.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-3">
                                    Vista Previa (primeros 10 registros)
                                </h4>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left">#</th>
                                                <th className="px-3 py-2 text-left">Nombre</th>
                                                <th className="px-3 py-2 text-left">Email</th>
                                                <th className="px-3 py-2 text-left">Rol</th>
                                                <th className="px-3 py-2 text-left">Disciplicador</th>
                                                <th className="px-3 py-2 text-left">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {importPreview.map((row) => (
                                                <tr key={row.rowNumber} className={!row.valid ? 'bg-red-50' : ''}>
                                                    <td className="px-3 py-2">{row.rowNumber}</td>
                                                    <td className="px-3 py-2">{row.nombre}</td>
                                                    <td className="px-3 py-2">{row.email}</td>
                                                    <td className="px-3 py-2">{row.rol}</td>
                                                    <td className="px-3 py-2">{row.disciplicador || '-'}</td>
                                                    <td className="px-3 py-2">
                                                        {row.valid ? (
                                                            <Badge variant="success">Válido</Badge>
                                                        ) : (
                                                            <div>
                                                                <Badge variant="danger">Error</Badge>
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    {row.errors.join(', ')}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {importData.length > 10 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        ... y {importData.length - 10} registros más
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Resumen */}
                        {importData.length > 0 && (
                            <Card className="p-4 bg-gray-50">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {importData.length}
                                        </p>
                                        <p className="text-sm text-gray-600">Total</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">
                                            {importData.filter(d => d.valid).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Válidos</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">
                                            {importData.filter(d => !d.valid).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Con errores</p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Botones */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowImportModal(false);
                                    setImportFile(null);
                                    setImportData([]);
                                    setImportPreview([]);
                                    setImportErrors([]);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleImportUsers}
                                disabled={importing || importData.filter(d => d.valid).length === 0}
                                variant="success"
                            >
                                {importing ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Importando...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Importar {importData.filter(d => d.valid).length} Usuarios
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Modal de Editar Progreso */}
                {showEditProgressModal && editingProgress && (
                    <Modal
                        isOpen={showEditProgressModal}
                        onClose={() => {
                            setShowEditProgressModal(false);
                            setEditingProgress(null);
                        }}
                        title={`Editar Progreso: ${editingProgress.user_name}`}
                        size="md"
                    >
                        <div className="space-y-6">
                            <Card className="p-4 bg-yellow-50 border-yellow-200">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-900">Edición Manual de Progreso</p>
                                        <p className="text-sm text-yellow-800 mt-1">
                                            Usa esto solo cuando necesites corregir el progreso manualmente.
                                            Cambiar esto NO marca las lecciones como completadas en la base de datos.
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Serie Actual
                                    </label>
                                    <Select
                                        value={editingProgress.current_series}
                                        onChange={(e) => setEditingProgress({
                                            ...editingProgress,
                                            current_series: parseInt(e.target.value)
                                        })}
                                    >
                                        {series.map(s => (
                                            <option key={s.id} value={s.orden}>
                                                Serie {s.orden}: {s.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Lección Actual
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={editingProgress.current_lesson}
                                        onChange={(e) => setEditingProgress({
                                            ...editingProgress,
                                            current_lesson: parseInt(e.target.value)
                                        })}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Lección en la que debe continuar
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEditProgressModal(false);
                                        setEditingProgress(null);
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={async () => {
                                        try {
                                            const { error } = await supabase
                                                .from('users')
                                                .update({
                                                    current_series: editingProgress.current_series,
                                                    current_lesson: editingProgress.current_lesson
                                                })
                                                .eq('id', editingProgress.user_id);

                                            if (error) throw error;

                                            alert('Progreso actualizado exitosamente');
                                            setShowEditProgressModal(false);
                                            setEditingProgress(null);

                                            // Recargar usuarios
                                            const { data: updatedUsers } = await supabase
                                                .from('users')
                                                .select('*')
                                                .is('deleted_at', null)
                                                .order('created_at', { ascending: false });

                                            if (updatedUsers) {
                                                const processed = updatedUsers.map(u => ({
                                                    ...u,
                                                    validated: u.approved || false,
                                                    joined_date: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : null
                                                }));
                                                setUsers(processed);
                                            }
                                        } catch (error) {
                                            console.error('Error actualizando progreso:', error);
                                            alert('Error: ' + error.message);
                                        }
                                    }}
                                >
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Tips Section */}
                <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {t("tipsTitle")}
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                        <p>
                            • <strong>{t("tip1")}</strong> {t("tip1Text")}
                        </p>
                        <p>
                            • <strong>{t("tip2")}</strong> {t("tip2Text")}
                        </p>
                        <p>
                            • <strong>{t("tip3")}</strong> {t("tip3Text")}
                        </p>
                        <p>
                            • <strong>{t("tip4")}</strong> {t("tip4Text")}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );

}