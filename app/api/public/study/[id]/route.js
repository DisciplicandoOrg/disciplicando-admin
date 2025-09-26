import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Cliente de Supabase sin autenticación
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
    try {
        const { data, error } = await supabase
            .from('lecciones')
            .select('contenido_md, titulo, numero')
            .eq('id', params.id)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'Estudio no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}