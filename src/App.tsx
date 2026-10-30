import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Veiculos } from './pages/Veiculos';
import { Motoristas } from './pages/Motoristas';
import { Fretes } from './pages/Fretes';
import { AppLayout } from './components/AppLayout';
import { AuthGuard } from './components/AuthGuard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas (Exigem Login) */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/motoristas" element={<Motoristas />} />
            <Route path="/fretes" element={<Fretes />} />
          </Route>
        </Route>

        {/* Redirecionamento Padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}