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
                const sectionId = lines[0].trim();

                let sectionTitle = '';
                let sectionContent = '';
                let currentLang = null;
                let contentBuffer = [];

                // Manejar especialmente conclusion y prayer
                const isConclusion = sectionId === 'conclusion';
                const isPrayer = sectionId === 'prayer';

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];

                    // Para conclusión, buscar el título correcto según el idioma
                    if (isConclusion && line.startsWith('### ')) {
                        if (language === 'es' && !line.includes('[EN]')) {
                            sectionTitle = line.replace('### ', '').trim();
                        } else if (language === 'en' && line.includes('[EN]')) {
                            sectionTitle = line.replace('### [EN] ', '').trim();
                        }
                        continue;
                    }

                    // Para prayer, el título está dentro del contenido
                    if (isPrayer && line.startsWith('### ')) {
                        // Este es parte del contenido, no el título de la sección
                        if (currentLang === language) {
                            contentBuffer.push(line);
                        }
                        continue;
                    }

                    // Para otras secciones
                    if (!isConclusion && !isPrayer && line.startsWith('### ')) {
                        if (language === 'es' && !line.includes('[EN]')) {
                            sectionTitle = line.replace('### ', '').trim();
                        } else if (language === 'en' && line.includes('[EN]')) {
                            sectionTitle = line.replace('### [EN] ', '').trim();
                        }
                        continue;
                    }

                    // Detectar marcadores de idioma
                    if (line.trim() === `::${language}`) {
                        currentLang = language;
                        contentBuffer = [];
                        continue;
                    } else if (line.trim() === '::es' || line.trim() === '::en') {
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
                        content: sectionContent,
                        isConclusion,
                        isPrayer
                    });
                }
            });

        } catch (error) {
            console.error('Error parseando contenido:', error);
        }

        return result;
    };

    // Renderizar campos con inputs inline - MEJORADO
    const renderLineWithInputs = (text) => {
        const parts = [];
        let lastIndex = 0;
        const regex = /\[input:([^:]+):([^\]]+)\]/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                // Procesar el texto antes del input con formato
                const beforeText = text.substring(lastIndex, match.index);
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {processFormattedText(beforeText)}
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
            // Procesar el texto después del último input con formato
            const afterText = text.substring(lastIndex);
            parts.push(
                <span key={`text-${lastIndex}`}>
                    {processFormattedText(afterText)}
                </span>
            );
        }

        return parts.length > 0 ? parts : processFormattedText(text);
    };

    // Procesar formato de texto completo (mejorado para manejar todos los casos)
    const processFormattedText = (text) => {
        if (!text) return text;

        let processedText = text;

        // Orden importante: procesar de más específico a menos específico

        // 1. Procesar italic + bold (***texto***)
        processedText = processedText.replace(/\*\*\*(.*?)\*\*\*/g, '<em><strong>$1</strong></em>');

        // 2. Procesar solo bold (**texto**)  
        processedText = processedText.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');

        // 3. Procesar solo italic (*texto*) - mejorado para manejar casos con espacios
        processedText = processedText.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');

        // 4. Procesar subrayado (_texto_)
        processedText = processedText.replace(/_([^_]+?)_/g, '<u>$1</u>');

        // 5. Procesar tachado (~~texto~~)
        processedText = processedText.replace(/~~(.*?)~~/g, '<del>$1</del>');

        return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
    };

    // Renderizar contenido procesado
    const renderProcessedContent = (text) => {
        if (!text) return null;

        const lines = text.split('\n');
        const elements = [];
        let inPrayerSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Headers (h3) - Para títulos como "Oración:"
            if (line.startsWith('### ')) {
                if (line.includes('Oración:') || line.includes('Prayer:')) {
                    inPrayerSection = true;
                }
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
            // Bullets con diferentes caracteres y niveles de indentación
            else if (line.match(/^\s*[•·▪▫◦‣⁃-]\s/)) {
                const leadingSpaces = line.match(/^(\s*)/)?.[1]?.length || 0;
                const indentLevel = Math.floor(leadingSpaces / 2);
                const bulletMatch = line.match(/^\s*([•·▪▫◦‣⁃-])\s(.*)$/);

                if (bulletMatch) {
                    const bullet = bulletMatch[1];
                    const content = bulletMatch[2];

                    // Determinar el estilo del bullet según el nivel
                    let bulletStyle = '•';
                    if (indentLevel === 1) bulletStyle = '◦';
                    if (indentLevel >= 2) bulletStyle = '▪';

                    elements.push(
                        <p key={`bullet-${i}`}
                            className={`mb-2 text-gray-700 leading-relaxed flex items-start`}
                            style={{ paddingLeft: `${indentLevel * 1.5}rem` }}>
                            <span className="mr-2">{bulletStyle}</span>
                            <span>
                                {renderLineWithInputs(content)}
                            </span>
                        </p>
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
            // Textarea placeholders - MEJORADO con placeholder personalizado
            else if (line.includes('[textarea:')) {
                const match = line.match(/\[textarea:([^\]]+)\]/);
                if (match) {
                    const fieldId = `textarea-${match[1]}`;
                    const fieldName = match[1];
                    const value = responses?.[fieldId] || '';

                    // Placeholder personalizado para oración
                    let placeholder = language === 'es' ? 'Escribe tu respuesta aquí...' : 'Write your answer here...';

                    if (inPrayerSection || fieldName.toLowerCase().includes('prayer') || fieldName.toLowerCase().includes('oracion')) {
                        placeholder = language === 'es'
                            ? 'Escribe tus peticiones, respuestas, preguntas, y lo que quieras decirle al Señor en oración...'
                            : 'Write your requests, responses, questions, and whatever you want to tell the Lord in prayer...';
                    }

                    elements.push(
                        <div key={fieldId} className="my-6">
                            <textarea
                                value={value}
                                onChange={(e) => onInputChange?.(fieldId, e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                rows="5"
                                placeholder={placeholder}
                            />
                        </div>
                    );
                }
            }
            // Regular paragraphs con formato
            else if (line.trim()) {
                elements.push(
                    <p key={`p-${i}`} className="mb-4 text-gray-700 leading-relaxed">
                        {processFormattedText(line)}
                    </p>
                );
            }
        }

        return elements;
    };

    const { metadata, sections } = parsedData;

    // Obtener los textos según el idioma
    const studyTitle = language === 'es' ? metadata.titulo_estudio : metadata.study_title;
    const bibleReference = language === 'es' ? metadata.referencia_biblica : metadata.bible_reference;
    const bibleText = language === 'es' ? metadata.texto_biblico : metadata.bible_text;

    return (
        <div className="prose prose-lg max-w-none">
            {/* Header estructurado */}
            {metadata && Object.keys(metadata).length > 0 && (
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                        {language === 'es' ? 'Guía de Estudio Bíblico' : 'Bible Study Guide'}
                    </p>

                    {metadata.numero && (
                        <div className="text-blue-600 font-medium mb-3">
                            {language === 'es' ? 'Lección' : 'Lesson'} {metadata.numero}
                        </div>
                    )}

                    {studyTitle && (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            {studyTitle}
                        </h1>
                    )}

                    {bibleReference && (
                        <p className="text-lg font-medium italic text-gray-800 mb-3">
                            {bibleReference}
                        </p>
                    )}

                    {bibleText && (
                        <div className="bg-blue-50 rounded-lg px-6 py-4 inline-block max-w-3xl">
                            <p className="text-gray-700 italic">
                                {processFormattedText(bibleText)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Secciones del estudio */}
            <div className="space-y-8">
                {sections.map((section, idx) => {
                    // Para secciones de oración (sin título de sección, solo contenido)
                    if (section.isPrayer) {
                        return (
                            <div key={`section-${idx}`} className="section prayer-section mt-8 p-6 bg-gray-50 rounded-lg">
                                <div className="section-content">
                                    {renderProcessedContent(section.content)}
                                </div>
                            </div>
                        );
                    }

                    // Para conclusión - FIX aquí
                    if (section.isConclusion) {
                        const conclusionTitle = language === 'es' ? 'CONCLUSIÓN' : 'CONCLUSION';
                        return (
                            <div key={`section-${idx}`} className="section conclusion-section">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    {section.title || conclusionTitle}
                                </h2>
                                <div className="section-content">
                                    {renderProcessedContent(section.content)}
                                </div>
                            </div>
                        );
                    }

                    // Para otras secciones normales
                    return (
                        <div key={`section-${idx}`} className="section">
                            {section.title && (
                                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    {section.title}
                                </h2>
                            )}
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