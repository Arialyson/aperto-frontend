import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Filter } from 'lucide-react';

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  renavam: string;
  documentoProprietario: string;
  capacidadeCarga: string;
  status: string;
}

export function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Form State
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [ano, setAno] = useState('');
  const [renavam, setRenavam] = useState('');
  const [documentoProprietario, setDocumentoProprietario] = useState('');
  const [capacidadeCarga, setCapacidadeCarga] = useState('');
  const [status, setStatus] = useState('Disponível');

  useEffect(() => {
    const salvos = localStorage.getItem('@taperto:veiculos');
    if (salvos) {
      try {
        setVeiculos(JSON.parse(salvos));
      } catch {
        setVeiculos([]);
      }
    } else {
      const iniciais: Veiculo[] = [
        {
          id: '1',
          placa: 'ABC-1D23',
          modelo: 'FH 540',
          marca: 'Volvo',
          ano: '2022',
          renavam: '12345678901',
          documentoProprietario: '12.345.678/0001-90',
          capacidadeCarga: '25 Toneladas',
          status: 'Em Rota'
        }
      ];
      setVeiculos(iniciais);
      localStorage.setItem('@taperto:veiculos', JSON.stringify(iniciais));
    }
  }, []);

  function salvar(novos: Veiculo[]) {
    setVeiculos(novos);
    localStorage.setItem('@taperto:veiculos', JSON.stringify(novos));
  }

  function mascaraPlaca(v: string) {
    const limpo = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    return limpo.length > 3 ? `${limpo.slice(0, 3)}-${limpo.slice(3)}` : limpo;
  }

  function mascaraCpfCnpj(v: string) {
    const limpo = v.replace(/\D/g, '').slice(0, 14);
    if (limpo.length <= 11) {
      return limpo.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return limpo.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
  }

  function mascaraRenavam(v: string) {
    return v.replace(/\D/g, '').slice(0, 11);
  }

  function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    const novo: Veiculo = {
      id: String(Date.now()),
      placa,
      modelo,
      marca,
      ano,
      renavam,
      documentoProprietario,
      capacidadeCarga,
      status
    };
    salvar([novo, ...veiculos]);
    setModalAberto(false);
    limparForm();
  }

  function handleExcluir(id: string) {
    salvar(veiculos.filter(v => v.id !== id));
  }

  function limparForm() {
    setPlaca('');
    setModelo('');
    setMarca('');
    setAno('');
    setRenavam('');
    setDocumentoProprietario('');
    setCapacidadeCarga('');
    setStatus('Disponível');
  }

  const veiculosFiltrados = veiculos.filter(v => {
    const termo = busca.toLowerCase();
    const atendeBusca = v.placa.toLowerCase().includes(termo) || v.modelo.toLowerCase().includes(termo) || v.marca.toLowerCase().includes(termo);
    const atendeStatus = filtroStatus === 'Todos' || v.status === filtroStatus;
    return atendeBusca && atendeStatus;
  });

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: 0 }}>Gestão de Veículos</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.9rem' }}>
            Controlo da frota, placas, capacidade e documentação.
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Novo Veículo
        </button>
      </div>

      {/* Barra de Filtro e Busca */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', backgroundColor: '#1e293b', padding: '12px', borderRadius: '10px', border: '1px solid #334155' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por placa, modelo ou marca..."
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
            <option value="Em Rota">Em Rota</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        </div>
      </div>

      {/* Tabela de Veículos */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px' }}>Placa / Modelo</th>
              <th style={{ padding: '12px 14px' }}>Marca / Ano</th>
              <th style={{ padding: '12px 14px' }}>CPF/CNPJ Proprietário</th>
              <th style={{ padding: '12px 14px' }}>RENAVAM</th>
              <th style={{ padding: '12px 14px' }}>Capacidade</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  Nenhum veículo encontrado.
                </td>
              </tr>
            ) : (
              veiculosFiltrados.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #33415540' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <strong style={{ color: 'white', display: 'block' }}>{v.placa}</strong>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{v.modelo}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{v.marca || '-'} {v.ano ? `(${v.ano})` : ''}</td>
                  <td style={{ padding: '12px 14px', color: '#f8fafc', fontFamily: 'monospace' }}>{v.documentoProprietario || '-'}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8', fontFamily: 'monospace' }}>{v.renavam || '-'}</td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{v.capacidadeCarga || '-'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: v.status === 'Disponível' ? '#22c55e20' : v.status === 'Em Rota' ? '#2563eb20' : '#ef444420',
                      color: v.status === 'Disponível' ? '#22c55e' : v.status === 'Em Rota' ? '#3b82f6' : '#ef4444'
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleExcluir(v.id)}
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
              Novo Veículo
            </h2>
            <form onSubmit={handleCriar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Placa *</label>
                  <input
                    required
                    type="text"
                    placeholder="ABC-1D23"
                    value={placa}
                    onChange={e => setPlaca(mascaraPlaca(e.target.value))}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Modelo *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: FH 540"
                    value={modelo}
                    onChange={e => setModelo(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Marca</label>
                  <input
                    type="text"
                    placeholder="Ex: Volvo"
                    value={marca}
                    onChange={e => setMarca(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Ano</label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={ano}
                    onChange={e => setAno(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>CPF/CNPJ Proprietário</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={documentoProprietario}
                    onChange={e => setDocumentoProprietario(mascaraCpfCnpj(e.target.value))}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>RENAVAM</label>
                  <input
                    type="text"
                    placeholder="11 dígitos"
                    value={renavam}
                    onChange={e => setRenavam(mascaraRenavam(e.target.value))}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Capacidade Carga</label>
                  <input
                    type="text"
                    placeholder="Ex: 25 Toneladas"
                    value={capacidadeCarga}
                    onChange={e => setCapacidadeCarga(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Em Rota">Em Rota</option>
                    <option value="Manutenção">Manutenção</option>
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

export default Veiculos;