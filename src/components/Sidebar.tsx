import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, LogOut, Package, Menu, X } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    sessionStorage.removeItem('@taperto:token');
    navigate('/login');
  }

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Fretes', path: '/fretes', icon: Package },
    { label: 'Motoristas', path: '/motoristas', icon: Users },
    { label: 'Veículos', path: '/veiculos', icon: Truck },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{
          display: 'none',
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 50,
          backgroundColor: '#1e293b',
          color: '#ffffff',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer'
        }}
        className="mobile-menu-btn"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside 
        style={{
          width: '260px',
          minWidth: '260px',
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
        className={`sidebar-container ${isOpen ? 'open' : ''}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '8px' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', letterSpacing: '-0.5px' }}>TáPerto</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map(item => {
            const Icone = item.icon;
            const ativo = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: ativo ? '600' : '500',
                  color: ativo ? '#ffffff' : '#94a3b8',
                  backgroundColor: ativo ? '#2563eb' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icone size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#ef444418',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            marginTop: 'auto',
            transition: 'background-color 0.2s ease'
          }}
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </aside>
    </>
  );
}

export default Sidebar;