import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../database/supabaseClient';

interface SosItem {
    id: string;
    created_at: string;
    commune: string;
    objet: string;
    description: string;
    statut: string;
    contact_nom?: string;
}

const SosList: React.FC = () => {
    const [sosList, setSosList] = useState<SosItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSos = async () => {
            try {
                const { data, error } = await supabase
                    .from('sos_pertes')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    setSosList(data);
                }
            } catch (err) {
                console.error("Erreur chargement SOS:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSos();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SOS Objets Perdus</h1>
                    <p className="text-sm text-slate-600 mt-1">Liste des objets égarés signalés auprès de l'association.</p>
                </div>
                <Link
                    to="/declarer-sos"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
                >
                    🚨 Signaler une perte
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-sm text-slate-500">Chargement des signalements...</div>
            ) : sosList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                    <p className="text-sm text-slate-600">Aucun signalement de perte pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {sosList.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-start justify-between gap-2">
                                <span className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                    📍 {item.commune}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.objet}</h3>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-3">{item.description}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                                <span className="text-slate-500">Statut : <strong className="text-slate-700">{item.statut || 'En cours'}</strong></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SosList;