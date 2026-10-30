import { Navigate, Outlet } from 'react-router-dom';

export function AuthGuard() {
  const token = localStorage.getItem('@taperto:token');

  // Se não existir token guardado, redireciona para a tela de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se o token existir, permite o acesso às rotas filhas
  return <Outlet />;
}