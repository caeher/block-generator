import React, { useState } from 'react';

function App() {
  // Estados para guardar lo que escribe el usuario y los mensajes de estado
  const [address, setAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Función que se ejecuta al hacer clic en cualquier botón
  const generateBlocks = async (numberOfBlocks) => {
    // 1. Validación básica
    if (!address) {
      alert("Por favor, ingresa una dirección de billetera primero.");
      return;
    }

    // 2. Mostrar mensaje de "Cargando..."
    setStatusMessage(`Solicitando generar ${numberOfBlocks} bloque(s) para ${address}...`);

    try {
      // 3. Llamada al backend (tu servidor "puente")
      // Asumimos que tu backend escucha en el puerto 3001 y tiene la ruta /generate
      const response = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          walletAddress: address, // La dirección del input
          blocksToGenerate: numberOfBlocks // 1, 10 o 100
        }),
      });

      const data = await response.json();

      // 4. Manejar la respuesta del servidor
      if (response.ok && data.success) {
        setStatusMessage(`¡Éxito! Se han generado ${numberOfBlocks} bloques. ID de transacción: ${data.txid}`);
      } else {
        setStatusMessage(`Error del servidor: ${data.error || 'Intentalo de nuevo'}`);
      }

    } catch (error) {
      // Manejar errores de conexión (ej: si el backend no está corriendo)
      console.error("Error en la petición:", error);
      setStatusMessage("Error de conexión: No se pudo contactar con el servidor backend.");
    }
  };

  // El "HTML" (JSX) que ve el usuario
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Generador de Bloques (Bitcoin Regtest)</h1>
      <hr />
      
      {/* Sección del Input */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="addressInput" style={{ display: 'block', marginBottom: '5px' }}>
          Dirección de Billetera Bitcoin (Regtest):
        </label>
        <input 
          id="addressInput"
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: bcrt1q..."
          style={{ width: '100%', maxWidth: '400px', padding: '8px', fontSize: '16px' }}
        />
      </div>

      {/* Sección de Botones */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => generateBlocks(1)} style={buttonStyle}>
          Generar 1 Bloque
        </button>
        <button onClick={() => generateBlocks(10)} style={buttonStyle}>
          Generar 10 Bloques
        </button>
        <button onClick={() => generateBlocks(100)} style={buttonStyle}>
          Generar 100 Bloques
        </button>
      </div>

      <hr />

      {/* Sección de Estado */}
      {statusMessage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
          <strong>Estado:</strong>
          <p style={{ margin: '5px 0 0 0' }}>{statusMessage}</p>
        </div>
      )}
    </div>
  );
}

// Un estilo muy básico para los botones
const buttonStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default App;
