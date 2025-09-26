"use client";

import { useState, useEffect } from 'react';
import StudyRenderer from '@/app/components/bible-studies/StudyRenderer';

export default function PublicStudyViewer({ params }) {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('es');
    const [error, setError] = useState(null);
    const [lessonTitle, setLessonTitle] = useState('');

    useEffect(() => {
        fetchStudy();
    }, [params.id]);

    const fetchStudy = async () => {
        try {
            // Usar la API pública en lugar de acceso directo a Supabase
            const response = await fetch(`/api/public/study/${params.id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error cargando estudio');
            }

            if (data.contenido_md) {
                setContent(data.contenido_md);
                setLessonTitle(data.titulo || '');
            } else {
                setError('Estudio no disponible');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Error cargando el estudio');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando estudio bíblico...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-600">{error}</p>
                    <p className="mt-4 text-gray-600">
                        Por favor, verifica el enlace o contacta al administrador.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header con selector de idioma */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-700">
                        {lessonTitle}
                    </h1>
                    <button
                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                        className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {language === 'es' ? '🇺🇸 English' : '🇪🇸 Español'}
                    </button>
                </div>

                {/* Contenido del estudio */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <StudyRenderer
                        content={content}
                        language={language}
                        responses={{}}
                        onInputChange={() => { }}
                    />
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2025 Disciplicando - Transformando vidas a través de la Palabra</p>
                </div>
            </div>
        </div>
    );
}