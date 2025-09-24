"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    Download, Mail, Printer, Globe,
    CheckCircle, BookOpen, Home, ChevronLeft
} from 'lucide-react';
import StudyRenderer from '@/components/BibleStudy/StudyRenderer';

export default function BibleStudyViewer() {
    const params = useParams();
    const searchParams = useSearchParams();

    // Detectar idioma desde URL o por defecto español
    const [language, setLanguage] = useState(searchParams.get('lang') || 'es');
    const [studyData, setStudyData] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        loadStudy();
        loadSavedResponses();
    }, [params.id]);

    useEffect(() => {
        // Actualizar idioma si cambia en la URL
        const langParam = searchParams.get('lang');
        if (langParam && langParam !== language) {
            setLanguage(langParam);
        }
    }, [searchParams]);

    const loadStudy = async () => {
        try {
            const response = await fetch(`/api/bible-study/${params.id}`);
            const data = await response.json();

            console.log('Datos recibidos del API:', data); // Debug
            console.log('Tipo de content:', typeof data.content); // Debug adicional
            console.log('Estructura de metadata:', data.metadata); // Debug metadata

            setStudyData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading study:', error);
            setLoading(false);
        }
    };

    const loadSavedResponses = () => {
        const saved = localStorage.getItem(`bible-study-${params.id}`);
        if (saved) {
            const data = JSON.parse(saved);
            setResponses(data);
            calculateProgress(data);
        }
    };

    const calculateProgress = (data) => {
        const totalFields = Object.keys(data).filter(k => k.startsWith('input-') || k.startsWith('textarea-')).length;
        const filledFields = Object.values(data).filter(v => v && v.trim() !== '').length;
        if (totalFields > 0) {
            setProgress(Math.round((filledFields / totalFields) * 100));
        }
    };

    const handleInputChange = (fieldId, value) => {
        const newResponses = {
            ...responses,
            [fieldId]: value,
            lastUpdated: new Date().toISOString()
        };
        setResponses(newResponses);
        localStorage.setItem(`bible-study-${params.id}`, JSON.stringify(newResponses));
        calculateProgress(newResponses);

        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    const handlePrint = () => {
        window.print();
    };

    const generatePDF = async () => {
        // Implementaremos esto en el siguiente paso
        alert(language === 'es' ? 'Generando PDF...' : 'Generating PDF...');
    };

    const sendByEmail = () => {
        const subject = studyData?.metadata?.title[language] || 'Bible Study';
        const body = encodeURIComponent(
            `${language === 'es' ? 'Mis respuestas del estudio bíblico' : 'My Bible study answers'}:\n\n` +
            JSON.stringify(responses, null, 2)
        );
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                        {language === 'es' ? 'Cargando estudio bíblico...' : 'Loading Bible study...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!studyData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <p className="text-xl text-red-600">
                        Error al cargar el estudio
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header Fijo */}
            <header className="sticky top-0 bg-white shadow-md z-20 print:hidden">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        {/* Logo y Título */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={language === 'es' ? 'Regresar' : 'Go back'}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                                <div className="hidden md:block">
                                    <h1 className="text-lg font-bold text-gray-900">
                                        {studyData?.metadata?.title?.[language]}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {studyData?.metadata?.bibleVerse}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex items-center gap-3">
                            {/* Progreso */}
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="text-sm text-gray-600">
                                    {language === 'es' ? 'Progreso' : 'Progress'}:
                                </div>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700">{progress}%</span>
                            </div>

                            {/* Cambiar idioma */}
                            <button
                                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                                className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                title={language === 'es' ? 'Change to English' : 'Cambiar a Español'}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="font-medium">{language.toUpperCase()}</span>
                            </button>

                            {/* Acciones */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={generatePDF}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    title="PDF"
                                >
                                    <Download className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={sendByEmail}
                                    className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                    title="Email"
                                >
                                    <Mail className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={handlePrint}
                                    className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                    title={language === 'es' ? 'Imprimir' : 'Print'}
                                >
                                    <Printer className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Indicador de guardado */}
                    {saving && (
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full shadow-lg">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {language === 'es' ? 'Guardado automáticamente' : 'Auto-saved'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none">
                    {/* Contenido del Estudio */}
                    <StudyRenderer
                        content={studyData?.content || ''}
                        metadata={studyData?.metadata}
                        language={language}
                        responses={responses}
                        onInputChange={handleInputChange}
                    />

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t text-center text-gray-500 print:hidden">
                        <p className="text-sm">
                            {language === 'es'
                                ? '© 2024 Disciplicando - Transformando vidas a través de la Palabra'
                                : '© 2024 Disciplicando - Transforming lives through the Word'
                            }
                        </p>
                    </div>
                </div>
            </main>

            {/* Estilos para impresión */}
            <style jsx global>{`
            @media print {
                @page {
                    size: letter;
                    margin: 0.5in;
                }
                
                body {
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                }
                
                .print\\:hidden {
                    display: none !important;
                }
                
                main {
                    max-width: 100% !important;
                }
            }
        `}</style>
        </div>
    );
}