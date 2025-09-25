// lib/bibleStudies.js
import { createSupabaseBrowserClient } from './supabaseClient';

/**
 * Obtener el contenido del estudio bíblico de una lección
 */
export async function getBibleStudyContent(lessonId) {
    const supabase = createSupabaseBrowserClient();

    try {
        const { data, error } = await supabase
            .from('lecciones')
            .select('id, titulo, numero, contenido_md, estudio_url, pdf_url')
            .eq('id', lessonId)
            .single();

        if (error) throw error;

        // Si hay contenido_md, usarlo. Si no, intentar cargar desde estudio_url
        if (data?.contenido_md) {
            return {
                success: true,
                data: {
                    ...data,
                    content: data.contenido_md,
                    source: 'database'
                }
            };
        } else if (data?.estudio_url) {
            // Cargar desde URL externa si existe
            try {
                const response = await fetch(data.estudio_url);
                const content = await response.text();
                return {
                    success: true,
                    data: {
                        ...data,
                        content: content,
                        source: 'url'
                    }
                };
            } catch (fetchError) {
                console.error('Error cargando desde URL:', fetchError);
                return {
                    success: false,
                    error: 'No se pudo cargar el estudio desde la URL'
                };
            }
        }

        return {
            success: false,
            error: 'No hay contenido de estudio disponible'
        };
    } catch (error) {
        console.error('Error obteniendo estudio bíblico:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Guardar progreso del estudio bíblico
 */
export async function saveBibleStudyProgress(userId, lessonId, progress, responses = null) {
    const supabase = createSupabaseBrowserClient();

    try {
        const updateData = {
            user_uuid: userId,
            lesson_id: lessonId,
            bible_study_progress: progress,
            bible_study_completed: progress >= 100,
            updated_at: new Date().toISOString()
        };

        // Solo agregar responses si existe
        if (responses) {
            updateData.bible_study_responses = responses;
        }

        const { data, error } = await supabase
            .from('lesson_progress')
            .upsert(updateData, {
                onConflict: 'user_uuid,lesson_id'
            });

        if (error) throw error;

        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('Error guardando progreso:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Obtener progreso guardado del usuario
 */
export async function getUserStudyProgress(userId, lessonId) {
    const supabase = createSupabaseBrowserClient();

    try {
        // Primero verificar si la tabla existe
        const { data, error } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_uuid', userId)
            .eq('lesson_id', lessonId)
            .maybeSingle(); // Usar maybeSingle en lugar de single

        if (error) {
            console.log('Tabla lesson_progress no encontrada o error:', error);
            // Retornar valores por defecto
            return {
                success: true,
                data: {
                    bible_study_progress: 0,
                    bible_study_completed: false,
                    bible_study_responses: {}
                }
            };
        }

        return {
            success: true,
            data: data || {
                bible_study_progress: 0,
                bible_study_completed: false,
                bible_study_responses: {}
            }
        };
    } catch (error) {
        console.error('Error obteniendo progreso:', error);
        return {
            success: true, // Cambiar a true para no bloquear
            data: {
                bible_study_progress: 0,
                bible_study_completed: false,
                bible_study_responses: {}
            }
        };
    }
}

/**
 * Obtener URL del PDF manual si existe
 */
export async function getManualPdfUrl(lessonId) {
    const supabase = createSupabaseBrowserClient();

    try {
        const { data, error } = await supabase
            .from('lecciones')
            .select('pdf_url')
            .eq('id', lessonId)
            .single();

        if (error) throw error;

        return data?.pdf_url || null;
    } catch (error) {
        console.error('Error obteniendo PDF manual:', error);
        return null;
    }
}