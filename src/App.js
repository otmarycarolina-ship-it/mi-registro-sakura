import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, BookOpen, Trash2, Edit3, Target, 
  Timer, ChevronRight, ChevronLeft, UserPlus, Send, X, StickyNote
} from 'lucide-react';

const App = () => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  // --- ESTADOS ---
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  const [datosMensuales, setDatosMensuales] = useState(() => {
    const salvo = localStorage.getItem('sakura_data_v3');
    return salvo ? JSON.parse(salvo) : {};
  });
  const [showEditModal, setShowEditModal] = useState(null);

  const mesActualKey = meses[mesIndice];
  const anioActual = new Date().getFullYear();

  // Obtener días exactos del mes seleccionado
  const getDiasEnMes = (month, year) => new Date(year, month + 1, 0).getDate();
  const totalDiasMes = getDiasEnMes(mesIndice, anioActual);

  useEffect(() => {
    localStorage.setItem('sakura_data_v3', JSON.stringify(datosMensuales));
  }, [datosMensuales]);

  const currentData = datosMensuales[mesActualKey] || {
    meta: 50, horas: 0, minutos: 0, revisitas: 0, estudiantes: [], diasActivos: [] 
  };

  const updateCurrentMonth = (newData) => {
    setDatosMensuales(prev => ({
      ...prev,
      [mesActualKey]: { ...currentData, ...newData }
    }));
  };

  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoMinuto, setNuevoMinuto] = useState('');
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: '', leccion: '' });

  // --- LÓGICA DE REGISTRO ---
  const registrarActividad = () => {
    let h = parseInt(nuevaHora) || 0;
    let m = parseInt(nuevoMinuto) || 0;
    const hoy = new Date().getDate();

    if (h > 0 || m > 0) {
      const totalMinutosActuales = (currentData.horas * 60) + currentData.minutos;
      const nuevoTotalMinutos = totalMinutosActuales + (h * 60) + m;
      
      // Si el mes en pantalla es el mes real actual, marcamos el día en el calendario
      const esMesReal = new Date().getMonth() === mesIndice;
      const nuevosDias = (esMesReal && !currentData.diasActivos.includes(hoy)) 
        ? [...currentData.diasActivos, hoy] 
        : currentData.diasActivos;

      updateCurrentMonth({
        horas: Math.floor(nuevoTotalMinutos / 60),
        minutos: nuevoTotalMinutos % 60,
        diasActivos: nuevosDias
      });
      setNuevaHora(''); setNuevoMinuto('');
    }
  };

  const toggleDiaManual = (dia) => {
    const nuevosDias = currentData.diasActivos.includes(dia)
      ? currentData.diasActivos.filter(d => d !== dia)
      : [...currentData.diasActivos, dia];
    updateCurrentMonth({ diasActivos: nuevosDias });
  };

  const enviarWhatsApp = () => {
    const mensaje = `🌸 *Mi informe* 🌸%0A%0A⏱️ *Horas:* ${currentData.horas}h ${currentData.minutos}m%0A📖 *Cursos Bíblicos:* ${currentData.estudiantes.length}%0A%0A_Enviado desde mi Registro Sakura_ 🌸`;
    const url = `https://wa.me/?text=${mensaje}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.assign(url);
  };

  const porcentaje = Math.min(100, (((currentData.horas * 60) + currentData.minutos) / (currentData.meta * 60)) * 100);

  const SakuraIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,22C12,22 15,18.5 15,15.5C15,13.5 13.5,12 12,12C10.5,12 9,13.5 9,15.5C9,18.5 12,22 12,22M12,2C12,2 9,5.5 9,8.5C9,10.5 10.5,12 12,12C13.5,12 15,10.5 15,8.5C15,5.5 12,2 12,2M2,12C2,12 5.5,15 8.5,15C10.5,15 12,13.5 12,12C12,10.5 10.5,9 8.5,9C5.5,9 2,12 2,12M22,12C22,12 18.5,9 15.5,9C13.5,9 12,10.5 12,12C12,13.5 13.5,15 15.5,15C18.5,15 22,12 22,12Z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#fffafa] p-4 md:p-10 font-sans text-slate-700 relative overflow-x-hidden">
      {/* Iconos de Fondo */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
        <SakuraIcon className="absolute top-10 left-10 w-32 h-32 text-pink-200 rotate-12" />
        <SakuraIcon className="absolute bottom-20 right-10 w-48 h-48 text-pink-100 -rotate-12" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-2">
            <SakuraIcon className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-serif font-bold text-pink-600 tracking-tight italic">Ministerio Sakura</h1>
          <p className="text-pink-300 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Organización Personal</p>
        </header>

        {/* Navegación y Meta */}
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
            <div className="flex justify-between items-center mb-2">
              <Target size={20} className="opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-widest">Meta Mensual</span>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="number" value={currentData.meta} 
                onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })}
                className="bg-white/20 w-20 text-3xl font-black rounded-2xl text-center focus:outline-none"
              />
              <span className="text-xl font-serif italic">horas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Registro y Calendario */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50">
              <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest mb-6 flex items-center gap-2"><Timer size={16} /> Registro de Hoy</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="number" placeholder="Hrs" className="w-full bg-pink-50/30 border-b-2 border-pink-100 p-4 text-2xl font-black text-pink-600 focus:outline-none" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}/>
                <input type="number" placeholder="Min" className="w-full bg-pink-50/30 border-b-2 border-pink-100 p-4 text-2xl font-black text-pink-600 focus:outline-none" value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)}/>
              </div>
              <button onClick={registrarActividad} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pink-100 active:scale-95 transition-all">Añadir al Informe</button>
            </section>

            {/* CALENDARIO CONECTADO */}
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-pink-50">
              <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CalendarIcon size={16} /> Actividad en {mesActualKey}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(totalDiasMes)].map((_, i) => {
                  const dia = i + 1;
                  const activo = currentData.diasActivos.includes(dia);
                  return (
                    <button 
                      key={dia}
                      onClick={() => toggleDiaManual(dia)}
                      className={`aspect-square rounded-full text-[10px] font-bold transition-all ${
                        activo ? 'bg-pink-400 text-white shadow-md shadow-pink-100' : 'bg-pink-50 text-pink-200 hover:bg-pink-100'
                      }`}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Columna Derecha: Informe y Cursos */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white/80 backdrop-blur-md p-10 rounded-[4rem] shadow-xl border border-pink-50 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
                <div className="p-4 bg-pink-50/50 rounded-[2rem]">
                  <p className="text-[10px] font-black text-pink-300 uppercase mb-1">Horas</p>
                  <p className="text-2xl font-black text-pink-600">{currentData.horas}h {currentData.minutos}m</p>
                </div>
                <div className="p-4 bg-pink-50/50 rounded-[2rem]">
                  <p className="text-[10px] font-black text-pink-300 uppercase mb-1">Cursos</p>
                  <p className="text-2xl font-black text-pink-600">{currentData.estudiantes.length}</p>
                </div>
                <div className="p-4 bg-pink-600 rounded-[2rem] text-white">
                  <p className="text-[10px] font-black opacity-70 uppercase mb-1 font-bold">Porcentaje</p>
                  <p className="text-2xl font-black">{porcentaje.toFixed(0)}%</p>
                </div>
                <button onClick={() => {if(window.confirm("¿Borrar informe del mes?")) updateCurrentMonth({horas:0, minutos:0, estudiantes:[], diasActivos:[]})}} className="p-4 bg-pink-50 text-pink-200 rounded-[2rem] flex items-center justify-center hover:text-pink-400 transition-colors">
                  <Trash2 size={24} />
                </button>
              </div>

              <button 
                onClick={enviarWhatsApp}
                className="w-full bg-[#25D366] text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                <Send size={24} /> ENVIAR INFORME POR WHATSAPP
              </button>
            </section>

            <section className="bg-white p-8 rounded-[4rem] shadow-sm border border-pink-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-pink-300 uppercase tracking-widest flex items-center gap-2"><BookOpen size={16} /> Gestión de Estudiantes</h3>
                <button onClick={() => setShowEditModal('nuevo')} className="bg-pink-100 text-pink-500 px-4 py-2 rounded-full text-xs font-bold hover:bg-pink-200 flex items-center gap-2 transition-all">
                  <UserPlus size={14} /> Añadir
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.estudiantes.map(est => (
                  <div key={est.id} className="p-5 bg-pink-50/30 rounded-3xl border border-transparent flex justify-between items-center">
                    <div>
                      <p className="font-bold text-pink-700 text-sm">{est.nombre}</p>
                      <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{est.leccion}</p>
                    </div>
                    <button onClick={() => updateCurrentMonth({ estudiantes: currentData.estudiantes.filter(e => e.id !== est.id) })} className="text-pink-200 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal Estudiantes */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] bg-pink-900/20 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl border border-pink-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-serif font-bold text-pink-600">Nuevo Estudiante</h4>
              <button onClick={() => setShowEditModal(null)} className="text-pink-200 hover:text-pink-400"><X /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Nombre completo" className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm focus:outline-none" value={nuevoEstudiante.nombre} onChange={e => setNuevoEstudiante({...nuevoEstudiante, nombre: e.target.value})}/>
              <input type="text" placeholder="Lección / Capítulo" className="w-full bg-pink-50 border border-pink-100 rounded-2xl p-4 text-sm focus:outline-none" value={nuevoEstudiante.leccion} onChange={e => setNuevoEstudiante({...nuevoEstudiante, leccion: e.target.value})}/>
              <button onClick={() => {
                if(nuevoEstudiante.nombre) {
                  updateCurrentMonth({ estudiantes: [...currentData.estudiantes, { ...nuevoEstudiante, id: Date.now() }] });
                  setNuevoEstudiante({ nombre: '', leccion: '' });
                  setShowEditModal(null);
                }
              }} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs">Guardar Estudiante</button>
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
