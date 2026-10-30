import { Link, useNavigate, useLocation } from 'react-router-dom';

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
      padding: '12px',
      borderRadius: '6px',
      fontWeight: isActive ? 'bold' : 'normal',
    };
  };

  return (
    <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#f8fafc', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '24px', fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid #334155' }}>
        TáPerto
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', flex: 1 }}>
        <Link to="/dashboard" style={getItemStyle('/dashboard')}>Visão Geral</Link>
        <Link to="/veiculos" style={getItemStyle('/veiculos')}>Veículos</Link>
        <Link to="/motoristas" style={getItemStyle('/motoristas')}>Motoristas</Link>
        <Link to="/fretes" style={getItemStyle('/fretes')}>Fretes</Link>
      </nav>
      <div style={{ padding: '20px' }}>
        <button 
          onClick={handleLogout} 
          style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sair da Conta
        </button>
      </div>
    </aside>
  );
}