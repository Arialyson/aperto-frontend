import React, { useState, useEffect } from 'react';
import { Truck, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  capacidade: string;
  status: string;
}

export function Veiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [status, setStatus] = useState('Disponível');
  const [saving, setSaving] = useState(false);

  async function loadVeiculos() {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch('http://localhost:3333/api/veiculos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setVeiculos(data);
      }
    } catch (error) {
      alert('Erro ao carregar veículos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVeiculos();
  }, []);

  function handleStartEdit(v: Veiculo) {
    setEditingId(v.id);
    setPlaca(v.placa);
    setModelo(v.modelo);
    setCapacidade(v.capacidade);
    setStatus(v.status);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setPlaca('');
    setModelo('');
    setCapacidade('');
    setStatus('Disponível');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!placa || !modelo || !capacidade) {
      alert('Preencha todos os campos do veículo.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('@taperto:token');
    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `http://localhost:3333/api/veiculos/${editingId}`
      : 'http://localhost:3333/api/veiculos';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ placa, modelo, capacidade, status })
      });

      if (!response.ok) {
        throw new Error('Erro ao guardar veículo.');
      }

      handleCancelEdit();
      loadVeiculos();
    } catch (error: any) {
      alert(error.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem a certeza de que deseja eliminar este veículo?')) return;

    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch(`http://localhost:3333/api/veiculos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        loadVeiculos();
      } else {
        alert('Erro ao eliminar veículo.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestão de Veículos</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cadastre, edite ou remova veículos da sua frota</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Placa</label>
          <input type="text" value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC-1234" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', textTransform: 'uppercase' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Modelo do Veículo</label>
          <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Volvo FH 540" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Capacidade (Toneladas)</label>
          <input type="text" value={capacidade} onChange={e => setCapacidade(e.target.value)} placeholder="Ex: 30 Ton" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        {editingId && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }}>
              <option value="Disponível">Disponível</option>
              <option value="Em Viagem">Em Viagem</option>
              <option value="Manutenção">Manutenção</option>
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

      {/* Lista */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>A carregar veículos...</div>
        ) : veiculos.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nenhum veículo cadastrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 16px' }}>Placa</th>
                <th style={{ padding: '14px 16px' }}>Modelo</th>
                <th style={{ padding: '14px 16px' }}>Capacidade</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#60a5fa' }}>{v.placa}</td>
                  <td style={{ padding: '14px 16px' }}>{v.modelo}</td>
                  <td style={{ padding: '14px 16px' }}>{v.capacidade}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: '#10b98120', color: '#34d399', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleStartEdit(v)} style={{ backgroundColor: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer' }} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(v.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Eliminar">
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

export default Veiculos;