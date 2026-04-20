import React, { useState } from 'react';

function App() {
  const [address, setAddress] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const generateBlocks = async (numberOfBlocks) => {
    if (!address) {
      alert("Por favor, ingresa una dirección de billetera primero.");
      return;
    }

    setStatusMessage(`Solicitando generar ${numberOfBlocks} bloque(s)...`);

    // Credenciales RPC (deben coincidir con tu bitcoin.conf)
    const rpcuser = 'local_rpc';
    const rpcpassword = 'local_rpc_password';

    const body = {
      jsonrpc: '1.0',
      id: 'frontend',
      method: 'generatetoaddress',
      params: [numberOfBlocks, address]
    };

    try {
      // ← La URL es "/" porque el proxy de CRA redirige al nodo
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${rpcuser}:${rpcpassword}`),
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      // La respuesta RPC tiene la forma { result: [...], error: null, id: "..." }
      if (data.error) {
        setStatusMessage(`Error RPC: ${data.error.message}`);
      } else {
        const hashes = data.result;
        setStatusMessage(`¡Éxito! ${hashes.length} bloque(s) generados.\nÚltimo hash: ${hashes[hashes.length - 1]}`);
      }

    } catch (error) {
      console.error("Error en la petición:", error);
      setStatusMessage("Error de conexión: ¿Está corriendo Bitcoin Core en regtest?");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Generador de Bloques (Bitcoin Regtest)</h1>
      <hr />

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

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => generateBlocks(1)} style={buttonStyle}>Generar 1 Bloque</button>
        <button onClick={() => generateBlocks(10)} style={buttonStyle}>Generar 10 Bloques</button>
        <button onClick={() => generateBlocks(100)} style={buttonStyle}>Generar 100 Bloques</button>
      </div>

      <hr />

      {statusMessage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
          <strong>Estado:</strong>
          <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>{statusMessage}</p>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default App;