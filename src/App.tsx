import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './database/supabaseClient';
import type { User } from '@supabase/supabase-js';
import './App.css'
import Home from './components/Home';
import SosForm from './components/SosForm'
import Navbar from './components/Navbar';
import SosList from './components/SosList';
import Login from './components/Login';
import Profile from './components/Profile';
import Forum from './components/Forum';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

// Interface locale pour typer proprement le profil utilisateur
interface UserProfileData {
  role: 'member' | 'admin';
  is_validated: boolean;
}

function AppRoutes({ user, setUser }: { user: User | null, setUser: (u: User | null) => void }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    // Fonction utilitaire pour récupérer le profil dans la table 'profiles'
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, is_validated')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setUserProfile(data as UserProfileData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        setUserProfile(null);
      }
    };

    // Récupère la session au premier chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser.id);
      } else {
        setUserProfile(null);
      }
    });

    // Écoute les changements (connexion / déconnexion / validation d'email)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchUserProfile(currentUser.id);
      } else {
        setUserProfile(null);
      }

      // ⚡ Redirection à la connexion initiale
      if (event === 'SIGNED_IN' && currentUser) {
        navigate('/profil');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, setUser]); // Retrait de setUserProfile des dépendances (état local stable)

  return (
    <>
      <Navbar user={user} userProfile={userProfile} />
      <Routes>
        {/* On passe user ET userProfile à la Home pour gérer l'affichage de l'actu ou du cadenas */}
        <Route path="/" element={<Home user={user} userProfile={userProfile} />} />

        <Route path="/declarer-sos" element={<SosForm />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/profil" element={<Profile user={user} />} />

        {/* 🔒 Routes protégées : inaccessible si pas validé */}
        <Route
          path="/sos"
          element={
            <ProtectedRoute user={user} userProfile={userProfile}>
              <SosList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute user={user} userProfile={userProfile}>
              <Forum user={user} />
            </ProtectedRoute>
          }
        />

        {/* 🔒 Route Admin Sécurisée */}
        <Route
          path="/admin"
          element={
            user && userProfile?.role === 'admin' ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <main className="flex-grow">
          <AppRoutes user={user} setUser={setUser} />
        </main>
      </div>
    </Router>
  );
}

export default App;