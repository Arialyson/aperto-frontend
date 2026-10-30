import { useState, useEffect } from 'react';
import { Truck, DollarSign, Users, Package, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

function MetricCard({ title, value, icon, color, description }: MetricCardProps) {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{title}</span>
        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
      </div>
      <div>
        <h2 style={{ color: '#f8fafc', fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>{value}</h2>
        <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '4px 0 0 0' }}>{description}</p>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Dados mockados para exibição visual imediata dos gráficos
  const faturamentoMensal = [
    { mes: 'Jan', valor: 12500 },
    { mes: 'Fev', valor: 18200 },
    { mes: 'Mar', valor: 15400 },
    { mes: 'Abr', valor: 22100 },
    { mes: 'Mai', valor: 28900 },
    { mes: 'Jun', valor: 24300 },
  ];

  const statusFretes = [
    { name: 'Entregues', value: 45, color: '#22c55e' },
    { name: 'Em Trânsito', value: 18, color: '#3b82f6' },
    { name: 'Pendentes', value: 12, color: '#eab308' },
    { name: 'Cancelados', value: 3, color: '#ef4444' },
  ];

  useEffect(() => {
    // Simula carregamento inicial
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ color: '#f8fafc', padding: '20px' }}>
        <p>A carregar indicadores do Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: '#f8fafc', margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>Dashboard Visão Geral</h1>
        <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '0.875rem' }}>Acompanhe os indicadores operacionais e financeiros da TáPerto.</p>
      </div>

      {/* Grid de Cards de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard 
          title="Faturamento do Mês" 
          value="R$ 28.900" 
          icon={<DollarSign size={22} />} 
          color="#22c55e" 
          description="+18% em relação ao mês anterior" 
        />
        <MetricCard 
          title="Fretes Ativos" 
          value="30" 
          icon={<Package size={22} />} 
          color="#3b82f6" 
          description="18 em trânsito / 12 pendentes" 
        />
        <MetricCard 
          title="Veículos em Rota" 
          value="14 / 20" 
          icon={<Truck size={22} />} 
          color="#a855f7" 
          description="70% da frota operacional" 
        />
        <MetricCard 
          title="Motoristas Ativos" 
          value="16" 
          icon={<Users size={22} />} 
          color="#eab308" 
          description="2 motoristas disponíveis" 
        />
      </div>

      {/* Seção de Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* Gráfico de Barras - Faturamento */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <TrendingUp color="#3b82f6" size={20} />
            <h2 style={{ color: '#f8fafc', fontSize: '1.1rem', margin: 0 }}>Evolução do Faturamento (R$)</h2>
          </div>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faturamentoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  formatter={(value: any) => [`R$ ${value}`, 'Faturamento']}
                />
                <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca - Distribution dos Fretes */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Clock color="#eab308" size={20} />
            <h2 style={{ color: '#f8fafc', fontSize: '1.1rem', margin: 0 }}>Status dos Fretes</h2>
          </div>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusFretes}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusFretes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda do Gráfico */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
            {statusFretes.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}