import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Eraser, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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

  function handleLimpar() {
    setNome('');
    setCpf('');
    setCnh('');
    setIdEmEdicao(null);
    setErro('');
    setSucesso('');
  }

  function handleIniciarEdicao(m: Motorista) {
    if (!m.id) return;
    setIdEmEdicao(m.id);
    setNome(m.nome);
    setCpf(m.cpf);
    setCnh(m.cnh);
    setErro('');
    setSucesso('');
  }

  async function handleSalvar(e: any) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!nome || !cpf || !cnh) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const dados = { nome, cpf, cnh };

      if (idEmEdicao) {
        await api.put(`/motoristas/${idEmEdicao}`, dados);
        setSucesso('Motorista atualizado com sucesso!');
      } else {
        await api.post('/motoristas', dados);
        setSucesso('Motorista cadastrado com sucesso!');
      }

      handleLimpar();
      carregarMotoristas();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao salvar motorista.');
    }
  }

  async function handleExcluir(id?: string) {
    if (!id) return;
    if (confirm('Deseja realmente eliminar este motorista?')) {
      try {
        await api.delete(`/motoristas/${id}`);
        setSucesso('Motorista removido com sucesso!');
        carregarMotoristas();
      } catch (err) {
        console.error('Erro ao eliminar motorista:', err);
      }
    }
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Gestão de Motoristas</h1>
      </header>

      {/* Formulário */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>
          {idEmEdicao ? 'Editar Motorista' : 'Cadastrar Novo Motorista'}
        </h2>
        
        {erro && (
          <p style={{ color: '#ef4444', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {erro}
          </p>
        )}
        {sucesso && (
          <p style={{ color: '#16a34a', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {sucesso}
          </p>
        )}

        <form onSubmit={handleSalvar} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
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

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              style={{ padding: '11px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {idEmEdicao ? <Edit2 size={18} /> : <Plus size={18} />}
              {idEmEdicao ? 'Atualizar' : 'Cadastrar'}
            </button>

            <button 
              type="button" 
              onClick={handleLimpar} 
              style={{ padding: '11px 16px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Eraser size={18} />
              Limpar
            </button>
          </div>
        </form>
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Motoristas Registrados</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Nome</th>
              <th style={{ padding: '12px' }}>CPF</th>
              <th style={{ padding: '12px' }}>CNH</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {motoristas.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum motorista cadastrado.
                </td>
              </tr>
            ) : (
              motoristas.map((m, index) => (
                <tr key={m.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{m.nome}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{m.cpf}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{m.cnh}</td>
                  <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleIniciarEdicao(m)} 
                      style={{ padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleExcluir(m.id)} 
                      style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}