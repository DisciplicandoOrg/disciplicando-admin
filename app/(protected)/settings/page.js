"use client"

import { useLang } from "@/app/i18n";
import React, { useState, useEffect } from "react";
import {
    Settings, Shield, Database, Globe, Bell, Mail,
    MessageSquare, Clock, Languages, Palette, Key,
    Server, Lock, Users, AlertCircle, Check, X,
    ChevronRight, Save, RefreshCw, Download, Upload
} from "lucide-react";

// Componentes UI
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
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
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

const Switch = ({ checked, onChange, label }) => (
    <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`block w-14 h-8 rounded-full ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
        {label && <span className="ml-3">{label}</span>}
    </label>
);

// Zonas horarias
const TIMEZONES = {
    usa: [
        { value: "America/New_York", label: "Este (Nueva York, Miami)", abbr: "EST/EDT" },
        { value: "America/Chicago", label: "Central (Chicago, Memphis, Houston)", abbr: "CST/CDT" },
        { value: "America/Denver", label: "Montaña (Denver, Phoenix)", abbr: "MST/MDT" },
        { value: "America/Los_Angeles", label: "Pacífico (Los Angeles, Seattle)", abbr: "PST/PDT" },
        { value: "America/Anchorage", label: "Alaska", abbr: "AKST/AKDT" },
        { value: "Pacific/Honolulu", label: "Hawaii", abbr: "HST" }
    ],
    latam: [
        { value: "America/Mexico_City", label: "México (Ciudad de México)", abbr: "CST" },
        { value: "America/Tijuana", label: "México (Tijuana)", abbr: "PST" },
        { value: "America/Guatemala", label: "Guatemala", abbr: "CST" },
        { value: "America/El_Salvador", label: "El Salvador", abbr: "CST" },
        { value: "America/Tegucigalpa", label: "Honduras", abbr: "CST" },
        { value: "America/Managua", label: "Nicaragua", abbr: "CST" },
        { value: "America/Costa_Rica", label: "Costa Rica", abbr: "CST" },
        { value: "America/Panama", label: "Panamá", abbr: "EST" },
        { value: "America/Bogota", label: "Colombia", abbr: "COT" },
        { value: "America/Lima", label: "Perú", abbr: "PET" },
        { value: "America/Guayaquil", label: "Ecuador", abbr: "ECT" },
        { value: "America/La_Paz", label: "Bolivia", abbr: "BOT" },
        { value: "America/Santiago", label: "Chile", abbr: "CLT/CLST" },
        { value: "America/Buenos_Aires", label: "Argentina", abbr: "ART" },
        { value: "America/Montevideo", label: "Uruguay", abbr: "UYT" },
        { value: "America/Sao_Paulo", label: "Brasil", abbr: "BRT" },
        { value: "America/Caracas", label: "Venezuela", abbr: "VET" },
        { value: "America/Santo_Domingo", label: "República Dominicana", abbr: "AST" },
        { value: "America/Puerto_Rico", label: "Puerto Rico", abbr: "AST" }
    ]
};

export default function ConfigPage() {
    const [activeSection, setActiveSection] = useState("general");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const { t } = useLang();

    // Estado para configuración de sesión
    const [sessionConfig, setSessionConfig] = useState({
        inactivityTimeout: 30, // minutos
        maxSessionTime: 8, // horas
        warningTime: 5, // minutos antes
    });

    // Estados de configuración
    const [config, setConfig] = useState({
        // General
        appName: "Disciplicando",
        timezone: "America/Chicago",
        language: "es",

        // Notificaciones
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: true,
        pushEnabled: false,

        // Seguridad
        twoFactorRequired: false,
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireSpecialChars: true,

        // Base de datos
        autoBackup: true,
        backupFrequency: "daily",
        retentionDays: 30,

        // Comunicaciones
        emailProvider: "sendgrid",
        smsProvider: "twilio",
        whatsappProvider: "twilio",

        // Apariencia
        primaryColor: "#2563eb",
        darkMode: false,
        logoUrl: "/logo-admin.png"
    });

    // Cargar configuración guardada al iniciar
    useEffect(() => {
        const savedConfig = localStorage.getItem('app_config');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }

        const savedSessionConfig = localStorage.getItem('session_config');
        if (savedSessionConfig) {
            setSessionConfig(JSON.parse(savedSessionConfig));
        }
    }, []);


    const sections = [
        {
            id: "general", label: "General", icon: Settings,
            desc: "Configuración básica de la aplicación: nombre, zona horaria, idioma principal"
        },
        {
            id: "security", label: "Seguridad", icon: Shield,
            desc: "Control de acceso, autenticación, políticas de contraseñas y permisos"
        },

        {
            id: "session",
            label: t("sessionTimeout"),
            icon: Clock,
            desc: t("sessionSettings")
        },

        {
            id: "database", label: "Base de Datos", icon: Database,
            desc: "Respaldos automáticos, mantenimiento y optimización de datos"
        },
        {
            id: "notifications", label: "Notificaciones", icon: Bell,
            desc: "Configurar qué tipos de notificaciones enviar y cuándo"
        },
        {
            id: "communications", label: "Comunicaciones", icon: Mail,
            desc: "Proveedores de email, SMS y WhatsApp para enviar mensajes"
        },
        {
            id: "appearance", label: "Apariencia", icon: Palette,
            desc: "Personalización visual: colores, logos, temas"
        }
    ];

    const handleSave = async () => {
        setSaving(true);

        // Guardar configuración general
        localStorage.setItem('app_config', JSON.stringify(config));

        // Guardar configuración de sesión
        localStorage.setItem('session_config', JSON.stringify(sessionConfig));

        // Simular guardado
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const renderGeneralSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Configuración General</h3>
                <p className="text-gray-600 mb-6">
                    Ajustes básicos que afectan a toda la aplicación
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Nombre de la Aplicación
                    </label>
                    <Input
                        value={config.appName}
                        onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                        placeholder="Disciplicando"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Aparece en emails y notificaciones
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Idioma Principal
                    </label>
                    <Select
                        value={config.language}
                        onChange={(e) => setConfig({ ...config, language: e.target.value })}
                    >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        Idioma por defecto para nuevos usuarios
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                        Zona Horaria
                    </label>
                    <Select
                        value={config.timezone}
                        onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                    >
                        <optgroup label="Estados Unidos">
                            {TIMEZONES.usa.map(tz => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label} ({tz.abbr})
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Latinoamérica">
                            {TIMEZONES.latam.map(tz => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label} ({tz.abbr})
                                </option>
                            ))}
                        </optgroup>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        Afecta horarios de reportes y notificaciones automáticas
                    </p>
                </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-blue-900">Tip sobre zonas horarias</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Memphis está en zona Central (CST/CDT). Honduras también usa CST pero sin horario de verano.
                            La mayoría de Centroamérica está en CST permanente.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderSecuritySection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Configuración de Seguridad</h3>
                <p className="text-gray-600 mb-6">
                    Protege las cuentas y datos de tus usuarios
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Autenticación
                </h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.twoFactorRequired}
                        onChange={(e) => setConfig({ ...config, twoFactorRequired: e.target.checked })}
                        label="Requerir autenticación de dos factores para admins"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tiempo de sesión (minutos)
                            </label>
                            <Input
                                type="number"
                                value={config.sessionTimeout}
                                onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
                                min="5"
                                max="1440"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Cierra sesión tras inactividad
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Políticas de Contraseñas
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Longitud mínima
                        </label>
                        <Input
                            type="number"
                            value={config.passwordMinLength}
                            onChange={(e) => setConfig({ ...config, passwordMinLength: parseInt(e.target.value) })}
                            min="6"
                            max="32"
                        />
                    </div>
                    <Switch
                        checked={config.requireSpecialChars}
                        onChange={(e) => setConfig({ ...config, requireSpecialChars: e.target.checked })}
                        label="Requerir caracteres especiales (!@#$%)"
                    />
                </div>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-amber-900">Niveles de acceso actuales</p>
                        <ul className="text-sm text-amber-700 mt-2 space-y-1">
                            <li>• <strong>Admin:</strong> Control total del sistema</li>
                            <li>• <strong>Disciplicador:</strong> Gestiona sus discípulos</li>
                            <li>• <strong>Discípulo:</strong> Solo ve su progreso</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderSessionSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t("sessionSettings")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("sessionSettings")}
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t("sessionTimeout")}
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("inactivityTimeout")}
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                value={sessionConfig.inactivityTimeout}
                                onChange={(e) => setSessionConfig({
                                    ...sessionConfig,
                                    inactivityTimeout: parseInt(e.target.value)
                                })}
                                min="5"
                                max="120"
                                className="w-24"
                            />
                            <span className="text-sm text-gray-500">minutos</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {t("inactivityTimeoutDesc")}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("maxSessionTime")}
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                value={sessionConfig.maxSessionTime}
                                onChange={(e) => setSessionConfig({
                                    ...sessionConfig,
                                    maxSessionTime: parseInt(e.target.value)
                                })}
                                min="1"
                                max="24"
                                className="w-24"
                            />
                            <span className="text-sm text-gray-500">horas</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {t("maxSessionTimeDesc")}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("warningTime")}
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                value={sessionConfig.warningTime}
                                onChange={(e) => setSessionConfig({
                                    ...sessionConfig,
                                    warningTime: parseInt(e.target.value)
                                })}
                                min="1"
                                max="15"
                                className="w-24"
                            />
                            <span className="text-sm text-gray-500">minutos</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {t("warningTimeDesc")}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <p className="text-sm text-amber-700">
                            {t("sessionNote")}
                        </p>
                        <p className="text-xs text-amber-600 mt-2">
                            <strong>Supabase Dashboard → Settings → Auth → JWT Expiry</strong>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderDatabaseSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Base de Datos</h3>
                <p className="text-gray-600 mb-6">
                    Respaldos y mantenimiento de datos
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Respaldos Automáticos
                </h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.autoBackup}
                        onChange={(e) => setConfig({ ...config, autoBackup: e.target.checked })}
                        label="Activar respaldos automáticos"
                    />

                    {config.autoBackup && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Frecuencia de respaldo
                                </label>
                                <Select
                                    value={config.backupFrequency}
                                    onChange={(e) => setConfig({ ...config, backupFrequency: e.target.value })}
                                >
                                    <option value="hourly">Cada hora</option>
                                    <option value="daily">Diario</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensual</option>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Retención de respaldos (días)
                                </label>
                                <Input
                                    type="number"
                                    value={config.retentionDays}
                                    onChange={(e) => setConfig({ ...config, retentionDays: parseInt(e.target.value) })}
                                    min="7"
                                    max="365"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Los respaldos más antiguos se eliminarán automáticamente
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4">Acciones Manuales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="secondary" className="justify-center">
                        <Download className="w-4 h-4" />
                        Descargar Respaldo
                    </Button>
                    <Button variant="secondary" className="justify-center">
                        <Upload className="w-4 h-4" />
                        Restaurar Respaldo
                    </Button>
                </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-green-900">Información de Supabase</p>
                        <p className="text-sm text-green-700 mt-1">
                            Tu base de datos está alojada en Supabase con respaldos automáticos diarios incluidos.
                            Los respaldos adicionales aquí son para mayor seguridad.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderNotificationsSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
                <p className="text-gray-600 mb-6">
                    Configura cuándo y cómo notificar a los usuarios
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4">Canales de Notificación</h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.emailEnabled}
                        onChange={(e) => setConfig({ ...config, emailEnabled: e.target.checked })}
                        label="Email"
                    />
                    <Switch
                        checked={config.smsEnabled}
                        onChange={(e) => setConfig({ ...config, smsEnabled: e.target.checked })}
                        label="SMS"
                    />
                    <Switch
                        checked={config.whatsappEnabled}
                        onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                        label="WhatsApp"
                    />
                    <Switch
                        checked={config.pushEnabled}
                        onChange={(e) => setConfig({ ...config, pushEnabled: e.target.checked })}
                        label="Notificaciones Push (App móvil)"
                    />
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4">Tipos de Notificaciones</h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Nueva lección disponible</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Recordatorio de actividad pendiente</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Felicitación por completar lección</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>Mensaje del disciplicador</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span>Resumen semanal de progreso</span>
                    </label>
                </div>
            </Card>
        </div>
    );

    const renderCommunicationsSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Proveedores de Comunicación</h3>
                <p className="text-gray-600 mb-6">
                    Servicios externos para enviar mensajes
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Proveedor
                        </label>
                        <Select
                            value={config.emailProvider}
                            onChange={(e) => setConfig({ ...config, emailProvider: e.target.value })}
                        >
                            <option value="sendgrid">SendGrid</option>
                            <option value="mailgun">Mailgun</option>
                            <option value="ses">Amazon SES</option>
                            <option value="smtp">SMTP Personalizado</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            API Key
                        </label>
                        <Input type="password" placeholder="••••••••••••••••" />
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    SMS y WhatsApp
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Proveedor
                        </label>
                        <Select
                            value={config.smsProvider}
                            onChange={(e) => setConfig({ ...config, smsProvider: e.target.value })}
                        >
                            <option value="twilio">Twilio</option>
                            <option value="vonage">Vonage (Nexmo)</option>
                            <option value="messagebird">MessageBird</option>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Account SID
                            </label>
                            <Input type="password" placeholder="••••••••••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Auth Token
                            </label>
                            <Input type="password" placeholder="••••••••••••••••" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Número de WhatsApp Business
                        </label>
                        <Input placeholder="+1 (901) 555-0123" />
                        <p className="text-xs text-gray-500 mt-1">
                            Debe estar verificado en WhatsApp Business API
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderAppearanceSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Apariencia</h3>
                <p className="text-gray-600 mb-6">
                    Personaliza el aspecto visual de la aplicación
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4">Tema</h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.darkMode}
                        onChange={(e) => setConfig({ ...config, darkMode: e.target.checked })}
                        label="Modo oscuro"
                    />
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Color principal
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={config.primaryColor}
                                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                className="w-20 h-10 rounded cursor-pointer"
                            />
                            <Input
                                value={config.primaryColor}
                                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                                className="w-32"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4">Logo</h4>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={config.logoUrl}
                            alt="Logo actual"
                            className="w-16 h-16 object-contain border rounded"
                        />
                        <Button variant="secondary">
                            <Upload className="w-4 h-4" />
                            Cambiar Logo
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        Recomendado: 512x512px, formato PNG con fondo transparente
                    </p>
                </div>
            </Card>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "general": return renderGeneralSection();
            case "security": return renderSecuritySection();
            case "database": return renderDatabaseSection();
            case "notifications": return renderNotificationsSection();
            case "communications": return renderCommunicationsSection();
            case "appearance": return renderAppearanceSection();
            case "session": return renderSessionSection();
            default: return renderGeneralSection();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
                    <p className="text-gray-600">
                        Administra todos los aspectos de tu aplicación
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="p-2">
                            <nav className="space-y-1">
                                {sections.map(section => {
                                    const Icon = section.icon;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3 ${activeSection === section.id
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <div className="flex-1">
                                                <div className="font-medium">{section.label}</div>
                                                {activeSection === section.id && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {section.desc}
                                                    </div>
                                                )}
                                            </div>
                                            {activeSection === section.id && (
                                                <ChevronRight className="w-4 h-4" />
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <Card className="p-6">
                            {renderContent()}

                            {/* Save Button */}
                            <div className="mt-8 pt-6 border-t flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Los cambios se aplicarán inmediatamente
                                </div>
                                <div className="flex items-center gap-3">
                                    {saved && (
                                        <span className="text-green-600 flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            Guardado
                                        </span>
                                    )}
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="min-w-[120px]"
                                    >
                                        {saving ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}