"use client";

import React, { useState, useEffect } from 'react';
import {
    Save, Plus, Trash2, Eye, EyeOff, RefreshCw,
    AlertTriangle, BookOpen, Globe, FileText, ChevronDown, ChevronRight
} from 'lucide-react';

export default function StudyEditor({ lessonId, initialData, onSave, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});

    const [formData, setFormData] = useState({
        // Título de la LECCIÓN (no del estudio)
        titulo_leccion: '',
        titulo_leccion_en: '',
        numero: 1,

        // Metadata del ESTUDIO BÍBLICO
        metadata: {
            // Título del ESTUDIO (puede ser diferente al de la lección)
            titulo_estudio: '',
            titulo_estudio_en: '',
            // Referencia bíblica
            referencia_biblica: '',
            referencia_biblica_en: '',
            // Texto bíblico (puede ser parcial)
            texto_biblico: '',
            texto_biblico_en: '',
        },

        // Secciones dinámicas
        sections: []
    });

    useEffect(() => {
        if (initialData) {
            const parsedData = parseExistingContent(initialData.contenido_md || '');

            // Asegurar que siempre haya introducción y conclusión
            let sections = parsedData.sections || [];

            // Verificar si hay introducción
            const hasIntro = sections.some(s => s.isIntroduction);
            if (!hasIntro) {
                sections.unshift({
                    id: Date.now() - 1,
                    title_es: 'INTRODUCCIÓN',
                    title_en: 'INTRODUCTION',
                    content_es: '',
                    content_en: '',
                    order: 0,
                    isIntroduction: true
                });
            }

            // Verificar si hay conclusión
            const hasConclusion = sections.some(s => s.isConclusion);
            if (!hasConclusion) {
                sections.push({
                    id: Date.now() + 999,
                    title_es: 'CONCLUSIÓN',
                    title_en: 'CONCLUSION',
                    content_es: '',
                    content_en: '',
                    order: sections.length + 1,
                    isConclusion: true
                });
            }

            // Reordenar
            sections.forEach((s, i) => s.order = i + 1);

            setFormData({
                titulo_leccion: initialData.titulo || '',
                titulo_leccion_en: initialData.titulo_en || '',
                numero: initialData.numero || 1,
                metadata: parsedData.metadata || {
                    titulo_estudio: '',
                    titulo_estudio_en: '',
                    referencia_biblica: '',
                    referencia_biblica_en: '',
                    texto_biblico: '',
                    texto_biblico_en: '',
                },
                sections: parsedData.sections || getDefaultSections()
            });

            // Expandir todas las secciones por defecto
            const expanded = {};
            parsedData.sections?.forEach((_, index) => {
                expanded[index] = true;
            });
            setExpandedSections(expanded);
        }
    }, [initialData]);



    // Secciones por defecto (4 secciones típicas)
    const getDefaultSections = () => [
        {
            id: Date.now() + 1,
            title_es: 'INTRODUCCIÓN',
            title_en: 'INTRODUCTION',
            content_es: '',
            content_en: '',
            order: 1,
            isIntroduction: true
        },
        {
            id: Date.now() + 2,
            title_es: '',
            title_en: '',
            content_es: '',
            content_en: '',
            order: 2
        },
        {
            id: Date.now() + 3,
            title_es: '',
            title_en: '',
            content_es: '',
            content_en: '',
            order: 3
        },
        {
            id: Date.now() + 4,
            title_es: '',
            title_en: '',
            content_es: '',
            content_en: '',
            order: 4
        },
        {
            id: Date.now() + 5,
            title_es: 'CONCLUSIÓN',
            title_en: 'CONCLUSION',
            content_es: '',
            content_en: '',
            order: 5,
            isConclusion: true
        }
    ];


    // Reemplaza la función parseExistingContent en StudyEditor.js con esta versión:

    const parseExistingContent = (content) => {
        if (!content) return { metadata: {}, sections: [] };

        const result = {
            metadata: {
                titulo_estudio: '',
                titulo_estudio_en: '',
                referencia_biblica: '',
                referencia_biblica_en: '',
                texto_biblico: '',
                texto_biblico_en: '',
            },
            sections: []
        };

        try {
            // 1. Extraer metadata YAML
            const metadataMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (metadataMatch) {
                const yamlContent = metadataMatch[1];
                const lines = yamlContent.split('\n');

                lines.forEach(line => {
                    const colonIndex = line.indexOf(':');
                    if (colonIndex > -1) {
                        const key = line.substring(0, colonIndex).trim();
                        let value = line.substring(colonIndex + 1).trim();
                        // Quitar comillas si existen
                        value = value.replace(/^["']|["']$/g, '');

                        // Mapear los campos correctamente
                        switch (key) {
                            case 'titulo_estudio':
                                result.metadata.titulo_estudio = value;
                                break;
                            case 'study_title':
                                result.metadata.titulo_estudio_en = value;
                                break;
                            case 'referencia_biblica':
                                result.metadata.referencia_biblica = value;
                                break;
                            case 'bible_reference':
                                result.metadata.referencia_biblica_en = value;
                                break;
                            case 'texto_biblico':
                                result.metadata.texto_biblico = value;
                                break;
                            case 'bible_text':
                                result.metadata.texto_biblico_en = value;
                                break;
                        }
                    }
                });
            }

            // 2. Procesar secciones
            const contentWithoutMetadata = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');

            // Buscar secciones
            const sections = contentWithoutMetadata.split(/^## /m).filter(s => s.trim());

            sections.forEach((sectionContent, index) => {
                const lines = sectionContent.split('\n');
                const sectionName = lines[0].trim(); // section1, section2, conclusion, etc.

                let titleEs = '';
                let titleEn = '';
                let contentEs = '';
                let contentEn = '';
                let currentLang = null;
                let contentBuffer = [];

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];

                    // Detectar título en español (sin [EN])
                    if (line.startsWith('### ') && !line.includes('[EN]')) {
                        titleEs = line.replace('### ', '').trim();
                    }
                    // Detectar título en inglés
                    else if (line.includes('### [EN] ')) {
                        titleEn = line.replace('### [EN] ', '').trim();
                    }
                    // Detectar marcador de idioma
                    else if (line.trim() === '::es') {
                        if (currentLang === 'en' && contentBuffer.length > 0) {
                            contentEn = contentBuffer.join('\n').trim();
                        }
                        currentLang = 'es';
                        contentBuffer = [];
                    }
                    else if (line.trim() === '::en') {
                        if (currentLang === 'es' && contentBuffer.length > 0) {
                            contentEs = contentBuffer.join('\n').trim();
                        }
                        currentLang = 'en';
                        contentBuffer = [];
                    }
                    // Acumular contenido
                    else if (currentLang) {
                        contentBuffer.push(line);
                    }
                }

                // Guardar último buffer
                if (currentLang && contentBuffer.length > 0) {
                    if (currentLang === 'es') contentEs = contentBuffer.join('\n').trim();
                    if (currentLang === 'en') contentEn = contentBuffer.join('\n').trim();
                }

                // Determinar tipo de sección
                const isIntroduction = titleEs.toUpperCase().includes('INTRODUCCIÓN') ||
                    titleEn.toUpperCase().includes('INTRODUCTION') ||
                    sectionName === 'section1';
                const isConclusion = titleEs.toUpperCase().includes('CONCLUSIÓN') ||
                    titleEn.toUpperCase().includes('CONCLUSION') ||
                    sectionName === 'conclusion';

                result.sections.push({
                    id: Date.now() + index,
                    title_es: titleEs,
                    title_en: titleEn,
                    content_es: contentEs,
                    content_en: contentEn,
                    order: index + 1,
                    isIntroduction,
                    isConclusion
                });
            });

        } catch (error) {
            console.error('Error parseando contenido:', error);
        }

        return result;
    };



    const addSection = () => {
        const currentSections = [...formData.sections];
        // Encontrar la posición antes de la conclusión
        const conclusionIndex = currentSections.findIndex(s => s.isConclusion);
        const insertIndex = conclusionIndex > -1 ? conclusionIndex : currentSections.length;

        const newSection = {
            id: Date.now(),
            title_es: '',
            title_en: '',
            content_es: '',
            content_en: '',
            order: insertIndex + 1,
            isIntroduction: false,
            isConclusion: false
        };

        // Insertar antes de la conclusión
        currentSections.splice(insertIndex, 0, newSection);

        // Reordenar
        currentSections.forEach((section, index) => {
            section.order = index + 1;
        });

        setFormData({ ...formData, sections: currentSections });
        setExpandedSections({ ...expandedSections, [insertIndex]: true });
    };

    const removeSection = (id) => {
        const section = formData.sections.find(s => s.id === id);
        if (section?.isIntroduction || section?.isConclusion) {
            alert('No se puede eliminar la introducción o conclusión');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar esta sección?')) return;

        const updatedSections = formData.sections.filter(s => s.id !== id);
        updatedSections.forEach((section, index) => {
            section.order = index + 1;
        });
        setFormData({ ...formData, sections: updatedSections });
    };

    const updateSection = (id, field, value) => {
        const updatedSections = formData.sections.map(section =>
            section.id === id ? { ...section, [field]: value } : section
        );
        setFormData({ ...formData, sections: updatedSections });
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const generateMarkdown = () => {
        const { metadata, sections } = formData;

        // Generar YAML header
        let markdown = '---\n';
        markdown += `titulo_leccion: "${formData.titulo_leccion || ''}"\n`;
        markdown += `lesson_title: "${formData.titulo_leccion_en || ''}"\n`;
        markdown += `numero: ${formData.numero}\n`;
        markdown += `titulo_estudio: "${metadata.titulo_estudio || ''}"\n`;
        markdown += `study_title: "${metadata.titulo_estudio_en || ''}"\n`;
        markdown += `referencia_biblica: "${metadata.referencia_biblica || ''}"\n`;
        markdown += `bible_reference: "${metadata.referencia_biblica_en || ''}"\n`;
        markdown += `texto_biblico: "${metadata.texto_biblico || ''}"\n`;
        markdown += `bible_text: "${metadata.texto_biblico_en || ''}"\n`;
        markdown += '---\n\n';

        // Generar secciones
        sections.forEach((section, index) => {
            const sectionName = section.isConclusion ? 'conclusion' : `section${index + 1}`;

            markdown += `## ${sectionName}\n\n`;

            // Títulos bilingües
            if (section.title_es) {
                markdown += `### ${section.title_es}\n`;
            }
            if (section.title_en) {
                markdown += `### [EN] ${section.title_en}\n`;
            }

            if (section.title_es || section.title_en) {
                markdown += '\n';
            }

            // Contenido en español
            if (section.content_es) {
                markdown += `::es\n${section.content_es}\n\n`;
            }

            // Contenido en inglés
            if (section.content_en) {
                markdown += `::en\n${section.content_en}\n\n`;
            }
        });

        return markdown;
    };

    const validateBeforeSave = () => {
        const errors = [];

        if (!formData.metadata.titulo_estudio && !formData.metadata.titulo_estudio_en) {
            errors.push('Debe incluir al menos el título del estudio en un idioma');
        }

        if (!formData.metadata.referencia_biblica && !formData.metadata.referencia_biblica_en) {
            errors.push('Debe incluir la referencia bíblica');
        }

        // Validar que introducción y conclusión tienen contenido
        const intro = formData.sections.find(s => s.isIntroduction);
        if (!intro?.content_es && !intro?.content_en) {
            errors.push('La introducción debe tener contenido');
        }

        const conclusion = formData.sections.find(s => s.isConclusion);
        if (!conclusion?.content_es && !conclusion?.content_en) {
            errors.push('La conclusión debe tener contenido');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSave = async () => {
        if (!validateBeforeSave()) {
            alert('Por favor corrige los errores de validación');
            return;
        }

        setLoading(true);
        setSaveStatus('saving');

        try {
            const markdown = generateMarkdown();

            await onSave({
                titulo: formData.titulo_leccion,
                titulo_en: formData.titulo_leccion_en,
                numero: formData.numero,
                contenido_md: markdown,
                // También guardar estos campos por separado si es necesario
                referencia_biblica: formData.metadata.referencia_biblica,
                texto_biblico: formData.metadata.texto_biblico
            });

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Error guardando:', error);
            setSaveStatus('error');
            alert('Error al guardar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                            Editor de Estudio Bíblico
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Lección {formData.numero}: {formData.titulo_leccion || 'Sin título'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Ocultar' : 'Vista'} Previa
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`px-4 py-2 rounded text-white flex items-center gap-2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>

                {/* Alertas de validación */}
                {validationErrors.length > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-yellow-900">Errores de validación:</p>
                                <ul className="mt-1 text-sm text-yellow-800">
                                    {validationErrors.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Información de la LECCIÓN */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Información de la Lección
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Número</label>
                        <input
                            type="number"
                            value={formData.numero}
                            onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Título de la Lección (Español)
                        </label>
                        <input
                            type="text"
                            value={formData.titulo_leccion}
                            onChange={(e) => setFormData({ ...formData, titulo_leccion: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: La Trinidad: Un Solo Dios..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Lesson Title (English)
                        </label>
                        <input
                            type="text"
                            value={formData.titulo_leccion_en}
                            onChange={(e) => setFormData({ ...formData, titulo_leccion_en: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: The Trinity: One God..."
                        />
                    </div>
                </div>
            </div>

            {/* ENCABEZADO DEL ESTUDIO BÍBLICO */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Encabezado del Estudio Bíblico
                </h3>

                {/* Títulos del Estudio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            📖 Título del Estudio (Español)
                        </label>
                        <input
                            type="text"
                            value={formData.metadata.titulo_estudio}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, titulo_estudio: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="ABRAZA LA VERDAD, VIVE EN COMUNIDAD TRINITARIA"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Este título aparecerá en el estudio (puede ser diferente al de la lección)
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            📖 Study Title (English)
                        </label>
                        <input
                            type="text"
                            value={formData.metadata.titulo_estudio_en}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, titulo_estudio_en: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="EMBRACE THE TRUTH, LIVE IN TRINITARIAN COMMUNITY"
                        />
                    </div>
                </div>

                {/* Referencias Bíblicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            📕 Referencia Bíblica (Español)
                        </label>
                        <input
                            type="text"
                            value={formData.metadata.referencia_biblica}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, referencia_biblica: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Mateo 3:16-17; 28:19"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            📕 Bible Reference (English)
                        </label>
                        <input
                            type="text"
                            value={formData.metadata.referencia_biblica_en}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, referencia_biblica_en: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Matthew 3:16-17; 28:19"
                        />
                    </div>
                </div>

                {/* Textos Bíblicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            ✝️ Texto Bíblico (Español)
                        </label>
                        <textarea
                            value={formData.metadata.texto_biblico}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, texto_biblico: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="Y Jesús, después que fue bautizado, subió luego del agua..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Puede ser una porción del texto completo si es muy largo
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            ✝️ Bible Text (English)
                        </label>
                        <textarea
                            value={formData.metadata.texto_biblico_en}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, texto_biblico_en: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="After Jesus was baptized, He went up immediately from the water..."
                        />
                    </div>
                </div>
            </div>

            {/* SECCIONES DEL ESTUDIO */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Secciones del Estudio ({formData.sections.length})
                    </h3>
                    <button
                        onClick={addSection}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar Sección
                    </button>
                </div>

                <div className="space-y-4">
                    {formData.sections.map((section, index) => (
                        <div key={section.id} className="border rounded-lg overflow-hidden">
                            <div
                                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${section.isIntroduction ? 'bg-green-50' :
                                    section.isConclusion ? 'bg-blue-50' : 'bg-white'
                                    }`}
                                onClick={() => toggleSection(index)}
                            >
                                <div className="flex items-center gap-3">
                                    {expandedSections[index] ?
                                        <ChevronDown className="w-5 h-5" /> :
                                        <ChevronRight className="w-5 h-5" />
                                    }
                                    <span className="font-medium">
                                        {section.isIntroduction ? '📝 Introducción' :
                                            section.isConclusion ? '🎯 Conclusión' :
                                                `📚 Sección ${index}`}
                                    </span>
                                    {(section.title_es || section.title_en) && (
                                        <span className="text-gray-600">
                                            - {section.title_es || section.title_en}
                                        </span>
                                    )}
                                </div>
                                {!section.isIntroduction && !section.isConclusion && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSection(section.id);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {expandedSections[index] && (
                                <div className="p-4 border-t space-y-4">
                                    {/* Títulos de la sección */}
                                    {!section.isIntroduction && !section.isConclusion && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Título de Sección (Español)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={section.title_es}
                                                    onChange={(e) => updateSection(section.id, 'title_es', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded"
                                                    placeholder="Ej: LA VOZ DEL PADRE – TU AFIRMACIÓN"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Section Title (English)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={section.title_en || ''}
                                                    onChange={(e) => updateSection(section.id, 'title_en', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded"
                                                    placeholder="Ex: THE FATHER'S VOICE – YOUR AFFIRMATION"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Contenidos bilingües */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                <Globe className="w-4 h-4 inline mr-1" />
                                                Contenido (Español)
                                            </label>
                                            <textarea
                                                value={section.content_es}
                                                onChange={(e) => updateSection(section.id, 'content_es', e.target.value)}
                                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="10"
                                                placeholder={section.isIntroduction ?
                                                    "¡Hola! Este estudio está diseñado para ayudarte..." :
                                                    section.isConclusion ?
                                                        "REFLEXIÓN FINAL: La Trinidad es el ecosistema divino..." :
                                                        "Contenido de la sección..."
                                                }
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {section.content_es.length} caracteres
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                <Globe className="w-4 h-4 inline mr-1" />
                                                Content (English)
                                            </label>
                                            <textarea
                                                value={section.content_en}
                                                onChange={(e) => updateSection(section.id, 'content_en', e.target.value)}
                                                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="10"
                                                placeholder={section.isIntroduction ?
                                                    "Hello! This study is designed to help you..." :
                                                    section.isConclusion ?
                                                        "FINAL THOUGHT: The Trinity is the divine ecosystem..." :
                                                        "Section content..."
                                                }
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {section.content_en.length} characters
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Vista previa */}
            {showPreview && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Vista Previa del Markdown</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
                        {generateMarkdown()}
                    </pre>
                </div>
            )}
        </div>
    );
}