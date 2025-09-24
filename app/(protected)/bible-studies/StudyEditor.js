"use client";

import React, { useState, useEffect } from 'react';
import {
    Save, Plus, Trash2, ChevronDown, ChevronRight,
    AlertCircle, Check, FileText, Globe, BookOpen,
    Copy, Eye, EyeOff, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function StudyEditor({ lessonId, initialData, onSave, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [originalContent, setOriginalContent] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);

    const [formData, setFormData] = useState({
        titulo: '',
        titulo_en: '',
        numero: 1,
        metadata: {
            tema: '',
            tema_en: '',
            versiculo_clave: '',
            versiculo_clave_en: '',
            objetivo: '',
            objetivo_en: '',
            duracion: '45-60 minutos'
        },
        sections: []
    });

    useEffect(() => {
        if (initialData) {
            // Guardar contenido original para comparación
            setOriginalContent(initialData.contenido_md || '');

            // Parsear el contenido existente
            const parsedData = parseExistingContent(initialData.contenido_md || '');

            setFormData({
                titulo: initialData.titulo || '',
                titulo_en: initialData.titulo_en || '',
                numero: initialData.numero || 1,
                metadata: parsedData.metadata || {
                    tema: '',
                    tema_en: '',
                    versiculo_clave: '',
                    versiculo_clave_en: '',
                    objetivo: '',
                    objetivo_en: '',
                    duracion: '45-60 minutos'
                },
                sections: parsedData.sections || []
            });
        }
    }, [initialData]);


    // FUNCIÓN CORREGIDA: Parsea TODAS las secciones correctamente
    const parseExistingContent = (content) => {
        if (!content) return { metadata: {}, sections: [] };

        console.log('=== INICIANDO PARSEO ===');
        console.log('Contenido original:', content.substring(0, 500) + '...');

        const result = {
            metadata: {},
            sections: []
        };

        try {
            // 1. Extraer metadata YAML (entre ---)
            const metadataMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (metadataMatch) {
                const yamlContent = metadataMatch[1];
                console.log('Metadata YAML encontrada:', yamlContent);

                // Parsear cada línea del YAML
                const lines = yamlContent.split('\n');
                lines.forEach(line => {
                    const colonIndex = line.indexOf(':');
                    if (colonIndex > -1) {
                        const key = line.substring(0, colonIndex).trim();
                        const value = line.substring(colonIndex + 1).trim();
                        result.metadata[key] = value;
                    }
                });
            }

            // 2. Remover metadata del contenido para procesar secciones
            const contentWithoutMetadata = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');

            // 3. Buscar TODAS las secciones (## sectionX)
            // Usar una expresión regular que capture todas las secciones
            const sectionRegex = /## (section\d+|conclusion)\s*\n([\s\S]*?)(?=## section|\## conclusion|$)/gi;
            let match;
            let sectionCount = 0;

            while ((match = sectionRegex.exec(contentWithoutMetadata)) !== null) {
                sectionCount++;
                const sectionName = match[1];
                const sectionContent = match[2].trim();

                console.log(`Procesando ${sectionName} (${sectionCount})`);

                // Extraer título y contenido bilingüe
                // Extraer título en español (no captura si empieza con [EN])
                const titleMatch = sectionContent.match(/### (?!\[EN\])(.+)/);
                const title = titleMatch ? titleMatch[1].trim() : '';

                // Extraer título en inglés
                const titleEnMatch = sectionContent.match(/### \[EN\] (.+)/);
                const title_en = titleEnMatch ? titleEnMatch[1].trim() : '';

                // Buscar contenido en español
                const esMatch = sectionContent.match(/::es\s*\n([\s\S]*?)(?=::en|$)/);
                const contentEs = esMatch ? esMatch[1].trim() : '';

                // Buscar contenido en inglés
                const enMatch = sectionContent.match(/::en\s*\n([\s\S]*?)(?=::es|$)/);
                const contentEn = enMatch ? enMatch[1].trim() : '';


                // Agregar la sección al resultado
                // Agregar la sección al resultado
                result.sections.push({
                    id: Date.now() + sectionCount, // ID único
                    title: title,
                    title_en: title_en,  // AGREGAR ESTA LÍNEA
                    content_es: contentEs,
                    content_en: contentEn,
                    order: sectionCount
                });

                console.log(`Sección ${sectionName} procesada:`, {
                    title: title.substring(0, 50),
                    esLength: contentEs.length,
                    enLength: contentEn.length
                });
            }

            // 4. Validación importante: verificar que se capturaron todas las secciones
            const totalSectionsInOriginal = (content.match(/## section/gi) || []).length;
            const hasConclusion = content.includes('## conclusion');
            const expectedSections = totalSectionsInOriginal + (hasConclusion ? 1 : 0);

            console.log(`=== RESUMEN DE PARSEO ===`);
            console.log(`Secciones esperadas: ${expectedSections}`);
            console.log(`Secciones capturadas: ${result.sections.length}`);

            if (result.sections.length < expectedSections) {
                console.error('⚠️ ADVERTENCIA: No se capturaron todas las secciones!');
                console.error(`Faltan ${expectedSections - result.sections.length} secciones`);

                // Intentar método alternativo si falló el primero
                const alternativeSections = parseAlternativeMethod(contentWithoutMetadata);
                if (alternativeSections.length > result.sections.length) {
                    console.log('Usando método alternativo de parseo');
                    result.sections = alternativeSections;
                }
            }

        } catch (error) {
            console.error('Error parseando contenido:', error);
        }

        return result;
    };



    // Método alternativo de parseo (más robusto)
    const parseAlternativeMethod = (content) => {
        const sections = [];
        const lines = content.split('\n');
        let currentSection = null;
        let currentContent = [];
        let inEs = false;
        let inEn = false;
        let sectionCounter = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Detectar nueva sección
            if (line.startsWith('## section') || line.startsWith('## conclusion')) {
                // Guardar sección anterior si existe
                if (currentSection) {
                    sections.push(currentSection);
                }

                sectionCounter++;
                currentSection = {
                    id: Date.now() + sectionCounter,
                    title: '',
                    content_es: '',
                    content_en: '',
                    order: sectionCounter
                };
                currentContent = [];
                inEs = false;
                inEn = false;
            }
            // Detectar título
            else if (line.startsWith('### ') && currentSection) {
                currentSection.title = line.replace('### ', '').trim();
            }
            // Detectar marcador de español
            else if (line.trim() === '::es') {
                inEs = true;
                inEn = false;
            }
            // Detectar marcador de inglés
            else if (line.trim() === '::en') {
                inEn = true;
                inEs = false;
            }
            // Agregar contenido a la sección actual
            else if (currentSection) {
                if (inEs) {
                    currentSection.content_es += line + '\n';
                } else if (inEn) {
                    currentSection.content_en += line + '\n';
                }
            }
        }

        // Guardar última sección
        if (currentSection) {
            sections.push(currentSection);
        }

        // Limpiar contenido
        sections.forEach(section => {
            section.content_es = section.content_es.trim();
            section.content_en = section.content_en.trim();
        });

        return sections;
    };

    const addSection = () => {
        const newSection = {
            id: Date.now(),
            title: '',
            content_es: '',
            content_en: '',
            order: formData.sections.length + 1
        };
        setFormData({ ...formData, sections: [...formData.sections, newSection] });
    };

    const removeSection = (id) => {
        if (!confirm('¿Estás seguro de eliminar esta sección?')) return;

        const updatedSections = formData.sections.filter(s => s.id !== id);
        // Reordenar
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

    // Generar contenido Markdown
    const generateMarkdown = () => {
        let markdown = '---\n';

        // Metadata
        Object.entries(formData.metadata).forEach(([key, value]) => {
            if (value) {
                markdown += `${key}: ${value}\n`;
            }
        });

        markdown += '---\n\n';

        // Secciones con títulos bilingües
        formData.sections.forEach((section, index) => {
            const sectionName = section.title?.toLowerCase().includes('conclus')
                ? 'conclusion'
                : `section${index + 1}`;

            markdown += `## ${sectionName}\n\n`;

            // Guardar ambos títulos si existen
            if (section.title) {
                markdown += `### ${section.title}\n`;
            }
            if (section.title_en) {
                markdown += `### [EN] ${section.title_en}\n`;
            }

            if (section.title || section.title_en) {
                markdown += '\n';
            }

            if (section.content_es) {
                markdown += `::es\n${section.content_es}\n\n`;
            }

            if (section.content_en) {
                markdown += `::en\n${section.content_en}\n\n`;
            }
        });

        return markdown;
    };


    // Validar antes de guardar
    const validateBeforeSave = () => {
        const errors = [];

        // Validar que hay al menos una sección
        if (formData.sections.length === 0) {
            errors.push('Debe haber al menos una sección');
        }

        // Validar que cada sección tiene contenido
        formData.sections.forEach((section, index) => {
            if (!section.title) {
                errors.push(`Sección ${index + 1}: Falta título`);
            }
            if (!section.content_es && !section.content_en) {
                errors.push(`Sección ${index + 1}: Falta contenido`);
            }
        });

        // Comparar con contenido original
        const newContent = generateMarkdown();
        const originalSectionCount = (originalContent.match(/## section/gi) || []).length;
        const newSectionCount = formData.sections.length;

        if (originalContent && newSectionCount < originalSectionCount) {
            errors.push(`⚠️ ADVERTENCIA: El contenido original tenía ${originalSectionCount} secciones, ahora solo hay ${newSectionCount}`);
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSave = async () => {
        // Validar antes de guardar
        if (!validateBeforeSave()) {
            const proceed = confirm(
                'Hay problemas de validación:\n\n' +
                validationErrors.join('\n') +
                '\n\n¿Deseas continuar de todos modos?'
            );
            if (!proceed) return;
        }

        setLoading(true);
        setSaveStatus('saving');

        try {
            const markdown = generateMarkdown();

            // Mostrar resumen antes de guardar
            const summary = `
                RESUMEN DE GUARDADO:
                - Secciones a guardar: ${formData.sections.length}
                - Caracteres totales: ${markdown.length}
                - Títulos de secciones: ${formData.sections.map(s => s.title).join(', ')}
            `;

            console.log(summary);

            if (!confirm(summary + '\n\n¿Confirmar guardado?')) {
                setLoading(false);
                setSaveStatus('');
                return;
            }

            await onSave({
                titulo: formData.titulo,
                titulo_en: formData.titulo_en,
                numero: formData.numero,
                contenido_md: markdown
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
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header con validación */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Editor de Estudio Bíblico</h2>
                        <p className="text-gray-600 mt-1">
                            Lección {formData.numero}: {formData.titulo || 'Sin título'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                                <p className="font-medium text-yellow-900">Problemas detectados:</p>
                                <ul className="mt-1 text-sm text-yellow-800">
                                    {validationErrors.map((error, index) => (
                                        <li key={index}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estado de guardado */}
                {saveStatus === 'saved' && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-800">Guardado exitosamente</span>
                    </div>
                )}
            </div>

            {/* Información básica */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Número de Lección</label>
                        <input
                            type="number"
                            value={formData.numero}
                            onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Título (Español)</label>
                        <input
                            type="text"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (English)</label>
                        <input
                            type="text"
                            value={formData.titulo_en}
                            onChange={(e) => setFormData({ ...formData, titulo_en: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Metadata del Estudio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tema (Español)</label>
                        <input
                            type="text"
                            value={formData.metadata.tema}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, tema: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Theme (English)</label>
                        <input
                            type="text"
                            value={formData.metadata.tema_en}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, tema_en: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Versículo Clave (Español)</label>
                        <input
                            type="text"
                            value={formData.metadata.versiculo_clave}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, versiculo_clave: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Key Verse (English)</label>
                        <input
                            type="text"
                            value={formData.metadata.versiculo_clave_en}
                            onChange={(e) => setFormData({
                                ...formData,
                                metadata: { ...formData.metadata, versiculo_clave_en: e.target.value }
                            })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Secciones */}
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

                {formData.sections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay secciones. Haz clic en "Agregar Sección" para comenzar.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {formData.sections.map((section, index) => (
                            <div key={section.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            Sección {index + 1}
                                        </span>
                                        {section.title && (
                                            <span className="text-gray-600">
                                                - {section.title}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeSection(section.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>


                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Título de la Sección (Español)
                                            </label>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded"
                                                placeholder="Ej: Introducción, Desarrollo..."
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
                                                placeholder="Ex: Introduction, Development..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Contenido (Español)
                                            </label>
                                            <textarea
                                                value={section.content_es}
                                                onChange={(e) => updateSection(section.id, 'content_es', e.target.value)}
                                                className="w-full px-3 py-2 border rounded"
                                                rows="8"
                                                placeholder="Contenido en español..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {section.content_es.length} caracteres
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Content (English)
                                            </label>
                                            <textarea
                                                value={section.content_en}
                                                onChange={(e) => updateSection(section.id, 'content_en', e.target.value)}
                                                className="w-full px-3 py-2 border rounded"
                                                rows="8"
                                                placeholder="Content in English..."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {section.content_en.length} characters
                                            </p>
                                        </div>
                                    </div>
                                </div>



                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Vista previa */}
            {showPreview && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Vista Previa del Markdown</h3>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                        {generateMarkdown()}
                    </pre>
                </div>
            )}
        </div>
    );
}