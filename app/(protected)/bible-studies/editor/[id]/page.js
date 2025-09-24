"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import StudyEditor from '../../StudyEditor';
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar datos de la lección si existe
        const loadLesson = async () => {
            if (params.id && params.id !== 'new') {
                try {
                    const { data, error } = await supabase
                        .from('lecciones')
                        .select('*')
                        .eq('id', params.id)
                        .single();

                    if (error) throw error;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error cargando lección:', error);
                    alert('Error al cargar la lección');
                }
            }
            setLoading(false);
        };

        loadLesson();
    }, [params.id, supabase]);

    const handleSave = async (formData) => {
        try {
            const { error } = await supabase
                .from('lecciones')
                .update({
                    titulo: formData.titulo,
                    titulo_en: formData.titulo_en,
                    numero: formData.numero,
                    contenido_md: formData.contenido_md,
                    updated_at: new Date().toISOString()
                })
                .eq('id', params.id);

            if (error) throw error;

            alert('Estudio guardado exitosamente');
            router.push('/bible-studies');
        } catch (error) {
            console.error('Error guardando:', error);
            throw error;
        }
    };

    const handleCancel = () => {
        if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
            router.push('/bible-studies');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4">Cargando editor...</p>
                </div>
            </div>
        );
    }

    return (
        <StudyEditor
            lessonId={params.id}
            initialData={initialData}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
}