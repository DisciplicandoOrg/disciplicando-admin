"use client"

import { useLang } from "@/app/i18n";
import React, { useState, useEffect, useMemo } from "react";
import {
    UserPlus, Users, Award, CheckCircle, AlertCircle,
    ChevronRight, Save, Search, Filter, Mail, Phone,
    Shield, BookOpen, Star, Clock, Calendar,
    ChevronDown, X, Check, Edit, Trash2, Eye
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

    // Form states
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        role: "disciple",
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
    const [users, setUsers] = useState([
        {
            id: "1",
            name: "María González",
            email: "maria@example.com",
            role: "discipler",
            disciples_count: 3,
            current_series: 2,
            validated: true,
            joined_date: "2024-01-15"
        },
        {
            id: "2",
            name: "Carlos Rodríguez",
            email: "carlos@example.com",
            role: "disciple",
            current_lesson: 8,
            discipler: "María González",
            validated: false,
            joined_date: "2024-03-20"
        },
        {
            id: "3",
            name: "Ana Martínez",
            email: "ana@example.com",
            role: "discipler",
            disciples_count: 5,
            current_series: 1,
            validated: true,
            joined_date: "2023-11-10"
        }
    ]);

    const [disciplers, setDisciplers] = useState([
        { id: "1", name: "María González" },
        { id: "3", name: "Ana Martínez" },
        { id: "4", name: "Pedro López" }
    ]);

    const [series, setSeries] = useState([
        { id: "s1", name: "Serie 1: Fundamentos", blocks: 3, lessons: 24 },
        { id: "s2", name: "Serie 2: Crecimiento", blocks: 4, lessons: 32 },
        { id: "s3", name: "Serie 3: Liderazgo", blocks: 3, lessons: 24 }
    ]);

    const handleAddUser = () => {
        // Aquí iría la lógica de Supabase
        console.log("Agregando usuario:", newUser);
        setShowAddModal(false);
        // Reset form
        setNewUser({
            name: "",
            email: "",
            phone: "",
            role: "disciple",
            discipler_id: "",
            validated_lessons: [],
            notes: ""
        });
    };

    const handleValidateUser = () => {
        // Aquí iría la lógica de Supabase
        console.log("Validando competencias:", validation);
        setShowValidateModal(false);
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
                                <option value="disciple">{t("disciple")}</option>
                                <option value="discipler">{t("discipler")}</option>
                                <option value="admin">{t("admin")}</option>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Asignación */}
                {newUser.role === "disciple" && (
                    <div>
                        <h4 className="font-medium mb-4 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {t("assignment")}
                        </h4>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("discipler")}
                            </label>
                            <Select
                                value={newUser.discipler_id}
                                onChange={(e) => setNewUser({ ...newUser, discipler_id: e.target.value })}
                            >
                                <option value="">{t("selectDiscipler")}...</option>
                                {disciplers.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                                {t("canAssignLater")}
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
                            <input type="radio" name="invite" defaultChecked />
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{t("sendEmailInvite")}</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="radio" name="invite" />
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{t("sendWhatsAppInvite")}</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="radio" name="invite" />
                            <UserPlus className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{t("createDirectly")}</span>
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
            title={t("validateCompetencies")}
            size="lg"
        >
            <div className="space-y-6">
                {/* Selección de Usuario */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t("selectUser")}
                    </label>
                    <Select
                        value={validation.user_id}
                        onChange={(e) => {
                            setValidation({ ...validation, user_id: e.target.value });
                            const user = users.find(u => u.id === e.target.value);
                            setSelectedUser(user);
                        }}
                    >
                        <option value="">{t("selectUserPlaceholder")}</option>
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
                                        <Badge variant={selectedUser.role === 'discipler' ? 'success' : 'info'}>
                                            {selectedUser.role}
                                        </Badge>
                                        {selectedUser.current_lesson && (
                                            <span className="text-sm text-gray-500">
                                                {t("currentLesson")}: {selectedUser.current_lesson}
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
                                {t("validateCompletesSeries")}
                            </h4>
                            <div className="space-y-3">
                                {series.map(s => (
                                    <label key={s.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            className="mt-1"
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
                                        <CheckCircle className="w-5 h-5 text-green-500 opacity-0" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Nivel de Certificación */}
                        <div>
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                {t("certificationLevel")}
                            </h4>
                            <Select
                                value={validation.certification_level}
                                onChange={(e) => setValidation({ ...validation, certification_level: e.target.value })}
                            >
                                <option value="none">{t("noCertification")}</option>
                                <option value="discipler">{t("certifiedDiscipler")}</option>
                                <option value="advanced">{t("advancedDiscipler")}</option>
                                <option value="master">{t("masterDiscipler")}</option>
                            </Select>
                            <p className="text-xs text-gray-500 mt-2">
                                • <strong>{t("certifiedDiscipler")}:</strong> {t("certificationNote1")}<br />
                                • <strong>{t("advancedDiscipler")}:</strong> {t("certificationNote2")}<br />
                                • <strong>{t("masterDiscipler")}:</strong> {t("certificationNote3")}
                            </p>
                        </div>

                        {/* Notas de Validación */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("validationNotes")}
                            </label>
                            <Textarea
                                value={validation.notes}
                                onChange={(e) => setValidation({ ...validation, notes: e.target.value })}
                                placeholder={t("validationNotesPlaceholder")}
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
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={handleValidateUser}
                        disabled={!validation.user_id}
                        variant="success"
                    >
                        <CheckCircle className="w-4 h-4" />
                        {t("validateCompetencies")}
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
                            placeholder={t("searchPlaceholder")}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Select className="md:w-48">
                    <option value="">{t("allUsers")}</option>
                    <option value="admin">{t("admins")}</option>
                    <option value="discipler">{t("disciplers")}</option>
                    <option value="disciple">{t("disciples")}</option>
                </Select>
                <Select className="md:w-48">
                    <option value="">{t("allStates")}</option>
                    <option value="validated">{t("validated")}</option>
                    <option value="not-validated">{t("noValidated")}</option>
                </Select>
            </div>

            {/* Users Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progreso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Ingreso
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={
                                            user.role === 'admin' ? 'danger' :
                                                user.role === 'discipler' ? 'success' : 'info'
                                        }>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.validated ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm text-green-700">Validado</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-500">Pendiente</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.role === 'discipler' ? (
                                            <div className="text-sm">
                                                <div>{user.disciples_count || 0} discípulos</div>
                                                <div className="text-gray-500">Serie {user.current_series || 1}</div>
                                            </div>
                                        ) : user.role === 'disciple' ? (
                                            <div className="text-sm">
                                                <div>Lección {user.current_lesson || 1}</div>
                                                <div className="text-gray-500">{user.discipler}</div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.joined_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            {!user.validated && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setValidation({ ...validation, user_id: user.id });
                                                        setSelectedUser(user);
                                                        setShowValidateModal(true);
                                                    }}
                                                >
                                                    <Award className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

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
                            className="w-full text-left hover:bg-gray-50 rounded-lg p-3 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-medium">{t("importMultiple")}</div>
                                    <div className="text-sm text-gray-500">{t("fromCSVExcel")}</div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                            </div>
                        </button>
                    </Card>
                </div>

                {/* Main Content */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Todos los Usuarios</h2>
                        {renderUsersList()}
                    </div>
                </Card>

                {/* Modals */}
                {renderAddUserModal()}
                {renderValidateModal()}

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