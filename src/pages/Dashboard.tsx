import React, { useState, useEffect } from 'react';
import { Package, Users, Truck, DollarSign, Clock, CheckCircle2, TrendingUp, Calculator } from 'lucide-react';

interface Stats {
  totalFretes: number;
  totalMotoristas: number;
  totalVeiculos: number;
  faturamentoTotal: number;
  fretesEmTransito: number;
  fretesEntregues: number;
  fretesPendentes: number;
  ultimosFretes: Array<{
    id: string;
    codigo: string;
    origem: string;
    destino: string;
    valor: number;
    status: string;
  }>;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Cotação Rápida em Reais
  const [distanciaKm, setDistanciaKm] = useState('');
  const [pesoTon, setPesoTon] = useState('');
  const [valorCotado, setValorCotado] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      const token = localStorage.getItem('@taperto:token');
      try {
        const response = await fetch('http://localhost:3333/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error('Erro ao carregar métricas.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  function calcularCotacao(e: React.FormEvent) {
    e.preventDefault();
    const km = Number(distanciaKm);
    const ton = Number(pesoTon);

    if (km > 0 && ton > 0) {
      // Cálculo em Reais: R$ 4,50/km + R$ 85,00/ton
      const total = km * 4.5 + ton * 85;
      setValorCotado(total);
    }
  }

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Carregando dados do painel...</div>;
  }

  const total = stats?.totalFretes || 0;
  const pctPendentes = total > 0 ? ((stats?.fretesPendentes || 0) / total) * 100 : 0;
  const pctEmTransito = total > 0 ? ((stats?.fretesEmTransito || 0) / total) * 100 : 0;
  const pctEntregues = total > 0 ? ((stats?.fretesEntregues || 0) / total) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Visão Geral da Logística</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Métricas calculadas em tempo real da sua operação</p>
      </div>

      {/* Cards Principais com Moeda R$ e Moldura Tracejada */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#2563eb20', padding: '12px', borderRadius: '10px', color: '#60a5fa' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Faturamento Total</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '2px 0 0 0' }}>
              R$ {stats?.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#3b82f620', padding: '12px', borderRadius: '10px', color: '#3b82f6' }}>
            <Package size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total de Fretes</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '2px 0 0 0' }}>{stats?.totalFretes}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#10b98120', padding: '12px', borderRadius: '10px', color: '#34d399' }}>
            <Users size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Motoristas Ativos</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '2px 0 0 0' }}>{stats?.totalMotoristas}</h3>
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ backgroundColor: '#f59e0b20', padding: '12px', borderRadius: '10px', color: '#fbbf24' }}>
            <Truck size={28} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Veículos na Frota</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '2px 0 0 0' }}>{stats?.totalVeiculos}</h3>
          </div>
        </div>
      </div>

      {/* Caixa de Diálogo de Cotação Rápida */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px dashed #334155' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={20} color="#60a5fa" />
          Simulador / Cotação Rápida de Frete
        </h2>
        <form onSubmit={calcularCotacao} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Distância (Km)</label>
            <input type="number" value={distanciaKm} onChange={e => setDistanciaKm(e.target.value)} placeholder="Ex: 350" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>Peso Carga (Ton)</label>
            <input type="number" value={pesoTon} onChange={e => setPesoTon(e.target.value)} placeholder="Ex: 12" style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Calcular Cotação
          </button>
        </form>

        {valorCotado !== null && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#0f172a', borderRadius: '8px', borderLeft: '4px solid #10b981', borderTop: '1px dashed #334155', borderRight: '1px dashed #334155', borderBottom: '1px dashed #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1' }}>Estimativa sugerida de Frete:</span>
            <strong style={{ fontSize: '1.25rem', color: '#34d399' }}>R$ {valorCotado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
          </div>
        )}
      </div>

      {/* Gráficos e Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#60a5fa" />
            Gráfico de Distribuição do Status
          </h2>

          <div style={{ height: '20px', backgroundColor: '#0f172a', borderRadius: '10px', overflow: 'hidden', display: 'flex', border: '1px solid #334155' }}>
            {pctPendentes > 0 && <div style={{ width: `${pctPendentes}%`, backgroundColor: '#fbbf24' }} title={`Pendentes: ${pctPendentes.toFixed(0)}%`} />}
            {pctEmTransito > 0 && <div style={{ width: `${pctEmTransito}%`, backgroundColor: '#3b82f6' }} title={`Em Trânsito: ${pctEmTransito.toFixed(0)}%`} />}
            {pctEntregues > 0 && <div style={{ width: `${pctEntregues}%`, backgroundColor: '#10b981' }} title={`Entregues: ${pctEntregues.toFixed(0)}%`} />}
            {total === 0 && <div style={{ width: '100%', backgroundColor: '#334155' }} title="Sem dados" />}
          </div>

          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e1' }}>
            <li style={{ borderBottom: '1px dashed #334155', paddingBottom: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="#fbbf24" /> Pendentes:</span> <strong>{stats?.fretesPendentes}</strong>
            </li>
            <li style={{ borderBottom: '1px dashed #334155', paddingBottom: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Truck size={16} color="#60a5fa" /> Em Trânsito:</span> <strong>{stats?.fretesEmTransito}</strong>
            </li>
            <li style={{ borderBottom: '1px dashed #334155', paddingBottom: '8px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#34d399" /> Entregues:</span> <strong>{stats?.fretesEntregues}</strong>
            </li>
          </ul>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Últimos Fretes Registrados</h2>
          {stats?.ultimosFretes.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Nenhum frete cadastrado ainda.</p>
          ) : (
            <ul style={{ listStyleType: 'square', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats?.ultimosFretes.map(f => (
                <li key={f.id} style={{ borderBottom: '1px dashed #334155', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#60a5fa', display: 'block', fontSize: '0.9rem' }}>{f.codigo}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{f.origem} ➔ {f.destino}</span>
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#34d399' }}>R$ {f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;