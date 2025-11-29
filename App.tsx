import React, { useState, useEffect } from 'react';
import { analyzeManifesto } from './services/geminiService';
import { ManifestoAnalysis, AppState, ActionItem } from './types';
import ValuesChart from './components/ValuesChart';
import ManifestoDisplay from './components/ManifestoDisplay';
import { 
  LoaderIcon, 
  SparklesIcon, 
  TargetIcon, 
  BookIcon, 
  HeartIcon, 
  CheckCircleIcon 
} from './components/Icons';

// Default input provided by user
const DEFAULT_MANIFESTO = `دیانتداری اور مسلسل علم کے حصول کے اصولوں پر کاربند رہتے ہوئے، میرا عزم ہے کہ بطور بیٹا اور بھائی میں اپنے خاندان کے لیے قابلِ اعتماد سہارے کا منبع بنوں، جبکہ خدمت کے جذبے سے معاشرے کے کمزور طبقوں کی مؤثر آواز بنوں۔ میرا حتمی نصب العین یہ ہے کہ ایک سرگرم طالب علم کی حیثیت سے اپنے منتخب پیشہ میں غیر معمولی مہارت اور برتری حاصل کروں تاکہ ایک بامقصد اور کامیاب زندگی گزار سکوں۔`;

const App: React.FC = () => {
  const [manifestoText, setManifestoText] = useState(DEFAULT_MANIFESTO);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysis, setAnalysis] = useState<ManifestoAnalysis | null>(null);
  const [todos, setTodos] = useState<ActionItem[]>([]);

  // Function to handle analysis
  const handleAnalyze = async () => {
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeManifesto(manifestoText);
      setAnalysis(result);
      
      // Convert raw strings to ActionItem objects
      const newTodos: ActionItem[] = result.suggestedActions.map((action, index) => ({
        id: `todo-${index}`,
        title: action,
        category: 'Self', // Default, could be refined
        isCompleted: false
      }));
      setTodos(newTodos);
      setAppState(AppState.DASHBOARD);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  // Auto-analyze on load for the demo experience
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const calculateProgress = () => {
    if (todos.length === 0) return 0;
    const completed = todos.filter(t => t.isCompleted).length;
    return Math.round((completed / todos.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-urdu font-bold text-lg pt-1">
              ع
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Azm-e-Hayat</h1>
          </div>
          <div className="flex items-center gap-4">
             {appState === AppState.DASHBOARD && (
                 <div className="hidden sm:flex text-sm text-slate-500 gap-1 items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Ready for service
                 </div>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* State: IDLE or ERROR */}
        {appState === AppState.ERROR && (
           <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
             Something went wrong connecting to the AI guide. Please ensure your API Key is valid.
             <button onClick={handleAnalyze} className="ml-4 underline font-bold">Retry</button>
           </div>
        )}

        {/* State: ANALYZING */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <LoaderIcon className="w-16 h-16 text-emerald-600 animate-spin relative z-10" />
            </div>
            <div>
                <h2 className="text-2xl font-urdu mb-2 text-slate-800">تجزیہ کیا جا رہا ہے...</h2>
                <p className="text-slate-500">Reflecting on your principles...</p>
            </div>
          </div>
        )}

        {/* State: DASHBOARD */}
        {appState === AppState.DASHBOARD && analysis && (
          <>
            {/* 1. Hero: Manifesto Display */}
            <ManifestoDisplay 
                urduText={manifestoText} 
                englishTranslation={analysis.englishTranslation}
            />

            {/* 2. Grid Layout for Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Column 1: Core Values Visualization */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <HeartIcon className="text-emerald-500 w-5 h-5" />
                        <h3 className="font-bold text-lg">Core Values Profile</h3>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <ValuesChart data={analysis.coreValues} />
                    </div>
                    <div className="mt-4 space-y-3">
                        {analysis.coreValues.slice(0, 3).map((val, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                <span className="font-bold text-emerald-700 text-sm whitespace-nowrap">{val.name}</span>
                                <p className="text-xs text-slate-500 leading-tight">{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Action Plan */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <TargetIcon className="text-emerald-500 w-5 h-5" />
                            <h3 className="font-bold text-lg">Daily Action Plan</h3>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            {calculateProgress()}% Complete
                        </div>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                        <div 
                            className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>

                    <div className="space-y-4">
                        {todos.map((todo) => (
                            <div 
                                key={todo.id} 
                                onClick={() => toggleTodo(todo.id)}
                                className={`
                                    group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                                    ${todo.isCompleted 
                                        ? 'bg-emerald-50 border-emerald-100' 
                                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${todo.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}
                                `}>
                                    {todo.isCompleted && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                </div>
                                <span className={`flex-grow font-medium text-base ${todo.isCompleted ? 'text-emerald-800 line-through opacity-70' : 'text-slate-700'}`}>
                                    {todo.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Daily Inspiration */}
                    <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 flex gap-4">
                        <SparklesIcon className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wider">Daily Inspiration</h4>
                            <p className="text-indigo-800 italic font-serif text-lg leading-relaxed">
                                "{analysis.dailyMotivation}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Reflection Journal (Static Demo) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <BookIcon className="text-emerald-500 w-5 h-5" />
                    <h3 className="font-bold text-lg">Evening Reflection</h3>
                </div>
                <textarea 
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
                    placeholder="How did you embody your values of honesty and service today? (Write here...)"
                ></textarea>
                <div className="flex justify-end mt-4">
                    <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                        Save Journal
                    </button>
                </div>
            </div>
          </>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm py-8">
        <p>&copy; {new Date().getFullYear()} Azm-e-Hayat. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;