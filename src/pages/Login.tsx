import { useState, FormEvent } from 'react';
import { api } from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/login', { email, senha });
      
      const { token, empresa } = response.data;

      localStorage.setItem('@taperto:token', token);
      localStorage.setItem('@taperto:empresa', JSON.stringify(empresa));

      window.location.href = '/dashboard';
    } catch (err: any) {
      if (err.response?.data?.erro) {
        setErro(err.response.data.erro);
      } else {
        setErro('Falha ao realizar login. Verifique as suas credenciais.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>TáPerto Logistics</h2>

        {erro && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{erro}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>E-mail:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="log@empresa.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Senha:</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={carregando} style={{ padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {carregando ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}