"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    Users,
    Shuffle,
    BookOpenText,
    BarChart3,
    Home,
    Settings,
    LogOut,
    Menu,
    X,
    Globe,
    TreePine,
    UserPlus
} from "lucide-react";

const SidebarItem = ({ href, icon: Icon, children, active = false }) => (
    <a
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-slate-700 hover:bg-slate-100'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span>{children}</span>
    </a>
);

const Sidebar = ({ isOpen, onToggle, currentPath, onLogout }) => (
    <>
        {/* Overlay para móvil */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onToggle}
            />
        )}

        {/* Sidebar */}
        <aside className={`
            fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
        `}>
            <div className="p-6 h-full overflow-y-auto">
                <div className="flex items-center gap-3 mb-8">
                    <img
                        src="/logo-admin.png"
                        alt="Logo Disciplicando"
                        width="40"
                        height="40"
                        className="block"
                    />
                    <h1 className="text-xl font-bold text-slate-800">Admin</h1>
                </div>

                <nav className="space-y-2">
                    <SidebarItem href="/" icon={Home} active={currentPath === "/"}>
                        Dashboard
                    </SidebarItem>

                    <SidebarItem href="/discipleship-tree" icon={TreePine} active={currentPath === "/discipleship-tree"}>
                        Árbol de Discipulado
                    </SidebarItem>

                    <SidebarItem href="/users" icon={Users} active={currentPath === "/users"}>
                        Admin de Usuarios
                    </SidebarItem>

                    <SidebarItem href="/user-management" icon={UserPlus} active={currentPath === "/user-management"}>
                        Gestión de Usuarios
                    </SidebarItem>

                    <SidebarItem href="/assignments/reassign" icon={Shuffle} active={currentPath === "/assignments/reassign"}>
                        Reasignar
                    </SidebarItem>

                    <SidebarItem href="/series" icon={BookOpenText} active={currentPath === "/series"}>
                        Series
                    </SidebarItem>

                    <SidebarItem href="/reports" icon={BarChart3} active={currentPath === "/reports"}>
                        Reportes
                    </SidebarItem>

                    <div className="border-t border-slate-200 my-4"></div>

                    <SidebarItem href="/settings" icon={Settings} active={currentPath === "/settings"}>
                        Configuración
                    </SidebarItem>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </nav>
            </div>
        </aside>
    </>
);

const Header = ({ onToggleSidebar, user, onLanguageToggle, currentLanguage }) => (
    <header className="bg-white border-b border-slate-200 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-md hover:bg-slate-100 lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-slate-800 hidden lg:block">
                    Panel de Administración
                </h2>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onLanguageToggle}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-slate-100 border border-slate-200"
                    title={`Cambiar a ${currentLanguage === 'es' ? 'English' : 'Español'}`}
                >
                    <Globe className="w-4 h-4" />
                    <span>{currentLanguage === 'es' ? 'ES' : 'EN'}</span>
                </button>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:inline">{user?.email || 'Usuario'}</span>
                </div>
            </div>
        </div>
    </header>
);

export default function AdminLayoutClient({ children }) {
    const router = useRouter();
    const supabase = useMemo(() => createSupabaseBrowserClient(), []);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const [language, setLanguage] = useState("es");

    useEffect(() => {
        // Detectar ruta actual
        setCurrentPath(window.location.pathname);

        // Detectar idioma guardado
        const savedLang = localStorage.getItem('disciplicando-language') || 'es';
        setLanguage(savedLang);
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                router.push('/login');
                return;
            }

            // Verificar si es admin
            const { data: isAdmin, error: adminError } = await supabase.rpc('me_is_admin');

            if (adminError || !isAdmin) {
                router.push('/403');
                return;
            }

            setUser(user);
            setLoading(false);
        };

        getUser();

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                router.push('/login');
            }
        });

        return () => subscription?.unsubscribe();
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleLanguageToggle = () => {
        const newLang = language === 'es' ? 'en' : 'es';
        setLanguage(newLang);
        localStorage.setItem('disciplicando-language', newLang);
        // Aquí puedes agregar lógica adicional para cambiar el idioma de la app
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-slate-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <div className="lg:w-64">
                <Sidebar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    currentPath={currentPath}
                    onLogout={handleLogout}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <Header
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    user={user}
                    onLanguageToggle={handleLanguageToggle}
                    currentLanguage={language}
                />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}