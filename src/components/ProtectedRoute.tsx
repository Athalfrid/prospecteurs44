import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  user: User | null;
  userProfile: { role: string; is_validated: boolean } | null;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, userProfile, children }) => {

  // Les admins ont toujours le droit de passer, même si is_validated est false
  if (userProfile?.role === 'admin') {
    return <>{children}</>;
  }

  // 1. Si l'utilisateur n'est pas du tout connecté -> redirection vers la page de connexion
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // 2. Si l'utilisateur est connecté mais pas encore validé par l'admin -> redirection vers la Home (ou une page d'attente)
  if (userProfile && !userProfile.is_validated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si tout est OK (connecté + validé), on affiche la page demandée
  return <>{children}</>;
};

export default ProtectedRoute;