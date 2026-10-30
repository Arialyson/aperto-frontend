import React, { useState, useEffect } from 'react';
import { Package, Plus, MapPin, DollarSign, Clock } from 'lucide-react';

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
  
  // Estados do Formulário
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [saving, setSaving] = useState(false);

  // Buscar Fretes do Backend
  async function loadFretes() {
    const token = localStorage.getItem('@taperto:token');
    try {
      const response = await fetch('http://localhost:3333/api/fretes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setFretes(data);
      }
    } catch (error) {
      alert('Erro ao carregar fretes do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFretes();
  }, []);

  // Criar Frete no Backend
  async function handleCreateFrete(e: React.FormEvent) {
    e.preventDefault();
    if (!origem || !destino || !valor) {
      alert('Preencha todos os campos do frete.');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('@taperto:token');

    try {
      const response = await fetch('http://localhost:3333/api/fretes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ origem, destino, valor })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar frete.');
      }

      setOrigem('');
      setDestino('');
      setValor('');
      loadFretes(); // Recarrega a lista
    } catch (error: any) {
      alert(error.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Gestão de Fretes</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Cadastre e acompanhe os seus fretes isolados em tempo real</p>
      </div>

      {/* Formulário para Novo Frete */}
      <form onSubmit={handleCreateFrete} style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
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

        <button type="submit" disabled={saving} style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Plus size={18} /> {saving ? 'A guardar...' : 'Criar Frete'}
        </button>
      </form>

      {/* Tabela / Lista de Fretes */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>A carregar fretes...</div>
        ) : fretes.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Nenhum frete cadastrado para esta conta.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '14px 16px' }}>Código</th>
                <th style={{ padding: '14px 16px' }}>Origem / Destino</th>
                <th style={{ padding: '14px 16px' }}>Valor</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {fretes.map(frete => (
                <tr key={frete.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#60a5fa' }}>{frete.codigo}</td>
                  <td style={{ padding: '14px 16px' }}>{frete.origem} ➔ {frete.destino}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>€{frete.valor}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: '#2563eb20', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {frete.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{frete.dataCriacao}</td>
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