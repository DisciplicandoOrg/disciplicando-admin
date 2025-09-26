"use client";

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import StudyRenderer from '@/app/components/bible-studies/StudyRenderer';

export default function PublicStudyViewer({ params }) {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('es');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudy();
    }, [params.id]);

    const fetchStudy = async () => {
        try {
            const supabase = createSupabaseBrowserClient();

            // Buscar el estudio por ID - sin requerir autenticación
            const { data, error } = await supabase
                .from('lecciones')
                .select('contenido_md, titulo, numero')
                .eq('id', params.id)
                .single();

            if (error) throw error;

            if (data && data.contenido_md) {
                setContent(data.contenido_md);
            } else {
                setError('Estudio no encontrado');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error cargando el estudio');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Selector de idioma */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                        className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
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
            </div>
        </div>
    );
}