import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Fretes } from './pages/Fretes';
import { Motoristas } from './pages/Motoristas';
import { Veiculos } from './pages/Veiculos';
import { RastreioPublico } from './pages/RastreioPublico';
import AppLayout from './components/AppLayout';

function RotaPrivada({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem('@taperto:token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout>{children}</AppLayout>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública de Autenticação */}
        <Route path="/login" element={<Login />} />

        {/* Rota Pública de Rastreamento (Sem Sidebar) */}
        <Route path="/rastreio/:id" element={<RastreioPublico />} />

        {/* Rotas Privadas com Sidebar do Sistema */}
        <Route 
          path="/" 
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          } 
        />
        <Route 
          path="/fretes" 
          element={
            <RotaPrivada>
              <Fretes />
            </RotaPrivada>
          } 
        />
        <Route 
          path="/motoristas" 
          element={
            <RotaPrivada>
              <Motoristas />
            </RotaPrivada>
          } 
        />
        <Route 
          path="/veiculos" 
          element={
            <RotaPrivada>
              <Veiculos />
            </RotaPrivada>
          } 
        />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;