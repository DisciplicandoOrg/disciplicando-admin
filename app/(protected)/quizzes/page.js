"use client";

import { useState, useEffect, useMemo } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import {
    BookOpen, Plus, Edit, Trash2, ChevronDown, ChevronRight,
    CheckCircle, XCircle, AlertCircle, Save, Eye, Copy,
    HelpCircle, FileText, Award, Clock, BarChart
} from "lucide-react";

// Componente principal
export default function QuizzesPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState([]);
    const [series, setSeries] = useState([]);
    const [lecciones, setLecciones] = useState([]);
    const [expandedQuizzes, setExpandedQuizzes] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [activeTab, setActiveTab] = useState("list");

    // Estados para el nuevo quiz
    const [newQuiz, setNewQuiz] = useState({
        leccion_id: "",
        serie_id: 1,
        titulo: "",
        titulo_en: "",
        descripcion: "",
        descripcion_en: "",
        preguntas: []
    });

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        setLoading(true);
        try {
            // Cargar series con sus bloques y lecciones
            const { data: seriesData } = await supabase
                .from("series")
                .select(`
                id, 
                nombre, 
                orden,
                bloques (
                    id,
                    nombre,
                    orden,
                    lecciones (
                        id,
                        numero,
                        titulo,
                        bloque_id
                    )
                )
            `)
                .order("orden");

            setSeries(seriesData || []);

            // Crear un mapa plano de lecciones con información de serie
            const leccionesFlat = [];
            seriesData?.forEach(serie => {
                serie.bloques?.forEach(bloque => {
                    bloque.lecciones?.forEach(leccion => {
                        leccionesFlat.push({
                            ...leccion,
                            serie_id: serie.id,
                            serie_nombre: serie.nombre,
                            bloque_nombre: bloque.nombre
                        });
                    });
                });
            });
            setLecciones(leccionesFlat);

            // Cargar quizzes
            const { data: quizzesData } = await supabase
                .from("quizzes")
                .select("*")
                .order("leccion_id");

            console.log("Quizzes básicos:", quizzesData);

            if (quizzesData && quizzesData.length > 0) {
                const quizzesWithQuestions = await Promise.all(
                    quizzesData.map(async (quiz) => {
                        // Buscar información de la lección
                        const leccionInfo = leccionesFlat.find(l => l.numero === quiz.leccion_id);

                        // Cargar preguntas del quiz
                        const { data: preguntas } = await supabase
                            .from("quiz_preguntas")
                            .select("*")
                            .eq("quiz_id", quiz.id)
                            .order("numero_pregunta");

                        // Para cada pregunta, cargar TODAS sus opciones
                        const preguntasWithOpciones = await Promise.all(
                            (preguntas || []).map(async (pregunta) => {
                                const { data: opciones } = await supabase
                                    .from("quiz_opciones")
                                    .select("*")
                                    .eq("pregunta_id", pregunta.id)
                                    .order("created_at"); // Ordenar por fecha de creación

                                console.log(`Pregunta ${pregunta.numero_pregunta} tiene ${opciones?.length} opciones`);

                                return {
                                    ...pregunta,
                                    quiz_opciones: opciones || []
                                };
                            })
                        );

                        return {
                            ...quiz,
                            serie_nombre: leccionInfo?.serie_nombre || `Serie ${quiz.serie_id}`,
                            quiz_preguntas: preguntasWithOpciones || []
                        };
                    })
                );

                setQuizzes(quizzesWithQuestions);
                console.log("Quizzes completos con serie:", quizzesWithQuestions);
            } else {
                setQuizzes([]);
            }

        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleAddPregunta = () => {
        setNewQuiz({
            ...newQuiz,
            preguntas: [
                ...newQuiz.preguntas,
                {
                    enunciado: "",
                    enunciado_en: "",
                    numero_pregunta: newQuiz.preguntas.length + 1,
                    opciones: [
                        { texto: "", texto_en: "", es_correcta: false },
                        { texto: "", texto_en: "", es_correcta: false },
                        { texto: "", texto_en: "", es_correcta: false },
                        { texto: "", texto_en: "", es_correcta: false }
                    ],
                    explicacion: "",
                    explicacion_en: ""
                }
            ]
        });
    };


    const handleSaveQuiz = async () => {
        try {
            // Validar que hay al menos una pregunta
            if (newQuiz.preguntas.length === 0) {
                alert("Debes agregar al menos una pregunta");
                return;
            }

            // Validar que cada pregunta tenga una opción correcta
            for (let i = 0; i < newQuiz.preguntas.length; i++) {
                const pregunta = newQuiz.preguntas[i];
                const tieneCorrecta = pregunta.opciones.some(op => op.es_correcta);
                if (!tieneCorrecta) {
                    alert(`La pregunta ${i + 1} no tiene una opción correcta seleccionada`);
                    return;
                }
            }

            console.log("Guardando quiz:", newQuiz);

            // Crear el quiz principal
            const { data: quizData, error: quizError } = await supabase
                .from("quizzes")
                .insert({
                    leccion_id: parseInt(newQuiz.leccion_id),
                    serie_id: parseInt(newQuiz.serie_id),
                    titulo: newQuiz.titulo,
                    titulo_en: newQuiz.titulo_en || null,
                    descripcion: newQuiz.descripcion || null,
                    descripcion_en: newQuiz.descripcion_en || null
                })
                .select()
                .single();

            if (quizError) {
                console.error("Error creando quiz:", quizError);
                throw quizError;
            }

            console.log("Quiz creado:", quizData);

            // Guardar cada pregunta con sus opciones
            for (const pregunta of newQuiz.preguntas) {
                console.log(`Guardando pregunta ${pregunta.numero_pregunta}`);

                const { data: preguntaData, error: preguntaError } = await supabase
                    .from("quiz_preguntas")
                    .insert({
                        quiz_id: quizData.id,
                        enunciado: pregunta.enunciado,
                        enunciado_en: pregunta.enunciado_en || null,
                        orden: pregunta.numero_pregunta,
                        numero_pregunta: pregunta.numero_pregunta
                    })
                    .select()
                    .single();

                if (preguntaError) {
                    console.error("Error creando pregunta:", preguntaError);
                    throw preguntaError;
                }

                console.log("Pregunta creada:", preguntaData);

                // Preparar las opciones para insertar
                const opcionesToInsert = [];
                for (let i = 0; i < pregunta.opciones.length; i++) {
                    const opcion = pregunta.opciones[i];
                    opcionesToInsert.push({
                        pregunta_id: preguntaData.id,
                        texto: opcion.texto,
                        texto_en: opcion.texto_en || null,
                        es_correcta: opcion.es_correcta || false,
                        letra_opcion: String.fromCharCode(65 + i), // Agrega las letras segun la pregunta: A, B, C, D
                        explicacion: opcion.es_correcta ? (pregunta.explicacion || null) : null,
                        explicacion_en: opcion.es_correcta ? (pregunta.explicacion_en || null) : null
                    });
                }

                console.log("Insertando opciones:", opcionesToInsert);

                const { data: opcionesData, error: opcionesError } = await supabase
                    .from("quiz_opciones")
                    .insert(opcionesToInsert)
                    .select();

                if (opcionesError) {
                    console.error("Error creando opciones:", opcionesError);
                    throw opcionesError;
                }

                console.log("Opciones creadas:", opcionesData);
            }

            alert("¡Quiz creado exitosamente!");
            setShowAddModal(false);
            fetchData(); // Recargar los datos

            // Limpiar formulario
            setNewQuiz({
                leccion_id: "",
                serie_id: 1,
                titulo: "",
                titulo_en: "",
                descripcion: "",
                descripcion_en: "",
                preguntas: []
            });
        } catch (error) {
            console.error("Error completo guardando quiz:", error);
            alert("Error al guardar el quiz: " + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        // Limpiar completamente el formulario
        setNewQuiz({
            leccion_id: "",
            serie_id: 1,
            titulo: "",
            titulo_en: "",
            descripcion: "",
            descripcion_en: "",
            preguntas: []
        });
    };

    const handleOpenModal = () => {
        // Asegurar que el formulario esté limpio antes de abrir
        setNewQuiz({
            leccion_id: "",
            serie_id: 1,
            titulo: "",
            titulo_en: "",
            descripcion: "",
            descripcion_en: "",
            preguntas: []
        });
        setShowAddModal(true);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!confirm("¿Estás seguro de eliminar este quiz? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from("quizzes")
                .delete()
                .eq("id", quizId);

            if (error) throw error;

            alert("Quiz eliminado exitosamente");
            fetchData();
        } catch (error) {
            console.error("Error eliminando quiz:", error);
            alert("Error al eliminar el quiz: " + error.message);
        }
    };

    const getQuizStats = (quiz) => {
        const totalPreguntas = quiz.quiz_preguntas?.length || 0;
        const totalOpciones = quiz.quiz_preguntas?.reduce((acc, p) =>
            acc + (p.quiz_opciones?.length || 0), 0) || 0;
        return { totalPreguntas, totalOpciones };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold">Gestión de Quizzes</h2>
                    <p className="text-gray-600">Administra los cuestionarios de evaluación</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Quiz
                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-2xl font-bold">{quizzes.length}</p>
                            <p className="text-sm text-gray-600">Quizzes Totales</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-2xl font-bold">
                                {quizzes.reduce((acc, q) => acc + (q.quiz_preguntas?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600">Preguntas Totales</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-purple-600" />
                        <div>
                            <p className="text-2xl font-bold">
                                {lecciones.filter(l =>
                                    quizzes.some(q => q.leccion_id === l.numero)
                                ).length}
                            </p>
                            <p className="text-sm text-gray-600">Lecciones con Quiz</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-8 h-8 text-red-600" />
                        <div>
                            <p className="text-2xl font-bold">
                                {lecciones.filter(l =>
                                    !quizzes.some(q => q.leccion_id === l.numero)
                                ).length}
                            </p>
                            <p className="text-sm text-gray-600">Lecciones sin Quiz</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Quizzes */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Cargando quizzes...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Quizzes Existentes</h3>

                    {quizzes.length === 0 ? (
                        <div className="bg-white rounded-lg border p-8 text-center">
                            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">No hay quizzes creados todavía</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quizzes.map((quiz) => {
                                const stats = getQuizStats(quiz);
                                const isExpanded = expandedQuizzes[quiz.id];

                                // Buscar información de la lección para obtener la serie
                                const leccion = lecciones.find(l => l.numero === quiz.leccion_id);
                                const serieName = quiz.serie_nombre || "Serie " + quiz.serie_id;

                                return (
                                    <div key={quiz.id} className="bg-white rounded-lg border">
                                        <div
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                            onClick={() => setExpandedQuizzes(prev => ({
                                                ...prev,
                                                [quiz.id]: !prev[quiz.id]
                                            }))}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isExpanded ?
                                                    <ChevronDown className="w-5 h-5" /> :
                                                    <ChevronRight className="w-5 h-5" />
                                                }
                                                <BookOpen className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <h4 className="font-semibold">
                                                        {serieName} - Lección {quiz.leccion_id}: {quiz.titulo}
                                                    </h4>
                                                    {quiz.titulo_en && (
                                                        <p className="text-sm text-gray-500 italic">
                                                            {quiz.titulo_en}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600">
                                                        {quiz.descripcion}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-xs text-gray-500">
                                                            {stats.totalPreguntas} preguntas
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {stats.totalOpciones} opciones totales
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t px-4 py-3 bg-gray-50">
                                                <div className="space-y-3">
                                                    {quiz.quiz_preguntas?.sort((a, b) => a.numero_pregunta - b.numero_pregunta).map((pregunta, index) => (
                                                        <div key={pregunta.id} className="bg-white rounded p-4 border">
                                                            <div className="mb-3">
                                                                <p className="font-medium text-sm text-blue-900">
                                                                    Pregunta {pregunta.numero_pregunta}:
                                                                </p>
                                                                <p className="text-sm font-medium mt-1">
                                                                    🇪🇸 {pregunta.enunciado}
                                                                </p>
                                                                {pregunta.enunciado_en && (
                                                                    <p className="text-sm text-gray-600 italic mt-1">
                                                                        🇺🇸 {pregunta.enunciado_en}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {pregunta.quiz_opciones?.map((opcion, opIndex) => (
                                                                    <div
                                                                        key={opcion.id}
                                                                        className={`p-3 rounded-lg border ${opcion.es_correcta
                                                                            ? 'bg-green-50 border-green-300'
                                                                            : 'bg-gray-50 border-gray-200'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-start gap-2">
                                                                            <span className="font-semibold text-sm">
                                                                                {String.fromCharCode(65 + opIndex)}.
                                                                            </span>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-start gap-2">
                                                                                    {opcion.es_correcta && (
                                                                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                                    )}
                                                                                    <div className="flex-1">
                                                                                        <p className="text-sm">
                                                                                            {opcion.texto}
                                                                                        </p>
                                                                                        {opcion.texto_en && (
                                                                                            <p className="text-sm text-gray-600 italic mt-1">
                                                                                                {opcion.texto_en}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                {opcion.es_correcta && opcion.explicacion && (
                                                                                    <div className="mt-2 p-2 bg-green-100 rounded border border-green-200">
                                                                                        <p className="text-xs font-semibold text-green-800 mb-1">
                                                                                            Explicación:
                                                                                        </p>
                                                                                        <p className="text-xs text-green-700">
                                                                                            🇪🇸 {opcion.explicacion}
                                                                                        </p>
                                                                                        {opcion.explicacion_en && (
                                                                                            <p className="text-xs text-green-700 mt-1">
                                                                                                🇺🇸 {opcion.explicacion_en}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Resumen del quiz */}
                                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p className="text-sm text-blue-900">
                                                        <strong>Total:</strong> {stats.totalPreguntas} preguntas con {stats.totalOpciones} opciones
                                                    </p>
                                                    <p className="text-xs text-blue-700 mt-1">
                                                        Cada pregunta tiene 4 opciones, una correcta con explicación
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}


                </div>
            )}

            {/* Modal Agregar Quiz */}
            {showAddModal && (
                <QuizModal
                    quiz={newQuiz}
                    setQuiz={setNewQuiz}
                    lecciones={lecciones}
                    onSave={handleSaveQuiz}
                    onClose={handleCloseModal}
                    onAddPregunta={handleAddPregunta}
                />
            )}
        </div>
    );
}

// Modal para agregar/editar quiz
function QuizModal({ quiz, setQuiz, lecciones, onSave, onClose, onAddPregunta }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Nuevo Quiz</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Información del Quiz</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Lección *
                                </label>
                                <select
                                    value={quiz.leccion_id}
                                    onChange={(e) => setQuiz({ ...quiz, leccion_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Seleccionar lección...</option>
                                    {lecciones.map(leccion => (
                                        <option key={leccion.id} value={leccion.numero}>
                                            Lección {leccion.numero}: {leccion.titulo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Serie
                                </label>
                                <input
                                    type="number"
                                    value={quiz.serie_id}
                                    onChange={(e) => setQuiz({ ...quiz, serie_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Título (Español) *
                                </label>
                                <input
                                    type="text"
                                    value={quiz.titulo}
                                    onChange={(e) => setQuiz({ ...quiz, titulo: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Título (Inglés)
                                </label>
                                <input
                                    type="text"
                                    value={quiz.titulo_en}
                                    onChange={(e) => setQuiz({ ...quiz, titulo_en: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descripción (Español)
                                </label>
                                <textarea
                                    value={quiz.descripcion}
                                    onChange={(e) => setQuiz({ ...quiz, descripcion: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descripción (Inglés)
                                </label>
                                <textarea
                                    value={quiz.descripcion_en}
                                    onChange={(e) => setQuiz({ ...quiz, descripcion_en: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preguntas */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Preguntas ({quiz.preguntas.length})</h3>
                            <button
                                type="button"
                                onClick={onAddPregunta}
                                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Pregunta
                            </button>
                        </div>

                        {quiz.preguntas.map((pregunta, preguntaIndex) => (
                            <PreguntaForm
                                key={preguntaIndex}
                                pregunta={pregunta}
                                index={preguntaIndex}
                                quiz={quiz}
                                setQuiz={setQuiz}
                            />
                        ))}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente para cada pregunta
function PreguntaForm({ pregunta, index, quiz, setQuiz }) {
    const updatePregunta = (field, value) => {
        const updatedPreguntas = [...quiz.preguntas];
        updatedPreguntas[index] = {
            ...updatedPreguntas[index],
            [field]: value
        };
        setQuiz({ ...quiz, preguntas: updatedPreguntas });
    };

    const updateOpcion = (opcionIndex, field, value) => {
        const updatedPreguntas = [...quiz.preguntas];
        updatedPreguntas[index].opciones[opcionIndex] = {
            ...updatedPreguntas[index].opciones[opcionIndex],
            [field]: value
        };

        // Si se marca una opción como correcta, desmarcar las demás
        if (field === 'es_correcta' && value === true) {
            updatedPreguntas[index].opciones.forEach((op, i) => {
                if (i !== opcionIndex) {
                    updatedPreguntas[index].opciones[i].es_correcta = false;
                }
            });
        }

        setQuiz({ ...quiz, preguntas: updatedPreguntas });
    };

    const removePregunta = () => {
        const updatedPreguntas = quiz.preguntas.filter((_, i) => i !== index);
        // Reajustar números de pregunta
        updatedPreguntas.forEach((p, i) => {
            p.numero_pregunta = i + 1;
        });
        setQuiz({ ...quiz, preguntas: updatedPreguntas });
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium">Pregunta {pregunta.numero_pregunta}</h4>
                <button
                    onClick={removePregunta}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar pregunta"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Enunciado (Español) *
                        </label>
                        <textarea
                            value={pregunta.enunciado}
                            onChange={(e) => updatePregunta('enunciado', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Enunciado (Inglés)
                        </label>
                        <textarea
                            value={pregunta.enunciado_en}
                            onChange={(e) => updatePregunta('enunciado_en', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Opciones de Respuesta
                    </label>
                    <div className="space-y-2">
                        {pregunta.opciones.map((opcion, opcionIndex) => (
                            <div key={opcionIndex} className="flex items-start gap-3 p-2 bg-white rounded">
                                <input
                                    type="radio"
                                    name={`pregunta-${index}-correcta`}
                                    checked={opcion.es_correcta}
                                    onChange={(e) => updateOpcion(opcionIndex, 'es_correcta', e.target.checked)}
                                    className="mt-1"
                                />
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={opcion.texto}
                                        onChange={(e) => updateOpcion(opcionIndex, 'texto', e.target.value)}
                                        placeholder={`Opción ${String.fromCharCode(65 + opcionIndex)} (Español)`}
                                        className="px-2 py-1 border rounded text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={opcion.texto_en}
                                        onChange={(e) => updateOpcion(opcionIndex, 'texto_en', e.target.value)}
                                        placeholder={`Opción ${String.fromCharCode(65 + opcionIndex)} (Inglés)`}
                                        className="px-2 py-1 border rounded text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Explicación de respuesta correcta (Español)
                        </label>
                        <textarea
                            value={pregunta.explicacion}
                            onChange={(e) => updatePregunta('explicacion', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="2"
                            placeholder="Se mostrará cuando seleccionen la respuesta correcta"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Explicación de respuesta correcta (Inglés)
                        </label>
                        <textarea
                            value={pregunta.explicacion_en}
                            onChange={(e) => updatePregunta('explicacion_en', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="2"
                            placeholder="Will show when correct answer is selected"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}