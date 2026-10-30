import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Building, Trash2, ShieldAlert } from 'lucide-react';

export function Configuracoes() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ nome: '', empresa: '', email: '' });

  useEffect(() => {
    const currentUserEmail = localStorage.getItem('@taperto:currentUser');
    if (currentUserEmail) {
      const storedData = localStorage.getItem(`@taperto:user_${currentUserEmail}`);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setUserData({
          nome: parsed.user?.nome || '',
          empresa: parsed.user?.empresa || '',
          email: currentUserEmail
        });
      } else {
        setUserData({
          nome: currentUserEmail.split('@')[0],
          empresa: 'Não informada',
          email: currentUserEmail
        });
      }
    }
  }, []);

  function handleExcluirConta() {
    const confirmacao = window.confirm(
      'Tem certeza de que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.'
    );

    if (confirmacao) {
      const currentUserEmail = localStorage.getItem('@taperto:currentUser');

      if (currentUserEmail) {
        localStorage.removeItem(`@taperto:user_${currentUserEmail}`);
      }

      localStorage.removeItem('@taperto:currentUser');
      localStorage.removeItem('@taperto:authenticated');
      localStorage.removeItem('@taperto:token');

      alert('Sua conta foi excluída com sucesso.');
      navigate('/login');
    }
  }

  return (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Configurações da Conta</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Gerencie suas informações de perfil e dados de acesso</p>
      </div>

      {/* Dados do Perfil */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>Informações do Perfil</h2>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Nome</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input type="text" value={userData.nome} disabled style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>Empresa / Transportadora</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Building size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input type="text" value={userData.empresa} disabled style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '6px' }}>E-mail</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input type="email" value={userData.email} disabled style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#94a3b8' }} />
          </div>
        </div>
      </div>

      {/* Zona de Perigo - Excluir Conta */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #ef444440', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}>
          <ShieldAlert size={20} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>Zona de Perigo</h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
          A exclusão de conta apaga todos os seus fretes, motoristas e veículos cadastrados. Essa ação não pode ser desfeita.
        </p>

        <button
          onClick={handleExcluirConta}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#ef444415',
            color: '#ef4444',
            border: '1px solid #ef444440',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          <Trash2 size={18} /> Excluir Minha Conta
        </button>
      </div>
    </div>
  );
}

export default Configuracoes;