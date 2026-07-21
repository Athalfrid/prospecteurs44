import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../database/supabaseClient';

interface UserProfileData {
    role: 'member' | 'admin';
    is_validated: boolean;
}

interface NavbarProps {
    user: User | null;
    userProfile: UserProfileData | null;
}

const Navbar: React.FC<NavbarProps> = ({ user, userProfile }) => {
    const [pseudo, setPseudo] = useState<string | null>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setPseudo(null); // On vide le pseudo à la déconnexion
    };

    // On écoute les changements d'utilisateur pour charger le pseudo depuis la table profiles
    useEffect(() => {
        const fetchNavbarPseudo = async () => {
            if (!user) {
                setPseudo(null);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('pseudo')
                    .eq('id', user.id)
                    .single();

                if (!error && data) {
                    setPseudo(data.pseudo);
                }
            } catch (err) {
                console.error("Erreur récup pseudo Navbar:", err);
            }
        };

        fetchNavbarPseudo();
    }, [user]);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="text-xl font-black tracking-tight text-gray-900">
                    Prospecteurs<span className="text-amber-600">44</span>
                </Link>

                {/* LIENS */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                        Accueil
                    </Link>
                    <Link to="/sos" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                        SOS en cours
                    </Link>
                    <Link to="/forum" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                        Forum
                    </Link>

                    {/* ZONE DYNAMIQUE : Connexion ou Profil */}
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/profil"
                                className="text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg max-w-[180px] truncate transition dashboard-link"
                            >
                                {/* ⚙️ Affichage du pseudo de la table, ou de l'email en secours */}
                                ⚙️ {pseudo || user.email}
                            </Link>
                            {/* ADMIN PANEL LINK */}
                            {userProfile?.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <Link to="/connexion" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                            Connexion
                        </Link>
                    )}


                    <Link
                        to="/declarer-sos"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                        Signaler une perte
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;