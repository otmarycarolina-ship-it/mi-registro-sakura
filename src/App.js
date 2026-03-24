import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('registro');
  const [registros, setRegistros] = useState([]);
  const [tiempo, setTiempo] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTiempo(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const agregarRegistro = (tipo) => {
    const nuevo = { id: Date.now(), tipo, hora: tiempo.toLocaleTimeString() };
    setRegistros([nuevo, ...registros]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff0f5', paddingBottom: '80px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <header style={{ textAlign: 'center', padding: '20px 0' }}>
          <h1 style={{ color: '#db7093', margin: 0 }}>SAKURA APP 🌸</h1>
        </header>

        {activeTab === 'registro' && (
          <div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '2rem', margin: 0, color: '#ff69b4' }}>{tiempo.toLocaleTimeString()}</h2>
              <p style={{ color: '#db7093' }}>{tiempo.toLocaleDateString()}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => agregarRegistro('Entrada')} style={{ backgroundColor: '#ffb6c1', border: 'none', padding: '20px', borderRadius: '15px', fontWeight: 'bold' }}>ENTRADA</button>
              <button onClick={() => agregarRegistro('Salida')} style={{ backgroundColor: '#db7093', border: 'none', padding: '20px', borderRadius: '15px', color: 'white', fontWeight: 'bold' }}>SALIDA</button>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '15px', padding: '10px' }}>
              {registros.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ffdae0' }}>
                  <span style={{ fontWeight: 'bold' }}>{r.tipo}</span>
                  <span>{r.hora}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cursos' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2>📖 Mis Cursos Bíblicos</h2>
            <p>Sección en construcción para tus lecciones.</p>
          </div>
        )}

        {activeTab === 'radio' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2>📻 Mi Emisora</h2>
            <p>Conectando con la señal...</p>
          </div>
        )}

        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', borderTop: '1px solid #ffdae0' }}>
          <button onClick={() => setActiveTab('cursos')} style={{ background: 'none', border: 'none', color: activeTab === 'cursos' ? '#db7093' : '#ccc', fontWeight: 'bold' }}>CURSOS</button>
          <button onClick={() => setActiveTab('registro')} style={{ background: 'none', border: 'none', color: activeTab === 'registro' ? '#db7093' : '#ccc', fontWeight: 'bold' }}>INICIO</button>
          <button onClick={() => setActiveTab('radio')} style={{ background: 'none', border: 'none', color: activeTab === 'radio' ? '#db7093' : '#ccc', fontWeight: 'bold' }}>RADIO</button>
        </nav>
      </div>
    </div>
  );
};

export default App;
