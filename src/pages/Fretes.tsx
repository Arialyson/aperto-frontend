import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

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

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [saving, setSaving] = useState(false);

  async function loadFretes() {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch('http://localhost:3333/api/fretes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setFretes(data);
      }
    } catch (error) {
      alert('Erro ao carregar fretes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFretes();
  }, []);

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

      if (!response.ok) {
        throw new Error('Erro ao guardar frete.');
      }

      handleCancelEdit();
      loadFretes();
    } catch (error: any) {
      alert(error.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem a certeza de que deseja eliminar este frete?')) return;

    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch(`http://localhost:3333/api/fretes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        loadFretes();
      } else {
        alert('Erro ao eliminar frete.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestão de Fretes</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cadastre, edite ou remova os seus fretes</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Origem</label>
          <input type="text" value={origem} onChange={e => setOrigem(e.target.value)} placeholder="Ex: Lisboa" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Destino</label>
          <input type="text" value={destino} onChange={e => setDestino(e.target.value)} placeholder="Ex: Porto" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Valor (€)</label>
          <input type="number" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex: 450" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
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
            {saving ? 'A guardar...' : editingId ? 'Atualizar' : 'Cadastrar'}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '12px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {/* Tabela */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>A carregar fretes...</div>
        ) : fretes.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nenhum frete cadastrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 16px' }}>Código</th>
                <th style={{ padding: '14px 16px' }}>Origem</th>
                <th style={{ padding: '14px 16px' }}>Destino</th>
                <th style={{ padding: '14px 16px' }}>Valor</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fretes.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#60a5fa' }}>{f.codigo}</td>
                  <td style={{ padding: '14px 16px' }}>{f.origem}</td>
                  <td style={{ padding: '14px 16px' }}>{f.destino}</td>
                  <td style={{ padding: '14px 16px' }}>€ {f.valor}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: '#10b98120', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {f.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleStartEdit(f)} style={{ backgroundColor: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer' }} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(f.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Fretes;