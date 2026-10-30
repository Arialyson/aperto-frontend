import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Eraser, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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

  function handleLimpar() {
    setOrigem('');
    setDestino('');
    setValor('');
    setIdEmEdicao(null);
    setErro('');
    setSucesso('');
  }

  function handleIniciarEdicao(f: Frete) {
    if (!f.id) return;
    setIdEmEdicao(f.id);
    setOrigem(f.origem);
    setDestino(f.destino);
    setValor(String(f.valor));
    setErro('');
    setSucesso('');
  }

  async function handleSalvar(e: any) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!origem || !destino || !valor) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const dados = { origem, destino, valor: Number(valor), status: 'Pendente' };

      if (idEmEdicao) {
        await api.put(`/fretes/${idEmEdicao}`, dados);
        setSucesso('Frete atualizado com sucesso!');
      } else {
        await api.post('/fretes', dados);
        setSucesso('Frete cadastrado com sucesso!');
      }

      handleLimpar();
      carregarFretes();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao salvar frete.');
    }
  }

  async function handleExcluir(id?: string) {
    if (!id) return;
    if (confirm('Deseja realmente eliminar este frete?')) {
      try {
        await api.delete(`/fretes/${id}`);
        setSucesso('Frete removido com sucesso!');
        carregarFretes();
      } catch (err) {
        console.error('Erro ao eliminar frete:', err);
      }
    }
  }

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Gestão de Fretes</h1>
      </header>

      {/* Formulário */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>
          {idEmEdicao ? 'Editar Frete' : 'Cadastrar Novo Frete'}
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
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1e293b' }}>Fretes Registrados</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Origem</th>
              <th style={{ padding: '12px' }}>Destino</th>
              <th style={{ padding: '12px' }}>Valor</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fretes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
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
                  <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleIniciarEdicao(f)} 
                      style={{ padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleExcluir(f.id)} 
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