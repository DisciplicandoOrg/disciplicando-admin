"use client";

import { useState, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useLang } from "@/app/i18n";
import {
    BookOpen,
    Plus,
    Edit2,
    Trash2,
    Upload,
    Calendar,
    Tag,
    FileText,
    Download,
    Eye,
    EyeOff,
    Layers
} from "lucide-react";

export default function BibleGuidesPage() {
    const { t } = useLang();
    const supabase = useMemo(() => createSupabaseBrowserClient(), []);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [expandedGuide, setExpandedGuide] = useState(null);

    // Estado del formulario
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        fecha_publicacion: "",
        texto_biblico: "",
        serie: "",
        temas: "",
        idioma: "es",
        pdf_file: null,
        is_active: true
    });

    // Cargar guías al iniciar
    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("bible_study_guides")
                .select("*")
                .order("fecha_publicacion", { ascending: false });

            if (error) throw error;
            setGuides(data || []);
        } catch (error) {
            console.error("Error cargando guías:", error);
            alert("Error cargando guías: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setFormData(prev => ({ ...prev, pdf_file: file }));
        } else {
            alert("Por favor selecciona un archivo PDF válido");
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.titulo.trim()) {
            alert(t("title") + " es obligatorio");
            return;
        }
        if (!formData.fecha_publicacion) {
            alert(t("publication_date") + " es obligatoria");
            return;
        }
        if (!formData.texto_biblico.trim()) {
            alert(t("biblical_text") + " es obligatorio");
            return;
        }
        if (!editingGuide && !formData.pdf_file) {
            alert("Debes seleccionar un archivo PDF");
            return;
        }

        try {
            setUploading(true);

            let pdfUrl = editingGuide?.pdf_url || "";
            let pdfFilename = editingGuide?.pdf_filename || "";

            // Si hay un archivo nuevo, subirlo
            if (formData.pdf_file) {
                const fileExt = "pdf";
                const fileName = `${Date.now()}_${formData.pdf_file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const filePath = `${fileName}`;

                // Subir archivo a Storage
                const { error: uploadError } = await supabase.storage
                    .from("bible-study-guides")
                    .upload(filePath, formData.pdf_file);

                if (uploadError) throw uploadError;

                // Obtener URL pública
                const { data: urlData } = supabase.storage
                    .from("bible-study-guides")
                    .getPublicUrl(filePath);

                pdfUrl = urlData.publicUrl;
                pdfFilename = fileName;
            }

            // Procesar temas (convertir texto separado por comas a array)
            const temasArray = formData.temas
                .split(",")
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const guideData = {
                titulo: formData.titulo.trim(),
                descripcion: formData.descripcion.trim(),
                fecha_publicacion: formData.fecha_publicacion,
                texto_biblico: formData.texto_biblico.trim(),
                serie: formData.serie.trim() || null,
                temas: temasArray,
                idioma: formData.idioma,
                pdf_url: pdfUrl,
                pdf_filename: pdfFilename,
                is_active: formData.is_active
            };

            if (editingGuide) {
                // Actualizar guía existente
                const { error } = await supabase
                    .from("bible_study_guides")
                    .update(guideData)
                    .eq("id", editingGuide.id);

                if (error) throw error;
                alert(t("guide_updated"));
            } else {
                // Crear nueva guía
                const { error } = await supabase
                    .from("bible_study_guides")
                    .insert([guideData]);

                if (error) throw error;
                alert(t("guide_created"));
            }

            // Limpiar formulario y recargar
            resetForm();
            fetchGuides();
            setShowForm(false);
        } catch (error) {
            console.error("Error guardando guía:", error);
            alert("Error guardando guía: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (guide) => {
        setEditingGuide(guide);
        setFormData({
            titulo: guide.titulo,
            descripcion: guide.descripcion || "",
            fecha_publicacion: guide.fecha_publicacion,
            texto_biblico: guide.texto_biblico,
            serie: guide.serie || "",
            temas: guide.temas?.join(", ") || "",
            idioma: guide.idioma || "es",
            pdf_file: null,
            is_active: guide.is_active
        });
        setShowForm(true);
    };

    const handleDelete = async (guide) => {
        if (!confirm(`${t("confirm_delete_guide")} "${guide.titulo}"?`)) {
            return;
        }

        try {
            // Eliminar archivo de Storage
            if (guide.pdf_filename) {
                await supabase.storage
                    .from("bible-study-guides")
                    .remove([guide.pdf_filename]);
            }

            // Eliminar registro de la base de datos
            const { error } = await supabase
                .from("bible_study_guides")
                .delete()
                .eq("id", guide.id);

            if (error) throw error;

            alert(t("guide_deleted"));
            fetchGuides();
        } catch (error) {
            console.error("Error eliminando guía:", error);
            alert("Error eliminando guía: " + error.message);
        }
    };

    const toggleActive = async (guide) => {
        try {
            const { error } = await supabase
                .from("bible_study_guides")
                .update({ is_active: !guide.is_active })
                .eq("id", guide.id);

            if (error) throw error;
            fetchGuides();
        } catch (error) {
            console.error("Error actualizando estado:", error);
            alert("Error actualizando estado: " + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: "",
            descripcion: "",
            fecha_publicacion: "",
            texto_biblico: "",
            serie: "",
            temas: "",
            idioma: "es",
            pdf_file: null,
            is_active: true
        });
        setEditingGuide(null);
    };

    const handleCancel = () => {
        resetForm();
        setShowForm(false);
    };

    // Obtener lista única de series para mostrar
    const uniqueSeries = useMemo(() => {
        const series = guides
            .filter(g => g.serie)
            .map(g => g.serie);
        return [...new Set(series)].sort();
    }, [guides]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t("loading_guides")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t("bible_guides")}</h1>
                    <p className="text-gray-600 mt-1">{t("bible_guides_subtitle")}</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    {t("new_guide")}
                </button>
            </div>

            {/* Información de series existentes */}
            {uniqueSeries.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Layers className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Series existentes:</h3>
                            <div className="flex flex-wrap gap-2">
                                {uniqueSeries.map((serie, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                                        {serie}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingGuide ? t("edit_guide") : t("new_study_guide")}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Título */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("title")} *
                                </label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: La Gracia de Dios"
                                    required
                                />
                            </div>

                            {/* Fecha de publicación */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("publication_date")} *
                                </label>
                                <input
                                    type="date"
                                    name="fecha_publicacion"
                                    value={formData.fecha_publicacion}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Texto bíblico */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("biblical_text")} *
                                </label>
                                <input
                                    type="text"
                                    name="texto_biblico"
                                    value={formData.texto_biblico}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: Juan 3:16-21"
                                    required
                                />
                            </div>

                            {/* Serie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Serie
                                </label>
                                <input
                                    type="text"
                                    name="serie"
                                    value={formData.serie}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: Estudio Cronológico de la Biblia 2025"
                                    list="series-list"
                                />
                                {uniqueSeries.length > 0 && (
                                    <datalist id="series-list">
                                        {uniqueSeries.map((serie, idx) => (
                                            <option key={idx} value={serie} />
                                        ))}
                                    </datalist>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Escribe el nombre de la serie o selecciona una existente
                                </p>
                            </div>

                            {/* Idioma */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Idioma *
                                </label>
                                <select
                                    name="idioma"
                                    value={formData.idioma}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="es">🇪🇸 Español</option>
                                    <option value="en">🇺🇸 English</option>
                                </select>
                            </div>

                            {/* Temas */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("themes")}
                                </label>
                                <input
                                    type="text"
                                    name="temas"
                                    value={formData.temas}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: salvación, gracia, fe"
                                />
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("description")}
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Breve descripción de la guía..."
                                />
                            </div>

                            {/* Archivo PDF */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("pdf_file")} {!editingGuide && "*"}
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {editingGuide && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Deja vacío para mantener el archivo actual
                                    </p>
                                )}
                            </div>

                            {/* Activa */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {t("active_guide")}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {t("saving")}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {editingGuide ? t("update") : t("save")}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={uploading}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:cursor-not-allowed"
                            >
                                {t("cancel")}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de guías */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {t("existing_guides")} ({guides.length})
                    </h2>
                </div>

                {guides.length === 0 ? (
                    <div className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t("no_guides_yet")}</p>
                        <p className="text-sm text-gray-400 mt-1">{t("click_new_guide")}</p>
                    </div>
                ) : (
                    <div>
                        {guides.map(guide => {
                            const isExpanded = expandedGuide === guide.id;

                            return (
                                <div key={guide.id} className="border-b border-gray-200 last:border-b-0">
                                    {/* Vista compacta - siempre visible */}
                                    <div className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Información básica */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {guide.titulo}
                                                    </h3>
                                                    {/* Badges compactos */}
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium flex-shrink-0">
                                                        {guide.idioma === 'es' ? '🇪🇸' : '🇺🇸'}
                                                    </span>
                                                    {guide.is_active ? (
                                                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Activa"></span>
                                                    ) : (
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" title="Inactiva"></span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                                                    {guide.serie && (
                                                        <span className="flex items-center gap-1">
                                                            <Layers className="w-3.5 h-3.5" />
                                                            <span className="font-medium">{guide.serie}</span>
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-3.5 h-3.5" />
                                                        {guide.texto_biblico}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(guide.fecha_publicacion).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <a
                                                    href={guide.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Ver PDF"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleActive(guide);
                                                    }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title={guide.is_active ? "Desactivar" : "Activar"}
                                                >
                                                    {guide.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(guide);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(guide);
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                {/* Botón expandir/colapsar */}
                                                <button
                                                    onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all ml-1"
                                                    title={isExpanded ? "Contraer" : "Ver detalles"}
                                                >
                                                    <svg
                                                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detalles expandidos */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                                            <div className="pt-4 space-y-3">
                                                {/* Descripción */}
                                                {guide.descripcion && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Descripción:</h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {guide.descripcion}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Información completa */}
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Fecha de publicación:</span>
                                                        <p className="text-gray-600">
                                                            {new Date(guide.fecha_publicacion).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Idioma:</span>
                                                        <p className="text-gray-600">
                                                            {guide.idioma === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                                                        </p>
                                                    </div>
                                                    {guide.serie && (
                                                        <div>
                                                            <span className="font-semibold text-gray-700">Serie:</span>
                                                            <p className="text-gray-600">{guide.serie}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Texto bíblico:</span>
                                                        <p className="text-gray-600">{guide.texto_biblico}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700">Estado:</span>
                                                        <p className="text-gray-600">
                                                            {guide.is_active ?
                                                                <span className="text-green-600 font-medium">✓ Activa</span> :
                                                                <span className="text-gray-500">○ Inactiva</span>
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Temas */}
                                                {guide.temas && guide.temas.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Temas:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {guide.temas.map((tema, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                                                                >
                                                                    {tema}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Enlace al PDF */}
                                                <div className="pt-2">
                                                    <a
                                                        href={guide.pdf_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Descargar PDF
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}