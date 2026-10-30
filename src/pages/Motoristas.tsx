import React, { useState, useEffect } from 'react';
import { User, Plus, Phone, FileText, BadgeCheck } from 'lucide-react';

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

  // Form states
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cnh, setCnh] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadMotoristas() {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch('http://localhost:3333/api/motoristas', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  async function handleCreateMotorista(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !cpf || !telefone || !cnh) {
      alert('Preencha todos os campos do motorista.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('@taperto:token');

    try {
      const response = await fetch('http://localhost:3333/api/motoristas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, cpf, telefone, cnh })
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar motorista.');
      }

      setNome('');
      setCpf('');
      setTelefone('');
      setCnh('');
      loadMotoristas();
    } catch (error: any) {
      alert(error.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestão de Motoristas</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cadastre os motoristas da sua frota</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleCreateMotorista} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Nome Completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>CPF</label>
          <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Telefone</label>
          <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 90000-0000" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>CNH</label>
          <input type="text" value={cnh} onChange={e => setCnh(e.target.value)} placeholder="00000000000" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
        </div>

        <button type="submit" disabled={saving} style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Plus size={18} /> {saving ? 'A guardar...' : 'Cadastrar'}
        </button>
      </form>

      {/* Lista */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>A carregar motoristas...</div>
        ) : motoristas.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nenhum motorista cadastrado.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 16px' }}>Nome</th>
                <th style={{ padding: '14px 16px' }}>CPF</th>
                <th style={{ padding: '14px 16px' }}>Telefone</th>
                <th style={{ padding: '14px 16px' }}>CNH</th>
              </tr>
            </thead>
            <tbody>
              {motoristas.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#60a5fa' }}>{m.nome}</td>
                  <td style={{ padding: '14px 16px' }}>{m.cpf}</td>
                  <td style={{ padding: '14px 16px' }}>{m.telefone}</td>
                  <td style={{ padding: '14px 16px' }}>{m.cnh}</td>
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