import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Motorista {
  id?: string;
  nome: string;
  cpf: string;
  cnh: string;
}

export function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnh, setCnh] = useState('');
  const [erro, setErro] = useState('');

  async function carregarMotoristas() {
    try {
      const response = await api.get('/motoristas');
      setMotoristas(response.data);
    } catch (err) {
      console.error('Erro ao carregar motoristas:', err);
    }
  }

  useEffect(() => {
    carregarMotoristas();
  }, []);

  async function handleCadastrar(e: any) {
    e.preventDefault();
    setErro('');

    if (!nome || !cpf || !cnh) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      await api.post('/motoristas', {
        nome,
        cpf,
        cnh,
      });

      setNome('');
      setCpf('');
      setCnh('');
      carregarMotoristas();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar motorista.');
    }
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Gestão de Motoristas</h1>
      </header>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Cadastrar Novo Motorista</h2>
        
        {erro && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{erro}</p>}

        <form onSubmit={handleCadastrar} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>Nome Completo</label>
            <input 
              type="text" 
              placeholder="Carlos Silva" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>CPF</label>
            <input 
              type="text" 
              placeholder="000.000.000-00" 
              value={cpf} 
              onChange={e => setCpf(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '5px' }}>CNH</label>
            <input 
              type="text" 
              placeholder="12345678900" 
              value={cnh} 
              onChange={e => setCnh(e.target.value)} 
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
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Motoristas Registados</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Nome</th>
              <th style={{ padding: '12px' }}>CPF</th>
              <th style={{ padding: '12px' }}>CNH</th>
            </tr>
          </thead>
          <tbody>
            {motoristas.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum motorista cadastrado.
                </td>
              </tr>
            ) : (
              motoristas.map((m, index) => (
                <tr key={m.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{m.nome}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{m.cpf}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{m.cnh}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}