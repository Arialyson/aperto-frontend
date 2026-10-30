import React, { useState } from 'react';
import { Mail, Lock, User, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    // Simula o registo e envio de e-mail de confirmação
    setEnviado(true);
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        width: '100%',
        maxWidth: '440px',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        
        {/* Logo / Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>TáPerto</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            {enviado ? 'Verifique a sua caixa de entrada' : 'Crie a sua conta e comece a gerir a sua frota'}
          </p>
        </div>

        {!enviado ? (
          /* Formulário de Registo */
          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Nome Completo *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  required
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Nome da Empresa / Transportadora</label>
              <div style={{ position: 'relative' }}>
                <Building size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Ex: Logística Express"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>E-mail Corporativo *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Palavra-passe *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              Criar Conta <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>
              Já tem uma conta?{' '}
              <a href="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
                Fazer Login
              </a>
            </div>
          </form>
        ) : (
          /* Tela de Sucesso / E-mail Enviado */
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <CheckCircle2 size={54} color="#22c55e" />
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#f8fafc' }}>E-mail de confirmação enviado!</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Enviámos um link de validação para <strong style={{ color: '#38bdf8' }}>{email}</strong>. Por favor, aceda ao seu e-mail e clique no link para ativar a conta.
            </p>

            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', width: '100%', fontSize: '0.8rem', color: '#64748b', border: '1px solid #334155' }}>
              💡 <em>Simulação: Quando o backend for integrado, esta etapa disparará o e-mail real via API (ex: SendGrid/Resend).</em>
            </div>

            <a
              href="/login"
              style={{
                width: '100%',
                backgroundColor: '#334155',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                marginTop: '10px',
                display: 'inline-block'
              }}
            >
              Ir para o Login
            </a>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cadastro;