import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const { data: lesson, error } = await supabase
            .from('lecciones')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !lesson) {
            return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 });
        }

        // Aquí renderizarías el HTML con el contenido markdown
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Estudio Bíblico - Lección ${lesson.numero}</title>
                <style>
                    body { font-family: Arial; padding: 20px; max-width: 800px; margin: 0 auto; }
                    h1 { color: #333; }
                    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>${lesson.titulo}</h1>
                <pre>${lesson.contenido_md || 'No hay contenido disponible'}</pre>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}