import React, { useEffect, useState } from 'react';
import { DollarSign, Package, Truck, Users, TrendingUp, PieChart } from 'lucide-react';

export function Dashboard() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Ativa a animação após a montagem do componente
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const kpis = [
    { titulo: 'Faturamento do Mês', valor: 'R$ 28.900', subtexto: '-18% em relação ao mês anterior', icone: DollarSign, cor: '#22c55e' },
    { titulo: 'Fretes Ativos', valor: '30', subtexto: '18 em trânsito / 12 pendentes', icone: Package, cor: '#3b82f6' },
    { titulo: 'Veículos em Rota', valor: '14 / 20', subtexto: '70% da frota operacional', icone: Truck, cor: '#a855f7' },
    { titulo: 'Motoristas Ativos', valor: '16', subtexto: '2 motoristas disponíveis', icone: Users, cor: '#eab308' },
  ];

  const dadosFaturamento = [12000, 15000, 18000, 14000, 22000, 28900];

  // Configuração das fatias do gráfico de pizza/rosca (SVG)
  const raio = 50;
  const circunferencia = 2 * Math.PI * raio; // ~314.16

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Cabeçalho */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>Visão Geral</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.95rem' }}>
          Acompanhe os principais indicadores operacionais e financeiros da TáPerto.
        </p>
      </div>

      {/* Cartões KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {kpis.map((kpi, idx) => {
          const Icone = kpi.icone;
          return (
            <div 
              key={idx} 
              style={{ 
                backgroundColor: '#1e293b', 
                padding: '20px', 
                borderRadius: '12px', 
                border: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>{kpi.titulo}</span>
                <div style={{ backgroundColor: `${kpi.cor}20`, padding: '8px', borderRadius: '8px' }}>
                  <Icone size={20} color={kpi.cor} />
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{kpi.valor}</h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', display: 'block' }}>{kpi.subtexto}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Gráfico 1 - Barras Animadas */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600', color: '#f8fafc' }}>Evolução do Faturamento (R$)</h3>
          </div>
          
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
            {dadosFaturamento.map((v, i) => {
              const alturaPercentual = (v / 30000) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '40px',
                      height: loaded ? `${alturaPercentual}%` : '0%', 
                      backgroundColor: '#2563eb', 
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }} 
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Mês {i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico 2 - Pizza / Rosca SVG Animado */}
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChart size={20} color="#eab308" />
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600', color: '#f8fafc' }}>Status dos Fretes</h3>
          </div>

          <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
            
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                {/* Arco 1: Em Trânsito (60%) */}
                <circle
                  cx="60"
                  cy="60"
                  r={raio}
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="16"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={loaded ? circunferencia * 0.4 : circunferencia}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />

                {/* Arco 2: Pendente (25%) */}
                <circle
                  cx="60"
                  cy="60"
                  r={raio}
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="16"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={loaded ? circunferencia * 0.75 : circunferencia}
                  style={{ 
                    transform: `rotate(${360 * 0.6}deg)`, 
                    transformOrigin: '60px 60px',
                    transition: 'stroke-dashoffset 1s ease-out 0.2s' 
                  }}
                />

                {/* Arco 3: Entregue (15%) */}
                <circle
                  cx="60"
                  cy="60"
                  r={raio}
                  fill="transparent"
                  stroke="#22c55e"
                  strokeWidth="16"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={loaded ? circunferencia * 0.85 : circunferencia}
                  style={{ 
                    transform: `rotate(${360 * 0.85}deg)`, 
                    transformOrigin: '60px 60px',
                    transition: 'stroke-dashoffset 1s ease-out 0.4s' 
                  }}
                />
              </svg>
            </div>

            {/* Legenda de Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2563eb' }} />
                <span style={{ color: '#94a3b8' }}>Em Trânsito (60%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#eab308' }} />
                <span style={{ color: '#94a3b8' }}>Pendente (25%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#94a3b8' }}>Entregue (15%)</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;