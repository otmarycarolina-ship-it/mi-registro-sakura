import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Clock, BookOpen, Trash2, Edit3, Target, 
  Timer, ChevronRight, ChevronLeft, UserPlus, Send, X, StickyNote, Play, Square, Bell
} from 'lucide-react';

const App = () => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  const [datosMensuales, setDatosMensuales] = useState(() => {
    const salvo = localStorage.getItem('sakura_data_v5');
    return salvo ? JSON.parse(salvo) : {};
  });
  const [showEditModal, setShowEditModal] = useState(null);

  // --- LÓGICA DEL CRONÓMETRO ---
  const [cronometroActivo, setCronometroActivo] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (cronometroActivo) {
      timerRef.current = setInterval(() => {
        setSegundos(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [cronometroActivo]);

  const formatTiempo = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const segs = s % 60;
    return `${hrs}h ${mins}m ${segs}s`;
  };

  const detenerYGuardarCronometro = () => {
    const hrsTranscurridas = Math.floor(segundos / 3600);
    const minsTranscurridos = Math.floor((segundos % 3600) / 60);
    
    if (hrsTranscurridas > 0 || minsTranscurridos > 0) {
      registrarActividadManual(hrsTranscurridas, minsTranscurridos);
      alert(`¡Sesión terminada! Se han añadido ${hrsTranscurridas}h y ${minsTranscurridos}m a tu informe.`);
    }
    setCronometroActivo(false);
    setSegundos(0);
  };

  const mesActualKey = meses[mesIndice];
  const anioActual = new Date().getFullYear();

  const getDiasEnMes = (month, year) => new Date(year, month + 1, 0).getDate();
  const totalDiasMes = getDiasEnMes(mesIndice, anioActual);

  useEffect(() => {
    localStorage.setItem('sakura_data_v5', JSON.stringify(datosMensuales));
  }, [datosMensuales]);

  const currentData = datosMensuales[mesActualKey] || {
    meta: 50, 
    estudiantes: [], 
    historial: {} 
  };

  const calcularTotales = () => {
    let totalMinutos = 0;
    Object.values(currentData.historial || {}).forEach(dia => {
      totalMinutos += (dia.h * 60) + dia.m;
    });
    return {
      horasTotales: Math.floor(totalMinutos / 60),
      minutosTotales: totalMinutos % 60,
      totalMinutos
    };
  };

  const { horasTotales, minutosTotales, totalMinutos } = calcularTotales();

  const updateCurrentMonth = (newData) => {
    setDatosMensuales(prev => ({
      ...prev,
      [mesActualKey]: { ...currentData, ...newData }
    }));
  };

  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoMinuto, setNuevoMinuto] = useState('');
  const [formEstudiante, setFormEstudiante] = useState({ nombre: '', fecha: '', leccion: '', notas: '', horaVisita: '' });

  const registrarActividadManual = (hManual, mManual) => {
    let h = hManual !== undefined ? hManual : (parseInt(nuevaHora) || 0);
    let m = mManual !== undefined ? mManual : (parseInt(nuevoMinuto) || 0);
    
    const hoy = new Date().getDate();
    const esMesReal = new Date().getMonth() === mesIndice;
    const diaARegistrar = esMesReal ? hoy : 1; 

    if (h > 0 || m > 0) {
      const historialActualizado = { ...currentData.historial };
      const tiempoPrevio = historialActualizado[diaARegistrar] || { h: 0, m: 0 };
      
      historialActualizado[diaARegistrar] = {
        h: tiempoPrevio.h + h,
        m: tiempoPrevio.m + m
      };

      updateCurrentMonth({ historial: historialActualizado });
      setNuevaHora(''); 
      setNuevoMinuto('');
    }
  };

  const eliminarDia = (dia) => {
    const nuevoHistorial = { ...currentData.historial };
    delete nuevoHistorial[dia];
    updateCurrentMonth({ historial: nuevoHistorial });
  };

  const enviarWhatsApp = () => {
    const mensaje = `🌸 *Mi informe* 🌸\n\n⏱️ *Horas:* ${horasTotales}h ${minutosTotales}m\n📖 *Cursos Bíblicos:* ${currentData.estudiantes.length}\n\n_Enviado desde mi Registro Sakura_ 🌸`;
    const url = `whatsapp://send?text=${encodeURIComponent(mensaje)}`;
    window.location.href = url;
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
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <SakuraIcon className="absolute top-10 left-10 w-32 h-32 text-pink-200 rotate-12" />
        <SakuraIcon className="absolute bottom-20 right-10 w-48 h-48 text-pink-100 -rotate-12" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-2"><SakuraIcon className="w-12 h-12 text-pink-400 animate-pulse" /></div>
          <h1 className="text-5xl font-serif font-bold text-pink-600 tracking-tight italic">Mi Registro Sakura</h1>
          <p className="text-pink-300 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Servicio y Organización</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-6 rounded-[3rem] shadow-sm border border-pink-50 flex items-center justify-between">
            <button onClick={() => setMesIndice((mesIndice - 1 + 12) % 12)} className="p-3 text-pink-300"><ChevronLeft size={32} /></button>
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-pink-500">{mesActualKey}</h2>
              <p className="text-[10px] font-black text-pink-200 tracking-widest uppercase">Mes de Servicio</p>
            </div>
            <button onClick={() => setMesIndice((mesIndice + 1) % 12)} className="p-3 text-pink-300"><ChevronRight size={32} /></button>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-6 rounded-[3rem] shadow-lg text-white flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2"><Target size={20} className="opacity-80" /><span className="text-[10px] font-black uppercase tracking-widest">Meta Mensual</span></div>
            <div className="flex items-center gap-3">
              <input type="number" value={currentData.meta} onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })} className="bg-white/20 w-20 text-3xl font-black rounded-2xl text-center focus:outline-none"/>
              <span className="text-xl font-serif italic">horas</span>
            </div>
          </div>
        </div>

        {/* CRONÓMETRO */}
        <section className="mb-8 bg-white/80 backdrop-blur-md p-6 rounded-[3rem] shadow-xl border-2 border-pink-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${cronometroActivo ? 'bg-pink-500 animate-pulse' : 'bg-pink-100'} text-white transition-all`}>
              <Timer size={32} className={cronometroActivo ? 'text-white' : 'text-pink-400'} />
            </div>
            <div>
              <p className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Cronómetro de Servicio</p>
              <p className="text-3xl font-black text-pink-600 font-mono">{formatTiempo(segundos)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {!cronometroActivo ? (
              <button onClick={() => setCronometroActivo(true)} className="flex items-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-pink-600 transition-all">
                <Play size={16} fill="white" /> Iniciar
              </button>
            ) : (
              <button onClick={detenerYGuardarCronometro} className="flex items-center gap-2 bg-red-400 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-red-500 transition-all">
                <Square size={16} fill="white" /> Detener y Guardar
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50">
              <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={16} /> Registro Manual</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="number" placeholder="Hrs" className="w-full bg-pink-50/30 border-b-2 border-pink-100 p-4 text-2xl font-black text-pink-600 focus:outline-none" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}/>
                <input type="number" placeholder="Min" className="w-full bg-pink-50/30 border-b-2 border-pink-100 p-4 text-2xl font-black text-pink-600 focus:outline-none" value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)}/>
              </div>
              <button onClick={() => registrarActividadManual()} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pink-100 active:scale-95 transition-all">Añadir al Informe</button>
            </section>

            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50">
              <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest mb-6 flex items-center gap-2"><CalendarIcon size={16} /> Actividad en {mesActualKey}</h3>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(totalDiasMes)].map((_, i) => {
                  const dia = i + 1;
                  const tieneActividad = currentData.historial && currentData.historial[dia];
                  return (
                    <button key={dia} onClick={() => tieneActividad && window.confirm(`¿Borrar actividad del día ${dia}?`) && eliminarDia(dia)}
                      className={`aspect-square rounded-full text-[10px] font-bold transition-all ${tieneActividad ? 'bg-pink-400 text-white shadow-md shadow-pink-100' : 'bg-pink-50 text-pink-200 hover:bg-pink-100'}`}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white/80 backdrop-blur-md p-10 rounded-[4rem] shadow-xl border border-pink-50 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
                <div className="p-4 bg-pink-50/50 rounded-[2rem]"><p className="text-[10px] font-black text-pink-300 uppercase mb-1">Horas</p><p className="text-2xl font-black text-pink-600">{horasTotales}h {minutosTotales}m</p></div>
                <div className="p-4 bg-pink-50/50 rounded-[2rem]"><p className="text-[10px] font-black text-pink-300 uppercase mb-1">Cursos</p><p className="text-2xl font-black text-pink-600">{currentData.estudiantes.length}</p></div>
                <div className="p-4 bg-pink-600 rounded-[2rem] text-white"><p className="text-[10px] font-black opacity-70 uppercase mb-1 font-bold">Porcentaje</p><p className="text-2xl font-black">{porcentaje.toFixed(0)}%</p></div>
                <button onClick={() => {if(window.confirm("¿Borrar informe completo del mes?")) updateCurrentMonth({historial:{}, estudiantes:[]})}} className="p-4 bg-pink-50 text-pink-200 rounded-[2rem] flex items-center justify-center hover:text-pink-400 transition-colors"><Trash2 size={24} /></button>
              </div>
              <button onClick={enviarWhatsApp} className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"><Send size={24} /> ENVIAR INFORME POR WHATSAPP</button>
            </section>

            <section className="bg-white p-8 rounded-[4rem] shadow-sm border border-pink-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest flex items-center gap-2"><BookOpen size={16} /> Cursos Bíblicos</h3>
                <button onClick={() => {setFormEstudiante({nombre:'', fecha:'', leccion:'', notas:'', horaVisita: ''}); setShowEditModal('nuevo')}} className="bg-pink-100 text-pink-500 px-4 py-2 rounded-full text-xs font-bold hover:bg-pink-200 flex items-center gap-2 transition-all"><UserPlus size={14} /> Añadir</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.estudiantes.map(est => (
                  <div key={est.id} onClick={() => {setFormEstudiante(est); setShowEditModal(est.id)}} className="p-5 bg-pink-50/30 rounded-3xl border border-transparent flex justify-between items-center cursor-pointer hover:border-pink-200 transition-all">
                    <div>
                      <p className="font-bold text-pink-700 text-sm">{est.nombre}</p>
                      <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
                        {est.fecha} • {est.leccion} {est.horaVisita && <span className="bg-pink-200 text-pink-600 px-2 py-0.5 rounded-full ml-2 flex items-center gap-1"><Clock size={10} /> {est.horaVisita}</span>}
                      </p>
                    </div>
                    <button onClick={(e) => {e.stopPropagation(); updateCurrentMonth({ estudiantes: currentData.estudiantes.filter(i => i.id !== est.id) })}} className="text-pink-200 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal Estudiante */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] bg-pink-900/20 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-serif font-bold text-pink-600">{showEditModal === 'nuevo' ? 'Nuevo Estudiante' : 'Editar Estudiante'}</h4>
              <button onClick={() => setShowEditModal(null)} className="text-pink-200 hover:text-pink-400"><X /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre Estudiante" className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.nombre} onChange={e => setFormEstudiante({...formEstudiante, nombre: e.target.value})}/>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Fecha (Ej: 24/03)" className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.fecha} onChange={e => setFormEstudiante({...formEstudiante, fecha: e.target.value})}/>
                <input type="text" placeholder="Folleto / Cap" className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm focus:outline-none" value={formEstudiante.leccion} onChange={e => setFormEstudiante({...formEstudiante, leccion: e.target.value})}/>
              </div>
              
              <div className="relative">
                <p className="text-[10px] font-black text-pink-300 uppercase mb-2 ml-1">Hora de la Visita</p>
                <div className="flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-2xl p-4">
                  <Clock size={16} className="text-pink-300" />
                  <input type="time" className="bg-transparent w-full text-sm focus:outline-none text-pink-600 font-bold" value={formEstudiante.horaVisita} onChange={e => setFormEstudiante({...formEstudiante, horaVisita: e.target.value})}/>
                </div>
              </div>

              <textarea placeholder="Notas del estudiante..." rows="3" className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm focus:outline-none resize-none" value={formEstudiante.notas} onChange={e => setFormEstudiante({...formEstudiante, notas: e.target.value})}/>
              <button onClick={() => {
                if(formEstudiante.nombre) {
                  const nuevos = showEditModal === 'nuevo' ? [...currentData.estudiantes, { ...formEstudiante, id: Date.now() }] : currentData.estudiantes.map(e => e.id === showEditModal ? formEstudiante : e);
                  updateCurrentMonth({ estudiantes: nuevos });
                  setShowEditModal(null);
                }
              }} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs">Guardar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
};

export default App;
