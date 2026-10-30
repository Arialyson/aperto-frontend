import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Frete {
  id?: string;
  origem: string;
  destino: string;
  valor: number;
  status: string;
}

export function Fretes() {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  async function carregarFretes() {
    try {
      const response = await api.get('/fretes');
      setFretes(response.data);
    } catch (err) {
      console.error('Erro ao carregar fretes:', err);
    }
  }

  useEffect(() => {
    carregarFretes();
  }, []);

  async function handleCadastrar(e: any) {
    e.preventDefault();
    setErro('');

    if (!origem || !destino || !valor) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      await api.post('/fretes', {
        origem,
        destino,
        valor: Number(valor),
        status: 'Pendente',
      });

      setOrigem('');
      setDestino('');
      setValor('');
      carregarFretes();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar frete.');
    }
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Gestão de Fretes</h1>
      </header>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Cadastrar Novo Frete</h2>
        
        {erro && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{erro}</p>}

        <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Origem</label>
            <input 
              type="text" 
              placeholder="São Paulo, SP" 
              value={origem} 
              onChange={e => setOrigem(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Destino</label>
            <input 
              type="text" 
              placeholder="Curitiba, PR" 
              value={destino} 
              onChange={e => setDestino(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Valor (R$)</label>
            <input 
              type="number" 
              placeholder="2500" 
              value={valor} 
              onChange={e => setValor(e.target.value)} 
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
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Fretes Registados</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Origem</th>
              <th style={{ padding: '12px' }}>Destino</th>
              <th style={{ padding: '12px' }}>Valor</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {fretes.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum frete cadastrado.
                </td>
              </tr>
            ) : (
              fretes.map((f, index) => (
                <tr key={f.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{f.origem}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{f.destino}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>R$ {f.valor}</td>
                  <td style={{ padding: '12px', color: '#2563eb', fontWeight: 'bold' }}>{f.status || 'Pendente'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}