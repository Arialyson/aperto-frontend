import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, TrendingUp, Users } from 'lucide-react';

interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  cnh: string;
}

export function Motoristas() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnh, setCnh] = useState('');
  const [saving, setSaving] = useState(false);

  // Formatação em tempo real e retroativa na tabela
  function formatarCPF(v: string) {
    const nums = v.replace(/\D/g, '').slice(0, 11);
    return nums
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function formatarTelefone(v: string) {
    const nums = v.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 10) {
      return nums
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return nums
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  async function loadMotoristas() {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch('http://localhost:3333/api/motoristas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setMotoristas(data);
      }
    } catch (error) {
      alert('Erro ao carregar motoristas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMotoristas();
  }, []);

  function handleStartEdit(m: Motorista) {
    setEditingId(m.id);
    setNome(m.nome);
    setCpf(formatarCPF(m.cpf));
    setTelefone(formatarTelefone(m.telefone));
    setCnh(m.cnh);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setNome('');
    setCpf('');
    setTelefone('');
    setCnh('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !cpf || !telefone || !cnh) {
      alert('Preencha todos os campos do motorista.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('@taperto:token');
    const isEditing = Boolean(editingId);
    const url = isEditing
      ? `http://localhost:3333/api/motoristas/${editingId}`
      : 'http://localhost:3333/api/motoristas';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          cpf: formatarCPF(cpf),
          telefone: formatarTelefone(telefone),
          cnh
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar motorista.');

      handleCancelEdit();
      loadMotoristas();
    } catch (error: any) {
      alert(error.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza de que deseja excluir este motorista?')) return;

    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch(`http://localhost:3333/api/motoristas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        loadMotoristas();
      } else {
        alert('Erro ao excluir motorista.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestão de Motoristas</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cadastre, edite ou remova os motoristas da sua frota</p>
      </div>

      {/* Card da Cotação / Indicador de Produtividade da Equipe */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#10b98120', padding: '12px', borderRadius: '10px', color: '#34d399' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Índice de Disponibilidade da Equipe</span>
            <strong style={{ fontSize: '1.3rem', color: '#fff' }}>100% Ativos</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '8px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
          <TrendingUp size={20} color="#34d399" />
          <span style={{ color: '#34d399', fontWeight: 'bold', fontSize: '0.9rem' }}>+ 2.5% produtividade</span>
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Nome Completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>CPF</label>
          <input type="text" value={cpf} onChange={e => setCpf(formatarCPF(e.target.value))} placeholder="000.000.000-00" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Telefone</label>
          <input type="text" value={telefone} onChange={e => setTelefone(formatarTelefone(e.target.value))} placeholder="(00) 90000-0000" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>CNH</label>
          <input type="text" value={cnh} onChange={e => setCnh(e.target.value)} placeholder="00000000000" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

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

      {/* Tabela de Motoristas */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px dashed #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Carregando motoristas...</div>
        ) : motoristas.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nenhum motorista cadastrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px dashed #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 16px' }}>Nome</th>
                <th style={{ padding: '14px 16px' }}>CPF</th>
                <th style={{ padding: '14px 16px' }}>Telefone</th>
                <th style={{ padding: '14px 16px' }}>CNH</th>
                <th style={{ padding: '14px 16px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {motoristas.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px dashed #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#60a5fa' }}>{m.nome}</td>
                  <td style={{ padding: '14px 16px' }}>{formatarCPF(m.cpf)}</td>
                  <td style={{ padding: '14px 16px' }}>{formatarTelefone(m.telefone)}</td>
                  <td style={{ padding: '14px 16px' }}>{m.cnh}</td>
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleStartEdit(m)} style={{ backgroundColor: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer' }} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(m.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Excluir">
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

export default Motoristas;