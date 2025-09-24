"use client";

import { useState, useEffect } from 'react';
import {
    BookOpen, Save, Eye, Globe, Plus, Trash2,
    ChevronDown, ChevronRight, Copy, FileText,
    AlertCircle, Check, Loader2
} from 'lucide-react';

export default function StudyEditor({ lessonId, onClose, supabase }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lesson, setLesson] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    //    const [previewMode, setPreviewMode] = useState(false);

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
            loadLessonData();
        }
    }, [lessonId]);

    const loadLessonData = async () => {
        try {
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

            if (error) throw error;

            setLesson(data);

            // Si hay contenido existente, parsearlo
            if (data.contenido_md) {
                parseExistingContent(data.contenido_md);
            } else {
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
            console.error('Error cargando lección:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseExistingContent = (markdown) => {
        // Aquí parsearías el markdown existente para rellenar studyData
        // Por ahora usar datos de ejemplo
        console.log('Parseando contenido existente:', markdown);
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
        markdown += `id: "${studyData.metadata.id}"\n`;
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
        markdown += `\n# Introducción\n`;
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
            const markdown = generateMarkdown();

            // Guardar en Supabase
            const { error } = await supabase
                .from('lecciones')
                .update({
                    contenido_md: markdown,
                    updated_at: new Date().toISOString()
                })
                .eq('id', lessonId);

            if (error) throw error;

            // Guardar archivo en GitHub (esto requeriría una API)
            // await saveToGitHub(markdown);

            alert('Estudio guardado exitosamente');
        } catch (error) {
            console.error('Error guardando:', error);
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
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
                        onClick={() => {
                            // Primero guardar el contenido actual
                            saveStudy();
                            // Luego abrir vista previa en nueva ventana
                            setTimeout(() => {
                                window.open(`/api/study-viewer/${lessonId}`, '_blank');
                            }, 1000);
                        }}
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

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Referencia Bíblica
                            </label>
                            <input
                                type="text"
                                value={studyData.metadata.bibleVerse}
                                onChange={(e) => setStudyData({
                                    ...studyData,
                                    metadata: { ...studyData.metadata, bibleVerse: e.target.value }
                                })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Ej: 2 Timoteo 3:16-17"
                            />
                        </div>

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
                                    rows="3"
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
                                    rows="3"
                                />
                            </div>
                        </div>

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
                                                    rows="6"
                                                    placeholder="Usa [input:id:placeholder] para campos de entrada"
                                                />
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
                                                    rows="6"
                                                    placeholder="Use [input:id:placeholder] for input fields"
                                                />
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
                                                <span className="text-sm">Incluir área de texto</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={section.hasInputs}
                                                    onChange={(e) => updateSection(
                                                        section.id,
                                                        'hasInputs',
                                                        e.target.checked
                                                    )}
                                                />
                                                <span className="text-sm">Incluir campos de entrada</span>
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
        </div>
    );
}