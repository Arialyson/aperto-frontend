import React, { useState, useEffect } from 'react';
import { Package, Users, Truck, DollarSign, Clock, CheckCircle2, TrendingUp, Calculator, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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

  // Estados do Simulador de Cotação Rápida
  const [distanciaKm, setDistanciaKm] = useState('');
  const [pesoTon, setPesoTon] = useState('');
  const [valorCotado, setValorCotado] = useState<number | null>(null);

  // Estado para visualização do QR Code de rastreio no Modal
  const [qrCodeCodigo, setQrCodeCodigo] = useState<string | null>(null);

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
      const total = km * 4.5 + ton * 85;
      setValorCotado(total);
    }
  }

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Carregando dados do painel...</div>;
  }

  const total = stats?.totalFretes || 0;
  const pendentes = stats?.fretesPendentes || 0;
  const emTransito = stats?.fretesEmTransito || 0;
  const entregues = stats?.fretesEntregues || 0;

  const pctPendentes = total > 0 ? (pendentes / total) * 100 : 0;
  const pctEmTransito = total > 0 ? (emTransito / total) * 100 : 0;
  const pctEntregues = total > 0 ? (entregues / total) * 100 : 0;

  // Cálculo de Ângulos para o Gráfico em Pizza (Conic Gradient)
  const anglePendentes = (pendentes / (total || 1)) * 360;
  const angleEmTransito = anglePendentes + (emTransito / (total || 1)) * 360;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Visão Geral da Logística</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Métricas calculadas em tempo real da sua operação</p>
      </div>

      {/* Cards Principais com Moldura Tracejada */}
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

      {/* Simulador / Cotação Rápida de Frete */}
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

      {/* Gráficos em Pizza e Barras + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Gráfico em Pizza + Gráfico em Barras */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#60a5fa" />
            Gráfico de Status (Pizza & Barras)
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
            {/* Gráfico em Pizza (Pie Chart CSS Native) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: total === 0 
                    ? '#334155' 
                    : `conic-gradient(#fbbf24 0deg ${anglePendentes}deg, #3b82f6 ${anglePendentes}deg ${angleEmTransito}deg, #10b981 ${angleEmTransito}deg 360deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8' }}>
                  {total} Fretes
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gráfico em Pizza</span>
            </div>

            {/* Legenda do Gráfico */}
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#cbd5e1', flex: 1, minWidth: '150px' }}>
              <li style={{ borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>●</span> Pendentes: <strong>{pendentes}</strong>
              </li>
              <li style={{ borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>●</span> Em Trânsito: <strong>{emTransito}</strong>
              </li>
              <li style={{ borderBottom: '1px dashed #334155', paddingBottom: '6px' }}>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>●</span> Entregues: <strong>{entregues}</strong>
              </li>
            </ul>
          </div>

          {/* Gráfico em Barras */}
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Gráfico de Proporção em Barras</span>
            <div style={{ height: '18px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', border: '1px solid #334155' }}>
              {pctPendentes > 0 && <div style={{ width: `${pctPendentes}%`, backgroundColor: '#fbbf24' }} title={`Pendentes: ${pctPendentes.toFixed(0)}%`} />}
              {pctEmTransito > 0 && <div style={{ width: `${pctEmTransito}%`, backgroundColor: '#3b82f6' }} title={`Em Trânsito: ${pctEmTransito.toFixed(0)}%`} />}
              {pctEntregues > 0 && <div style={{ width: `${pctEntregues}%`, backgroundColor: '#10b981' }} title={`Entregues: ${pctEntregues.toFixed(0)}%`} />}
              {total === 0 && <div style={{ width: '100%', backgroundColor: '#334155' }} title="Sem dados" />}
            </div>
          </div>
        </div>

        {/* Últimos Fretes com Ícone e Modal do QR Code */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px dashed #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Últimos Fretes e QR Code de Rastreio</h2>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#34d399' }}>
                        R$ {f.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => setQrCodeCodigo(f.codigo)}
                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#60a5fa', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Ver QR Code de Rastreio"
                      >
                        <QrCode size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Modal para Visualização do QR Code de Rastreio */}
      {qrCodeCodigo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', padding: '28px', borderRadius: '16px', border: '1px dashed #334155', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '360px', width: '90%' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>QR Code de Rastreio</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Escaneie para acompanhar o frete <strong>{qrCodeCodigo}</strong></p>
            
            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px' }}>
              <QRCodeSVG value={`http://localhost:5173/rastreio?codigo=${qrCodeCodigo}`} size={180} />
            </div>

            <button
              onClick={() => setQrCodeCodigo(null)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;