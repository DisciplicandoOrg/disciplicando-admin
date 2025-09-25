"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check } from 'lucide-react';

export default function StudyRenderer({ content, language, responses, onInputChange, metadata }) {
    const [editingField, setEditingField] = useState(null);
    const inputRefs = useRef({});

    // Procesar el contenido según el formato del editor
    const processContent = (rawContent) => {
        if (!rawContent) return [];

        const sections = [];
        const lines = rawContent.split('\n');
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

            // Detectar secciones
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

            // Si estamos en el idioma correcto o no hay marcador
            if (!currentLang || currentLang === language) {
                buffer.push(line);
            }
        }

        // Agregar última sección
        if (buffer.length > 0 && currentSection) {
            currentSection.content = buffer.join('\n');
            sections.push(currentSection);
        }

        return sections;
    };

    // Renderizar campos con inputs inline
    const renderLineWithInputs = (text, sectionId) => {
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
    const renderProcessedContent = (text, sectionId) => {
        const lines = text.split('\n');
        const elements = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Headers
            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={`h3-${i}`} className="text-xl font-bold mt-8 mb-4 text-gray-900">
                        {line.replace('### ', '')}
                    </h3>
                );
            }
            // Bold text
            else if (line.includes('**')) {
                const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

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

    const sections = processContent(content);

    return (
        <div className="prose prose-lg max-w-none">
            {/* Header estructurado según tu especificación */}
            {metadata && (
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
                    {/* 1. Guía de estudio bíblico */}
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">
                        {language === 'es' ? 'Guía de Estudio Bíblico' : 'Bible Study Guide'}
                    </p>

                    {/* 2. Número de lección */}
                    <div className="text-blue-600 font-medium mb-3">
                        {language === 'es' ? 'Lección' : 'Lesson'} {metadata.numero || '2'}
                    </div>

                    {/* 3. Título del estudio */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {metadata.title}
                    </h1>

                    {/* 4. Referencia bíblica */}
                    {metadata.bibleVerse && (
                        <p className="text-lg font-bold italic text-gray-800 mb-3">
                            {metadata.bibleVerse}
                        </p>
                    )}

                    {/* 5. Texto bíblico */}
                    {metadata.bibleText && (
                        <div className="bg-blue-50 rounded-lg px-6 py-4 inline-block max-w-3xl">
                            <p className="text-gray-700 italic">
                                "{metadata.bibleText}"
                            </p>
                            {metadata.bibleVerse && (
                                <p className="text-sm text-gray-600 mt-2 text-right">
                                    — {metadata.bibleVerse}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Secciones del estudio */}
            <div className="space-y-8">
                {sections.map((section, idx) => (
                    <div key={`section-${idx}`} className="section">
                        {/* Título de sección si existe */}
                        {section.id && section.id !== '1' && (
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                {section.id}
                            </h2>
                        )}

                        {/* Contenido de la sección */}
                        {renderProcessedContent(section.content, section.id)}
                    </div>
                ))}
            </div>

            {/* Conclusión si no está en las secciones */}
            {!sections.find(s => s.id?.toLowerCase().includes('conclusión') || s.id?.toLowerCase().includes('conclusion')) && (
                <div className="mt-12 pt-6 border-t">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {language === 'es' ? 'Conclusión' : 'Conclusion'}
                    </h2>
                    <p className="text-gray-600 italic text-center">
                        {language === 'es'
                            ? 'Completa el estudio con oración y reflexión personal.'
                            : 'Complete the study with prayer and personal reflection.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}