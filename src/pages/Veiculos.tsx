import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Veiculo {
  id?: string;
  placa: string;
  modelo: string;
  capacidade: number;
}

export function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [erro, setErro] = useState('');

  async function carregarVeiculos() {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
    }
  }

  useEffect(() => {
    carregarVeiculos();
  }, []);

  async function handleCadastrar(e: any) {
    e.preventDefault();
    setErro('');

    if (!placa || !modelo || !capacidade) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      await api.post('/veiculos', {
        placa,
        modelo,
        capacidade: Number(capacidade),
      });

      setPlaca('');
      setModelo('');
      setCapacidade('');
      carregarVeiculos();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar veículo.');
    }
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Gestão de Veículos</h1>
      </header>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Cadastrar Novo Veículo</h2>
        
        {erro && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{erro}</p>}

        <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Placa</label>
            <input 
              type="text" 
              placeholder="ABC-1234" 
              value={placa} 
              onChange={e => setPlaca(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Modelo</label>
            <input 
              type="text" 
              placeholder="Volvo FH 540" 
              value={modelo} 
              onChange={e => setModelo(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Capacidade (Kg)</label>
            <input 
              type="number" 
              placeholder="30000" 
              value={capacidade} 
              onChange={e => setCapacidade(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <button 
            type="submit" 
            style={{ padding: '11px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cadastrar
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Veículos Registados</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Placa</th>
              <th style={{ padding: '12px' }}>Modelo</th>
              <th style={{ padding: '12px' }}>Capacidade</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum veículo cadastrado.
                </td>
              </tr>
            ) : (
              veiculos.map((v, index) => (
                <tr key={v.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{v.placa}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{v.modelo}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{v.capacidade} Kg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}