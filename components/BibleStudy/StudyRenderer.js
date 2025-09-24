"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check } from 'lucide-react';

export default function StudyRenderer({ content, language, responses, onInputChange, metadata }) {
    const [editingField, setEditingField] = useState(null);
    const inputRefs = useRef({});

    // Procesar el contenido markdown
    const processContent = (rawContent) => {
        if (!rawContent) {
            console.error('No content provided');
            return [];
        }

        // Asegurar que sea string y reemplazar los \n escapados con saltos de línea reales
        let contentToProcess = typeof rawContent === 'string' ? rawContent : String(rawContent);

        // Si el contenido tiene \n escapados, reemplazarlos con saltos de línea reales
        if (contentToProcess.includes('\\n')) {
            contentToProcess = contentToProcess.replace(/\\n/g, '\n');
        }

        const sections = [];
        const lines = contentToProcess.split('\n');
        let currentSection = null;
        let currentLang = null;
        let buffer = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Detectar separadores
            if (line === '---') {
                if (buffer.length > 0 && currentSection) {
                    currentSection.content = buffer.join('\n');
                    sections.push(currentSection);
                    buffer = [];
                    currentSection = null;
                }
                continue;
            }

            // Detectar inicio de sección
            if (line.startsWith('## ')) {
                if (buffer.length > 0 && currentSection) {
                    currentSection.content = buffer.join('\n');
                    sections.push(currentSection);
                    buffer = [];
                }
                currentSection = {
                    id: line.replace('## ', '').trim(),
                    type: 'section',
                    content: ''
                };
                continue;
            }

            // Detectar marcadores de idioma
            if (line.startsWith('::')) {
                currentLang = line.replace('::', '').trim();
                continue;
            }

            // Si estamos en el idioma correcto o no hay marcador de idioma
            if (!currentLang || currentLang === language) {
                buffer.push(line);
            }

            // Si encontramos otro marcador de idioma, resetear
            if (line.startsWith('::') && line !== `::${language}`) {
                currentLang = null;
            }
        }

        // Agregar última sección
        if (buffer.length > 0 && currentSection) {
            currentSection.content = buffer.join('\n');
            sections.push(currentSection);
        }

        return sections;
    };

    // Renderizar una línea con inputs inline
    const renderLineWithInputs = (text, sectionId) => {
        const parts = [];
        let lastIndex = 0;
        const regex = /\[input:([^:]+):([^\]]+)\]/g;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Agregar texto antes del input
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {text.substring(lastIndex, match.index)}
                    </span>
                );
            }

            const fieldId = `input-${match[1]}`;
            const placeholder = match[2];
            const value = responses[fieldId] || '';

            parts.push(
                <span key={fieldId} className="inline-block mx-1">
                    {editingField === fieldId ? (
                        <input
                            ref={el => inputRefs.current[fieldId] = el}
                            type="text"
                            value={value}
                            onChange={(e) => onInputChange(fieldId, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setEditingField(null);
                                }
                            }}
                            placeholder={placeholder}
                            className="px-3 py-1 border-2 border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                            autoFocus
                        />
                    ) : (
                        <button
                            onClick={() => {
                                setEditingField(fieldId);
                                setTimeout(() => {
                                    inputRefs.current[fieldId]?.focus();
                                }, 50);
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

        // Agregar texto restante
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
    const renderProcessedContent = (text, sectionId) => {
        const lines = text.split('\n');
        const elements = [];
        let currentList = [];
        let isInList = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Headers
            if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={`h4-${i}`} className="text-lg font-semibold mt-6 mb-3 text-gray-800">
                        {line.replace('#### ', '')}
                    </h4>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={`h3-${i}`} className="text-xl font-bold mt-8 mb-4 text-gray-900 border-b-2 border-gray-200 pb-2">
                        {line.replace('### ', '')}
                    </h3>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={`h2-${i}`} className="text-2xl font-bold mt-8 mb-4 text-blue-900">
                        {line.replace('## ', '')}
                    </h2>
                );
            } else if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={`h1-${i}`} className="text-3xl font-bold mt-8 mb-6 text-blue-900">
                        {line.replace('# ', '')}
                    </h1>
                );
            }
            // Bold text
            else if (line.includes('**')) {
                const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

                // Check for inputs in this line
                if (line.includes('[input:')) {
                    elements.push(
                        <p key={`p-${i}`} className="mb-4 text-gray-700 leading-relaxed">
                            {renderLineWithInputs(line.replace(/\*\*(.*?)\*\*/g, '$1'), sectionId)}
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
                        {renderLineWithInputs(line, sectionId)}
                    </p>
                );
            }
            // Textarea placeholders
            else if (line.includes('[textarea:')) {
                const match = line.match(/\[textarea:([^\]]+)\]/);
                if (match) {
                    const fieldId = `textarea-${match[1]}`;
                    const value = responses[fieldId] || '';

                    elements.push(
                        <div key={fieldId} className="my-6">
                            <textarea
                                value={value}
                                onChange={(e) => onInputChange(fieldId, e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none transition-colors hover:border-gray-300"
                                rows="5"
                                placeholder={language === 'es' ? 'Escribe tu respuesta aquí...' : 'Write your answer here...'}
                            />
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                    {value.length > 0 && `${value.length} caracteres`}
                                </span>
                                {value.length > 0 && (
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Guardado
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                }
            }
            // Prayer notes special placeholder
            else if (line.includes('[prayer-notes]')) {
                const fieldId = 'prayer-notes';
                const value = responses[fieldId] || '';

                elements.push(
                    <div key={fieldId} className="my-6 bg-blue-50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3 text-blue-900">
                            {language === 'es' ? '📝 Notas de Oración' : '📝 Prayer Notes'}
                        </h4>
                        <textarea
                            value={value}
                            onChange={(e) => onInputChange(fieldId, e.target.value)}
                            className="w-full p-4 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none bg-white"
                            rows="8"
                            placeholder={language === 'es' ? 'Escribe aquí tus peticiones, agradecimientos y reflexiones...' : 'Write your requests, thanksgiving and reflections here...'}
                        />
                    </div>
                );
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

    // Procesar y renderizar secciones
    const sections = processContent(content);

    return (
        <div className="prose prose-lg max-w-none">
            {/* Header con título, subtítulo y referencia */}
            {metadata && (
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {metadata.title?.[language] || metadata.title}
                    </h1>
                    <p className="text-xl text-gray-600 mb-3">
                        {metadata.subtitle?.[language] || metadata.subtitle}
                    </p>
                    <div className="bg-blue-50 rounded-lg px-6 py-3 inline-block mb-4">
                        <p className="text-lg text-blue-700 font-semibold">
                            {metadata.bibleVerse}
                        </p>
                        {metadata.bibleText && (
                            <p className="text-sm text-blue-600 italic mt-1">
                                "{metadata.bibleText[language] || metadata.bibleText}"
                            </p>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">
                        {language === 'es' ? 'Guía de Estudio Bíblico' : 'Bible Study Guide'}
                    </p>
                </div>
            )}

            {sections.map((section, idx) => (
                <div key={`section-${idx}`} className="mb-8">
                    {renderProcessedContent(section.content, section.id)}

                    {/* Agregar textareas automáticas después de preguntas de reflexión */}
                    {(section.content.includes('**Observación:**') ||
                        section.content.includes('**Observation:**')) &&
                        !section.content.includes('[textarea:') && (
                            <div className="my-6">
                                <textarea
                                    value={responses[`textarea-${section.id}-observation`] || ''}
                                    onChange={(e) => onInputChange(`textarea-${section.id}-observation`, e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                    rows="4"
                                    placeholder={language === 'es' ? 'Escribe tu observación...' : 'Write your observation...'}
                                />
                            </div>
                        )}

                    {(section.content.includes('**Interpretación:**') ||
                        section.content.includes('**Interpretation:**')) &&
                        !section.content.includes('[textarea:') && (
                            <div className="my-6">
                                <textarea
                                    value={responses[`textarea-${section.id}-interpretation`] || ''}
                                    onChange={(e) => onInputChange(`textarea-${section.id}-interpretation`, e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                    rows="4"
                                    placeholder={language === 'es' ? 'Escribe tu interpretación...' : 'Write your interpretation...'}
                                />
                            </div>
                        )}

                    {(section.content.includes('**Aplicación:**') ||
                        section.content.includes('**Application:**')) &&
                        !section.content.includes('[textarea:') && (
                            <div className="my-6">
                                <textarea
                                    value={responses[`textarea-${section.id}-application`] || ''}
                                    onChange={(e) => onInputChange(`textarea-${section.id}-application`, e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                                    rows="4"
                                    placeholder={language === 'es' ? 'Escribe tu aplicación personal...' : 'Write your personal application...'}
                                />
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
}