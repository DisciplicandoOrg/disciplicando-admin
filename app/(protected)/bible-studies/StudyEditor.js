"use client";

import { useState, useEffect } from 'react';
import {
    BookOpen, Save, Eye, Globe, Plus, Trash2,
    ChevronDown, ChevronRight, Copy, FileText,
    AlertCircle, Check, Loader2, Bold, Italic, List,
    Quote, Heading, Link2
} from 'lucide-react';

export default function StudyEditor({ lessonId, onClose, supabase }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lesson, setLesson] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [showPreview, setShowPreview] = useState(false);

    // Estado del contenido del estudio
    const [studyData, setStudyData] = useState({
        metadata: {
            id: '',
            seriesId: 1,
            lessonNumber: 1,
            title: { es: '', en: '' },
            subtitle: { es: '', en: '' },
            introduction: { es: '', en: '' },
            bibleVerse: '',
            bibleText: { es: '', en: '' },
            estimatedTime: 45,
            difficulty: 'beginner',
            tags: []
        },
        sections: []
    });

    // Plantilla de sección nueva
    const newSectionTemplate = {
        id: `section-${Date.now()}`,
        type: 'content',
        title: { es: '', en: '' },
        content: { es: '', en: '' },
        hasTextarea: false,
        hasInputs: false
    };

    useEffect(() => {
        if (lessonId) {
            console.log("Cargando lección con ID:", lessonId);
            loadLessonData();
        }
    }, [lessonId]);

    const loadLessonData = async () => {
        setLoading(true);
        try {
            console.log("Iniciando carga de lección:", lessonId);

            // Cargar datos de la lección desde Supabase
            const { data, error } = await supabase
                .from('lecciones')
                .select(`
                    *,
                    lecciones_i18n!left (
                        locale,
                        titulo,
                        contenido_md
                    ),
                    bloques (
                        *,
                        series (*)
                    )
                `)
                .eq('id', lessonId)
                .single();

            // AGREGAR ESTE DEBUG
            console.log("=== DEBUG COMPLETO ===");
            console.log("Datos cargados:", data);
            console.log("Contenido MD existe?", data?.contenido_md ? "SÍ" : "NO");
            console.log("Longitud del contenido:", data?.contenido_md?.length);
            console.log("Primeros 200 caracteres:", data?.contenido_md?.substring(0, 200));

            if (error) {
                console.error("Error al cargar:", error);
                throw error;
            }

            console.log("Datos cargados de la BD:", data);
            setLesson(data);

            // Verificar si hay contenido real y parsearlo
            if (data?.contenido_md &&
                data.contenido_md !== "Contenido en preparación..." &&
                data.contenido_md.length > 30) {
                console.log("Intentando parsear...");
                parseExistingContent(data.contenido_md);
            } else {
                console.log("No hay contenido para parsear, iniciando vacio");
                // Crear estructura inicial
                setStudyData({
                    ...studyData,
                    metadata: {
                        ...studyData.metadata,
                        id: data.numero?.toString() || '1',
                        lessonNumber: data.numero || 1,
                        title: {
                            es: data.titulo || '',
                            en: data.lecciones_i18n?.find(i => i.locale === 'en')?.titulo || ''
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error total:', error);
            alert('Error al cargar la lección: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const parseExistingContent = (markdown) => {
        if (!markdown) return;

        try {
            // Crear backup local antes de parsear
            localStorage.setItem(`backup_lesson_${lesson?.id}_${Date.now()}`, markdown);

            const newStudyData = { /* ... estructura inicial ... */ };

            // Split principal por ---
            const parts = markdown.split('---');

            // IMPORTANTE: Unir TODAS las partes después del metadata
            // No solo parts[2], sino parts.slice(2).join('---')
            const allSectionsContent = parts.slice(2).join('---');

            // Buscar TODAS las secciones, no importa si son 4, 5 o más
            const sectionMatches = allSectionsContent.matchAll(
                /## section(\d+)(.*?)(?=## section|\Z)/gs
            );

            for (const match of sectionMatches) {
                // Parsear cada sección encontrada
            }

            // Solo actualizar si encontramos al menos 1 sección
            if (newStudyData.sections.length > 0) {
                setStudyData(newStudyData);
            } else {
                alert('⚠️ No se pudieron cargar todas las secciones. Verifique el formato.');
            }
        } catch (error) {
            console.error('Error parseando:', error);
        }
    };



    // Función para insertar formato markdown
    const insertMarkdownFormat = (fieldPath, format) => {
        // Esta función ayuda a insertar formato markdown
        const formats = {
            bold: '**texto**',
            italic: '*texto*',
            bolditalic: '***texto***',
            list: '\n- Punto 1\n- Punto 2\n- Punto 3',
            numberedList: '\n1. Primero\n2. Segundo\n3. Tercero',
            quote: '\n> Cita o texto destacado',
            heading: '\n### Subtítulo',
            link: '[texto del enlace](https://url.com)'
        };

        alert(`Para ${format}, usa: ${formats[format]}`);
    };

    // Función para renderizar preview de markdown
    const renderMarkdownPreview = (markdown) => {
        let html = markdown;

        // Convertir markdown a HTML básico
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-3">$1</h3>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>');
        html = html.replace(/\n/g, '<br>');

        return html;
    };

    const addSection = () => {
        setStudyData({
            ...studyData,
            sections: [...studyData.sections, { ...newSectionTemplate, id: `section-${Date.now()}` }]
        });
    };

    const updateSection = (sectionId, field, value) => {
        setStudyData({
            ...studyData,
            sections: studyData.sections.map(s =>
                s.id === sectionId ? { ...s, [field]: value } : s
            )
        });
    };

    const deleteSection = (sectionId) => {
        if (confirm('¿Eliminar esta sección?')) {
            setStudyData({
                ...studyData,
                sections: studyData.sections.filter(s => s.id !== sectionId)
            });
        }
    };

    const generateMarkdown = () => {
        let markdown = '---\n';

        // Metadata
        markdown += `# Identificadores\n`;
        markdown += `id: "${studyData.metadata.id || studyData.metadata.lessonNumber}"\n`;
        markdown += `seriesId: ${studyData.metadata.seriesId}\n`;
        markdown += `lessonNumber: ${studyData.metadata.lessonNumber}\n\n`;

        // Títulos
        markdown += `title:\n`;
        markdown += `  es: "${studyData.metadata.title.es}"\n`;
        markdown += `  en: "${studyData.metadata.title.en}"\n\n`;

        markdown += `subtitle:\n`;
        markdown += `  es: "${studyData.metadata.subtitle.es}"\n`;
        markdown += `  en: "${studyData.metadata.subtitle.en}"\n\n`;

        // Referencias bíblicas
        markdown += `bibleVerse: "${studyData.metadata.bibleVerse}"\n`;
        markdown += `bibleText:\n`;
        markdown += `  es: "${studyData.metadata.bibleText.es}"\n`;
        markdown += `  en: "${studyData.metadata.bibleText.en}"\n\n`;

        // Introducción
        markdown += `# Introducción\n`;
        markdown += `introduction:\n`;
        markdown += `  es: "${studyData.metadata.introduction.es}"\n`;
        markdown += `  en: "${studyData.metadata.introduction.en}"\n\n`;

        // Metadatos
        markdown += `estimatedTime: ${studyData.metadata.estimatedTime}\n`;
        markdown += `difficulty: "${studyData.metadata.difficulty}"\n`;
        markdown += `tags: [${studyData.metadata.tags.map(t => `"${t}"`).join(', ')}]\n`;
        markdown += `---\n\n`;

        // Secciones
        studyData.sections.forEach((section, idx) => {
            markdown += `## section${idx + 1}\n\n`;

            // Contenido en español
            markdown += `::es\n`;
            markdown += `### ${section.title.es}\n\n`;
            markdown += section.content.es + '\n';

            if (section.hasTextarea) {
                markdown += `\n[textarea:section${idx + 1}]\n`;
            }
            markdown += `::\n\n`;

            // Contenido en inglés
            markdown += `::en\n`;
            markdown += `### ${section.title.en}\n\n`;
            markdown += section.content.en + '\n';

            if (section.hasTextarea) {
                markdown += `\n[textarea:section${idx + 1}]\n`;
            }
            markdown += `::\n\n`;

            markdown += `---\n\n`;
        });

        return markdown;
    };

    const saveStudy = async () => {
        setSaving(true);
        try {

            // BACKUP: Guardar copia del contenido actual antes de sobrescribir
            const { data: currentData } = await supabase
                .from('lecciones')
                .select('contenido_md')
                .eq('id', lessonId)
                .single();

            if (currentData?.contenido_md) {
                console.log('BACKUP del contenido anterior:', currentData.contenido_md);
                // Opcionalmente, guardar en localStorage como respaldo
                localStorage.setItem(`backup_lesson_${lessonId}`, currentData.contenido_md);
            }

            const markdown = generateMarkdown();

            console.log("Guardando markdown:", markdown);
            console.log("En lección ID:", lessonId);

            // Guardar en Supabase
            const { data, error } = await supabase
                .from('lecciones')
                .update({
                    contenido_md: markdown,
                    updated_at: new Date().toISOString()
                })
                .eq('id', lessonId)
                .select()
                .single();

            if (error) {
                console.error("Error al guardar:", error);
                throw error;
            }

            console.log("Guardado exitoso:", data);
            alert('Estudio guardado exitosamente');

        } catch (error) {
            console.error('Error guardando:', error);
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePreview = () => {
        setShowPreview(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <div>
                        <h2 className="text-xl font-bold">Editor de Estudio Bíblico</h2>
                        <p className="text-sm text-gray-600">
                            Lección {lesson?.numero}: {lesson?.titulo}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePreview}
                        className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
                    >
                        <Eye className="w-4 h-4" />
                        Vista Previa
                    </button>

                    <button
                        onClick={saveStudy}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Guardar
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('metadata')}
                    className={`px-4 py-2 font-medium ${activeTab === 'metadata'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Información General
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 font-medium ${activeTab === 'content'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Contenido
                </button>
                <button
                    onClick={() => setActiveTab('markdown')}
                    className={`px-4 py-2 font-medium ${activeTab === 'markdown'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Markdown
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'metadata' && (
                    <div className="space-y-6">
                        {/* TÍTULOS */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Título (Español)
                                </label>
                                <input
                                    type="text"
                                    value={studyData.metadata.title.es}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            title: { ...studyData.metadata.title, es: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Title (English)
                                </label>
                                <input
                                    type="text"
                                    value={studyData.metadata.title.en}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            title: { ...studyData.metadata.title, en: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* SUBTÍTULOS - NUEVO */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subtítulo (Español)
                                </label>
                                <input
                                    type="text"
                                    value={studyData.metadata.subtitle.es}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            subtitle: { ...studyData.metadata.subtitle, es: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Ej: Fundamento de nuestra fe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Subtitle (English)
                                </label>
                                <input
                                    type="text"
                                    value={studyData.metadata.subtitle.en}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            subtitle: { ...studyData.metadata.subtitle, en: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Ex: Foundation of our faith"
                                />
                            </div>
                        </div>

                        {/* REFERENCIA BÍBLICA */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Referencia Bíblica / Bible Reference
                            </label>
                            <input
                                type="text"
                                value={studyData.metadata.bibleVerse}
                                onChange={(e) => setStudyData({
                                    ...studyData,
                                    metadata: { ...studyData.metadata, bibleVerse: e.target.value }
                                })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Ej: 2 Timoteo 3:16-17 / 2 Timothy 3:16-17"
                            />
                        </div>

                        {/* TEXTO BÍBLICO EN AMBOS IDIOMAS */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Texto Bíblico (Español)
                                </label>
                                <textarea
                                    value={studyData.metadata.bibleText.es}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            bibleText: { ...studyData.metadata.bibleText, es: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="4"
                                    placeholder="Pega aquí el versículo completo en español"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Bible Text (English)
                                </label>
                                <textarea
                                    value={studyData.metadata.bibleText.en}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            bibleText: { ...studyData.metadata.bibleText, en: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="4"
                                    placeholder="Paste here the complete verse in English"
                                />
                            </div>
                        </div>

                        {/* INTRODUCCIÓN */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Introducción (Español)
                                </label>
                                <textarea
                                    value={studyData.metadata.introduction.es}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            introduction: { ...studyData.metadata.introduction, es: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="4"
                                    placeholder="Ej: ¡Bienvenido a este tiempo de estudio personal! El objetivo de esta guía..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Introduction (English)
                                </label>
                                <textarea
                                    value={studyData.metadata.introduction.en}
                                    onChange={(e) => setStudyData({
                                        ...studyData,
                                        metadata: {
                                            ...studyData.metadata,
                                            introduction: { ...studyData.metadata.introduction, en: e.target.value }
                                        }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="4"
                                    placeholder="Ex: Welcome to this time of personal study! The goal of this guide..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        {/* Barra de herramientas de formato */}
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-2">Herramientas de Formato Markdown:</p>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => insertMarkdownFormat('', 'bold')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50 flex items-center gap-1"
                                    title="Texto en negrita: **texto**"
                                >
                                    <Bold className="w-4 h-4" /> Bold
                                </button>
                                <button
                                    onClick={() => insertMarkdownFormat('', 'italic')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50 flex items-center gap-1"
                                    title="Texto en cursiva: *texto*"
                                >
                                    <Italic className="w-4 h-4" /> Italic
                                </button>
                                <button
                                    onClick={() => insertMarkdownFormat('', 'bolditalic')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50"
                                    title="Negrita y cursiva: ***texto***"
                                >
                                    <strong><em>B+I</em></strong>
                                </button>
                                <button
                                    onClick={() => insertMarkdownFormat('', 'list')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50 flex items-center gap-1"
                                    title="Lista: - item"
                                >
                                    <List className="w-4 h-4" /> Lista
                                </button>
                                <button
                                    onClick={() => insertMarkdownFormat('', 'quote')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50 flex items-center gap-1"
                                    title="Cita: > texto"
                                >
                                    <Quote className="w-4 h-4" /> Cita
                                </button>
                                <button
                                    onClick={() => insertMarkdownFormat('', 'heading')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50 flex items-center gap-1"
                                    title="Subtítulo: ### texto"
                                >
                                    <Heading className="w-4 h-4" /> Subtítulo
                                </button>
                                <button
                                    onClick={() => insertMarkdownFormat('', 'link')}
                                    className="px-3 py-1 bg-white rounded hover:bg-gray-50 flex items-center gap-1"
                                    title="Enlace: [texto](url)"
                                >
                                    <Link2 className="w-4 h-4" /> Enlace
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Secciones del Estudio</h3>
                            <button
                                onClick={addSection}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Sección
                            </button>
                        </div>

                        {studyData.sections.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No hay secciones todavía</p>
                                <button
                                    onClick={addSection}
                                    className="mt-3 text-blue-600 hover:text-blue-700"
                                >
                                    Agregar primera sección
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {studyData.sections.map((section, idx) => (
                                    <div key={section.id} className="border rounded-lg p-4 bg-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-medium">Sección {idx + 1}</h4>
                                            <button
                                                onClick={() => deleteSection(section.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Título (Español)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={section.title.es}
                                                    onChange={(e) => updateSection(
                                                        section.id,
                                                        'title',
                                                        { ...section.title, es: e.target.value }
                                                    )}
                                                    className="w-full px-3 py-2 border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Title (English)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={section.title.en}
                                                    onChange={(e) => updateSection(
                                                        section.id,
                                                        'title',
                                                        { ...section.title, en: e.target.value }
                                                    )}
                                                    className="w-full px-3 py-2 border rounded"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Contenido (Español)
                                                </label>
                                                <textarea
                                                    value={section.content.es}
                                                    onChange={(e) => updateSection(
                                                        section.id,
                                                        'content',
                                                        { ...section.content, es: e.target.value }
                                                    )}
                                                    className="w-full px-3 py-2 border rounded"
                                                    rows="8"
                                                    placeholder="Usa markdown: **negrita**, *cursiva*, ***ambos***, - listas, > citas"
                                                />
                                                {/* Mini preview */}
                                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                    <div dangerouslySetInnerHTML={{
                                                        __html: renderMarkdownPreview(section.content.es)
                                                    }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Content (English)
                                                </label>
                                                <textarea
                                                    value={section.content.en}
                                                    onChange={(e) => updateSection(
                                                        section.id,
                                                        'content',
                                                        { ...section.content, en: e.target.value }
                                                    )}
                                                    className="w-full px-3 py-2 border rounded"
                                                    rows="8"
                                                    placeholder="Use markdown: **bold**, *italic*, ***both***, - lists, > quotes"
                                                />
                                                {/* Mini preview */}
                                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                    <div dangerouslySetInnerHTML={{
                                                        __html: renderMarkdownPreview(section.content.en)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={section.hasTextarea}
                                                    onChange={(e) => updateSection(
                                                        section.id,
                                                        'hasTextarea',
                                                        e.target.checked
                                                    )}
                                                />
                                                <span className="text-sm">Incluir área de texto para respuesta</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'markdown' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Vista Markdown</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(generateMarkdown());
                                    alert('Copiado al portapapeles');
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                <Copy className="w-4 h-4" />
                                Copiar
                            </button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                            <code>{generateMarkdown()}</code>
                        </pre>
                    </div>
                )}
            </div>

            {/* Modal de Vista Previa */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Vista Previa del Estudio</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                            <div className="prose max-w-none">
                                <h1>{studyData.metadata.title.es}</h1>
                                <h2 className="text-gray-600">{studyData.metadata.subtitle.es}</h2>
                                <p><strong>Referencia:</strong> {studyData.metadata.bibleVerse}</p>
                                <blockquote className="border-l-4 border-blue-500 pl-4">
                                    {studyData.metadata.bibleText.es}
                                </blockquote>
                                <div className="mt-4">
                                    <h3>Introducción</h3>
                                    <p>{studyData.metadata.introduction.es}</p>
                                </div>
                                {studyData.sections.map((section, idx) => (
                                    <div key={section.id} className="mt-6">
                                        <h3>{idx + 1}. {section.title.es}</h3>
                                        <div dangerouslySetInnerHTML={{
                                            __html: renderMarkdownPreview(section.content.es)
                                        }} />
                                        {section.hasTextarea && (
                                            <textarea
                                                className="w-full mt-3 p-3 border rounded"
                                                rows="4"
                                                placeholder="Escribe tu respuesta aquí..."
                                                disabled
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}