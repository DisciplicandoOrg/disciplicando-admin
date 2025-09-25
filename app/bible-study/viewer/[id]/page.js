"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    Download, Mail, Printer, Globe,
    CheckCircle, BookOpen, ChevronLeft, FileText
} from 'lucide-react';
import StudyRenderer from '@/components/BibleStudy/StudyRenderer';
import {
    getBibleStudyContent,
    saveBibleStudyProgress,
    getUserStudyProgress,
    getManualPdfUrl
} from '@/lib/bibleStudies';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import html2pdf from 'html2pdf.js';

export default function BibleStudyViewer() {
    const params = useParams();
    const searchParams = useSearchParams();
    const supabase = createSupabaseBrowserClient();

    // Estados
    const [language, setLanguage] = useState(searchParams.get('lang') || 'es');
    const [studyData, setStudyData] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const [user, setUser] = useState(null);
    const [manualPdfUrl, setManualPdfUrl] = useState(null);

    // Cargar usuario
    useEffect(() => {
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // Si el usuario tiene idioma preferido, usarlo
            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('preferred_language')
                    .eq('uuid', user.id)
                    .single();

                if (profile?.preferred_language && !searchParams.get('lang')) {
                    setLanguage(profile.preferred_language);
                }
            }
        };

        loadUser();
    }, []);

    // Cargar estudio
    useEffect(() => {
        if (params.id) {
            loadStudy();
        }
    }, [params.id, user]);

    // Actualizar idioma desde URL
    useEffect(() => {
        const langParam = searchParams.get('lang');
        if (langParam && langParam !== language) {
            setLanguage(langParam);
        }
    }, [searchParams]);

    const loadStudy = async () => {
        setLoading(true);
        try {
            // Cargar desde Supabase
            const studyResult = await getBibleStudyContent(params.id);

            // Agregar este console.log para ver qué datos llegan
            console.log('Datos del estudio:', studyResult.data);

            if (!studyResult.success) {
                console.error('Error:', studyResult.error);
                setLoading(false);
                return;
            }

            // Extraer metadata del contenido si existe
            let extractedTitle = studyResult.data.titulo;
            let extractedVerse = studyResult.data.referencia_biblica;
            let extractedText = studyResult.data.texto_biblico;

            // Si el contenido tiene metadata, usarla
            if (studyResult.data.contenido_md) {
                const lines = studyResult.data.contenido_md.split('\n');
                lines.forEach(line => {
                    if (line.includes('titulo_estudio:')) {
                        extractedTitle = line.split(':')[1].trim();
                    }
                    if (line.includes('versiculo_clave:')) {
                        extractedVerse = line.split(':')[1].trim();
                    }
                    if (line.includes('texto_biblico:')) {
                        extractedText = line.split(':')[1].trim();
                    }
                });
            }

            // Preparar metadata desde los datos reales
            // Preparar metadata basada en el contenido real de la lección
            const metadata = {
                title: extractedTitle || 'Estudio Bíblico',
                numero: studyResult.data.numero,
                bibleVerse: extractedVerse || '',
                bibleText: extractedText || ''
            };


            setStudyData({
                ...studyResult.data,
                content: studyResult.data.contenido_md || studyResult.data.content,
                metadata: metadata
            });

            // Cargar progreso guardado del usuario
            if (user) {
                const progressResult = await getUserStudyProgress(user.id, params.id);
                if (progressResult.success && progressResult.data) {
                    setResponses(progressResult.data.bible_study_responses || {});
                    setProgress(progressResult.data.bible_study_progress || 0);
                }
            } else {
                // Si no hay usuario, cargar desde localStorage
                loadSavedResponses();
            }

            // Verificar si hay PDF manual
            const pdfUrl = await getManualPdfUrl(params.id);
            setManualPdfUrl(pdfUrl);

        } catch (error) {
            console.error('Error loading study:', error);
        } finally {
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
        const fields = Object.keys(data).filter(k =>
            (k.startsWith('input-') || k.startsWith('textarea-')) &&
            k !== 'lastUpdated'
        );
        const totalFields = fields.length;
        const filledFields = fields.filter(k => data[k] && data[k].trim() !== '').length;

        if (totalFields > 0) {
            const newProgress = Math.round((filledFields / totalFields) * 100);
            setProgress(newProgress);
            return newProgress;
        }
        return 0;
    };

    const handleInputChange = async (fieldId, value) => {
        const newResponses = {
            ...responses,
            [fieldId]: value,
            lastUpdated: new Date().toISOString()
        };
        setResponses(newResponses);

        // Calcular y actualizar progreso
        const newProgress = calculateProgress(newResponses);

        // Guardar localmente siempre
        localStorage.setItem(`bible-study-${params.id}`, JSON.stringify(newResponses));

        // Si hay usuario, guardar en Supabase
        if (user) {
            setSaving(true);
            await saveBibleStudyProgress(user.id, params.id, newProgress, newResponses);
            setTimeout(() => setSaving(false), 1000);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const generatePDF = async () => {
        const element = document.querySelector('.bible-study-content-wrapper');
        if (!element) {
            alert('No se puede generar el PDF en este momento');
            return;
        }

        const opt = {
            margin: 1,
            filename: `estudio-biblico-leccion-${params.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
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
                                {manualPdfUrl && (
                                    <a
                                        href={manualPdfUrl}
                                        download
                                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        title="PDF Manual"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </a>
                                )}

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
                <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none bible-study-content-wrapper">
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