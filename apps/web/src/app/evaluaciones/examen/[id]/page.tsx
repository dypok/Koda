'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';





export default function ExamPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
function getCookie(name: string) { if (typeof document === "undefined") return ""; const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)"); return v ? v[2] : null; }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const router = useRouter();

  useEffect(() => {
    async function loadExam() {
      try {
        const token = getCookie('supabase-auth-token');
        const res = await fetch(`http://localhost:3001/api/v1/learning/modules/${params.id}/exam`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Error cargando el examen');
        
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
         alert('Hubo un problema al cargar el examen');
      } finally {
        setLoading(false);
      }
    }
    loadExam();
  }, [params.id]);

  useEffect(() => {
    if (loading || submitting) return;
    const timer = setInterval(() => {
       setTimeLeft(prev => {
          if (prev <= 1) {
             clearInterval(timer);
             handleSubmit();
             return 0;
          }
          return prev - 1;
       });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitting]);

  if (loading) return <div className="p-8 text-center">Cargando Examen Final...</div>;
  if (!questions.length) return <div className="p-8 text-center text-red-500">No hay preguntas disponibles</div>;

  const currentQ = questions[currentIndex];
  
  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleSubmit = async () => {
    if (timeLeft > 0 && Object.keys(answers).length < questions.length) {
      if (!confirm(`Tienes ${questions.length - Object.keys(answers).length} preguntas sin responder. ¿Estás seguro de enviar el examen?`)) {
        return;
      }
    }
    
    setSubmitting(true);
    try {
        const token = getCookie('supabase-auth-token');
        const res = await fetch(`http://localhost:3001/api/v1/learning/exam/${params.id}/attempt`, {
          method: 'POST',
          headers: { 
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ answers, time_spent_seconds: 1800 - timeLeft })
        });
        
        if (!res.ok) throw new Error('Error evaluando el examen');
        const result = await res.json();
        
        if (result.passed) {
          alert(`¡Módulo Completado! Aprobaste con un ${result.score}% y ganaste ${result.xp_earned} XP`);
        } else {
          alert(`Obtuviste ${result.score}%. Necesitas 80% para certificar este módulo.`);
        }
        
        // Redirigir a resumen
        router.push(`/evaluaciones/resumen/${result.attempt_id}`);
    } catch (error) {
       alert('Error al calificar el examen');
       setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
     const m = Math.floor(seconds / 60).toString().padStart(2, '0');
     const s = (seconds % 60).toString().padStart(2, '0');
     return `${m}:${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Examen Final de Módulo</h1>
        <div className="flex items-center gap-4">
           <div className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
             ⏳ {formatTime(timeLeft)}
           </div>
           <div className="text-sm font-medium text-slate-500">
             {currentIndex + 1} / {questions.length}
           </div>
        </div>
      </div>
      
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-8 border-t-4 border-t-indigo-600 shadow-lg">
        <h2 className="text-xl font-medium mb-6">{currentQ.prompt}</h2>
        {currentQ.code_snippet && (
           <pre className="bg-slate-900 text-green-400 p-4 rounded-md mb-6 overflow-x-auto text-sm shadow-inner">
             {currentQ.code_snippet}
           </pre>
        )}
        
        <div className="space-y-3">
          {currentQ.options?.map((opt: any) => (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                answers[currentQ.id] === opt.id 
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          Anterior
        </button>
        
        {currentIndex === questions.length - 1 ? (
          <button onClick={handleSubmit} disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {submitting ? 'Evaluando...' : 'Finalizar Examen'}
          </button>
        ) : (
          <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}
