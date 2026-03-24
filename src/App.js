import React, { useState, useEffect } from 'react';
import { Save, Send, Trash2, Plus, BookOpen, Clock, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const App = () => {
  // --- ESTADOS (Memoria) ---
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [estudios, setEstudios] = useState(0);
  const [nombreEstudiante, setNombreEstudiante] = useState('');
  const [leccion, setLeccion] = useState('');
  const [mes, setMes] = useState('MARZO');
  const metaHoras = 50;

  // --- 1. AUTOGUARDADO (Carga al abrir) ---
  useEffect(() => {
    const datosGuardados = localStorage.getItem('registroSakura');
    if (datosGuardados) {
      const parsed = JSON.parse(datosGuardados);
      setHoras(parsed.horas || 0);
      setMinutos(parsed.minutos || 0);
      setEstudios(parsed.estudios || 0);
    }
  }, []);

  // --- 2. AUTOGUARDADO (Guarda al cambiar algo) ---
  useEffect(() => {
    const datos = { horas, minutos, estudios };
    localStorage.setItem('registroSakura', JSON.stringify(datos));
  }, [horas, minutos, estudios]);

  // --- FUNCIONES ---
  const agregarTiempo = () => {
    let nuevosMinutos = minutos + 15; 
    if (nuevosMinutos >= 60) {
      setHoras(horas + 1);
      setMinutos(nuevosMinutos - 60);
    } else {
      setMinutos(nuevosMinutos);
    }
  };

  const registrarEstudio = () => {
    if (!nombreEstudiante) {
      alert("Por favor escribe el nombre del estudiante");
      return;
    }
    setEstudios(estudios + 1);
    setNombreEstudiante('');
    setLeccion('');
    alert(`¡Estudio con ${nombreEstudiante} registrado! 📖`);
  };

  const borrarTodo = () => {
    if (window.confirm("¿Estás segura de borrar el informe del mes? 🌸")) {
      setHoras(0);
      setMinutos(0);
      setEstudios(0);
    }
  };

  const enviarWhatsApp = () => {
    const mensaje = `🌸 *Mi informe* 🌸

⏱️ *Horas:* ${horas}h ${minutos}m
📖 *Cursos Bíblicos:* ${estudios}

_¡Servicio completado con éxito!_ ✨`;

    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    // window.open con estos parámetros permite abrir WhatsApp desde la PWA/Pantalla de inicio
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Cálculo de progreso
  const totalMinutos = (horas * 60) + minutos;
  const porcentaje = Math.min(Math.round((totalMinutos / (metaHoras * 60)) * 100), 100);

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans text-gray-500 pb-10">
      
      {/* Selector de Mes */}
      <div className="flex justify-between items-center p-8">
        <ChevronLeft className="text-pink-300" />
        <h1 className="text-2xl font-italic text-pink-400 tracking-widest italic font-light">{mes}</h1>
        <ChevronRight className="text-pink-300" />
      </div>

      {/* Tarjeta de Meta */}
      <div className="mx-6 bg-white p-6 rounded-[2.5rem] shadow-sm mb-6 border border-pink-50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-3 rounded-2xl text-pink-500">
              <Clock size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-400">{metaHoras}</span>
            <span className="text-pink-200 text-xs uppercase tracking-widest font-bold">Horas Meta</span>
          </div>
          <span className="text-pink-400 font-bold">{porcentaje}%</span>
        </div>
        <div className="w-full bg-pink-50 h-3 rounded-full overflow-hidden">
          <div className="bg-pink-400 h-full transition-all duration-500" style={{ width: `${porcentaje}%` }}></div>
        </div>
      </div>

      {/* Registro Diario (Horas) */}
      <div className="mx-6 bg-white p-6 rounded-[2.5rem] shadow-sm mb-6 border border-pink-50">
        <div className="flex items-center gap-2 mb-6 text-pink-300 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Clock size={12} /> Registro Diario
        </div>
        <div className="flex justify-between items-center">
          <div className="bg-[#FAF9FB] px-8 py-4 rounded-2xl text-gray-300 text-xl font-light w-24 text-center">H</div>
          <div className="bg-[#FAF9FB] px-8 py-4 rounded-2xl text-gray-300 text-xl font-light w-24 text-center">M</div>
          <button onClick={agregarTiempo} className="bg-pink-500 text-white p-5 rounded-2xl shadow-lg shadow-pink-200 active:scale-90 transition-transform">
            <Plus size={28} />
          </button>
        </div>
      </div>

      {/* Cursos Bíblicos (Formulario exacto a la imagen) */}
      <div className="mx-6 bg-white p-6 rounded-[2.5rem] shadow-sm mb-6 border border-pink-50 text-gray-400">
        <div className="flex items-center gap-2 mb-6 text-pink-300 text-[10px] font-bold uppercase tracking-[0.2em]">
          <BookOpen size={12} /> Cursos Bíblicos
        </div>
        <input 
          type="text" 
          placeholder="Nombre del estudiante"
          value={nombreEstudiante}
          onChange={(e) => setNombreEstudiante(e.target.value)}
          className="w-full p-5 bg-[#FAF9FB] rounded-2xl mb-4 outline-none placeholder-gray-300 italic"
        />
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-[#FAF9FB] rounded-2xl p-5 flex justify-between items-center">
             <span className="text-gray-300 italic">...</span>
             <ChevronRight size={18} className="text-pink-300 rotate-90" />
          </div>
          <input 
            type="text" 
            placeholder="Lección/Cap."
            value={leccion}
            onChange={(e) => setLeccion(e.target.value)}
            className="flex-1 p-5 bg-[#FAF9FB] rounded-2xl outline-none placeholder-gray-300 italic"
          />
        </div>
        <button onClick={registrarEstudio} className="w-full bg-pink-500 text-white p-5 rounded-2xl font-bold shadow-lg shadow-pink-100 flex items-center justify-center gap-3">
          <UserPlus size={20} /> REGISTRAR VISITA
        </button>
      </div>

      {/* Resumen Final Rosa */}
      <div className="mx-6 mb-6 bg-pink-500 p-8 rounded-[3rem] text-white shadow-xl flex justify-around items-center text-center">
        <div>
          <p className="text-[10px] uppercase opacity-70 mb-2 italic tracking-widest">Tiempo Total</p>
          <p className="text-3xl font-medium">{horas}h {minutos}m</p>
        </div>
        <div className="w-[1px] h-12 bg-pink-400 opacity-50"></div>
        <div>
          <p className="text-[10px] uppercase opacity-70 mb-2 italic tracking-widest">Estudios</p>
          <p className="text-3xl font-medium">{estudios}</p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="mx-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => alert("¡Progreso guardado! 🌸")} className="bg-white border border-pink-100 text-pink-400 p-5 rounded-3xl flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase shadow-sm">
            <Save size={18} /> Guardar Borrador
          </button>
          <button onClick={borrarTodo} className="bg-pink-50/50 border border-pink-100 text-pink-300 p-5 rounded-3xl flex items-center justify-center gap-2 font-bold tracking-widest text-xs uppercase shadow-sm">
            <Trash2 size={18} /> Borrar
          </button>
        </div>
        
        <button onClick={enviarWhatsApp} className="bg-pink-500 text-white p-6 rounded-[2.5rem] shadow-lg shadow-pink-200 flex items-center justify-center gap-4 font-bold text-xs tracking-[0.2em] uppercase">
          <Send size={22} className="rotate-[-10deg]" /> ENVIAR INFORME POR WHATSAPP
        </button>
      </div>

    </div>
  );
};

export default App;
