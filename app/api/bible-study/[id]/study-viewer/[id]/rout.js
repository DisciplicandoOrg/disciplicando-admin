import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Obtener la lección con su contenido
        const { data: lesson, error } = await supabase
            .from('lecciones')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !lesson) {
            return NextResponse.json({ error: 'Estudio no encontrado' }, { status: 404 });
        }

        // Devolver una página HTML simple para vista previa
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${lesson.titulo}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px;
                        line-height: 1.6;
                    }
                    h1 { color: #2563eb; }
                    h2 { color: #1e40af; margin-top: 2em; }
                    h3 { color: #3730a3; }
                    .input-field {
                        border-bottom: 2px solid #ddd;
                        display: inline-block;
                        min-width: 150px;
                        margin: 0 4px;
                        padding: 2px 4px;
                    }
                    textarea {
                        width: 100%;
                        min-height: 100px;
                        border: 2px solid #ddd;
                        border-radius: 4px;
                        padding: 8px;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <h1>${lesson.titulo}</h1>
                <div>${lesson.contenido_md ? processMarkdown(lesson.contenido_md) : 'Sin contenido'}</div>
            </body>
            </html>
        `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function processMarkdown(content) {
    if (!content) return '';

    // Convertir markdown básico a HTML
    let html = content
        .replace(/### (.*?)$/gm, '<h3>$1</h3>')
        .replace(/## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[input:(.*?):(.*?)\]/g, '<span class="input-field">$2</span>')
        .replace(/\[textarea:(.*?)\]/g, '<textarea placeholder="Escribe aquí..."></textarea>')
        .replace(/\n/g, '<br>');

    return html;
}