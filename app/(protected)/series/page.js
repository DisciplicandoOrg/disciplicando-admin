"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { BookOpenText, Plus, Edit, Trash2, ChevronDown, ChevronRight, Globe, Folder, FileText } from "lucide-react";

// Modal para editar serie
function EditSerieModal({ serie, isOpen, onClose, onSave, supabase }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre_es: "",
        descripcion_es: "",
        nombre_en: "",
        descripcion_en: "",
        orden: 1,
        is_active: true
    });

    useEffect(() => {
        if (serie) {
            setFormData({
                nombre_es: serie.nombre || "",
                descripcion_es: serie.descripcion || "",
                nombre_en: serie.nombre_en || "",
                descripcion_en: serie.descripcion_en || "",
                orden: serie.orden || 1,
                is_active: serie.is_active ?? true
            });
        } else {
            setFormData({
                nombre_es: "",
                descripcion_es: "",
                nombre_en: "",
                descripcion_en: "",
                orden: 1,
                is_active: true
            });
        }
    }, [serie]);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (serie?.id) {
                // Actualizar serie existente
                const { error: serieError } = await supabase
                    .from("series")
                    .update({
                        nombre: formData.nombre_es,
                        descripcion: formData.descripcion_es,
                        orden: formData.orden,
                        is_active: formData.is_active
                    })
                    .eq("id", serie.id);

                if (serieError) throw serieError;

                // Manejar traducción al inglés
                if (formData.nombre_en || formData.descripcion_en) {
                    await supabase
                        .from("series_i18n")
                        .delete()
                        .eq("series_id", serie.id)
                        .eq("locale", "en");

                    const { error: insertError } = await supabase
                        .from("series_i18n")
                        .insert({
                            series_id: serie.id,
                            locale: "en",
                            nombre: formData.nombre_en || null,
                            descripcion: formData.descripcion_en || null
                        });

                    if (insertError) console.error("Error con traducción:", insertError);
                }
            } else {
                // Crear nueva serie
                // Generar slug desde el nombre
                const slug = formData.nombre_es
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                    .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales con guiones
                    .replace(/^-+|-+$/g, ''); // Quitar guiones al inicio y final

                const { data: newSerie, error: serieError } = await supabase
                    .from("series")
                    .insert({
                        slug: slug || 'serie-' + Date.now(), // Usar timestamp si no hay slug
                        nombre: formData.nombre_es,
                        descripcion: formData.descripcion_es,
                        orden: formData.orden,
                        is_active: formData.is_active
                    })
                    .select()
                    .single();

                if (serieError) throw serieError;

                // Crear traducción al inglés si hay contenido
                if ((formData.nombre_en || formData.descripcion_en) && newSerie) {
                    await supabase
                        .from("series_i18n")
                        .insert({
                            series_id: newSerie.id,
                            locale: "en",
                            nombre: formData.nombre_en || null,
                            descripcion: formData.descripcion_en || null
                        });
                }
            }

            await onSave();
            onClose();
        } catch (error) {
            console.error("Error guardando serie:", error);
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {serie ? "Editar Serie" : "Nueva Serie"}
                </h2>

                <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-semibold mb-3">🇪🇸 Español</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.nombre_es}
                                    onChange={(e) => setFormData({ ...formData, nombre_es: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    value={formData.descripcion_es}
                                    onChange={(e) => setFormData({ ...formData, descripcion_es: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50">
                        <h3 className="font-semibold mb-3">🇺🇸 English</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.nombre_en}
                                    onChange={(e) => setFormData({ ...formData, nombre_en: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.descripcion_en}
                                    onChange={(e) => setFormData({ ...formData, descripcion_en: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Orden</label>
                            <input
                                type="number"
                                value={formData.orden}
                                onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-md"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estado</label>
                            <select
                                value={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="true">Activa</option>
                                <option value="false">Inactiva</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !formData.nombre_es}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal para bloques
function BloqueModal({ bloque, serieId, isOpen, onClose, onSave, supabase }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre_es: "",
        nombre_en: "",
        orden: 1
    });

    useEffect(() => {
        if (bloque) {
            setFormData({
                nombre_es: bloque.nombre || "",
                nombre_en: bloque.nombre_en || "",
                orden: bloque.orden || 1
            });
        } else {
            setFormData({
                nombre_es: "",
                nombre_en: "",
                orden: 1
            });
        }
    }, [bloque]);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (bloque?.id) {
                // Actualizar bloque
                const { error } = await supabase
                    .from("bloques")
                    .update({
                        nombre: formData.nombre_es,
                        orden: formData.orden
                    })
                    .eq("id", bloque.id);

                if (error) throw error;

                // Actualizar traducción
                if (formData.nombre_en) {
                    await supabase
                        .from("bloques_i18n")
                        .delete()
                        .eq("bloque_id", bloque.id)
                        .eq("locale", "en");

                    await supabase
                        .from("bloques_i18n")
                        .insert({
                            bloque_id: bloque.id,
                            locale: "en",
                            nombre: formData.nombre_en
                        });
                }
            } else {
                // Crear nuevo bloque
                const { data: newBloque, error } = await supabase
                    .from("bloques")
                    .insert({
                        serie_id: serieId,
                        nombre: formData.nombre_es,
                        orden: formData.orden
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Crear traducción
                if (formData.nombre_en && newBloque) {
                    await supabase
                        .from("bloques_i18n")
                        .insert({
                            bloque_id: newBloque.id,
                            locale: "en",
                            nombre: formData.nombre_en
                        });
                }
            }

            await onSave();
            onClose();
        } catch (error) {
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">
                    {bloque ? "Editar Bloque" : "Nuevo Bloque"}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">🇪🇸 Nombre (Español) *</label>
                        <input
                            type="text"
                            value={formData.nombre_es}
                            onChange={(e) => setFormData({ ...formData, nombre_es: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">🇺🇸 Name (English)</label>
                        <input
                            type="text"
                            value={formData.nombre_en}
                            onChange={(e) => setFormData({ ...formData, nombre_en: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Orden</label>
                        <input
                            type="number"
                            value={formData.orden}
                            onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-md"
                            min="1"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !formData.nombre_es}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal para lecciones
function LeccionModal({ leccion, bloqueId, isOpen, onClose, onSave, supabase }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo_es: "",
        titulo_en: "",
        numero: 1,
        is_active: true,
        video_url: "",
        blog_url: "",
        estudio_url: "",
        quiz_url: "",
        contenido_md: "",
        quiz_min_score: 80 // Porcentaje mínimo para aprobar
    });

    useEffect(() => {
        if (leccion) {
            setFormData({
                titulo_es: leccion.titulo || "",
                titulo_en: leccion.titulo_en || "",
                numero: leccion.numero || 1,
                is_active: leccion.is_active ?? true,
                video_url: leccion.video_url || "",
                blog_url: leccion.blog_url || "",
                estudio_url: leccion.estudio_url || "",
                quiz_url: leccion.quiz_url || "",
                contenido_md: leccion.contenido_md || "",
                quiz_min_score: leccion.quiz_min_score || 80
            });
        } else {
            setFormData({
                titulo_es: "",
                titulo_en: "",
                numero: 1,
                is_active: true,
                video_url: "",
                blog_url: "",
                estudio_url: "",
                quiz_url: "",
                contenido_md: "",
                quiz_min_score: 80
            });
        }
    }, [leccion]);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (leccion?.id) {
                // Actualizar lección
                const { error } = await supabase
                    .from("lecciones")
                    .update({
                        titulo: formData.titulo_es,
                        numero: formData.numero,
                        is_active: formData.is_active,
                        video_url: formData.video_url || null,
                        blog_url: formData.blog_url || null,
                        estudio_url: formData.estudio_url || null,
                        quiz_url: formData.quiz_url || null,
                        contenido_md: formData.contenido_md || null,
                        quiz_min_score: formData.quiz_min_score
                    })
                    .eq("id", leccion.id);

                if (error) throw error;

                // Actualizar traducción
                if (formData.titulo_en) {
                    await supabase
                        .from("lecciones_i18n")
                        .delete()
                        .eq("leccion_id", leccion.id)
                        .eq("locale", "en");

                    await supabase
                        .from("lecciones_i18n")
                        .insert({
                            leccion_id: leccion.id,
                            locale: "en",
                            titulo: formData.titulo_en,
                            contenido_md: formData.contenido_md || null
                        });
                }
            } else {
                // Crear nueva lección
                const { data: newLeccion, error } = await supabase
                    .from("lecciones")
                    .insert({
                        bloque_id: bloqueId,
                        titulo: formData.titulo_es,
                        numero: formData.numero,
                        is_active: formData.is_active,
                        video_url: formData.video_url || null,
                        blog_url: formData.blog_url || null,
                        estudio_url: formData.estudio_url || null,
                        quiz_url: formData.quiz_url || null,
                        contenido_md: formData.contenido_md || null,
                        quiz_min_score: formData.quiz_min_score
                    })
                    .select()
                    .single();

                if (error) throw error;

                // Crear traducción
                if (formData.titulo_en && newLeccion) {
                    await supabase
                        .from("lecciones_i18n")
                        .insert({
                            leccion_id: newLeccion.id,
                            locale: "en",
                            titulo: formData.titulo_en,
                            contenido_md: formData.contenido_md || null
                        });
                }
            }

            await onSave();
            onClose();
        } catch (error) {
            alert("Error al guardar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {leccion ? "Editar Lección" : "Nueva Lección"}
                </h2>

                <div className="space-y-4">
                    {/* Títulos en ambos idiomas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">🇪🇸 Título (Español) *</label>
                            <input
                                type="text"
                                value={formData.titulo_es}
                                onChange={(e) => setFormData({ ...formData, titulo_es: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">🇺🇸 Title (English)</label>
                            <input
                                type="text"
                                value={formData.titulo_en}
                                onChange={(e) => setFormData({ ...formData, titulo_en: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>
                    </div>

                    {/* Configuración básica */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Número de lección</label>
                            <input
                                type="number"
                                value={formData.numero}
                                onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-md"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estado</label>
                            <select
                                value={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                <option value="true">Activa</option>
                                <option value="false">Inactiva</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                % Mínimo para aprobar quiz
                            </label>
                            <input
                                type="number"
                                value={formData.quiz_min_score}
                                onChange={(e) => setFormData({ ...formData, quiz_min_score: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-md"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    {/* Sección de recursos */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">📚 Recursos de la Lección</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            El discípulo tendrá acceso a estos 4 recursos. Si alguno no está disponible, se mostrará deshabilitado.
                        </p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    🎥 URL del Video (YouTube no listado)
                                </label>
                                <input
                                    type="text"
                                    value={formData.video_url}
                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Video explicativo de la lección
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    🎙️ URL del Podcast (Audio)
                                </label>
                                <input
                                    type="text"
                                    value={formData.blog_url}
                                    onChange={(e) => setFormData({ ...formData, blog_url: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="URL del podcast/audio de la lección"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Versión en audio/podcast para quienes prefieren escuchar. Opcional - se mostrará gris si no está disponible.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    📖 URL del Estudio Bíblico
                                </label>
                                <input
                                    type="text"
                                    value={formData.estudio_url}
                                    onChange={(e) => setFormData({ ...formData, estudio_url: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://sermons.church/... o URL personalizada"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Estudio escrito que pueden completar, imprimir o enviar por email
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    ✅ URL del Quiz/Cuestionario
                                </label>
                                <input
                                    type="text"
                                    value={formData.quiz_url}
                                    onChange={(e) => setFormData({ ...formData, quiz_url: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="URL del cuestionario o quiz"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Evaluación final - Requiere {formData.quiz_min_score}% para aprobar y notificar al discipulador
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notas adicionales */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            📝 Notas o contenido adicional (opcional)
                        </label>
                        <textarea
                            value={formData.contenido_md}
                            onChange={(e) => setFormData({ ...formData, contenido_md: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="3"
                            placeholder="Notas adicionales, instrucciones especiales, etc."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !formData.titulo_es}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente principal
export default function SeriesPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState("es");
    const [expandedSeries, setExpandedSeries] = useState({});
    const [expandedBloques, setExpandedBloques] = useState({});

    // Estados para modales
    const [editingSerie, setEditingSerie] = useState(null);
    const [showSerieModal, setShowSerieModal] = useState(false);
    const [editingBloque, setEditingBloque] = useState(null);
    const [showBloqueModal, setShowBloqueModal] = useState(false);
    const [selectedSerieId, setSelectedSerieId] = useState(null);
    const [editingLeccion, setEditingLeccion] = useState(null);
    const [showLeccionModal, setShowLeccionModal] = useState(false);
    const [selectedBloqueId, setSelectedBloqueId] = useState(null);

    useEffect(() => {
        fetchSeries();
    }, []);

    const fetchSeries = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("series")
                .select(`
                    id,
                    nombre,
                    descripcion,
                    orden,
                    is_active,
                    series_i18n!left (
                        locale,
                        nombre,
                        descripcion
                    ),
                    bloques (
                        id,
                        nombre,
                        orden,
                        bloques_i18n!left (
                            locale,
                            nombre
                        ),
                        lecciones (
                            id,
                            titulo,
                            numero,
                            is_active,
                            video_url,
                            contenido_md,
                            lecciones_i18n!left (
                                locale,
                                titulo
                            )
                        )
                    )
                `)
                .order("orden", { ascending: true });

            if (error) throw error;

            const processedData = data?.map(serie => {
                const enTranslation = serie.series_i18n?.find(t => t.locale === "en");
                return {
                    ...serie,
                    nombre_en: enTranslation?.nombre || "",
                    descripcion_en: enTranslation?.descripcion || "",
                    bloques: serie.bloques?.map(bloque => {
                        const bloqueEnTranslation = bloque.bloques_i18n?.find(t => t.locale === "en");
                        return {
                            ...bloque,
                            nombre_en: bloqueEnTranslation?.nombre || "",
                            lecciones: bloque.lecciones?.map(leccion => {
                                const leccionEnTranslation = leccion.lecciones_i18n?.find(t => t.locale === "en");
                                return {
                                    ...leccion,
                                    titulo_en: leccionEnTranslation?.titulo || ""
                                };
                            }).sort((a, b) => (a.numero || 0) - (b.numero || 0))
                        };
                    }).sort((a, b) => (a.orden || 0) - (b.orden || 0))
                };
            });

            setSeries(processedData || []);
        } catch (err) {
            console.error("Error cargando series:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSerie = async (serieId) => {
        if (!confirm("¿Estás seguro de eliminar esta serie y todo su contenido?")) return;
        try {
            const { error } = await supabase
                .from("series")
                .delete()
                .eq("id", serieId);
            if (error) throw error;
            fetchSeries();
        } catch (err) {
            alert("Error al eliminar: " + err.message);
        }
    };

    const handleDeleteBloque = async (bloqueId) => {
        if (!confirm("¿Estás seguro de eliminar este bloque y todas sus lecciones?")) return;
        try {
            const { error } = await supabase
                .from("bloques")
                .delete()
                .eq("id", bloqueId);
            if (error) throw error;
            fetchSeries();
        } catch (err) {
            alert("Error al eliminar: " + err.message);
        }
    };

    const handleDeleteLeccion = async (leccionId) => {
        if (!confirm("¿Estás seguro de eliminar esta lección?")) return;
        try {
            const { error } = await supabase
                .from("lecciones")
                .delete()
                .eq("id", leccionId);
            if (error) throw error;
            fetchSeries();
        } catch (err) {
            alert("Error al eliminar: " + err.message);
        }
    };

    const getDisplayName = (item, field) => {
        if (language === "en") {
            return item[`${field}_en`] || item[field] || "";
        }
        return item[field] || "";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold">Series de Estudio</h2>
                    <p className="text-gray-600">Gestiona las series, bloques y lecciones</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setLanguage("es")}
                            className={`px-3 py-1 rounded ${language === "es" ? "bg-white shadow" : ""}`}
                        >
                            🇪🇸 ES
                        </button>
                        <button
                            onClick={() => setLanguage("en")}
                            className={`px-3 py-1 rounded ${language === "en" ? "bg-white shadow" : ""}`}
                        >
                            🇺🇸 EN
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            setEditingSerie(null);
                            setShowSerieModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Serie
                    </button>
                </div>
            </div>

            {loading && <p className="text-gray-500">Cargando series...</p>}

            {!loading && series.length > 0 && (
                <div className="space-y-4">
                    {series.map((serie) => (
                        <div key={serie.id} className="border rounded-lg bg-white shadow-sm">
                            <div className="p-4 flex items-center justify-between">
                                <div
                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                    onClick={() => setExpandedSeries(prev => ({ ...prev, [serie.id]: !prev[serie.id] }))}
                                >
                                    {expandedSeries[serie.id] ?
                                        <ChevronDown className="w-5 h-5" /> :
                                        <ChevronRight className="w-5 h-5" />
                                    }
                                    <BookOpenText className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {getDisplayName(serie, "nombre")}
                                        </h3>
                                        {getDisplayName(serie, "descripcion") && (
                                            <p className="text-gray-600 text-sm">
                                                {getDisplayName(serie, "descripcion")}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {serie.bloques?.length || 0} bloques
                                            </span>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-xs text-gray-500">
                                                {serie.bloques?.reduce((total, bloque) =>
                                                    total + (bloque.lecciones?.length || 0), 0
                                                ) || 0} lecciones totales
                                            </span>
                                            {!serie.is_active && (
                                                <>
                                                    <span className="text-xs text-gray-500">•</span>
                                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                                        Inactiva
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingSerie(serie);
                                            setShowSerieModal(true);
                                        }}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSerie(serie.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {expandedSeries[serie.id] && (
                                <div className="border-t px-4 pb-4">
                                    <div className="flex justify-between items-center mt-4 mb-2">
                                        <span className="text-sm font-semibold text-gray-700">Bloques</span>
                                        <button
                                            onClick={() => {
                                                setEditingBloque(null);
                                                setSelectedSerieId(serie.id);
                                                setShowBloqueModal(true);
                                            }}
                                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Agregar Bloque
                                        </button>
                                    </div>

                                    {(!serie.bloques || serie.bloques.length === 0) ? (
                                        <p className="text-gray-500 py-4">No hay bloques en esta serie</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {serie.bloques.map((bloque) => (
                                                <div key={bloque.id} className="ml-4 border rounded p-3 bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className="flex items-center gap-2 cursor-pointer flex-1"
                                                            onClick={() => setExpandedBloques(prev => ({ ...prev, [bloque.id]: !prev[bloque.id] }))}
                                                        >
                                                            {expandedBloques[bloque.id] ?
                                                                <ChevronDown className="w-4 h-4" /> :
                                                                <ChevronRight className="w-4 h-4" />
                                                            }
                                                            <Folder className="w-4 h-4 text-green-600" />
                                                            <h4 className="font-semibold">
                                                                {getDisplayName(bloque, "nombre")}
                                                            </h4>
                                                            <span className="text-sm text-gray-500">
                                                                ({bloque.lecciones?.length || 0} lecciones)
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingBloque(bloque);
                                                                    setSelectedSerieId(serie.id);
                                                                    setShowBloqueModal(true);
                                                                }}
                                                                className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBloque(bloque.id)}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {expandedBloques[bloque.id] && (
                                                        <div className="mt-3">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-semibold text-gray-600 ml-6">Lecciones</span>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingLeccion(null);
                                                                        setSelectedBloqueId(bloque.id);
                                                                        setShowLeccionModal(true);
                                                                    }}
                                                                    className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                    Agregar Lección
                                                                </button>
                                                            </div>

                                                            {(!bloque.lecciones || bloque.lecciones.length === 0) ? (
                                                                <p className="text-xs text-gray-500 ml-6">No hay lecciones en este bloque</p>
                                                            ) : (
                                                                <div className="ml-6 space-y-1">
                                                                    {bloque.lecciones.map((leccion) => (
                                                                        <div key={leccion.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <FileText className="w-3 h-3 text-blue-500" />
                                                                                <span className="text-gray-400">
                                                                                    #{leccion.numero}
                                                                                </span>
                                                                                <span className={leccion.is_active ? "" : "text-gray-400"}>
                                                                                    {getDisplayName(leccion, "titulo")}
                                                                                </span>
                                                                                {!leccion.is_active && (
                                                                                    <span className="text-xs bg-gray-200 px-1 rounded">
                                                                                        Inactiva
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingLeccion(leccion);
                                                                                        setSelectedBloqueId(bloque.id);
                                                                                        setShowLeccionModal(true);
                                                                                    }}
                                                                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                                                >
                                                                                    <Edit className="w-3 h-3" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteLeccion(leccion.id)}
                                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                                >
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modales */}
            <EditSerieModal
                serie={editingSerie}
                isOpen={showSerieModal}
                onClose={() => {
                    setShowSerieModal(false);
                    setEditingSerie(null);
                }}
                onSave={fetchSeries}
                supabase={supabase}
            />

            <BloqueModal
                bloque={editingBloque}
                serieId={selectedSerieId}
                isOpen={showBloqueModal}
                onClose={() => {
                    setShowBloqueModal(false);
                    setEditingBloque(null);
                }}
                onSave={fetchSeries}
                supabase={supabase}
            />

            <LeccionModal
                leccion={editingLeccion}
                bloqueId={selectedBloqueId}
                isOpen={showLeccionModal}
                onClose={() => {
                    setShowLeccionModal(false);
                    setEditingLeccion(null);
                }}
                onSave={fetchSeries}
                supabase={supabase}
            />
        </div>
    );
}