import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../database/supabaseClient';

const SosForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        commune: '',
        objet: '',
        description: '',
        contact_nom: '',
        contact_tel: '',
        contact_email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { error } = await supabase
                .from('sos_pertes')
                .insert([formData]);

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate('/sos');
            }, 2000);
        } catch (err: any) {
            console.error("Erreur enregistrement SOS:", err);
            setErrorMsg("Une erreur est survenue lors de l'envoi du formulaire.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Déclarer un objet perdu</h1>
                <p className="text-sm text-slate-600 mt-1 mb-6">Remplissez ce formulaire pour alerter l'équipe des Prospecteurs44.</p>

                {success ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-medium text-center">
                        ✅ Votre signalement a bien été enregistré. Redirection en cours...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Commune / Ville de la perte</label>
                            <input
                                type="text"
                                name="commune"
                                required
                                value={formData.commune}
                                onChange={handleChange}
                                placeholder="Ex: La Chapelle-Basse-Mer"
                                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Objet perdu</label>
                            <input
                                type="text"
                                name="objet"
                                required
                                value={formData.objet}
                                onChange={handleChange}
                                placeholder="Ex: Alliance en or, clés de voiture..."
                                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description et circonstances</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Donnez un maximum de détails (zone approximative, date, contexte...)"
                                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Votre Nom / Prénom</label>
                                <input
                                    type="text"
                                    name="contact_nom"
                                    required
                                    value={formData.contact_nom}
                                    onChange={handleChange}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    name="contact_tel"
                                    value={formData.contact_tel}
                                    onChange={handleChange}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                name="contact_email"
                                required
                                value={formData.contact_email}
                                onChange={handleChange}
                                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl shadow transition disabled:opacity-50 mt-2"
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le signalement"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SosForm;