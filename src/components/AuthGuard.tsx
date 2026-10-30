import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // Simulação de verificação de autenticação no localStorage
  const isAuthenticated = localStorage.getItem('@taperto:authenticated') === 'true';

  if (!isAuthenticated) {
    // Redireciona para o login caso o utilizador não esteja autenticado
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;