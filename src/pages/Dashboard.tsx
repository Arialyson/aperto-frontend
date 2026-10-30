import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Dashboard() {
  const [metricas, setMetricas] = useState({ veiculos: 0, motoristas: 0, fretes: 0 });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resVeiculos, resMotoristas, resFretes] = await Promise.all([
          api.get('/veiculos'),
          api.get('/motoristas'),
          api.get('/fretes')
        ]);
        
        setMetricas({
          veiculos: resVeiculos.data.length || 0,
          motoristas: resMotoristas.data.length || 0,
          fretes: resFretes.data.length || 0
        });
      } catch (error) {
        console.error("Erro ao buscar dados do backend", error);
      }
    }
    carregarDados();
  }, []);

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>Visão Geral</h1>
        <div style={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ color: '#64748b' }}>Painel da Empresa</span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '1rem' }}>Total de Veículos</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{metricas.veiculos}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '1rem' }}>Motoristas Ativos</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{metricas.motoristas}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '1rem' }}>Fretes em Andamento</h3>
          <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{metricas.fretes}</p>
        </div>
      </div>
    </>
  );
}