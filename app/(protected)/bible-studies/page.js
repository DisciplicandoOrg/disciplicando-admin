"use client";

import { useState, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useLang } from "@/app/i18n";
import {
    BookOpen, Plus, Edit, Eye, Link, Copy, Camera,
    FileText, Globe, Video, Headphones,
    CheckCircle, AlertCircle, Search, Filter,
    ChevronDown, ChevronRight, Layers
} from "lucide-react";

export default function BibleStudiesPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const { lang, t } = useLang();
    const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [series, setSeries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSeries, setExpandedSeries] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    // Helper para obtener texto en el idioma correcto desde la BD
    const getLocalizedText = (item, field) => {
        if (!item) return '';

        // Si el idioma es inglés y hay traducción
        if (lang === 'en') {
            // Para series con series_i18n
            if (item.series_i18n) {
                const enTranslation = item.series_i18n.find(t => t.locale === 'en');
                if (enTranslation && enTranslation[field]) {
                    return enTranslation[field];
                }
            }
            // Para lecciones con lecciones_i18n
            if (item.lecciones_i18n) {
                const enTranslation = item.lecciones_i18n.find(t => t.locale === 'en');
                if (enTranslation && enTranslation[field]) {
                    return enTranslation[field];
                }
            }
        }

        // Retornar el campo en español por defecto
        return item[field] || '';
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Obtener series ordenadas
            const { data: seriesData } = await supabase
                .from("series")
                .select("*")
                .order("orden", { ascending: true });

            setSeries(seriesData || []);

            // Obtener lecciones con sus relaciones, ordenadas por número
            const { data: lessonsData } = await supabase
                .from("lecciones")
                .select(`
                    *,
                    bloques (
                        id,
                        nombre,
                        serie_id,
                        series (
                            id,
                            nombre,
                            orden
                        )
                    )
                `)
                .order("numero", { ascending: true });

            setLessons(lessonsData || []);

            // Auto-expandir series que tienen lecciones
            const initialExpanded = {};
            seriesData?.forEach(serie => {
                initialExpanded[serie.id] = true; // Expandir todas por defecto
            });
            setExpandedSeries(initialExpanded);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStudy = (lessonId) => {
        window.location.href = `/bible-studies/editor/${lessonId}`;
    };

    const handleEditStudy = (lessonId) => {
        window.location.href = `/bible-studies/editor/${lessonId}`;
    };

    const handlePreviewStudy = (lessonId) => {
        const url = `${window.location.origin}/api/bible-study/viewer/${lessonId}`;
        setPreviewUrl(url);
        setShowPreview(true);
    };

    const handleCopyLink = (lessonId) => {
        const url = `${window.location.origin}/api/bible-study/viewer/${lessonId}`;
        navigator.clipboard.writeText(url);
        alert("Link copiado al portapapeles");
    };

    const toggleSeries = (seriesId) => {
        setExpandedSeries(prev => ({
            ...prev,
            [seriesId]: !prev[seriesId]
        }));
    };

    const expandAll = () => {
        const newExpanded = {};
        series.forEach(s => {
            newExpanded[s.id] = true;
        });
        setExpandedSeries(newExpanded);
    };

    const collapseAll = () => {
        setExpandedSeries({});
    };

    // Agrupar lecciones por serie
    const lessonsBySeries = useMemo(() => {
        const grouped = {};

        series.forEach(serie => {
            grouped[serie.id] = {
                serie: serie,
                lessons: lessons.filter(lesson =>
                    lesson.bloques?.serie_id === serie.id
                ).sort((a, b) => a.numero - b.numero)
            };
        });

        return grouped;
    }, [lessons, series]);

    // Filtrar lecciones según búsqueda
    const getFilteredLessons = (seriesLessons) => {
        if (!searchQuery) return seriesLessons;

        return seriesLessons.filter(lesson =>
            lesson.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.numero?.toString().includes(searchQuery)
        );
    };

    const getStudyStatus = (lesson) => {
        if (lesson.lesson_content) {
            return {
                status: "complete",
                color: "green",
                text: t("study_complete")  // Usar t() aquí
            };
        }
        if (lesson.estudio_url) {
            return {
                status: "external",
                color: "blue",
                text: t("study_external")  // Usar t() aquí
            };
        }
        return {
            status: "pending",
            color: "gray",
            text: t("no_study")  // Usar t() aquí
        };
    };

    const getResourceIcons = (lesson) => {
        const icons = [];
        if (lesson.video_url) icons.push(<Camera key="video" className="w-4 h-4 text-red-600" title="Video" />);
        if (lesson.podcast_url) icons.push(<Headphones key="podcast" className="w-4 h-4 text-purple-600" title="Podcast" />);
        if (lesson.lesson_content || lesson.estudio_url) icons.push(<FileText key="study" className="w-4 h-4 text-blue-600" title="Estudio" />);
        if (lesson.quiz_url) icons.push(<CheckCircle key="quiz" className="w-4 h-4 text-green-600" title="Quiz" />);
        return icons;
    };

    // Calcular estadísticas
    const stats = useMemo(() => {
        const total = lessons.length;
        const withStudy = lessons.filter(l => l.lesson_content || l.estudio_url).length;
        const pending = lessons.filter(l => !l.lesson_content && !l.estudio_url).length;

        return { total, withStudy, pending };
    }, [lessons]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t("bible_studies")}</h1>
                    <p className="text-gray-600 mt-1">{t("bible_studies_subtitle")}</p>

                </div>
                <button
                    onClick={() => window.location.href = '/bible-studies/new'}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    {t("create_new_study")}

                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">{t("total_lessons")}</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">{t("with_study")}</p>
                            <p className="text-2xl font-bold">{stats.withStudy}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                        <div>
                            <p className="text-sm text-gray-600">{t("pending_studies")}</p>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <Globe className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">{t("bilingual")}</p>
                            <p className="text-2xl font-bold">ES/EN</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t("search_lesson")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={expandAll}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                > {t("expand_all")}
                </button>
                <button
                    onClick={collapseAll}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                > {t("collapse_all")}
                </button>
            </div>

            {/* Lista de lecciones por serie */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <p className="text-gray-500">Cargando...</p>
                    </div>
                ) : series.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay series disponibles</p>
                    </div>
                ) : (
                    Object.values(lessonsBySeries).map(({ serie, lessons }) => {
                        const filteredLessons = getFilteredLessons(lessons);
                        const isExpanded = expandedSeries[serie.id];

                        // Si no hay lecciones después de filtrar, no mostrar la serie
                        if (searchQuery && filteredLessons.length === 0) return null;

                        return (
                            <div key={serie.id} className="bg-white rounded-lg border shadow-sm">
                                {/* Header de la serie */}
                                <div
                                    className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                                    onClick={() => toggleSeries(serie.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {isExpanded ? (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-gray-600" />
                                            )}
                                            <Layers className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {serie.nombre}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {lessons.length} lecciones •
                                                    {lessons.filter(l => l.lesson_content || l.estudio_url).length} con estudio
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {serie.orden === 1 && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    Serie Principal
                                                </span>
                                            )}
                                            <span className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full">
                                                Serie {serie.orden}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de lecciones */}
                                {isExpanded && (
                                    <div className="divide-y">
                                        {filteredLessons.length === 0 ? (
                                            <div className="px-6 py-8 text-center text-gray-500">
                                                No hay lecciones en esta serie
                                            </div>
                                        ) : (
                                            filteredLessons.map(lesson => {
                                                const status = getStudyStatus(lesson);
                                                const icons = getResourceIcons(lesson);

                                                return (
                                                    <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-lg font-bold text-gray-400">
                                                                        {lesson.numero}.
                                                                    </span>
                                                                    <div>
                                                                        <h4 className="font-medium text-gray-900">
                                                                            {lesson.titulo}
                                                                        </h4>
                                                                        {lesson.bloques?.nombre && (
                                                                            <p className="text-sm text-gray-500">
                                                                                {lesson.bloques.nombre}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-6">
                                                                {/* Recursos */}
                                                                <div className="flex gap-2">
                                                                    {icons}
                                                                </div>

                                                                {/* Estado */}
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                                                    ${status.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                                                                    ${status.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                                                                    ${status.color === 'gray' ? 'bg-gray-100 text-gray-800' : ''}
                                                                `}>
                                                                    {status.text}
                                                                </span>

                                                                {/* Acciones */}
                                                                <div className="flex gap-2">
                                                                    {lesson.lesson_content ? (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleEditStudy(lesson.id)}
                                                                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                                                                                title="Editar estudio"
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handlePreviewStudy(lesson.id)}
                                                                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                                                                                title="Vista previa"
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleCopyLink(lesson.id)}
                                                                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                                                                                title="Copiar link"
                                                                            >
                                                                                <Link className="w-4 h-4" />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleCreateStudy(lesson.id)}
                                                                            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                                        > {t("create_study")}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal de vista previa */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Vista Previa del Estudio</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <iframe
                            src={previewUrl}
                            className="flex-1 w-full"
                            title="Vista previa"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}