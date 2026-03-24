import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, Trash2, BarChart3, 
  Target, Heart, Timer, ChevronRight, ChevronLeft, 
  UserPlus, Send, Save
} from 'lucide-react';

const App = () => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  
  // --- Lógica de Autoguardado (LocalStorage) ---
  const [datosMensuales, setDatosMensuales] = useState(() => {
    const guardado = localStorage.getItem('sakura_data');
    return guardado ? JSON.parse(guardado) : {};
  });

  useEffect(() => {
    localStorage.setItem('sakura_data', JSON.stringify(datosMensuales));
  }, [datosMensuales]);

  const mesActualKey = meses[mesIndice];
  const currentData = datosMensuales[mesActualKey] || {
    meta: 50, horas: 0, minutos: 0, revisitas: 0, estudiantes: []
  };

  const updateCurrentMonth = (newData) => {
    setDatosMensuales(prev => ({
      ...prev, [mesActualKey]: { ...currentData, ...newData }
    }));
  };

  // --- Función para WhatsApp ---
  const enviarWhatsApp = () => {
    const mensaje = `🌸 *Informe de ${mesActualKey}* 🌸%0A%0A` +
                    `⏱️ *Tiempo:* ${currentData.horas}h ${currentData.minutos}m%0A` +
                    `🔄 *Revisitas:* ${currentData.revisitas}%0A` +
                    `📖 *Estudios:* ${currentData.estudiantes.length}%0A%0A` +
                    `_Enviado desde mi Registro Sakura_`;
    
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  // Estados locales
  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoMinuto, setNuevoMinuto] = useState('');
  const [nuevaRevisita, setNuevaRevisita] = useState('');
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: '', fecha: '', leccion: '' });

  const agregarTiempo = () => {
    let h = parseInt(nuevaHora) || 0;
    let m = parseInt(nuevoMinuto) || 0;
    if (h > 0 || m > 0) {
      const totalMinutos = (currentData.horas * 60) + currentData.minutos + (h * 60) + m;
      updateCurrentMonth({ horas: Math.floor(totalMinutos / 60), minutos: totalMinutos % 60 });
      setNuevaHora(''); setNuevoMinuto('');
    }
  };

  const agregarEstudiante = () => {
    if (nuevoEstudiante.nombre) {
      updateCurrentMonth({ estudiantes: [...currentData.estudiantes, { ...nuevoEstudiante, id: Date.now() }] });
      setNuevoEstudiante({ nombre: '', fecha: '', leccion: '' });
    }
  };

  const porcentaje = Math.min(100, (currentData.horas / currentData.meta) * 100);
  const SakuraIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12,22C12,22 15,18.5 15,15.5C15,13.5 13.5,12 12,12C10.5,12 9,13.5 9,15.5C9,18.5 12,22 12,22M12,2C12,2 9,5.5 9,8.5C9,10.5 10.5,12 12,12C13.5,12 15,10.5 15,8.5C15,5.5 12,2 12,2M2,12C2,12 5.5,15 8.5,15C10.5,15 12,13.5 12,12C12,10.5 10.5,9 8.5,9C5.5,9 2,12 2,12M22,12C22,12 18.5,9 15.5,9C13.5,9 12,10.5 12,12C12,13.5 13.5,15 15.5,15C18.5,15 22,12 22,12Z" /></svg>
  );

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4 md:p-8 font-sans text-slate-800 relative overflow-hidden pb-24">
      <div className="absolute top-[-5%] left-[-5%] text-pink-100 opacity-50 rotate-45"><SakuraIcon className="w-64 h-64" /></div>
      <div className="max-w-4xl mx-auto relative z-10">
        
        <nav className="flex items-center justify-between mb-8 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border border-pink-100">
          <button onClick={() => setMesIndice((mesIndice - 1 + 12) % 12)} className="p-2 text-pink-400"><ChevronLeft size={28} /></button>
          <div className="text-center">
            <h1 className="text-2xl font-serif font-black text-pink-600 uppercase tracking-tighter">{mesActualKey}</h1>
            <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest">Año de Servicio</p>
          </div>
          <button onClick={() => setMesIndice((mesIndice + 1) % 12)} className="p-2 text-pink-400"><ChevronRight size={28} /></button>
        </nav>

        <section className="bg-white/90 p-6 rounded-[2.5rem] shadow-lg border border-pink-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500 p-2 rounded-2xl text-white"><Target size={20} /></div>
              <div>
                <span className="text-xs font-bold text-pink-300 uppercase">Meta</span>
                <input type="number" value={currentData.meta} onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })} className="w-12 font-black text-xl text-pink-600 bg-transparent focus:outline-none" />
              </div>
            </div>
            <p className="text-2xl font-black text-pink-500">{porcentaje.toFixed(0)}%</p>
          </div>
          <div className="h-3 w-full bg-pink-50 rounded-full overflow-hidden border border-pink-100"><div className="h-full bg-pink-500 transition-all duration-700" style={{ width: `${porcentaje}%` }} /></div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <section className="bg-white/80 p-6 rounded-[2.5rem] shadow-md border border-pink-100">
            <h2 className="text-sm font-black uppercase text-pink-400 mb-4 flex items-center gap-2"><Timer size={16} /> Registro</h2>
            <div className="flex gap-2 mb-4">
              <input type="number" placeholder="H" className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-pink-700" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)} />
              <input type="number" placeholder="M" className="w-full bg-pink-50/50 rounded-xl px-4 py-3 text-pink-700" value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)} />
              <button onClick={agregarTiempo} className="bg-pink-500 text-white px-5 rounded-xl font-bold">+</button>
            </div>
            <div className="flex gap-2 pt-4 border-t border-pink-50">
              <input type="number" placeholder="Revisitas..." className="flex-1 bg-pink-50/50 rounded-xl px-4 py-2 text-sm" value={nuevaRevisita} onChange={e => setNuevaRevisita(e.target.value)} />
              <button onClick={() => { updateCurrentMonth({ revisitas: currentData.revisitas + (parseInt(nuevaRevisita) || 0) }); setNuevaRevisita(''); }} className="bg-pink-400 text-white px-4 rounded-xl font-bold text-xs">ADD</button>
            </div>
          </section>

          <section className="bg-white/90 p-6 rounded-[2.5rem] shadow-xl border border-pink-100">
            <h2 className="text-sm font-black uppercase text-pink-400 mb-4 flex items-center gap-2"><BarChart3 size={16} /> Resumen</h2>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Tiempo Total</span><span className="font-black text-pink-600">{currentData.horas}h {currentData.minutos}m</span></div>
              <div className="flex justify-between"><span>Revisitas</span><span className="font-black text-pink-600">{currentData.revisitas}</span></div>
            </div>
          </section>
        </div>

        <section className="bg-white/90 p-6 rounded-[2.5rem] shadow-xl border border-pink-100 mb-8">
          <h2 className="text-sm font-black uppercase text-pink-400 mb-4 flex items-center gap-2"><BookOpen size={16} /> Estudios Bíblicos</h2>
          <div className="space-y-3 mb-6 bg-pink-50/30 p-4 rounded-3xl">
            <input type="text" placeholder="Nombre" className="w-full bg-white rounded-xl px-4 py-2 text-sm" value={nuevoEstudiante.nombre} onChange={e => setNuevoEstudiante({...nuevoEstudiante, nombre: e.target.value})} />
            <button onClick={agregarEstudiante} className="w-full bg-pink-600 text-white py-2 rounded-xl font-bold text-sm">Registrar Visita</button>
          </div>
          <div className="space-y-3">
            {currentData.estudiantes.map(est => (
              <div key={est.id} className="flex justify-between items-center bg-white border border-pink-50 p-4 rounded-2xl">
                <span className="font-black text-pink-700">{est.nombre}</span>
                <button onClick={() => updateCurrentMonth({ estudiantes: currentData.estudiantes.filter(e => e.id !== est.id) })} className="text-red-300"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4 mt-8">
          <button onClick={() => alert("¡Tus datos están seguros en este teléfono!")} className="bg-white border-2 border-pink-200 text-pink-500 py-4 rounded-3xl font-black uppercase flex items-center justify-center gap-3 shadow-sm">
            <Save size={20} /> Datos Guardados
          </button>
          <button onClick={enviarWhatsApp} className="bg-pink-600 text-white py-4 rounded-3xl font-black uppercase flex items-center justify-center gap-3 hover:bg-pink-700 shadow-lg active:scale-95">
            <Send size={20} /> Enviar Informe de {mesActualKey}
          </button>
        </div>

        <footer className="mt-16 text-center opacity-30 font-black text-[10px] uppercase tracking-[0.5em]">🌸 Ministerio Sakura 🌸</footer>
      </div>
    </div>
  );
};

export default App;
