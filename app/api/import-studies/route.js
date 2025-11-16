// Crear este archivo: app/api/import-studies/route.js

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Función helper para crear el cliente de Supabase dentro de las funciones del handler
function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseAnonKey);
}

// Estudio Bíblico Lección 1 - La Autoridad Suprema de las Escrituras
const estudio1 = `---
# Identificadores
id: "1"
seriesId: 1
lessonNumber: 1

title:
  es: "La Autoridad Suprema de las Escrituras"
  en: "The Supreme Authority of Scripture"

subtitle:
  es: "Fundamento de nuestra fe"
  en: "Foundation of our faith"

bibleVerse: "2 Timoteo 3:16-17"
bibleText:
  es: "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia, a fin de que el hombre de Dios sea perfecto, enteramente preparado para toda buena obra."
  en: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work."

# Introducción
introduction:
  es: "En este estudio examinaremos la doctrina fundamental de la autoridad de las Escrituras, entendiendo por qué la Biblia es nuestra única regla de fe y práctica."
  en: "In this study we will examine the fundamental doctrine of the authority of Scripture, understanding why the Bible is our only rule of faith and practice."

estimatedTime: 45
difficulty: "beginner"
tags: ["doctrina", "biblia", "autoridad", "fundamentos"]
---

## section1

::es
### ¿Qué significa que la Escritura es inspirada por Dios?

La palabra "inspirada" literalmente significa "soplada por Dios". Esto significa que Dios supervisó sobrenaturalmente a los autores humanos de la Biblia para que, usando sus propias personalidades y estilos, escribieran exactamente lo que Él quería comunicar.

**Reflexión:** ¿Cómo cambia tu perspectiva saber que la Biblia no es simplemente un libro escrito por hombres, sino las palabras mismas de Dios?

[textarea:section1]
::

::en
### What does it mean that Scripture is God-breathed?

The word "inspired" literally means "God-breathed". This means that God supernaturally supervised the human authors of the Bible so that, using their own personalities and styles, they wrote exactly what He wanted to communicate.

**Reflection:** How does your perspective change knowing that the Bible is not simply a book written by men, but the very words of God?

[textarea:section1]
::

---

## section2

::es
### La utilidad práctica de las Escrituras

Pablo menciona cuatro usos específicos de la Escritura:

1. **Enseñar** - Nos muestra la verdad sobre Dios, nosotros mismos y la salvación
2. **Redargüir** - Nos confronta cuando estamos equivocados
3. **Corregir** - Nos muestra cómo volver al camino correcto
4. **Instruir en justicia** - Nos entrena en cómo vivir de manera que agrade a Dios

**Aplicación Personal:** ¿En cuál de estas cuatro áreas necesitas que la Palabra de Dios trabaje más en tu vida actualmente?

[textarea:section2]
::

::en
### The Practical Usefulness of Scripture

Paul mentions four specific uses of Scripture:

1. **Teaching** - Shows us the truth about God, ourselves, and salvation
2. **Rebuking** - Confronts us when we are wrong
3. **Correcting** - Shows us how to get back on the right path
4. **Training in righteousness** - Trains us in how to live in a way that pleases God

**Personal Application:** In which of these four areas do you need God's Word to work more in your life currently?

[textarea:section2]
::

---

## section3

::es
### El propósito final: Ser completos y preparados

El versículo 17 nos revela el propósito de Dios al darnos Su Palabra: que seamos "perfectos" (completos, maduros) y "enteramente preparados para toda buena obra".

Esto significa que:
- La Biblia contiene todo lo que necesitamos para la vida espiritual
- No necesitamos revelaciones adicionales fuera de las Escrituras
- Podemos confiar completamente en su suficiencia

**Compromiso:** Escribe un compromiso personal sobre cómo vas a priorizar la lectura y estudio de la Biblia en tu vida diaria.

[textarea:section3]
::

::en
### The Ultimate Purpose: Being Complete and Equipped

Verse 17 reveals God's purpose in giving us His Word: that we may be "complete" (perfect, mature) and "thoroughly equipped for every good work."

This means that:
- The Bible contains everything we need for spiritual life
- We don't need additional revelations outside of Scripture
- We can completely trust in its sufficiency

**Commitment:** Write a personal commitment about how you will prioritize reading and studying the Bible in your daily life.

[textarea:section3]
::

---`;

// Estudio Bíblico Lección 3 - La Naturaleza de Dios y Su Santidad
const estudio3 = `---
# Identificadores
id: "3"
seriesId: 1
lessonNumber: 3

title:
  es: "La Naturaleza de Dios y Su Santidad"
  en: "The Nature of God and His Holiness"

subtitle:
  es: "Conociendo al Dios Santo"
  en: "Knowing the Holy God"

bibleVerse: "Isaías 6:1-8"
bibleText:
  es: "Y el uno al otro daba voces, diciendo: Santo, santo, santo, Jehová de los ejércitos; toda la tierra está llena de su gloria."
  en: "And they were calling to one another: 'Holy, holy, holy is the Lord Almighty; the whole earth is full of his glory.'"

# Introducción
introduction:
  es: "En este estudio exploraremos la visión de Isaías del trono de Dios, descubriendo qué significa que Dios es santo y cómo Su santidad debe impactar nuestras vidas."
  en: "In this study we will explore Isaiah's vision of God's throne, discovering what it means that God is holy and how His holiness should impact our lives."

estimatedTime: 45
difficulty: "beginner"
tags: ["doctrina", "santidad", "Dios", "adoración"]
---

## section1

::es
### La visión de la gloria de Dios

Isaías tuvo una visión extraordinaria del trono de Dios en el templo. Observa los detalles:
- El Señor sentado en un trono alto y sublime
- Sus faldas llenaban el templo
- Serafines (ángeles) proclamando Su santidad
- El templo se llenó de humo

**Reflexión:** Cuando piensas en Dios, ¿lo imaginas con esta majestuosidad y santidad? ¿Cómo afecta tu adoración el recordar quién es Él realmente?

[textarea:section1]
::

::en
### The Vision of God's Glory

Isaiah had an extraordinary vision of God's throne in the temple. Notice the details:
- The Lord seated on a high and lofty throne
- His robe filled the temple
- Seraphim (angels) proclaiming His holiness
- The temple was filled with smoke

**Reflection:** When you think of God, do you imagine Him with this majesty and holiness? How does remembering who He really is affect your worship?

[textarea:section1]
::

---

## section2

::es
### El significado de "Santo, Santo, Santo"

La triple repetición de "santo" es significativa:
1. En hebreo, la repetición indica énfasis supremo
2. Es el único atributo de Dios repetido tres veces en la Escritura
3. Indica que la santidad es la esencia misma de Dios

La santidad de Dios significa que Él es:
- Completamente separado del pecado
- Absolutamente puro
- Totalmente diferente a nosotros
- Perfecto en todos Sus caminos

**Aplicación:** ¿Cómo debe cambiar tu forma de acercarte a Dios el entender Su absoluta santidad?

[textarea:section2]
::

::en
### The Meaning of "Holy, Holy, Holy"

The triple repetition of "holy" is significant:
1. In Hebrew, repetition indicates supreme emphasis
2. It is the only attribute of God repeated three times in Scripture
3. It indicates that holiness is the very essence of God

God's holiness means that He is:
- Completely separate from sin
- Absolutely pure
- Totally different from us
- Perfect in all His ways

**Application:** How should understanding His absolute holiness change the way you approach God?

[textarea:section2]
::

---

## section3

::es
### Nuestra respuesta a la santidad de Dios

Observa la reacción de Isaías ante la santidad de Dios:
1. **Convicción de pecado** - "¡Ay de mí! que soy muerto"
2. **Confesión** - "siendo hombre inmundo de labios"
3. **Limpieza** - El serafín tocó sus labios con el carbón encendido
4. **Comisión** - "Heme aquí, envíame a mí"

Esta debe ser nuestra respuesta:
- Humildad ante Su santidad
- Confesión de nuestro pecado
- Recibir Su perdón
- Disponibilidad para servirle

**Compromiso:** ¿Qué área de tu vida necesitas rendir a la santidad de Dios? ¿Estás dispuesto a decir "Heme aquí, envíame a mí"?

[textarea:section3]
::

::en
### Our Response to God's Holiness

Notice Isaiah's reaction to God's holiness:
1. **Conviction of sin** - "Woe to me! I am ruined"
2. **Confession** - "I am a man of unclean lips"
3. **Cleansing** - The seraph touched his lips with the burning coal
4. **Commission** - "Here am I. Send me!"

This should be our response:
- Humility before His holiness
- Confession of our sin
- Receiving His forgiveness
- Availability to serve Him

**Commitment:** What area of your life do you need to surrender to God's holiness? Are you willing to say "Here am I, send me"?

[textarea:section3]
::

---`;

export async function POST(request) {
    try {
        const supabase = createSupabaseClient();

        // Actualizar Lección 1
        const { error: error1 } = await supabase
            .from('lecciones')
            .update({
                contenido_md: estudio1,
                updated_at: new Date().toISOString()
            })
            .eq('numero', 1);

        if (error1) {
            console.error('Error actualizando lección 1:', error1);
        }

        // Actualizar Lección 3
        const { error: error3 } = await supabase
            .from('lecciones')
            .update({
                contenido_md: estudio3,
                updated_at: new Date().toISOString()
            })
            .eq('numero', 3);

        if (error3) {
            console.error('Error actualizando lección 3:', error3);
        }

        return NextResponse.json({
            success: true,
            message: 'Estudios importados exitosamente',
            results: {
                leccion1: error1 ? 'Error' : 'Importado',
                leccion3: error3 ? 'Error' : 'Importado'
            }
        });

    } catch (error) {
        console.error('Error en importación:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Usa POST para importar los estudios'
    });
}