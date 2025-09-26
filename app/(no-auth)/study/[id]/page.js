"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import StudyRenderer from '@/components/bible-studies/StudyRenderer';

// Cliente público de Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
            const { data, error } = await supabase
                .from('lecciones')
                .select('contenido_md, titulo, numero')
                .eq('id', params.id)
                .eq('is_active', true)
                .single();

            if (error) throw error;

            if (data && data.contenido_md) {
                setContent(data.contenido_md);
                setLessonTitle(data.titulo || '');
            } else {
                setError('Estudio no disponible');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error cargando el estudio');
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

                <div className="bg-white rounded-lg shadow-sm p-8">
                    <StudyRenderer
                        content={content}
                        language={language}
                        responses={{}}
                        onInputChange={() => { }}
                    />
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2025 Disciplicando - Transformando vidas a través de la Palabra</p>
                </div>
            </div>
        </div>
    );
}