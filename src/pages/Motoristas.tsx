import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Filter, UserCheck } from 'lucide-react';

interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  cnh: string;
  categoriaCnh: string;
  telefone: string;
  status: string;
}

export function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Form State
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnh, setCnh] = useState('');
  const [categoriaCnh, setCategoriaCnh] = useState('D');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState('Disponível');

  useEffect(() => {
    const salvos = localStorage.getItem('@taperto:motoristas');
    if (salvos) {
      try {
        setMotoristas(JSON.parse(salvos));
      } catch {
        setMotoristas([]);
      }
    } else {
      const iniciais: Motorista[] = [
        {
          id: '1',
          nome: 'Carlos Silva',
          cpf: '123.456.789-00',
          cnh: '12345678900',
          categoriaCnh: 'E',
          telefone: '(11) 98765-4321',
          status: 'Em Viagem'
        },
        {
          id: '2',
          nome: 'João Santos',
          cpf: '987.654.321-11',
          cnh: '09876543211',
          categoriaCnh: 'D',
          telefone: '(21) 97654-3210',
          status: 'Disponível'
        }
      ];
      setMotoristas(iniciais);
      localStorage.setItem('@taperto:motoristas', JSON.stringify(iniciais));
    }
  }, []);

  function salvar(novos: Motorista[]) {
    setMotoristas(novos);
    localStorage.setItem('@taperto:motoristas', JSON.stringify(novos));
  }

  // Máscaras de entrada
  function mascaraCpf(v: string) {
    const limpo = v.replace(/\D/g, '').slice(0, 11);
    return limpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2') .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function mascaraTelefone(v: string) {
    const limpo = v.replace(/\D/g, '').slice(0, 11);
    if (limpo.length <= 10) {
      return limpo.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return limpo.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  function mascaraCnh(v: string) {
    return v.replace(/\D/g, '').slice(0, 11);
  }

  function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    const novo: Motorista = {
      id: String(Date.now()),
      nome,
      cpf,
      cnh,
      categoriaCnh,
      telefone,
      status
    };
    salvar([novo, ...motoristas]);
    setModalAberto(false);
    limparForm();
  }

  function handleExcluir(id: string) {
    salvar(motoristas.filter(m => m.id !== id));
  }

  function limparForm() {
    setNome('');
    setCpf('');
    setCnh('');
    setCategoriaCnh('D');
    setTelefone('');
    setStatus('Disponível');
  }

  const motoristasFiltrados = motoristas.filter(m => {
    const termo = busca.toLowerCase();
    const atendeBusca = m.nome.toLowerCase().includes(termo) || m.cpf.includes(termo) || m.cnh.includes(termo);
    const atendeStatus = filtroStatus === 'Todos' || m.status === filtroStatus;
    return atendeBusca && atendeStatus;
  });

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0 }}>Gestão de Motoristas</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.9rem' }}>
            Registo de condutores, CNH, contacto e disponibilidade.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Novo Motorista
        </button>
      </div>

      {/* Barra de Filtro e Busca */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou CNH..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 34px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="#64748b" />
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            style={{ padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Disponível">Disponível</option>
            <option value="Em Viagem">Em Viagem</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela de Motoristas */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Nome</th>
              <th style={{ padding: '12px 14px' }}>CPF</th>
              <th style={{ padding: '12px 14px' }}>CNH / Categoria</th>
              <th style={{ padding: '12px 14px' }}>Telefone</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {motoristasFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  Nenhum motorista encontrado.
                </td>
              </tr>
            ) : (
              motoristasFiltrados.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #33415540' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 'bold', color: 'white' }}>{m.nome}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8', fontFamily: 'monospace' }}>{m.cpf}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                    <span style={{ fontFamily: 'monospace' }}>{m.cnh}</span> <strong style={{ color: '#38bdf8' }}>({m.categoriaCnh})</strong>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{m.telefone || '-'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: m.status === 'Disponível' ? '#22c55e20' : m.status === 'Em Viagem' ? '#2563eb20' : '#ef444420',
                      color: m.status === 'Disponível' ? '#22c55e' : m.status === 'Em Viagem' ? '#3b82f6' : '#ef4444'
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleExcluir(m.id)}
                      style={{ backgroundColor: '#ef444420', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Cadastro */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#1e293b', width: '100%', maxWidth: '550px', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 16px 0', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              Novo Motorista
            </h2>
            <form onSubmit={handleCriar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Nome Completo *</label>
                <input
                  required
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>CPF *</label>
                  <input
                    required
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(mascaraCpf(e.target.value))}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Telefone</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={e => setTelefone(mascaraTelefone(e.target.value))}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>CNH *</label>
                  <input
                    required
                    type="text"
                    placeholder="11 dígitos"
                    value={cnh}
                    onChange={e => setCnh(mascaraCnh(e.target.value))}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Cat.</label>
                  <select
                    value={categoriaCnh}
                    onChange={e => setCategoriaCnh(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  >
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Em Viagem">Em Viagem</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Motoristas;