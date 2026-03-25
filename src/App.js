import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Clock, BookOpen, Trash2, Target, 
  Timer, ChevronRight, ChevronLeft, UserPlus, Send, X, Play, Pause, Square
} from 'lucide-react';

const App = () => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  const [datosMensuales, setDatosMensuales] = useState(() => {
    const salvo = localStorage.getItem('sakura_data_v6');
    return salvo ? JSON.parse(salvo) : {};
  });

  // Estados para el Cronómetro
  const [segundosReloj, setSegundosReloj] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const timerRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(null);
  const mesActualKey = meses[mesIndice];

  useEffect(() => {
    localStorage.setItem('sakura_data_v6', JSON.stringify(datosMensuales));
  }, [datosMensuales]);

  // Lógica del Cronómetro
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

  const finalizarCronometro = () => {
    const h = Math.floor(segundosReloj / 3600);
    const m = Math.floor((segundosReloj % 3600) / 60);
    if (h > 0 || m > 0) {
      registrarActividad(h, m);
    }
    setSegundosReloj(0);
    setCorriendo(false);
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
    const mensaje = `🌸 *Mi informe de Marzo* 🌸\n\n⏱️ *Horas:* ${horas}h ${minutos}m\n📖 *Cursos Bíblicos:* ${currentData.estudiantes.length}\n\n_Enviado desde mi Registro Sakura_ 🌸`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const porcentaje = Math.min(100, (totalMinutos / (currentData.meta * 60)) * 100);

  return (
    <div className="min-h-screen bg-[#FFF9FA] p-4 md:p-8 font-sans text-slate-700">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <header className="text-center py-4">
          <h1 className="text-4xl font-serif font-bold text-[#D14D91] italic">Marzo</h1>
          <div className="flex justify-center gap-10 mt-2">
            <button onClick={() => setMesIndice((mesIndice - 1 + 12) % 12)} className="text-pink-300"><ChevronLeft size={28} /></button>
            <button onClick={() => setMesIndice((mesIndice + 1) % 12)} className="text-pink-300"><ChevronRight size={28} /></button>
          </div>
        </header>

        {/* META BOX (Imagen 1) */}
        <div className="bg-[#F06292] rounded-[2.5rem] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <Target className="opacity-40" size={24} />
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">META</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <input 
              type="number" 
              value={currentData.meta} 
              onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })}
              className="bg-white/20 w-16 text-2xl font-bold rounded-xl text-center focus:outline-none py-1"
            />
            <span className="text-2xl font-serif italic">horas</span>
          </div>
        </div>

        {/* CRONÓMETRO (Imagen 1 estética) */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50 text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="bg-pink-50 p-4 rounded-full mb-3">
              <Clock className="text-[#F06292]" size={32} />
            </div>
            <div className="text-4xl font-medium text-[#F06292] tracking-tight">
              {formatTiempoReloj(segundosReloj)}
            </div>
          </div>
          
          <button 
            onClick={() => setCorriendo(!corriendo)}
            className="bg-[#F06292] text-white px-10 py-3 rounded-2xl font-bold text-xs tracking-widest flex items-center gap-2 mx-auto uppercase transition-transform active:scale-95"
          >
            {corriendo ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
            {corriendo ? 'PAUSAR' : 'INICIAR'}
          </button>

          {segundosReloj > 0 && !corriendo && (
            <button onClick={finalizarCronometro} className="text-[10px] font-bold text-pink-300 underline block mx-auto">GUARDAR TIEMPO</button>
          )}
        </div>

        {/* REGISTRO MANUAL */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50">
          <div className="flex items-center gap-2 mb-6 text-pink-300">
            <Clock size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">REGISTRO MANUAL</span>
          </div>
          <div className="flex gap-4 mb-4">
            <input type="number" placeholder="Hrs" className="w-1/2 bg-transparent border-b border-pink-100 p-2 text-xl text-center focus:outline-none" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}/>
            <input type="number" placeholder="Min" className="w-1/2 bg-transparent border-b border-pink-100 p-2 text-xl text-center focus:outline-none" value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)}/>
          </div>
          <button 
            onClick={() => registrarActividad(nuevaHora, nuevoMinuto)}
            className="w-full bg-[#F06292] text-white py-4 rounded-3xl font-bold text-[10px] tracking-[0.2em] uppercase shadow-md active:scale-95"
          >
            AÑADIR TIEMPO
          </button>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-pink-50 text-center">
            <p className="text-[9px] font-bold text-pink-300 uppercase mb-1">Total Horas</p>
            <p className="text-xl font-bold text-pink-600">{horas}h {minutos}m</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-pink-50 text-center">
            <p className="text-[9px] font-bold text-pink-300 uppercase mb-1">Progreso</p>
            <p className="text-xl font-bold text-pink-600">{porcentaje.toFixed(0)}%</p>
          </div>
        </div>

        {/* BOTÓN WHATSAPP (Imagen 3 estética) */}
        <button 
          onClick={enviarWhatsApp}
          className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-bold text-sm tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
        >
          <Send size={22} />
          <span>ENVIAR POR WHATSAPP</span>
        </button>

        {/* GESTIÓN DE ESTUDIANTES */}
        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-pink-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-bold text-pink-300 uppercase tracking-widest">Estudiantes</h3>
            <button onClick={() => {setFormEstudiante({nombre:'', fecha:'', leccion:'', horaVisita:'', notas:''}); setShowEditModal('nuevo')}} className="text-pink-400"><UserPlus size={20} /></button>
          </div>
          <div className="space-y-3">
            {currentData.estudiantes.map(est => (
              <div key={est.id} className="p-4 bg-pink-50/30 rounded-2xl border border-pink-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-pink-700 text-sm">{est.nombre}</p>
                  <p className="text-[9px] text-pink-400 font-medium">🕒 {est.horaVisita} • 📖 {est.leccion}</p>
                </div>
                <button onClick={() => updateCurrentMonth({ estudiantes: currentData.estudiantes.filter(i => i.id !== est.id) })} className="text-pink-200"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL NUEVO ESTUDIANTE (Imagen 2) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowEditModal(null)} className="absolute top-6 right-8 text-pink-200"><X /></button>
            <h4 className="text-xl font-serif font-bold text-[#D14D91] mb-6">Nuevo Estudiante</h4>
            
            <div className="space-y-4">
              <input type="text" placeholder="Nombre Estudiante" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none text-slate-500" value={formEstudiante.nombre} onChange={e => setFormEstudiante({...formEstudiante, nombre: e.target.value})}/>
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Fecha (24/03)" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.fecha} onChange={e => setFormEstudiante({...formEstudiante, fecha: e.target.value})}/>
                <input type="text" placeholder="Folleto / Cap" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.leccion} onChange={e => setFormEstudiante({...formEstudiante, leccion: e.target.value})}/>
              </div>

              <div className="relative">
                <p className="text-[10px] text-pink-300 font-bold uppercase mb-2 ml-2">Hora de Visita</p>
                <input type="time" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.horaVisita} onChange={e => setFormEstudiante({...formEstudiante, horaVisita: e.target.value})}/>
              </div>

              <textarea placeholder="Notas adicionales..." rows="3" className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm focus:outline-none resize-none" value={formEstudiante.notas} onChange={e => setFormEstudiante({...formEstudiante, notas: e.target.value})}/>
              
              <button 
                onClick={() => {
                  if(formEstudiante.nombre) {
                    updateCurrentMonth({ estudiantes: [...currentData.estudiantes, { ...formEstudiante, id: Date.now() }] });
                    setShowEditModal(null);
                  }
                }} 
                className="w-full bg-[#F06292] text-white py-4 rounded-3xl font-bold uppercase text-[10px] tracking-widest shadow-lg"
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
          filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(301deg) brightness(95%) contrast(80%);
        }
      `}</style>
    </div>
  );
};

export default App;
