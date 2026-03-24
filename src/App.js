import React, { useState, useEffect } from 'react';

function App() {
  const [registros, setRegistros] = useState([]);
  const [tiempo, setTiempo] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTiempo(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const agregarRegistro = (tipo) => {
    const nuevo = { tipo, hora: new Date().toLocaleTimeString(), id: Date.now() };
    setRegistros([nuevo, ...registros]);
  };

  return (
    <div style={{ backgroundColor: '#fff0f5', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#d87093' }}>🌸 Registro Sakura 🌸</h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{tiempo}</p>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => agregarRegistro('Entrada')} style={{ backgroundColor: '#ffb6c1', border: 'none', padding: '10px 20px', margin: '5px', borderRadius: '10px', cursor: 'pointer' }}>Entrada</button>
        <button onClick={() => agregarRegistro('Salida')} style={{ backgroundColor: '#db7093', color: 'white', border: 'none', padding: '10px 20px', margin: '5px', borderRadius: '10px', cursor: 'pointer' }}>Salida</button>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        {registros.map(r => (
          <div key={r.id} style={{ background: 'white', padding: '10px', marginBottom: '5px', borderRadius: '5px', borderLeft: '5px solid #ffb6c1' }}>
            <strong>{r.tipo}</strong> - {r.hora}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
