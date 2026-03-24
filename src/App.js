import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Radio, Heart, Timer, ChevronRight, Save } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('registro');
  const [registros, setRegistros] = useState([]);
  const [tiempo, setTiempo] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTiempo(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const agregarRegistro = (tipo) => {
    const nuevo = {
      id: Date.now(),
      tipo,
      hora: tiempo.toLocaleTimeString(),
      fecha: tiempo.toLocaleDateString()
    };
    setRegistros([nuevo, ...registros]);
  };

  const SeccionRegistro = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-pink-100 text-center">
        <div className="text-5xl font-bold text-pink-500 mb-2 drop-shadow-sm">
          {tiempo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <p className="text-pink-400 font-medium">{tiempo.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => agregarRegistro('Entrada')} className="bg-gradient-to-br from-pink-400 to-rose-400 text-white p-6 rounded-3xl shadow-md active:scale-95 transition-all flex flex-col items-center gap-2">
          <Timer size={32} />
          <span className="font-bold">ENTRADA</span>
        </button>
        <button onClick={() => agregarRegistro('Salida')} className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-3xl shadow-md active:scale-95 transition-all flex flex-col items-center gap-2">
          <Save size={32} />
          <span className="font-bold">SALIDA</span>
        </button>
      </div>

      <div className="bg-white/60 rounded-3xl p-4 max-h-64 overflow-y-auto shadow-inner">
        {registros.length === 0 ? (
          <p className="text-center text-pink-300 py-8 italic">No hay registros hoy 🌸</p>
        ) : (
          registros.map(r => (
            <div key={r.id} className="bg-white p-3 rounded-2xl mb-2 shadow-sm flex justify-between items-center border-l-4 border-pink-400">
              <span className="font-bold text-pink-600">{r.tipo}</span>
              <span className="text-gray-500 text-sm">{r.hora}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fff0f5] pb-24 font-sans text-gray-700">
      <div className="max-w-md mx-auto p-4">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-black text-rose-500 tracking-tight">SAKURA APP 🌸</h1>
          <Heart className="text-pink-400 fill-pink-400" size={24} />
        </header>

        {activeTab === 'registro' && <SeccionRegistro />}
        {activeTab === 'cursos' && (
          <div className="bg-white/80 p-6 rounded-3xl shadow-lg border border-pink-100 text-center animate-in slide-in-from-right">
            <BookOpen size={48} className="mx-auto text-pink-400 mb-4" />
            <h2 className="text-xl font-bold text-pink-600 mb-2">Cursos Bíblicos</h2>
            <p className="text-gray-500">Sección en construcción para tus estudios 📖</p>
          </div>
        )}
        {activeTab === 'radio' && (
          <div className="bg-white/80 p-6 rounded-3xl shadow-lg border border-pink-100 text-center animate-in slide-in-from-right">
            <Radio size={48} className="mx-auto text-pink-400 mb-4" />
            <h2 className="text-xl font-bold text-pink-600 mb-2">Emisora</h2>
            <p className="text-gray-500">Sintonizando tu fe... 📻</p>
          </div>
        )}

        <nav className="fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-pink-50 p-2 flex justify-around items-center">
          <button onClick={() => setActiveTab('cursos')} className={`p-4 rounded-full transition-all ${activeTab === 'cursos' ? 'bg-pink-100 text-pink-600' : 'text-gray-400'}`}>
            <BookOpen size={24} />
          </button>
          <button onClick={() => setActiveTab('registro')} className={`p-4 rounded-full transition-all ${activeTab === 'registro' ? 'bg-pink-500 text-white scale-110 shadow-lg' : 'text-gray-400'}`}>
            <Calendar size={24} />
          </button>
          <button onClick={() => setActiveTab('radio')} className={`p-4 rounded-full transition-all ${activeTab === 'radio' ? 'bg-pink-100 text-pink-600' : 'text-gray-400'}`}>
            <Radio size={24} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
