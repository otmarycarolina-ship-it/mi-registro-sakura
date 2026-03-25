import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Clock, BookOpen, Trash2, Target, 
  Timer, ChevronRight, ChevronLeft, UserPlus, Send, X, Play, Pause
} from 'lucide-react';

const App = () => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  const [datosMensuales, setDatosMensuales] = useState(() => {
    const salvo = localStorage.getItem('sakura_data_v7');
    return salvo ? JSON.parse(salvo) : {};
  });

  // Estados para el Cronómetro
  const [segundosReloj, setSegundosReloj] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const timerRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(null);
  const mesActualKey = meses[mesIndice];

  useEffect(() => {
    localStorage.setItem('sakura_data_v7', JSON.stringify(datosMensuales));
  }, [datosMensuales]);

  // Lógica del Cronómetro (Sincronizado)
  useEffect(() => {
    if (corriendo) {
      timerRef.current = setInterval(() => {
        setSegundosReloj(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [corriendo]);

  const currentData = datosMensuales[mesActualKey] || {
    meta: 50, 
    estudiantes: [], 
    historial: {} 
  };

  const updateCurrentMonth = (newData) => {
    setDatosMensuales(prev => ({
      ...prev,
      [mesActualKey]: { ...currentData, ...newData }
    }));
  };

  const formatTiempoReloj = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Función para pasar el tiempo del cronómetro al informe total
  const guardarTiempoReloj = () => {
    const h = Math.floor(segundosReloj / 3600);
    const m = Math.floor((segundosReloj % 3600) / 60);
    if (h > 0 || m > 0) {
      registrarActividad(h, m);
      setSegundosReloj(0);
      setCorriendo(false);
    }
  };

  const calcularTotales = () => {
    let totalMinutos = 0;
    Object.values(currentData.historial || {}).forEach(dia => {
      totalMinutos += (dia.h * 60) + dia.m;
    });
    return {
      horas: Math.floor(totalMinutos / 60),
      minutos: totalMinutos % 60,
      totalMinutos
    };
  };

  const { horas, minutos, totalMinutos } = calcularTotales();
  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoMinuto, setNuevoMinuto] = useState('');
  const [formEstudiante, setFormEstudiante] = useState({ nombre: '', fecha: '', leccion: '', horaVisita: '', notas: '' });

  const registrarActividad = (hInput, mInput) => {
    let h = parseInt(hInput) || 0;
    let m = parseInt(mInput) || 0;
    const hoy = new Date().getDate();
    const historialActualizado = { ...currentData.historial };
    const tiempoPrevio = historialActualizado[hoy] || { h: 0, m: 0 };
    
    historialActualizado[hoy] = {
      h: tiempoPrevio.h + h,
      m: tiempoPrevio.m + m
    };

    updateCurrentMonth({ historial: historialActualizado });
    setNuevaHora(''); 
    setNuevoMinuto('');
  };

  const enviarWhatsApp = () => {
    const mensaje = `🌸 *Mi Registro de Servicio* 🌸\n\n📅 *Mes:* ${mesActualKey}\n⏱️ *Horas:* ${horas}h ${minutos}m\n📖 *Cursos Bíblicos:* ${currentData.estudiantes.length}\n\n_Enviado desde mi Registro Sakura_ 🌸`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const porcentaje = Math.min(100, (totalMinutos / (currentData.meta * 60)) * 100);

  const SakuraIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12c.5-1.5 2-5.5 0-9.5-2 4-.5 8 0 9.5z" />
      <path d="M12 12c1.5-.5 5.5-2 9.5 0-4 2-8 .5-9.5 0z" />
      <path d="M12 12c-.5 1.5-2 5.5 0 9.5 2-4 .5-8 0-9.5z" />
      <path d="M12 12c-1.5.5-5.5 2-9.5 0 4-2 8-.5 9.5 0z" />
      <circle cx="12" cy="12" r="1.2" className="fill-white opacity-60" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#fffafa] p-4 md:p-10 font-sans text-slate-700 relative overflow-x-hidden">
      {/* Fondo Sakura Decorativo */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <SakuraIcon className="absolute top-10 left-10 w-32 h-32 text-pink-200 rotate-12" />
        <SakuraIcon className="absolute bottom-20 right-10 w-48 h-48 text-pink-100 -rotate-12" />
      </div>

      <div className="max-w-xl mx-auto relative z-10 space-y-6">
        
        {/* ENCABEZADO (Imagen 1) */}
        <header className="text-center mb-4">
          <div className="flex justify-between items-center bg-white/70 backdrop-blur-xl p-6 rounded-[3rem] shadow-sm border border-pink-50">
            <button onClick={() => setMesIndice((mesIndice - 1 + 12) % 12)} className="p-2 text-pink-300"><ChevronLeft size={32} /></button>
            <h1 className="text-4xl font-serif font-bold text-pink-600 italic">{mesActualKey}</h1>
            <button onClick={() => setMesIndice((mesIndice + 1) % 12)} className="p-2 text-pink-300"><ChevronRight size={32} /></button>
          </div>
        </header>

        {/* META (Imagen 1 estética) */}
        <div className="bg-pink-500 rounded-[2.5rem] p-7 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-1">
            <Target className="opacity-40" size={20} />
            <span className="text-[10px] font-black tracking-widest uppercase opacity-70">META</span>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              value={currentData.meta} 
              onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })}
              className="bg-white/20 w-16 text-2xl font-black rounded-xl text-center focus:outline-none py-1"
            />
            <span className="text-2xl font-serif italic">horas</span>
          </div>
        </div>

        {/* CRONÓMETRO (Imagen 1 estética) */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="bg-pink-50 p-4 rounded-full mb-2">
              <Clock className="text-pink-500" size={32} />
            </div>
            <div className="text-4xl font-medium text-pink-600 tracking-tight">
              {formatTiempoReloj(segundosReloj)}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setCorriendo(!corriendo)}
              className="bg-pink-500 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs tracking-widest flex items-center justify-center gap-2 mx-auto uppercase active:scale-95 transition-all w-full max-w-[200px]"
            >
              {corriendo ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
              {corriendo ? 'PAUSAR' : 'INICIAR'}
            </button>
            {segundosReloj > 0 && !corriendo && (
              <button onClick={guardarTiempoReloj} className="text-[10px] font-black text-pink-300 underline uppercase tracking-widest">Añadir al informe total</button>
            )}
          </div>
        </div>

        {/* REGISTRO MANUAL */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50">
          <div className="flex items-center gap-2 mb-6 text-pink-200">
            <Clock size={16} />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Registro Manual</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="number" placeholder="Hrs" className="w-full bg-pink-50/30 border-b border-pink-100 p-4 text-2xl font-black text-pink-600 text-center focus:outline-none" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}/>
            <input type="number" placeholder="Min" className="w-full bg-pink-50/30 border-b border-pink-100 p-4 text-2xl font-black text-pink-600 text-center focus:outline-none" value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)}/>
          </div>
          <button onClick={() => registrarActividad(nuevaHora, nuevoMinuto)} className="w-full bg-pink-500 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-pink-100 active:scale-95 transition-all">AÑADIR TIEMPO</button>
        </div>

        {/* TOTALES */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 text-center">
            <p className="text-[9px] font-black text-pink-300 uppercase mb-1">Total Mes</p>
            <p className="text-2xl font-black text-pink-600">{horas}h {minutos}m</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 text-center">
            <p className="text-[9px] font-black text-pink-300 uppercase mb-1">Progreso</p>
            <p className="text-2xl font-black text-pink-600">{porcentaje.toFixed(0)}%</p>
          </div>
        </div>

        {/* BOTÓN WHATSAPP (Imagen 3 estética) */}
        <button 
          onClick={enviarWhatsApp}
          className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-bold text-sm tracking-widest flex items-center justify-center gap-4 shadow-lg active:scale-95 transition-all"
        >
          <Send size={24} />
          <span className="font-black uppercase tracking-[0.1em]">ENVIAR POR WHATSAPP</span>
        </button>

        {/* ESTUDIANTES */}
        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-pink-300 uppercase tracking-widest flex items-center gap-2"><BookOpen size={16} /> Estudiantes</h3>
            <button onClick={() => {setFormEstudiante({nombre:'', fecha:'', leccion:'', horaVisita:'', notas:''}); setShowEditModal('nuevo')}} className="bg-pink-100 text-pink-500 p-2 rounded-full hover:bg-pink-200 transition-all"><UserPlus size={18} /></button>
          </div>
          <div className="space-y-3">
            {currentData.estudiantes.map(est => (
              <div key={est.id} className="p-5 bg-pink-50/30 rounded-3xl border border-pink-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-pink-700 text-sm">{est.nombre}</p>
                  <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                    {est.fecha} • {est.horaVisita ? `🕒 ${est.horaVisita}` : ''} • {est.leccion}
                  </p>
                </div>
                <button onClick={() => updateCurrentMonth({ estudiantes: currentData.estudiantes.filter(i => i.id !== est.id) })} className="text-pink-200 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL NUEVO ESTUDIANTE (Imagen 2 estética) */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] bg-pink-900/10 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowEditModal(null)} className="absolute top-8 right-8 text-pink-200 hover:text-pink-400"><X /></button>
            <h4 className="text-2xl font-serif font-bold text-pink-600 mb-8">Nuevo Estudiante</h4>
            
            <div className="space-y-4">
              <input type="text" placeholder="Nombre Estudiante" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.nombre} onChange={e => setFormEstudiante({...formEstudiante, nombre: e.target.value})}/>
              
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Fecha (24/03)" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.fecha} onChange={e => setFormEstudiante({...formEstudiante, fecha: e.target.value})}/>
                <input type="text" placeholder="Folleto / Cap" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.leccion} onChange={e => setFormEstudiante({...formEstudiante, leccion: e.target.value})}/>
              </div>

              {/* CAMPO HORA DE VISITA (Sincronizado con imagen 2) */}
              <div className="relative">
                <p className="text-[9px] font-black text-pink-300 uppercase mb-2 ml-1">Hora de Visita</p>
                <div className="flex items-center bg-pink-50/50 rounded-2xl p-4">
                  <Clock size={16} className="text-pink-300 mr-2" />
                  <input type="time" className="w-full bg-transparent text-sm focus:outline-none text-slate-500" value={formEstudiante.horaVisita} onChange={e => setFormEstudiante({...formEstudiante, horaVisita: e.target.value})}/>
                </div>
              </div>

              <textarea placeholder="Notas adicionales..." rows="3" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none resize-none" value={formEstudiante.notas} onChange={e => setFormEstudiante({...formEstudiante, notas: e.target.value})}/>
              
              <button 
                onClick={() => {
                  if(formEstudiante.nombre) {
                    updateCurrentMonth({ estudiantes: [...currentData.estudiantes, { ...formEstudiante, id: Date.now() }] });
                    setShowEditModal(null);
                  }
                }} 
                className="w-full bg-pink-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] mt-4 shadow-lg shadow-pink-100"
              >
                GUARDAR ESTUDIANTE
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(50%) sepia(20%) saturate(2000%) hue-rotate(300deg);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default App;
