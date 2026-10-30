import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Package, LogOut } from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('@taperto:token');
    localStorage.removeItem('@taperto:empresa');
    navigate('/login');
  };

  const getItemStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? 'white' : '#94a3b8',
      backgroundColor: isActive ? '#334155' : 'transparent',
      textDecoration: 'none',
      padding: '12px 16px',
      borderRadius: '6px',
      fontWeight: isActive ? 'bold' : 'normal',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'background-color 0.2s, color 0.2s',
    };
  };

  return (
    <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '24px', fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Truck color="#2563eb" size={28} />
        TáPerto
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', flex: 1 }}>
        <Link to="/dashboard" style={getItemStyle('/dashboard')}>
          <LayoutDashboard size={20} />
          Visão Geral
        </Link>
        <Link to="/veiculos" style={getItemStyle('/veiculos')}>
          <Truck size={20} />
          Veículos
        </Link>
        <Link to="/motoristas" style={getItemStyle('/motoristas')}>
          <Users size={20} />
          Motoristas
        </Link>
        <Link to="/fretes" style={getItemStyle('/fretes')}>
          <Package size={20} />
          Fretes
        </Link>
      </nav>

      <div style={{ padding: '20px' }}>
        <button 
          onClick={handleLogout} 
          style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}