import React, { useEffect, useState } from 'react';
import { supabase } from '../database/supabaseClient';

interface PendingProfile {
    id: string;
    pseudo: string;         // Requis, généré par ton trigger SQL
    role: string;           // Requis ('user', 'member', etc.)
    is_validated: boolean;  // Requis (false ici)
    updated_at: string;     // Requis

    // 💡 On peut garder ces deux-là en OPTIONNELS (avec le '?') 
    // au cas où tu les ajoutes plus tard, comme ça TypeScript ne râle plus !
    full_name?: string;
    email?: string;
}

const AdminPanel: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<PendingProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Charger les demandes en attente
    // Charger les demandes en attente
    const fetchPendingUsers = async () => {
        setLoading(true);

        // 💡 On ne demande que les colonnes qui existent VRAIMENT dans ta table (voir capture)
        const { data, error } = await supabase
            .from('profiles')
            .select('id, pseudo, role, updated_at, is_validated') // On a enlevé 'email' et 'full_name'
            .eq('is_validated', false);

        if (error) {
            console.error('Erreur lors du chargement:', error.message);
            setMessage(`❌ Erreur : ${error.message}`);
        } else {
            setPendingUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    // Valider un membre
    const handleValidate = async (id: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ is_validated: true })
            .eq('id', id);

        if (error) {
            setMessage(`❌ Erreur: ${error.message}`);
        } else {
            setMessage('✅ Membre validé avec succès !');
            setPendingUsers(pendingUsers.filter(u => u.id !== id));
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement des demandes...</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
            <h1 className="text-3xl font-black text-gray-900 mb-2 text-left">Panel Administrateur</h1>
            <p className="text-gray-500 mb-8 text-left">Validation des nouvelles inscriptions des Prospecteurs 44.</p>

            {message && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-left">
                    {message}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-left">Demandes d'adhésion en attente ({pendingUsers.length})</h2>
                </div>

                {pendingUsers.map((user) => (
                    <div key={user.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                        <div>
                            {/* 💡 On affiche le pseudo à la place du nom non renseigné */}
                            <h3 className="font-bold text-gray-900 text-lg">
                                {user.pseudo || 'Nouveau membre'}
                            </h3>

                            <p className="text-sm text-amber-600 font-medium mt-0.5">
                                Statut : En attente ({user.role})
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Inscrit le : {new Date(user.updated_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleValidate(user.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition"
                            >
                                Accepter le membre
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPanel;