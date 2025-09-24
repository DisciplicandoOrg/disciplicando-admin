"use client";

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import StudyEditor from '../../StudyEditor';
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function EditorPage() {
    const params = useParams();
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);

    return (
        <StudyEditor
            lessonId={params.id}
            supabase={supabase}
            onClose={() => window.location.href = '/bible-studies'}
        />
    );
}