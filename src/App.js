import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Trash2, 
  BarChart3, 
  Target,
  Heart,
  Timer,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  Send,
  Save
} from 'lucide-react';

const App = () => {
  // --- Estado Principal por Mes ---
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  const [mesIndice, setMesIndice] = useState(new Date().getMonth());
  const [datosMensuales, setDatosMensuales] = useState({});

  // Inicializar datos para el mes actual si no existen
  const mesActualKey = meses[mesIndice];
  
  const currentData = datosMensuales[mesActualKey] || {
    meta: 50,
    horas: 0,
    minutos: 0,
    revisitas: 0,
    estudiantes: []
  };

  // --- Funciones de Actualización de Estado ---
  const updateCurrentMonth = (newData) => {
    setDatosMensuales(prev => ({
      ...prev,
      [mesActualKey]: { ...currentData, ...newData }
    }));
  };

  // Estados locales para formularios
  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevoMinuto, setNuevoMinuto] = useState('');
  const [nuevaRevisita, setNuevaRevisita] = useState('');
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    fecha: '',
    leccion: ''
  });

  // --- Lógica de Negocio ---
  const cambiarMes = (direccion) => {
    setMesIndice(prev => {
      if (direccion === 'sig') return (prev + 1) % 12;
      return (prev - 1 + 12) % 12;
    });
  };

  const agregarTiempo = () => {
    let h = parseInt(nuevaHora) || 0;
    let m = parseInt(nuevoMinuto) || 0;

    if (h > 0 || m > 0) {
      const totalMinutosActuales = (currentData.horas * 60) + currentData.minutos;
      const minutosAAgregar = (h * 60) + m;
      const nuevoTotalMinutos = totalMinutosActuales + minutosAAgregar;
      
      updateCurrentMonth({
        horas: Math.floor(nuevoTotalMinutos / 60),
        minutos: nuevoTotalMinutos % 60
      });
      
      setNuevaHora('');
      setNuevoMinuto('');
    }
  };

  const agregarEstudiante = () => {
    if (nuevoEstudiante.nombre) {
      const listaActualizada = [...currentData.estudiantes, { ...nuevoEstudiante, id: Date.now() }];
      updateCurrentMonth({ estudiantes: listaActualizada });
      setNuevoEstudiante({ nombre: '', fecha: '', leccion: '' });
    }
  };

  const eliminarEstudiante = (id) => {
    const listaFiltrada = currentData.estudiantes.filter(e => e.id !== id);
    updateCurrentMonth({ estudiantes: listaFiltrada });
  };

  const horasRestantes = Math.max(0, currentData.meta - currentData.horas);
  const porcentaje = Math.min(100, (currentData.horas / currentData.meta) * 100);

  const SakuraIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,22C12,22 15,18.5 15,15.5C15,13.5 13.5,12 12,12C10.5,12 9,13.5 9,15.5C9,18.5 12,22 12,22M12,2C12,2 9,5.5 9,8.5C9,10.5 10.5,12 12,12C13.5,12 15,10.5 15,8.5C15,5.5 12,2 12,2M2,12C2,12 5.5,15 8.5,15C10.5,15 12,13.5 12,12C12,10.5 10.5,9 8.5,9C5.5,9 2,12 2,12M22,12C22,12 18.5,9 15.5,9C13.5,9 12,10.5 12,12C12,13.5 13.5,15 15.5,15C18.5,15 22,12 22,12Z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4 md:p-8 font-sans text-slate-800 relative overflow-hidden pb-24">
      {/* Decoración ambiental */}
      <div className="absolute top-[-5%] left-[-5%] text-pink-100 opacity-50 rotate-45"><SakuraIcon className="w-64 h-64" /></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Selector de Mes */}
        <nav className="flex items-center justify-between mb-8 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border border-pink-100">
          <button onClick={() => cambiarMes('ant')} className="p-2 text-pink-400 hover:bg-pink-50 rounded-full transition-colors">
            <ChevronLeft size={28} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-serif font-black text-pink-600 uppercase tracking-tighter">
              {mesActualKey}
            </h1>
            <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest">Año de Servicio</p>
          </div>
          <button onClick={() => cambiarMes('sig')} className="p-2 text-pink-400 hover:bg-pink-50 rounded-full transition-colors">
            <ChevronRight size={28} />
          </button>
        </nav>

        {/* Panel de Meta */}
        <section className="bg-white/90 p-6 rounded-[2.5rem] shadow-lg border border-pink-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500 p-2 rounded-2xl text-white shadow-md">
                <Target size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">Objetivo</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={currentData.meta} 
                    onChange={(e) => updateCurrentMonth({ meta: Number(e.target.value) })}
                    className="w-10 font-black text-xl text-pink-600 bg-transparent focus:outline-none"
                  />
                  <span className="text-pink-600 font-bold">horas</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-pink-300 uppercase">Progreso</span>
              <p className="text-2xl font-black text-pink-500">{porcentaje.toFixed(0)}%</p>
            </div>
          </div>
          <div className="h-3 w-full bg-pink-50 rounded-full overflow-hidden border border-pink-100 p-0.5">
            <div className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${porcentaje}%` }} />
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Registro de Actividad */}
          <div className="space-y-6">
            <section className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-md border border-pink-100">
              <h2 className="text-sm font-black uppercase text-pink-400 mb-4 flex items-center gap-2">
                <Timer size={16} /> Registro Diario
              </h2>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <input 
                    type="number" placeholder="H" 
                    className="w-full bg-pink-50/50 border border-pink-100 rounded-xl px-4 py-3 text-pink-700 focus:outline-none"
                    value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}
                  />
                  <span className="absolute right-3 top-3.5 text-[10px] font-bold text-pink-200">HRS</span>
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="number" placeholder="M" 
                    className="w-full bg-pink-50/50 border border-pink-100 rounded-xl px-4 py-3 text-pink-700 focus:outline-none"
                    value={nuevoMinuto} onChange={e => setNuevoMinuto(e.target.value)}
                  />
                  <span className="absolute right-3 top-3.5 text-[10px] font-bold text-pink-200">MIN</span>
                </div>
                <button onClick={agregarTiempo} className="bg-pink-500 text-white px-5 rounded-xl font-bold shadow-lg shadow-pink-100 active:scale-95">+</button>
              </div>
              <div className="flex gap-2 pt-4 border-t border-pink-50">
                <input 
                  type="number" placeholder="Sumar Revisitas..." 
                  className="flex-1 bg-pink-50/50 border border-pink-100 rounded-xl px-4 py-2 text-sm text-pink-700 focus:outline-none"
                  value={nuevaRevisita} onChange={e => setNuevaRevisita(e.target.value)}
                />
                <button 
                  onClick={() => {
                    const val = parseInt(nuevaRevisita) || 0;
                    updateCurrentMonth({ revisitas: currentData.revisitas + val });
                    setNuevaRevisita('');
                  }}
                  className="bg-pink-400 text-white px-4 rounded-xl font-bold text-xs"
                >
                  ADD
                </button>
              </div>
            </section>

            {/* Informe Consolidado Minimalista */}
            <section className="bg-white/90 p-6 rounded-[2.5rem] shadow-xl border border-pink-100">
              <h2 className="text-sm font-black uppercase text-pink-400 mb-4 flex items-center gap-2 tracking-widest">
                <BarChart3 size={16} /> Resumen {mesActualKey}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-pink-700 font-bold">Tiempo Total</span>
                  <span className="text-xl font-black text-pink-600">{currentData.horas}h {currentData.minutos}m</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-pink-700 font-bold">Revisitas</span>
                  <span className="text-xl font-black text-pink-600">{currentData.revisitas}</span>
                </div>
                <div className="flex justify-between items-center px-2 bg-pink-50/50 p-3 rounded-2xl">
                  <span className="text-pink-800 font-black text-xs uppercase">Faltan para Meta</span>
                  <span className="text-2xl font-black text-pink-500">{horasRestantes}h</span>
                </div>
              </div>
            </section>
          </div>

          {/* Gestión de Estudios Bíblicos */}
          <section className="bg-white/90 p-6 rounded-[2.5rem] shadow-xl border border-pink-100 flex flex-col h-full">
            <h2 className="text-sm font-black uppercase text-pink-400 mb-4 flex items-center gap-2 tracking-widest">
              <BookOpen size={16} /> Estudios Bíblicos
            </h2>
            
            {/* Formulario de Estudiante */}
            <div className="space-y-3 mb-6 bg-pink-50/30 p-4 rounded-3xl border border-pink-50">
              <input 
                type="text" placeholder="Nombre del estudiante"
                className="w-full bg-white border border-pink-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
                value={nuevoEstudiante.nombre}
                onChange={e => setNuevoEstudiante({...nuevoEstudiante, nombre: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="date"
                  className="bg-white border border-pink-100 rounded-xl px-3 py-2 text-xs text-pink-400 focus:outline-none"
                  value={nuevoEstudiante.fecha}
                  onChange={e => setNuevoEstudiante({...nuevoEstudiante, fecha: e.target.value})}
                />
                <input 
                  type="text" placeholder="Lección/Cap."
                  className="bg-white border border-pink-100 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  value={nuevoEstudiante.leccion}
                  onChange={e => setNuevoEstudiante({...nuevoEstudiante, leccion: e.target.value})}
                />
              </div>
              <button 
                onClick={agregarEstudiante}
                className="w-full bg-pink-600 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-pink-700 transition-all"
              >
                <UserPlus size={16} /> Registrar Visita
              </button>
            </div>

            {/* Lista de Estudiantes */}
            <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[300px] space-y-3 pr-2">
              {currentData.estudiantes.map(est => (
                <div key={est.id} className="group relative bg-white border border-pink-50 p-4 rounded-2xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-pink-700 text-sm">{est.nombre}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] text-pink-300 font-bold flex items-center gap-1 uppercase">
                          <Calendar size={10} /> {est.fecha || 'Sin fecha'}
                        </span>
                        <span className="text-[10px] text-pink-400 font-bold flex items-center gap-1 uppercase">
                          <BookOpen size={10} /> {est.leccion || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => eliminarEstudiante(est.id)}
                      className="text-pink-100 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {currentData.estudiantes.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <SakuraIcon className="w-10 h-10 mx-auto mb-2 text-pink-300" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No hay estudios registrados</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Acciones Finales */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="flex-1 bg-white border-2 border-pink-200 text-pink-500 py-4 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-pink-50 transition-all shadow-sm">
            <Save size={20} /> Guardar Borrador
          </button>
          <button 
            className="flex-[2] bg-pink-600 text-white py-4 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-pink-700 transition-all shadow-lg shadow-pink-100 active:scale-95"
            onClick={() => {
              const resumen = `Informe ${mesActualKey}:\nHoras: ${currentData.horas}:${currentData.minutos}\nRevisitas: ${currentData.revisitas}\nCursos: ${currentData.estudiantes.length}`;
              console.log("Copiando al portapapeles:", resumen);
              // Aquí podrías disparar una función de compartir
            }}
          >
            <Send size={20} /> Enviar Informe de {mesActualKey}
          </button>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-[10px] font-black text-pink-200 uppercase tracking-[0.5em]">🌸 Ministerio Sakura 🌸</p>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
