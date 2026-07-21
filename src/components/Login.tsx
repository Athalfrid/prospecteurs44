import React, { useState } from 'react';
import { supabase } from '../database/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
  if (isRegistering) {
    // Inscription d'un nouveau membre
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    // Si la confirmation par e-mail est désactivée dans Supabase, data.user est immédiatement disponible
    if (data?.user) {
      // 🚀 Redirection immédiate vers le profil pour forcer la saisie du nom/prénom
      navigate('/profil');
    } else {
      // Cas où la confirmation par e-mail est activée dans Supabase
      setMessage({ 
        type: 'success', 
        text: "Compte créé avec succès ! Un e-mail de confirmation vous a été envoyé." 
      });
      setIsRegistering(false);
    }
  } else {
    // Connexion classique
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Si la connexion réussit, direction l'accueil
    navigate('/');
  }
} catch (err: any) {
  setMessage({ type: 'error', text: err.message || "Une erreur est survenue." });
} finally {
  setLoading(false);
}
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="text-center mb-6">
        <span className="text-3xl">🔐</span>
        <h2 className="mt-2 text-2xl font-black text-gray-900">
          {isRegistering ? "Rejoindre l'association" : "Espace Membre"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isRegistering ? "Créez votre compte de prospecteur" : "Connectez-vous pour accéder au forum privé"}
        </p>
      </div>

      {message && (
        <div className={`mb-5 p-4 rounded-xl text-sm font-medium border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? '📋 ' : '❌ '} {message.text}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Adresse Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
            placeholder="prospecteur@exemple.fr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Mot de passe</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition"
        >
          {loading ? "Calcul en cours..." : isRegistering ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage(null);
          }}
          className="text-xs text-amber-700 hover:underline font-semibold"
        >
          {isRegistering ? "Déjà membre ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>
    </div>
  );
};

export default Login;