import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Lock, Mail } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !senha) {
      alert('Por favor, preencha o e-mail e a palavra-passe.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciais inválidas.');
      }

      // Autenticação VÁLIDA: guarda o JWT real retornado do servidor
      localStorage.setItem('@taperto:token', data.token);
      localStorage.setItem('@taperto:currentUser', data.user.email);
      localStorage.setItem('@taperto:authenticated', 'true');

      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Erro ao conectar ao servidor backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#2563eb', borderRadius: '12px', marginBottom: '12px' }}>
            <Truck size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Acessar o TáPerto</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Gestão Logística e Fretes</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: '#cbd5e1' }}>E-mail</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: '#cbd5e1' }}>Palavra-passe</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                required
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'A autenticar...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '8px' }}>
            Ainda não tem uma conta?
          </p>
          <Link
            to="/cadastro"
            style={{ color: '#60a5fa', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none' }}
          >
            Criar nova conta no TáPerto
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;