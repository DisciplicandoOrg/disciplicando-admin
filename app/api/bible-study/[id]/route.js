import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Buscar el archivo en las diferentes series
        const contentDir = path.join(process.cwd(), 'content', 'bible-studies');
        let filePath = null;

        // Mapeo de IDs a archivos  
        const seriesMapping = {
            '101': 'series-1-doctrinal/101-authority-scripture.md',
            '102': 'series-1-doctrinal/102-trinity.md',
            '103': 'series-1-doctrinal/103-nature-god-holiness.md',
            // Agrega más cuando los crees
        };

        // Buscar el archivo
        if (seriesMapping[id]) {
            const possiblePath = path.join(contentDir, seriesMapping[id]);
            if (fs.existsSync(possiblePath)) {
                filePath = possiblePath;
            }
        }

        if (!filePath) {
            return NextResponse.json(
                { error: 'Study not found', searchedId: id },
                { status: 404 }
            );
        }

        // Leer el archivo completo como string
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Procesar el frontmatter manualmente
        let metadata = {};
        let content = fileContent;

        // Buscar el frontmatter entre --- líneas
        const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);

        if (frontmatterMatch) {
            // Parsear el frontmatter como YAML simple
            const frontmatterText = frontmatterMatch[1];
            content = frontmatterMatch[2]; // El contenido después del frontmatter

            // Parsear líneas del frontmatter
            const lines = frontmatterText.split('\n');
            let currentKey = '';
            let currentObj = metadata;
            let inObject = false;
            let currentObjectName = '';

            for (const line of lines) {
                const trimmedLine = line.trim();

                // Skip comentarios y líneas vacías
                if (trimmedLine.startsWith('#') || trimmedLine === '') continue;

                // Detectar objetos anidados (title:, series:, etc.)
                if (line.includes(':') && !line.includes('"') && !line.includes("'")) {
                    const colonIndex = line.indexOf(':');
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();

                    if (value === '') {
                        // Es un objeto
                        currentObjectName = key;
                        metadata[key] = metadata[key] || {};
                        currentObj = metadata[key];
                        inObject = true;
                    } else if (inObject && line.startsWith('  ')) {
                        // Es una propiedad dentro del objeto
                        const [subKey, ...subValueParts] = trimmedLine.split(':');
                        const subValue = subValueParts.join(':').trim().replace(/['"]/g, '');
                        currentObj[subKey] = subValue;
                    } else {
                        // Es un valor simple
                        metadata[key] = value.replace(/['"]/g, '');
                        inObject = false;
                        currentObj = metadata;
                    }
                } else if (inObject && line.startsWith('  ')) {
                    // Propiedad dentro de objeto
                    const [subKey, ...subValueParts] = line.trim().split(':');
                    if (subKey && subValueParts.length > 0) {
                        const subValue = subValueParts.join(':').trim().replace(/['"]/g, '');
                        currentObj[subKey] = subValue;
                    }
                } else if (!line.startsWith('  ')) {
                    // Reset del contexto de objeto
                    inObject = false;
                    currentObj = metadata;
                }
            }
        }

        // No escapar el contenido, enviarlo tal cual
        const responseData = {
            metadata: metadata,
            content: content  // Enviar el contenido sin modificar
        };

        console.log('Sending content type:', typeof responseData.content);
        console.log('Content length:', responseData.content.length);
        console.log('First 200 chars:', responseData.content.substring(0, 200));

        // Headers para CORS
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        };

        return NextResponse.json(responseData, { headers });

    } catch (error) {
        console.error('Error loading Bible study:', error);
        return NextResponse.json(
            { error: 'Error loading study', message: error.message },
            { status: 500 }
        );
    }
}

export async function OPTIONS(request) {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}