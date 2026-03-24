import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, Trash2, BarChart3, 
  Target, Heart, Timer, ChevronRight, ChevronLeft, 
  UserPlus, Send, Save, Book
} from 'lucide-react';

const App = () => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  
  const [datosMensuales, setDatosMensuales] = useState(() => {
    const guardado = localStorage.getItem('sakura_data_v2');
    return guardado ? JSON.parse(guardado) : {};
  });

  useEffect(() => {
    localStorage.setItem('sakura_data_v2', JSON.stringify(datosMensuales));
  }, [datosMensuales]);

  const mesActualKey = meses[mesIndice];
  const currentData = datosMensuales[mesActualKey] || {
    meta: 50, horas: 0, minutos: 0, revisitas: 0, estudios: []
  };

  const updateCurrentMonth = (newData) => {
    setDatosMensuales(prev => ({
      ...prev, [mesActualKey]: { ...currentData, ...newData }
    }));
  };

  const enviarWhatsApp = () => {
    let textoEstudios = currentData.estudios.length > 0 
      ? currentData.estudios.map(e => `- ${e.nombre} (${e.leccion})`).join('%0A')
      : 'Ninguno';

    const mensaje = `🌸 *Informe de ${mesActualKey}* 🌸%0A%0A` +
                    `⏱️ *Tiempo:* ${currentData.horas}h ${currentData.minutos}m%0A` +
                    `🔄 *Revisitas:* ${currentData.revisitas}%0A` +
                    `📖 *Estudios:* ${currentData.estudiantes ? currentData.estudiantes.length : 0}%0A%0A` +
                    `📚 *Detalle de Cursos:*%0A${textoEstudios}%0A%0A` +
                    `_Enviado desde mi Registro Sakura_`;
    
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoMinuto, setNuevoMinuto] = useState('');
  const [nuevaRevisita, setNuevaRevisita] = useState('');
  
  // Nuevo estado para los 3 campos de estudio
  const [estudioTemp, setEstudioTemp] = useState({ nombre: '', fecha: '', leccion: '' });

  const agregarTiempo = () => {
    let h = parseInt(nuevaHora) || 0;
    let m = parseInt(nuevoMinuto) || 0;
    if (h > 0 || m > 0) {
      const totalMinutos = (currentData.horas * 60) + currentData.minutos + (h * 60) + m;
      updateCurrentMonth({ horas: Math.floor(totalMinutos / 60), minutos: totalMinutos % 60 });
      setNuevaHora(''); setNuevoMinuto('');
    }
  };

  const agregarEstudio = () => {
    if (estudioTemp.nombre && estudioTemp.fecha) {
      const listaActual = currentData.estudios || [];
      updateCurrentMonth({ 
        estudios: [...listaActual, { ...estudioTemp, id: Date.now() }] 
      });
      setEstudioTemp({ nombre: '', fecha: '', leccion: '' });
    }
  };

  const borrarEstudio = (id) => {
    updateCurrentMonth({ 
      estudios: currentData.estudios.filter(e => e.id !== id) 
    });
  };

  const porcentaje = Math.min(100, (currentData.horas / currentData.meta) * 100);

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4 font-sans text-slate-800 pb-20">
      <div className="max-w-md mx-auto">
        
        {/* Navegación de Mes */}
        <nav className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-pink-100">
          <button onClick={() => setMesIndice((mesIndice - 1 + 12) % 12)} className="text-pink-400"><ChevronLeft /></button>
          <div className="text-center">
            <h1 className="text-xl font-black text-pink-600 uppercase italic tracking-tighter">{mesActualKey}</h1>
            <p className="text-[9px] font-bold text-pink-300 uppercase tracking-widest">Ministerio Sakura</p>
          </div>
          <button onClick={() => setMesIndice((mesIndice + 1) % 12)} className="text-pink-400"><ChevronRight /></button>
        </nav>

        {/* Meta de Horas */}
        <section className="bg-white p-5 rounded-[2rem] shadow-md border border-pink-50 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-pink-100 p-2 rounded-xl text-pink-500"><Target size={18}/></div>
              <input type="number" value={currentData.meta} onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })} className="w-10 font-bold text-lg text-pink-600 bg-transparent focus:outline-none" />
              <span className="text-xs font-bold text-pink-300 uppercase">Horas</span>
            </div>
            <span className="font-black text-pink-500">{porcentaje.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-pink-50 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400 transition-all duration-500" style={{ width: `${porcentaje}%` }} />
          </div>
        </section>

        {/* Registro Diario */}
        <section className="bg-white p-5 rounded-[2rem] shadow-md border border-pink-50 mb-6">
          <h2 className="text-[10px] font-black uppercase text-pink-300 mb-4 flex items-center gap-2"><Timer size={14} /> Registro Diario</h2>
          <div className="flex gap-2">
            <input type="number" placeholder="H" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)} className="w-full bg-pink-50/50 rounded-2xl p-3 text-center font-bold text-pink-600" />
            <input type="number" placeholder="M" value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)} className="w-full bg-pink-50/50 rounded-2xl p-3 text-center font-bold text-pink-600" />
            <button onClick={agregarTiempo} className="bg-pink-500 text-white px-6 rounded-2xl font-black text-xl shadow-lg shadow-pink-100">+</button>
          </div>
        </section>

        {/* CURSOS BÍBLICOS (La nueva parte) */}
        <section className="bg-white p-5 rounded-[2rem] shadow-md border border-pink-50 mb-6">
          <h2 className="text-[10px] font-black uppercase text-pink-300 mb-4 flex items-center gap-2"><Book size={14} /> Cursos Bíblicos</h2>
          <div className="space-y-2 mb-4">
            <input type="text" placeholder="Nombre del estudiante" value={estudioTemp.nombre} onChange={e => setEstudioTemp({...estudioTemp, nombre: e.target.value})} className="w-full bg-pink-50/30 border border-pink-100 rounded-xl p-3 text-sm" />
            <div className="flex gap-2">
              <input type="date" value={estudioTemp.fecha} onChange={e => setEstudioTemp({...estudioTemp, fecha: e.target.value})} className="w-full bg-pink-50/30 border border-pink-100 rounded-xl p-3 text-sm text-pink-400" />
              <input type="text" placeholder="Lección/Cap." value={estudioTemp.leccion} onChange={e => setEstudioTemp({...estudioTemp, leccion: e.target.value})} className="w-full bg-pink-50/30 border border-pink-100 rounded-xl p-3 text-sm" />
            </div>
            <button onClick={agregarEstudio} className="w-full bg-pink-500 text-white p-3 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2">
              <UserPlus size={16}/> Registrar Visita
            </button>
          </div>

          <div className="space-y-2">
            {(currentData.estudios || []).map(est => (
              <div key={est.id} className="flex justify-between items-center bg-pink-50/20 p-3 rounded-2xl border border-pink-50">
                <div className="flex flex-col">
                  <span className="font-bold text-pink-700 text-sm">{est.nombre}</span>
                  <span className="text-[10px] text-pink-300 font-bold">{est.fecha} — {est.leccion}</span>
                </div>
                <button onClick={() => borrarEstudio(est.id)} className="text-pink-200 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </section>

        {/* Resumen Final */}
        <section className="bg-pink-600 p-6 rounded-[2.5rem] shadow-xl text-white mb-6">
          <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] font-black uppercase opacity-70 italic">Resumen Mensual</span>
             <BarChart3 size={16} className="opacity-70"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase opacity-60">Tiempo Total</p>
              <p className="text-2xl font-black">{currentData.horas}h {currentData.minutos}m</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase opacity-60">Estudios</p>
              <p className="text-2xl font-black">{(currentData.estudios || []).length}</p>
            </div>
          </div>
        </section>

        <button onClick={enviarWhatsApp} className="w-full bg-white border-2 border-pink-100 text-pink-500 p-4 rounded-3xl font-black uppercase flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all">
          <Send size={20} /> Enviar Informe a WhatsApp
        </button>

      </div>
    </div>
  );
};

export default App;
