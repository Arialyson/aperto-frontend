import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, User, Building, Mail, Lock, ArrowRight } from 'lucide-react';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3333/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, empresa, email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta.');
      }

      // Guarda o token e as informações reais retornadas do backend
      localStorage.setItem('@taperto:token', data.token);
      localStorage.setItem('@taperto:currentUser', data.user.email);
      localStorage.setItem('@taperto:authenticated', 'true');

      alert('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Erro ao conectar ao servidor backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '32px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: '#2563eb', borderRadius: '12px', marginBottom: '12px' }}>
            <Truck size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Criar conta no TáPerto</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>Crie a sua conta e comece a gerir a sua frota</p>
        </div>

        <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: '#cbd5e1' }}>Nome Completo *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
              <input type="text" required value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: '#cbd5e1' }}>Nome da Empresa / Transportadora</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Building size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
              <input type="text" value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Ex: Logística Express" style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: '#cbd5e1' }}>E-mail Corporativo *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: '#cbd5e1' }}>Palavra-passe *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
              <input type="password" required value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px 10px 10px 40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Criando conta...' : 'Criar Conta'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Já tem uma conta? </span>
          <Link to="/login" style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none' }}>Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;