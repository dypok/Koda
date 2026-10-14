'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


function getCookie(n:string){if(typeof document==='undefined')return'';const v=document.cookie.match('(^|;) ?'+n+'=([^;]*)(;|$)');return v?v[2]:null;}
import { CheckCircle, XCircle, ArrowRight } from '@phosphor-icons/react';

export default function AttemptReviewScreen({ params }: { params: { attemptId: string } }) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const router = useRouter();

  useEffect(() => {
    async function loadSummary() {
      try {
        const token = getCookie('supabase-auth-token');
        const res = await fetch(`http://localhost:3001/api/v1/learning/attempts/${params.attemptId}/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setSummary(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [params.attemptId]);

  if (loading) return <div className="p-8 text-center">Cargando revisión...</div>;
  if (!summary) return <div className="p-8 text-center text-red-500">Intento no encontrado</div>;

  const { passed, score, details } = summary;
  const correctCount = details.filter((d: any) => d.is_correct).length;
  const incorrectCount = details.length - correctCount;

  const filteredDetails = details.filter((d: any) => {
     if (filter === 'correct') return d.is_correct;
     if (filter === 'incorrect') return !d.is_correct;
     return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      
      <div className={`rounded-xl p-8 text-center mb-8 text-white ${passed ? 'bg-green-600' : 'bg-red-500'}`}>
         <h1 className="text-3xl font-bold mb-2">
            {passed ? '¡Evaluación Aprobada!' : 'Evaluación Reprobada'}
         </h1>
         <p className="text-xl opacity-90">Puntuación: {score.toFixed(1)}%</p>
      </div>

      <div className="flex gap-4 mb-6">
         <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded-full font-medium ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>
            Todas ({details.length})
         </button>
         <button 
            onClick={() => setFilter('correct')} 
            className={`px-4 py-2 rounded-full font-medium ${filter === 'correct' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}>
            Aciertos ({correctCount})
         </button>
         <button 
            onClick={() => setFilter('incorrect')} 
            className={`px-4 py-2 rounded-full font-medium ${filter === 'incorrect' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-700'}`}>
            Por Mejorar ({incorrectCount})
         </button>
      </div>

      <div className="space-y-6">
        {filteredDetails.map((item: any, i: number) => (
           <div key={i} className={`p-6 border-l-4 ${item.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex gap-4 items-start">
                 <div className="mt-1">
                    {item.is_correct ? <CheckCircle weight='fill' className="text-green-500 w-6 h-6" /> : <XCircle weight='fill' className="text-red-500 w-6 h-6" />}
                 </div>
                 <div className="flex-1">
                    <h3 className="text-lg font-medium mb-4">{item.prompt}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div className="bg-slate-50 p-3 rounded-md border">
                          <div className="text-xs font-semibold text-slate-400 mb-1">Tu respuesta:</div>
                          <div className={item.is_correct ? 'text-green-700' : 'text-red-600 line-through'}>
                             {item.user_answer || '(Sin responder)'}
                          </div>
                       </div>
                       
                       {!item.is_correct && (
                          <div className="bg-green-50 p-3 rounded-md border border-green-100">
                             <div className="text-xs font-semibold text-green-600 mb-1">Respuesta correcta:</div>
                             <div className="text-green-800">
                                {item.correct_answer}
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md mt-4">
                       <div className="text-sm font-semibold text-blue-800 mb-1">Feedback formativo:</div>
                       <p className="text-sm text-blue-900">{item.explanation || 'Revisa la teoría correspondiente a este concepto.'}</p>
                    </div>
                 </div>
              </div>
           </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center pb-12">
         <button className="gap-2" onClick={() => router.push('/dashboard')}>
            {passed ? 'Continuar al siguiente módulo' : 'Repasar conceptos clave'} <ArrowRight className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
}
