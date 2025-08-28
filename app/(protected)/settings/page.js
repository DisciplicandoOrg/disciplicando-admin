"use client"

import React, { useState, useEffect } from "react";
import {
    Settings, Shield, Database, Globe, Bell, Mail,
    MessageSquare, Clock, Languages, Palette, Key,
    Server, Lock, Users, AlertCircle, Check, X,
    ChevronRight, Save, RefreshCw, Download, Upload
} from "lucide-react";
import { useLang } from "@/app/i18n";

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
    const { t } = useLang();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

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
            id: "general",
            label: t("generalSection"),
            icon: Settings,
            desc: t("generalSectionDesc")
        },
        {
            id: "security",
            label: t("securitySection"),
            icon: Shield,
            desc: t("securitySectionDesc")
        },

        {
            id: "session",
            label: t("sessionTimeout"),
            icon: Clock,
            desc: t("sessionSettings")
        },

        {
            id: "database",
            label: t("databaseSection"),
            icon: Database,
            desc: t("databaseSectionDesc")
        },
        {
            id: "notifications",
            label: t("notificationsSection"),
            icon: Bell,
            desc: t("notificationsSectionDesc")
        },
        {
            id: "communications",
            label: t("communicationsSection"),
            icon: Mail,
            desc: t("communicationsSectionDesc")
        },
        {
            id: "appearance",
            label: t("appearanceSection"),
            icon: Palette,
            desc: t("appearanceSectionDesc")
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
                <h3 className="text-lg font-semibold mb-4">{t("generalConfig")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("generalConfigDesc")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t("appName")}
                    </label>
                    <Input
                        value={config.appName}
                        onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                        placeholder="Disciplicando"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t("appNameDesc")}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        {t("mainLanguage")}
                    </label>
                    <Select
                        value={config.language}
                        onChange={(e) => setConfig({ ...config, language: e.target.value })}
                    >
                        <option value="es">{t("spanish")}</option>
                        <option value="en">{t("english")}</option>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        {t("mainLanguageDesc")}
                    </p>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                        {t("timezone")}
                    </label>
                    <Select
                        value={config.timezone}
                        onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                    >
                        <optgroup label={t("unitedStates")}>
                            {TIMEZONES.usa.map(tz => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label} ({tz.abbr})
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label={t("latinAmerica")}>
                            {TIMEZONES.latam.map(tz => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label} ({tz.abbr})
                                </option>
                            ))}
                        </optgroup>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                        {t("timezoneDesc")}
                    </p>
                </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-blue-900">{t("timezonesTip")}</p>
                        <p className="text-sm text-blue-700 mt-1">
                            {t("timezonesTipText")}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderSecuritySection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t("securityConfig")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("securityConfigDesc")}
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t("authentication")}
                </h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.twoFactorRequired}
                        onChange={(e) => setConfig({ ...config, twoFactorRequired: e.target.checked })}
                        label={t("requireTwoFactor")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("sessionTime")}
                            </label>
                            <Input
                                type="number"
                                value={config.sessionTimeout}
                                onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
                                min="5"
                                max="1440"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t("sessionTimeDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    {t("passwordPolicies")}
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("minPasswordLength")}
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
                        label={t("requireSpecialChars")}
                    />
                </div>
            </Card>

            <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-amber-900">{t("accessLevels")}</p>
                        <ul className="text-sm text-amber-700 mt-2 space-y-1">
                            <li>• <strong>Admin:</strong> {t("adminAccess")}</li>
                            <li>• <strong>{t("discipler")}:</strong> {t("disciplerAccess")}</li>
                            <li>• <strong>{t("disciple")}:</strong> {t("discipleAccess")}</li>
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
                            <span className="text-sm text-gray-500">{t("minutes")}</span>
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
                            <span className="text-sm text-gray-500">{t("hours")}</span>
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
                            <span className="text-sm text-gray-500">{t("minutes")}</span>
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
                <h3 className="text-lg font-semibold mb-4">{t("databaseTitle")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("databaseDesc")}
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    {t("autoBackups")}
                </h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.autoBackup}
                        onChange={(e) => setConfig({ ...config, autoBackup: e.target.checked })}
                        label={t("enableAutoBackup")}
                    />

                    {config.autoBackup && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t("backupFrequency")}
                                </label>
                                <Select
                                    value={config.backupFrequency}
                                    onChange={(e) => setConfig({ ...config, backupFrequency: e.target.value })}
                                >
                                    <option value="hourly">{t("hourly")}</option>
                                    <option value="daily">{t("daily")}</option>
                                    <option value="weekly">{t("weekly")}</option>
                                    <option value="monthly">{t("monthly")}</option>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t("retentionDays")}
                                </label>
                                <Input
                                    type="number"
                                    value={config.retentionDays}
                                    onChange={(e) => setConfig({ ...config, retentionDays: parseInt(e.target.value) })}
                                    min="7"
                                    max="365"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {t("retentionDesc")}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4">{t("manualActions")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="secondary" className="justify-center">
                        <Download className="w-4 h-4" />
                        {t("downloadBackup")}
                    </Button>
                    <Button variant="secondary" className="justify-center">
                        <Upload className="w-4 h-4" />
                        {t("restoreBackup")}
                    </Button>
                </div>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-green-900">{t("supabaseInfo")}</p>
                        <p className="text-sm text-green-700 mt-1">
                            {t("supabaseInfoText")}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderNotificationsSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t("notificationsTitle")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("notificationsDesc")}
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4">{t("notificationChannels")}</h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.emailEnabled}
                        onChange={(e) => setConfig({ ...config, emailEnabled: e.target.checked })}
                        label={t("emailChannel")}
                    />
                    <Switch
                        checked={config.smsEnabled}
                        onChange={(e) => setConfig({ ...config, smsEnabled: e.target.checked })}
                        label={t("smsChannel")}
                    />
                    <Switch
                        checked={config.whatsappEnabled}
                        onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                        label={t("whatsappChannel")}
                    />
                    <Switch
                        checked={config.pushEnabled}
                        onChange={(e) => setConfig({ ...config, pushEnabled: e.target.checked })}
                        label={t("pushChannel")}
                    />
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4">{t("notificationTypes")}</h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{t("newLessonAvailable")}</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{t("activityReminder")}</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{t("lessonCompleted")}</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span>{t("messageFromDiscipler")}</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span>{t("weeklyProgressSummary")}</span>
                    </label>
                </div>
            </Card>
        </div>
    );

    const renderCommunicationsSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t("communicationProviders")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("communicationProvidersDesc")}
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t("emailChannel")}
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("emailProvider")}
                        </label>
                        <Select
                            value={config.emailProvider}
                            onChange={(e) => setConfig({ ...config, emailProvider: e.target.value })}
                        >
                            <option value="sendgrid">SendGrid</option>
                            <option value="mailgun">Mailgun</option>
                            <option value="ses">Amazon SES</option>
                            <option value="smtp">{t("customSMTP")}</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("apiKey")}
                        </label>
                        <Input type="password" placeholder="••••••••••••••••" />
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {t("smsWhatsapp")}
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("emailProvider")}
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
                                {t("accountSID")}
                            </label>
                            <Input type="password" placeholder="••••••••••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {t("authToken")}
                            </label>
                            <Input type="password" placeholder="••••••••••••••••" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("whatsappBusinessNumber")}
                        </label>
                        <Input placeholder="+1 (901) 555-0123" />
                        <p className="text-xs text-gray-500 mt-1">
                            {t("whatsappBusinessNumberDesc")}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderAppearanceSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">{t("appearanceTitle")}</h3>
                <p className="text-gray-600 mb-6">
                    {t("appearanceDesc")}
                </p>
            </div>

            <Card className="p-6">
                <h4 className="font-medium mb-4">{t("theme")}</h4>
                <div className="space-y-4">
                    <Switch
                        checked={config.darkMode}
                        onChange={(e) => setConfig({ ...config, darkMode: e.target.checked })}
                        label={t("darkMode")}
                    />
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {t("primaryColor")}
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
                <h4 className="font-medium mb-4">{t("logo")}</h4>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={config.logoUrl}
                            alt="Logo actual"
                            className="w-16 h-16 object-contain border rounded"
                        />
                        <Button variant="secondary">
                            <Upload className="w-4 h-4" />
                            {t("changeLogo")}
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                        {t("logoRecommendation")}
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("settings")}</h1>
                    <p className="text-gray-600">
                        {t("settingsSubtitle")}
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
                                    {t("changesWillApply")}
                                </div>
                                <div className="flex items-center gap-3">
                                    {saved && (
                                        <span className="text-green-600 flex items-center gap-2">
                                            <Check className="w-4 h-4" />
                                            {t("saved")}
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
                                                {t("saving")}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                {t("saveChanges")}
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