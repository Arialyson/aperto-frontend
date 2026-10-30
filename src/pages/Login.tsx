import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Truck, Lock, Mail, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      const response = await api.post('/login', { email, senha });

      // Armazena diretamente os valores retornados pela API
      localStorage.setItem('@taperto:token', response.data.token);
      localStorage.setItem('@taperto:empresa', JSON.stringify(response.data.empresa));

      navigate('/dashboard');
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Credenciais inválidas. Tente novamente.');
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', color: '#f8fafc' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#334155', borderRadius: '50%', marginBottom: '12px' }}>
            <Truck size={36} color="#3b82f6" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>TáPerto</h1>
          <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Aceda à sua conta para gerir fretes</p>
        </div>

        {erro && (
          <div style={{ backgroundColor: '#ef444420', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '6px' }}>E-mail</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="email" 
                placeholder="empresa@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '6px' }}>Palavra-passe</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}
          >
            Entrar
          </button>
        </form>

      </div>
    </div>
  );
}