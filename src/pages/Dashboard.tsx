import React, { useState, useEffect } from 'react';
import { Package, Users, Truck, PlusCircle, Sparkles, Building, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [counts, setCounts] = useState({ fretes: 0, motoristas: 0, veiculos: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboardData() {
      const token = localStorage.getItem('@taperto:token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [userRes, fretesRes, motoristasRes, veiculosRes] = await Promise.all([
          fetch('http://localhost:3333/api/auth/me', { headers }),
          fetch('http://localhost:3333/api/fretes', { headers }),
          fetch('http://localhost:3333/api/motoristas', { headers }),
          fetch('http://localhost:3333/api/veiculos', { headers })
        ]);

        const userDataJson = await userRes.json();
        if (!userRes.ok) throw new Error(userDataJson.error || 'Sessão inválida.');

        const fretesJson = await fretesRes.json();
        const motoristasJson = await motoristasRes.json();
        const veiculosJson = await veiculosRes.json();

        setUserData(userDataJson.user);
        setCounts({
          fretes: Array.isArray(fretesJson) ? fretesJson.length : 0,
          motoristas: Array.isArray(motoristasJson) ? motoristasJson.length : 0,
          veiculos: Array.isArray(veiculosJson) ? veiculosJson.length : 0
        });
      } catch (error) {
        localStorage.removeItem('@taperto:token');
        localStorage.removeItem('@taperto:authenticated');
        localStorage.removeItem('@taperto:currentUser');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#94a3b8' }}>
        A carregar dados do painel...
      </div>
    );
  }

  if (!userData) return null;

  const isNewAccount = counts.fretes === 0 && counts.motoristas === 0 && counts.veiculos === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>
            Olá, <span style={{ color: '#60a5fa' }}>{userData.nome || 'Usuário'}</span>! 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px', margin: 0 }}>
            Bem-vindo ao seu painel de controle logístico.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.875rem' }}>
            <Building size={16} color="#60a5fa" />
            <span><strong>Empresa:</strong> {userData.empresa || 'Não informada'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.875rem' }}>
            <Mail size={16} color="#34d399" />
            <span><strong>E-mail:</strong> {userData.email || 'N/A'}</span>
          </div>
        </div>
      </div>

      {isNewAccount && (
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #2563eb', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} color="#60a5fa" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
              Primeiros passos no TáPerto 🎉
            </h2>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            Sua conta está vazia! Crie o seu primeiro frete ou cadastre os motoristas e veículos da sua transportadora.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Link to="/fretes" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none' }}>
              <PlusCircle size={18} /> Criar Primeiro Frete
            </Link>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Package color="#60a5fa" size={20} />
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Fretes Ativos</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{counts.fretes}</span>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Users color="#34d399" size={20} />
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Motoristas</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{counts.motoristas}</span>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Truck color="#f59e0b" size={20} />
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Veículos</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{counts.veiculos}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;