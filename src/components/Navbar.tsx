import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../database/supabaseClient';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/")
        setPseudo(null); // On vide le pseudo à la déconnexion
        setIsOpen(false);
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
            <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="text-2xl font-black tracking-tight text-gray-900 flex">
                    <img
                        src="/icon-512-removebg-preview.png"
                        alt="Logo Prospecteurs44"
                        className="h-10 w-10 object-contain mr-4"
                    />Prospecteurs<span className="text-amber-600">44</span>
                </Link>

                {/* LIENS DESKTOP (Cachés sur mobile) */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                        Accueil
                    </Link>

                    <Link to="/presentation" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                        Présentation de l'association
                    </Link>

                    {/* ZONE DYNAMIQUE : Connexion ou Profil */}
                    {user && pseudo ? (
                        <div className="flex items-center gap-4">
                            <Link to="/sos" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                                SOS en cours
                            </Link>
                            <Link to="/forum" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                                Forum
                            </Link>
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
                                className="text-sm font-semibold text-red-600 hover:cursor-pointer hover:text-red-800 transition"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/connexion" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                                Espace membre 🔒
                            </Link>
                            <Link
                                to="/declarer-sos"
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                            >
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                                Signaler une perte
                            </Link>
                        </>
                    )}

                </div>

                {/* BOUTON BURGER MOBILE (Visible uniquement sur mobile) */}
                <div className="flex items-center gap-3 md:hidden">
                    <Link
                        to="/declarer-sos"
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
                    >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                        SOS
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-600 hover:text-gray-900 focus:outline-none p-1"
                        aria-label="Menu"
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* MENU DÉROULANT MOBILE */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
                    <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-semibold text-gray-600 hover:text-gray-900 py-1"
                    >
                        🏠︎ Accueil
                    </Link>
                    <Link to="/presentation"
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-semibold text-gray-600 hover:text-gray-900 py-1">
                        ℹ️ Présentation de l'association
                    </Link>
                    <Link
                        to="/sos"
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-semibold text-gray-600 hover:text-gray-900 py-1"
                    >
                        🆘 SOS en cours
                    </Link>
                    <Link
                        to="/forum"
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-semibold text-gray-600 hover:text-gray-900 py-1"
                    >
                        🗫 Forum
                    </Link>

                    {user ? (
                        <div className="pt-2 border-t border-gray-100 space-y-3">
                            <Link
                                to="/profil"
                                onClick={() => setIsOpen(false)}
                                className="block text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-lg truncate transition"
                            >
                                ⚙️ {pseudo || user.email}
                            </Link>
                            {userProfile?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-sm font-semibold text-gray-600 hover:text-gray-900 py-1"
                                >
                                    🛡️ Admin
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="block w-full text-center text-sm font-semibold text-red-600 hover:text-red-800 py-1"
                            >
                                🏃🚪 Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                to="/connexion"
                                onClick={() => setIsOpen(false)}
                                className="block text-sm font-semibold text-gray-600 hover:text-gray-900 py-1"
                            >
                                Connexion
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;