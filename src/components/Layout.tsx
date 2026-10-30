import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, LogOut, Package } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('@taperto:token');
    navigate('/login');
  }

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Fretes', path: '/fretes', icon: Package },
    { label: 'Motoristas', path: '/motoristas', icon: Users },
    { label: 'Veículos', path: '/veiculos', icon: Truck },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      
      {/* Sidebar Lateral */}
      <aside style={{ width: '240px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>TáPerto</span>
        </div>

        {/* Menu de Navegação */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map(item => {
            const Icone = item.icon;
            const ativo = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: ativo ? 'bold' : 'normal',
                  color: ativo ? '#ffffff' : '#94a3b8',
                  backgroundColor: ativo ? '#2563eb' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icone size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Botão de Sair */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#ef444415',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            marginTop: 'auto'
          }}
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {children}
      </main>

    </div>
  );
}

export default Layout;