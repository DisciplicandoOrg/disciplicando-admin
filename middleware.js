// middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    const response = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value
                },
                set(name, value, options) {
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name, options) {
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const pathname = request.nextUrl.pathname

    // Rutas públicas que NO requieren autenticación
    const publicRoutes = ['/login', '/403']

    // Rutas que empiezan con estos prefijos tampoco requieren auth
    const publicPrefixes = [
        '/public',           // Para el viewer público
        '/api/public',       // Para APIs públicas
        '/study-viewer'      // Ruta alternativa si prefieres
    ]

    // Verificar si es ruta pública
    const isPublicRoute = publicRoutes.includes(pathname) ||
        publicPrefixes.some(prefix => pathname.startsWith(prefix))

    // Si es una ruta pública, permitir el acceso
    if (isPublicRoute) {
        return response
    }

    // Para rutas protegidas, verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()

    // Si no hay usuario y trata de acceder a ruta protegida
    if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Si hay usuario, verificar permisos de admin para rutas protegidas
    try {
        const { data: isAdmin, error } = await supabase.rpc('me_is_admin')

        if (error || !isAdmin) {
            return NextResponse.redirect(new URL('/403', request.url))
        }
    } catch (error) {
        console.error('Error checking admin status:', error)
        return NextResponse.redirect(new URL('/403', request.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}