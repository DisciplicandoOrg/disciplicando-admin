"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check } from 'lucide-react';

export default function StudyRenderer({ content, language = 'es', responses, onInputChange }) {
    const [editingField, setEditingField] = useState(null);
    const [parsedData, setParsedData] = useState({ metadata: {}, sections: [] });
    const inputRefs = useRef({});

    useEffect(() => {
        if (content) {
            const parsed = parseMarkdownContent(content);
            setParsedData(parsed);
        }
    }, [content, language]);

    // Parsear el contenido markdown
    const parseMarkdownContent = (rawContent) => {
        if (!rawContent) return { metadata: {}, sections: [] };

        const result = {
            metadata: {},
            sections: []
        };

        try {
            // 1. Extraer y parsear metadata YAML
            const metadataMatch = rawContent.match(/^---\s*\n([\s\S]*?)\n---/);
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
                        result.metadata[key] = value;
                    }
                });
            }

            // 2. Remover metadata del contenido
            const contentWithoutMetadata = rawContent.replace(/^---[\s\S]*?---\n+/, '');

            // 3. Procesar secciones
            const sectionBlocks = contentWithoutMetadata.split(/^## /m).filter(s => s.trim());

            sectionBlocks.forEach(block => {
                const lines = block.split('\n');
                const sectionId = lines[0].trim(); // section1, section2, conclusion, etc.

                let sectionTitle = '';
                let sectionContent = '';
                let currentLang = null;
                let contentBuffer = [];
                let skipNextLine = false;

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];

                    // Detectar títulos de sección
                    if (line.startsWith('### ')) {
                        if (language === 'es' && !line.includes('[EN]')) {
                            sectionTitle = line.replace('### ', '').trim();
                            skipNextLine = false;
                        } else if (language === 'en' && line.includes('[EN]')) {
                            sectionTitle = line.replace('### [EN] ', '').trim();
                            skipNextLine = false;
                        }
                        continue;
                    }

                    // Detectar marcadores de idioma
                    if (line.trim() === `::${language}`) {
                        currentLang = language;
                        contentBuffer = [];
                        continue;
                    } else if (line.trim() === '::es' || line.trim() === '::en') {
                        // Si encontramos otro idioma, guardar el buffer actual y cambiar
                        if (currentLang === language && contentBuffer.length > 0) {
                            sectionContent = contentBuffer.join('\n').trim();
                        }
                        currentLang = line.trim().replace('::', '');
                        contentBuffer = [];
                        continue;
                    }

                    // Acumular contenido solo del idioma actual
                    if (currentLang === language) {
                        contentBuffer.push(line);
                    }
                }

                // Guardar el último buffer si es del idioma correcto
                if (currentLang === language && contentBuffer.length > 0) {
                    sectionContent = contentBuffer.join('\n').trim();
                }

                if (sectionTitle || sectionContent) {
                    result.sections.push({
                        id: sectionId,
                        title: sectionTitle,
                        content: sectionContent
                    });
                }
            });

        } catch (error) {
            console.error('Error parseando contenido:', error);
        }

        return result;
    };

    // Renderizar campos con inputs inline
    const renderLineWithInputs = (text) => {
        const parts = [];
        let lastIndex = 0;
        const regex = /\[input:([^:]+):([^\]]+)\]/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {text.substring(lastIndex, match.index)}
                    </span>
                );
            }

            const fieldId = `input-${match[1]}`;
            const placeholder = match[2];
            const value = responses?.[fieldId] || '';

            parts.push(
                <span key={fieldId} className="inline-block mx-1">
                    {editingField === fieldId ? (
                        <input
                            ref={el => inputRefs.current[fieldId] = el}
                            type="text"
                            value={value}
                            onChange={(e) => onInputChange?.(fieldId, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setEditingField(null);
                            }}
                            placeholder={placeholder}
                            className="px-3 py-1 border-2 border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                            autoFocus
                        />
                    ) : (
                        <button
                            onClick={() => {
                                setEditingField(fieldId);
                                setTimeout(() => inputRefs.current[fieldId]?.focus(), 50);
                            }}
                            className="group relative px-3 py-1 border-b-2 border-dashed border-gray-400 hover:border-blue-500 transition-colors min-w-[150px] inline-flex items-center gap-1"
                        >
                            <span className={value ? "text-blue-700 font-medium" : "text-gray-400 italic"}>
                                {value || placeholder}
                            </span>
                            <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                        </button>
                    )}
                </span>
            );

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(
                <span key={`text-${lastIndex}`}>
                    {text.substring(lastIndex)}
                </span>
            );
        }

        return parts.length > 0 ? parts : text;
    };

    // Renderizar contenido procesado
    const renderProcessedContent = (text) => {
        if (!text) return null;

        const lines = text.split('\n');
        const elements = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Headers (h3)
            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={`h3-${i}`} className="text-xl font-bold mt-6 mb-3 text-gray-900">
                        {line.replace('### ', '')}
                    </h3>
                );
            }
            // Subheaders (h4)
            else if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={`h4-${i}`} className="text-lg font-semibold mt-4 mb-2 text-gray-800">
                        {line.replace('#### ', '')}
                    </h4>
                );
            }
            // Indented bullets (detectar espacios antes del •)
            else if (line.trim().startsWith('•')) {
                const indentLevel = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2; // Cada 2 espacios = 1 nivel
                const content = line.trim().substring(1).trim();

                elements.push(
                    <p key={`bullet-${i}`}
                        className={`mb-2 text-gray-700 leading-relaxed flex items-start`}
                        style={{ paddingLeft: `${indentLevel * 1.5}rem` }}>
                        <span className="mr-2">•</span>
                        <span>{renderLineWithInputs(content)}</span>
                    </p>
                );
            }
            // Bold text
            else if (line.includes('**')) {
                const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

                if (line.includes('[input:')) {
                    elements.push(
                        <p key={`p-${i}`} className="mb-4 text-gray-700 leading-relaxed">
                            {renderLineWithInputs(line.replace(/\*\*(.*?)\*\*/g, '$1'))}
                        </p>
                    );
                } else {
                    elements.push(
                        <p key={`p-${i}`} className="mb-4 text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: processedLine }} />
                    );
                }
            }
            // Lines with inputs
            else if (line.includes('[input:')) {
                elements.push(
                    <p key={`input-line-${i}`} className="mb-4 text-gray-700 leading-relaxed">
                        {renderLineWithInputs(line)}
                    </p>
                );
            }
            // Textarea placeholders
            else if (line.includes('[textarea:')) {
                const match = line.match(/\[textarea:([^\]]+)\]/);
                if (match) {
                    const fieldId = `textarea-${match[1]}`;
                    const value = responses?.[fieldId] || '';

                    elements.push(
                        <div key={fieldId} className="my-6">
                            <textarea
                                value={value}
                                onChange={(e) => onInputChange?.(fieldId, e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                rows="5"
                                placeholder={language === 'es' ? 'Escribe tu respuesta aquí...' : 'Write your answer here...'}
                            />
                        </div>
                    );
                }
            }
            // Regular paragraphs
            else if (line.trim()) {
                elements.push(
                    <p key={`p-${i}`} className="mb-4 text-gray-700 leading-relaxed">
                        {line}
                    </p>
                );
            }
        }

        return elements;
    };

    const { metadata, sections } = parsedData;

    // Obtener los textos según el idioma
    const getMetadataValue = (key) => {
        if (language === 'es') {
            return metadata[key] || metadata[`${key}_es`] || '';
        } else {
            return metadata[`${key}_en`] || metadata[`${key}_english`] || metadata[key] || '';
        }
    };

    const studyTitle = language === 'es' ? metadata.titulo_estudio : metadata.study_title;
    const bibleReference = language === 'es' ? metadata.referencia_biblica : metadata.bible_reference;
    const bibleText = language === 'es' ? metadata.texto_biblico : metadata.bible_text;

    return (
        <div className="prose prose-lg max-w-none">
            {/* Header estructurado */}
            {metadata && Object.keys(metadata).length > 0 && (
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                    {/* 1. Guía de estudio bíblico */}
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                        {language === 'es' ? 'Guía de Estudio Bíblico' : 'Bible Study Guide'}
                    </p>

                    {/* 2. Número de lección */}
                    {metadata.numero && (
                        <div className="text-blue-600 font-medium mb-3">
                            {language === 'es' ? 'Lección' : 'Lesson'} {metadata.numero}
                        </div>
                    )}

                    {/* 3. Título del estudio */}
                    {studyTitle && (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {studyTitle}
                        </h1>
                    )}

                    {/* 4. Referencia bíblica */}
                    {bibleReference && (
                        <p className="text-lg font-medium italic text-gray-800 mb-3">
                            {bibleReference}
                        </p>
                    )}

                    {/* 5. Texto bíblico */}
                    {bibleText && (
                        <div className="bg-blue-50 rounded-lg px-6 py-4 inline-block max-w-3xl">
                            <p className="text-gray-700 italic">
                                «{bibleText}»
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Secciones del estudio */}
            <div className="space-y-8">
                {sections.map((section, idx) => {
                    // Determinar si es sección de oración
                    const isPrayerSection = section.id === 'prayer' ||
                        section.title?.toUpperCase().includes('ORACIÓN') ||
                        section.title?.toUpperCase().includes('PRAYER');

                    // No mostrar título para secciones de oración
                    if (isPrayerSection) {
                        return (
                            <div key={`section-${idx}`} className="section prayer-section mt-8 p-6 bg-gray-50 rounded-lg">
                                <div className="section-content">
                                    {renderProcessedContent(section.content)}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={`section-${idx}`} className="section">
                            {/* Título de sección si existe */}
                            {section.title && (
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    {section.title}
                                </h2>
                            )}

                            {/* Contenido de la sección */}
                            <div className="section-content">
                                {renderProcessedContent(section.content)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mensaje si no hay contenido */}
            {(!sections || sections.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                    <p>No hay contenido disponible para mostrar.</p>
                </div>
            )}
        </div>
    );
}