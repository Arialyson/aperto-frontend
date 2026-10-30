import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Dashboard } from './pages/Dashboard';
import { Fretes } from './pages/Fretes';
import { Motoristas } from './pages/Motoristas';
import { Veiculos } from './pages/Veiculos';
import { RastreioPublico } from './pages/RastreioPublico';
import { Configuracoes } from './pages/Configuracoes';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/rastreio/:id" element={<RastreioPublico />} />

        {/* Rotas Protegidas */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fretes" element={<Fretes />} />
          <Route path="/motoristas" element={<Motoristas />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>

        {/* Redirecionamento Padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;