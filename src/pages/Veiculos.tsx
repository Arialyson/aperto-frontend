import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Eraser, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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

  function handleLimpar() {
    setPlaca('');
    setModelo('');
    setCapacidade('');
    setIdEmEdicao(null);
    setErro('');
    setSucesso('');
  }

  function handleIniciarEdicao(v: Veiculo) {
    if (!v.id) return;
    setIdEmEdicao(v.id);
    setPlaca(v.placa);
    setModelo(v.modelo);
    setCapacidade(String(v.capacidade));
    setErro('');
    setSucesso('');
  }

  async function handleSalvar(e: any) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!placa || !modelo || !capacidade) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const dados = { placa, modelo, capacidade: Number(capacidade) };

      if (idEmEdicao) {
        await api.put(`/veiculos/${idEmEdicao}`, dados);
        setSucesso('Veículo atualizado com sucesso!');
      } else {
        await api.post('/veiculos', dados);
        setSucesso('Veículo cadastrado com sucesso!');
      }

      handleLimpar();
      carregarVeiculos();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao salvar veículo.');
    }
  }

  async function handleExcluir(id?: string) {
    if (!id) return;
    if (confirm('Deseja realmente eliminar este veículo?')) {
      try {
        await api.delete(`/veiculos/${id}`);
        setSucesso('Veículo removido com sucesso!');
        carregarVeiculos();
      } catch (err) {
        console.error('Erro ao eliminar veículo:', err);
      }
    }
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Gestão de Veículos</h1>
      </header>

      {/* Formulário */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>
          {idEmEdicao ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
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
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Veículos Registrados</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Placa</th>
              <th style={{ padding: '12px' }}>Modelo</th>
              <th style={{ padding: '12px' }}>Capacidade</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  Nenhum veículo cadastrado.
                </td>
              </tr>
            ) : (
              veiculos.map((v, index) => (
                <tr key={v.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>{v.placa}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{v.modelo}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{v.capacidade} Kg</td>
                  <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleIniciarEdicao(v)} 
                      style={{ padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleExcluir(v.id)} 
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