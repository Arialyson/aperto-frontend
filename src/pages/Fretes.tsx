import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, QrCode, Calculator, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Frete {
  id: string;
  codigo: string;
  origem: string;
  destino: string;
  status: string;
  valor: number;
  dataCriacao: string;
}

export function Fretes() {
  const [fretes, setFretes] = useState<Frete[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // Formulário
  const [editingId, setEditingId] = useState<string | null>(null);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [saving, setSaving] = useState(false);

  // Cotação Rápida
  const [distanciaKm, setDistanciaKm] = useState('');
  const [pesoTon, setPesoTon] = useState('');
  const [valorCotado, setValorCotado] = useState<number | null>(null);

  // Modal QR Code
  const [qrCodeCodigo, setQrCodeCodigo] = useState<string | null>(null);

  async function loadFretes() {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch('http://localhost:3333/api/fretes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setFretes(data);
    } catch (error) {
      alert('Erro ao carregar fretes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFretes();
  }, []);

  function calcularCotacao(e: React.FormEvent) {
    e.preventDefault();
    const km = Number(distanciaKm);
    const ton = Number(pesoTon);

    if (km > 0 && ton > 0) {
      const total = km * 4.5 + ton * 85;
      setValorCotado(total);
      if (!valor) setValor(String(total));
    }
  }

  function handleStartEdit(frete: Frete) {
    setEditingId(frete.id);
    setOrigem(frete.origem);
    setDestino(frete.destino);
    setValor(String(frete.valor));
    setStatus(frete.status);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setOrigem('');
    setDestino('');
    setValor('');
    setStatus('Pendente');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origem || !destino || !valor) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('@taperto:token');
    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `http://localhost:3333/api/fretes/${editingId}`
      : 'http://localhost:3333/api/fretes';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ origem, destino, valor: Number(valor), status })
      });

      if (!response.ok) throw new Error('Erro ao salvar frete.');

      handleCancelEdit();
      loadFretes();
    } catch (error: any) {
      alert(error.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickStatusChange(frete: Frete, novoStatus: string) {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch(`http://localhost:3333/api/fretes/${frete.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          origem: frete.origem,
          destino: frete.destino,
          valor: frete.valor,
          status: novoStatus
        })
      });

      if (response.ok) loadFretes();
    } catch (error) {
      alert('Erro ao atualizar status.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza de que deseja excluir este frete?')) return;

    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch(`http://localhost:3333/api/fretes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) loadFretes();
    } catch (error) {
      alert('Erro de conexão.');
    }
  }

  const fretesFiltrados = fretes.filter(f => {
    const atendeBusca = 
      f.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      f.origem.toLowerCase().includes(busca.toLowerCase()) ||
      f.destino.toLowerCase().includes(busca.toLowerCase());
    const atendeStatus = filtroStatus === 'Todos' || f.status === filtroStatus;
    return atendeBusca && atendeStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestão de Fretes</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cadastre, edite e acompanhe o mercado de fretes</p>
      </div>

      {/* Card da Cotação / Indicador de Mercado (Bolsa de Valores) */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#10b98120', padding: '12px', borderRadius: '10px', color: '#34d399' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Cotação Média do Frete / Tonelada</span>
            <strong style={{ fontSize: '1.3rem', color: '#fff' }}>R$ 85,00 / Ton</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
          <TrendingUp size={20} color="#34d399" />
          <span style={{ color: '#34d399', fontWeight: 'bold', fontSize: '0.9rem' }}>+ 4.2% esta semana</span>
        </div>
      </div>

      {/* Calculadora de Cotação Rápida */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="#60a5fa" />
          Calculadora de Cotação Rápida
        </h2>
        <form onSubmit={calcularCotacao} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Distância (Km)</label>
            <input type="number" value={distanciaKm} onChange={e => setDistanciaKm(e.target.value)} placeholder="Ex: 200" style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Peso (Ton)</label>
            <input type="number" value={pesoTon} onChange={e => setPesoTon(e.target.value)} placeholder="Ex: 5" style={{ width: '100%', padding: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
          </div>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Cotar & Preencher
          </button>
        </form>

        {valorCotado !== null && (
          <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Valor estimado calculado:</span>
            <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>R$ {valorCotado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </div>
        )}
      </div>

      {/* Formulário de Cadastro / Edição */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Origem</label>
          <input type="text" value={origem} onChange={e => setOrigem(e.target.value)} placeholder="Ex: São Paulo" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Destino</label>
          <input type="text" value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ex: Curitiba" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Valor (R$)</label>
          <input type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex: 1500" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        {editingId && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}>
              <option value="Pendente">Pendente</option>
              <option value="Em Trânsito">Em Trânsito</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', backgroundColor: editingId ? '#10b981' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {editingId ? <Check size={18} /> : <Plus size={18} />}
            {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '12px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Pesquisa e Filtros */}
      <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px', backgroundColor: '#0f172a', padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por Código, Origem ou Destino..."
            style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} color="#60a5fa" />
          <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Filtrar Status:</span>
          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
            style={{ padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Trânsito">Em Trânsito</option>
            <option value="Entregue">Entregue</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Fretes com Troca Rápida de Status */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px dashed #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Carregando fretes...</div>
        ) : fretesFiltrados.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nenhum frete encontrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px dashed #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 16px' }}>Código</th>
                <th style={{ padding: '14px 16px' }}>Origem</th>
                <th style={{ padding: '14px 16px' }}>Destino</th>
                <th style={{ padding: '14px 16px' }}>Valor</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fretesFiltrados.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px dashed #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#60a5fa' }}>{f.codigo}</td>
                  <td style={{ padding: '14px 16px' }}>{f.origem}</td>
                  <td style={{ padding: '14px 16px' }}>{f.destino}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#34d399' }}>
                    R$ {f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={f.status}
                      onChange={e => handleQuickStatusChange(f, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: f.status === 'Entregue' ? '#34d399' : f.status === 'Em Trânsito' ? '#60a5fa' : f.status === 'Pendente' ? '#fbbf24' : '#f87171',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pendente" style={{ color: '#fbbf24' }}>Pendente</option>
                      <option value="Em Trânsito" style={{ color: '#60a5fa' }}>Em Trânsito</option>
                      <option value="Entregue" style={{ color: '#34d399' }}>Entregue</option>
                      <option value="Cancelado" style={{ color: '#f87171' }}>Cancelado</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => setQrCodeCodigo(f.codigo)} style={{ backgroundColor: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer' }} title="QR Code Rastreio">
                      <QrCode size={18} />
                    </button>
                    <button onClick={() => handleStartEdit(f)} style={{ backgroundColor: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer' }} title="Editar Dados">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal QR Code */}
      {qrCodeCodigo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', padding: '28px', borderRadius: '16px', border: '1px dashed #334155', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>QR Code de Rastreio</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Acompanhe o frete <strong>{qrCodeCodigo}</strong></p>            
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px' }}>
              <QRCodeSVG value={`http://localhost:5173/rastreio?codigo=${qrCodeCodigo}`} size={180} />
            </div>
            <button onClick={() => setQrCodeCodigo(null)} style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fretes;