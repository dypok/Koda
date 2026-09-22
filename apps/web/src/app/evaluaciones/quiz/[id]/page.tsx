'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { getCookie } from 'cookies-next';

export default function QuizPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadQuiz() {
      try {
        const token = getCookie('supabase-auth-token');
        const res = await fetch(`http://localhost:3001/api/v1/learning/modules/${params.id}/quiz`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error('Error cargando el quiz');
        
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
         toast.error('Hubo un problema al cargar el quiz');
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Cargando Quiz...</div>;
  if (!questions.length) return <div className="p-8 text-center text-red-500">No hay preguntas disponibles</div>;

  const currentQ = questions[currentIndex];
  
  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!confirm(`Tienes ${questions.length - Object.keys(answers).length} preguntas sin responder. ¿Estás seguro de enviar el quiz?`)) {
        return;
      }
    }
    
    setSubmitting(true);
    try {
        const token = getCookie('supabase-auth-token');
        const res = await fetch(`http://localhost:3001/api/v1/learning/quiz/${params.id}/attempt`, {
          method: 'POST',
          headers: { 
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ answers, time_spent_seconds: 120 })
        });
        
        if (!res.ok) throw new Error('Error evaluando el quiz');
        const result = await res.json();
        
        if (result.passed) {
          toast.success(`¡Felicidades! Aprobaste con un ${result.score}% y ganaste ${result.xp_earned} XP`);
        } else {
          toast.error(`Obtuviste ${result.score}%. Necesitas 70% para aprobar.`);
        }
        
        // Redirigir a resumen
        router.push(`/evaluaciones/resumen/${result.attempt_id}`);
    } catch (error) {
       toast.error('Error al calificar el quiz');
    } finally {
       setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz Intermedio</h1>
        <div className="text-sm font-medium text-slate-500">Pregunta {currentIndex + 1} de {questions.length}</div>
      </div>
      
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-medium mb-6">{currentQ.prompt}</h2>
        {currentQ.code_snippet && (
           <pre className="bg-slate-900 text-green-400 p-4 rounded-md mb-6 overflow-x-auto text-sm">
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
                  ? 'border-blue-600 bg-blue-50/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          Anterior
        </Button>
        
        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Evaluando...' : 'Enviar Quiz'}
          </Button>
        ) : (
          <Button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}>
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
