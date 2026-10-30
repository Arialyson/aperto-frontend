import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, Plus, Search, MapPin, User, Truck, AlertCircle, X, Filter } from 'lucide-react';

interface Motorista {
  id: string;
  nome: string;
}

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
}

interface Frete {
  id: string;
  origem: string;
  destino: string;
  valor: number;
  status: string;
  dataColeta: string;
  motoristaId?: string;
  veiculoId?: string;
  motorista?: { nome: string };
  veiculo?: { placa: string; modelo: string };
}

export function Fretes() {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('Todos');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [dataColeta, setDataColeta] = useState('');
  const [motoristaId, setMotoristaId] = useState('');
  const [veiculoId, setVeiculoId] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const [resFretes, resMotoristas, resVeiculos] = await Promise.all([
        api.get('/fretes').catch(() => ({ data: [] })),
        api.get('/motoristas').catch(() => ({ data: [] })),
        api.get('/veiculos').catch(() => ({ data: [] }))
      ]);

      setFretes(resFretes.data || []);
      setMotoristas(resMotoristas.data || []);
      setVeiculos(resVeiculos.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }

  function limparFormulario() {
    setOrigem('');
    setDestino('');
    setValor('');
    setDataColeta('');
    setMotoristaId('');
    setVeiculoId('');
    setErro('');
  }

  async function handleSalvarFrete(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!origem || !destino || !valor || !dataColeta) {
      setErro('Preencha os campos obrigatórios (Origem, Destino, Valor e Data).');
      return;
    }

    try {
      const payload = {
        origem,
        destino,
        valor: Number(valor),
        dataColeta,
        motoristaId: motoristaId || null,
        veiculoId: veiculoId || null,
        status: 'Pendente'
      };

      const response = await api.post('/fretes', payload);
      setFretes(prev => [response.data, ...prev]);
      setModalAberto(false);
      limparFormulario();
      carregarDados();
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao guardar o frete. Tente novamente.');
    }
  }

  // Aplicação combinada da busca textual e do filtro por status
  const fretesFiltrados = fretes.filter(frete => {
    const combinaBusca = 
      frete.origem.toLowerCase().includes(busca.toLowerCase()) ||
      frete.destino.toLowerCase().includes(busca.toLowerCase()) ||
      frete.motorista?.nome.toLowerCase().includes(busca.toLowerCase()) ||
      frete.veiculo?.placa.toLowerCase().includes(busca.toLowerCase());

    const statusAtual = frete.status || 'Pendente';
    const combinaStatus = filtroStatus === 'Todos' || statusAtual.toLowerCase() === filtroStatus.toLowerCase();

    return combinaBusca && combinaStatus;
  });

  const opcoesStatus = ['Todos', 'Pendente', 'Em Trânsito', 'Entregue'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#f8fafc', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>Gestão de Fretes</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Cadastre, atribua e filtre os fretes por estado operacional.</p>
        </div>
        <button 
          onClick={() => { limparFormulario(); setModalAberto(true); }}
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={20} />
          Novo Frete
        </button>
      </div>

      {/* Área de Filtros e Busca */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Campo de Busca */}
          <div style={{ flex: 1, minWidth: '260px', backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              placeholder="Buscar por origem, destino, motorista ou placa..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ width: '100%', backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          {/* Botões Rápidos de Filtro por Status */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={18} color="#64748b" style={{ marginRight: '4px' }} />
            {opcoesStatus.map(status => {
              const ativo = filtroStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    border: '1px solid',
                    borderColor: ativo ? '#3b82f6' : '#334155',
                    backgroundColor: ativo ? '#2563eb' : '#1e293b',
                    color: ativo ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {status}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Tabela de Fretes */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '10px', border: '1px solid #334155', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '14px 16px' }}>Rota (Origem → Destino)</th>
              <th style={{ padding: '14px 16px' }}>Valor</th>
              <th style={{ padding: '14px 16px' }}>Motorista Atribuído</th>
              <th style={{ padding: '14px 16px' }}>Veículo</th>
              <th style={{ padding: '14px 16px' }}>Data Coleta</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>A carregar fretes...</td>
              </tr>
            ) : fretesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Nenhum frete encontrado com os filtros selecionados.</td>
              </tr>
            ) : (
              fretesFiltrados.map(frete => (
                <tr key={frete.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} color="#3b82f6" />
                      {frete.origem} → {frete.destino}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#22c55e', fontWeight: 'bold' }}>
                    R$ {Number(frete.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 16px', color: frete.motorista ? '#f8fafc' : '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={16} color="#94a3b8" />
                      {frete.motorista?.nome || 'Não atribuído'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: frete.veiculo ? '#f8fafc' : '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={16} color="#94a3b8" />
                      {frete.veiculo ? `${frete.veiculo.modelo} (${frete.veiculo.placa})` : 'Não atribuído'}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>
                    {frete.dataColeta}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      backgroundColor: frete.status === 'Entregue' ? '#22c55e20' : frete.status === 'Em Trânsito' ? '#3b82f620' : '#eab30820',
                      color: frete.status === 'Entregue' ? '#22c55e' : frete.status === 'Em Trânsito' ? '#3b82f6' : '#eab308'
                    }}>
                      {frete.status || 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Novo Frete */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '520px', borderRadius: '12px', border: '1px solid #334155', padding: '24px', color: '#f8fafc' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Novo Frete</h2>
              <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {erro && (
              <div style={{ backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={handleSalvarFrete} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Origem *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: São Paulo, SP" 
                    value={origem} 
                    onChange={e => setOrigem(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Destino *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Rio de Janeiro, RJ" 
                    value={destino} 
                    onChange={e => setDestino(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Valor (R$) *</label>
                  <input 
                    type="number" 
                    placeholder="2500" 
                    value={valor} 
                    onChange={e => setValor(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Data de Coleta *</label>
                  <input 
                    type="date" 
                    value={dataColeta} 
                    onChange={e => setDataColeta(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Vincular Motorista</label>
                <select 
                  value={motoristaId} 
                  onChange={e => setMotoristaId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                >
                  <option value="">Nenhum motorista selecionado</option>
                  {motoristas.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Vincular Veículo</label>
                <select 
                  value={veiculoId} 
                  onChange={e => setVeiculoId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                >
                  <option value="">Nenhum veículo selecionado</option>
                  {veiculos.map(v => (
                    <option key={v.id} value={v.id}>{v.modelo} - {v.placa}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalAberto(false)}
                  style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Salvar Frete
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}