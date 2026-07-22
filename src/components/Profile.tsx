import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

interface ProfileProps {
  user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [pseudo, setPseudo] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [detector, setDetector] = useState('');

  const [loading, setLoading] = useState(true); // On commence en mode chargement le temps de fetch
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Charger les données depuis la table 'profiles' au démarrage
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pseudo, birth_date, detector')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 signifie "aucune ligne trouvée", ce qui est normal si c'est la première connexion
          throw error;
        }

        if (data) {
          setPseudo(data.pseudo || '');
          setBirthDate(data.birth_date || '');
          setDetector(data.detector || '');
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération du profil :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      // On utilise .upsert() : ça insère si ça n'existe pas, ou ça met à jour si ça existe déjà
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          pseudo: pseudo,
          birth_date: birthDate,
          detector: detector,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setMessage({ type: 'success', text: "Profil enregistré avec succès dans la base de données ! 👍" });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "Erreur lors de la sauvegarde." });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
        <p className="p-3 text-gray-500 font-medium mb-6">Veuillez vous connecter pour accéder à votre profil.</p>
        <Link className="bg-amber-600 hover:cursor-pointer hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5" to={'/connexion'}>Je me connecte</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 font-medium text-gray-500">
        Chargement de vos informations...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="text-center mb-6">
        <span className="text-3xl">⚙️</span>
        <h2 className="mt-2 text-2xl font-black text-gray-900">Mon Profil</h2>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
      </div>

      {message && (
        <div className={`mb-5 p-4 rounded-xl text-sm font-medium border ${message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Pseudo / Prénom</label>
          <input
            type="text"
            required
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
            placeholder="Votre pseudo"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Date de naissance</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Matériel / Détecteur principal</label>
          <input
            type="text"
            value={detector}
            onChange={(e) => setDetector(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
            placeholder="Ex: Deus II, Garrett..."
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition"
        >
          {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
        </button>
      </form>
    </div>
  );
};

export default Profile;