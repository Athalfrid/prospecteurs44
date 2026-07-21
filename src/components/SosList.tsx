import React, { useEffect, useState } from 'react';
import { supabase } from '../database/supabaseClient';

interface SosAlert {
  id: string;
  created_at: string;
  reporter_name: string;
  reporter_contact: string;
  object_type: string;
  location_name: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

const SosList: React.FC = () => {
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('sos_alerts')
          .select('*')
          .eq('status', 'en_cours')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setAlerts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des SOS :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleFacebookShare = (sos: SosAlert) => {
    const text = `🚨 **SOS OBJET PERDU - APPEL AUX PROSPECTEURS** 🚨\n\n` +
                 `👉 Un(e) ${sos.object_type} a été perdu(e) à : ${sos.location_name}.\n` +
                 `Détails : ${sos.description || 'Non spécifiés'}\n\n` +
                 `Retrouvez la zone de recherche exacte et contactez le propriétaire ici :`;
    
    const siteUrl = `https://prospecteurs44.fr/sos/${sos.id}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(text)}`;
    
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
  };

  const handleMessengerSend = (sos: SosAlert) => {
    const siteUrl = `https://prospecteurs44.fr/sos/${sos.id}`;
    navigator.clipboard.writeText(`🚨 SOS ${sos.object_type} à ${sos.location_name}\n${siteUrl}`);
    alert("Lien et texte du SOS copiés ! Tu peux maintenant les coller directement dans ta discussion Messenger de groupe. 👍");
  };

  if (loading) {
    return <div className="text-center py-10 font-medium text-gray-500">Chargement des alertes en cours...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Alertes SOS en cours</h2>
        <p className="text-gray-500 mt-1">Découvrez les recherches actives en Loire-Atlantique.</p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          🎉 Aucun SOS en attente ! Tous les objets ont été retrouvés.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                    🚨 SOS Actif
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {item.object_type} perdu(e)
                </h3>
                <p className="text-sm font-semibold text-amber-700 flex items-center gap-1 mb-3">
                  📍 {item.location_name}
                </p>

                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-xl mb-4 italic">
                    "{item.description}"
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
                {/* 🗺️ BOUTON GOOGLE MAPS (S'affiche uniquement si les coordonnées GPS existent) */}
                {item.latitude && item.longitude && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                  >
                    🗺️ Itinéraire / Ouvrir dans Maps
                  </a>
                )}

                {/* BOUTONS DE PARTAGE */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleFacebookShare(item)}
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold py-2.5 px-2 rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                  >
                    🔵 Facebook
                  </button>
                  <button
                    onClick={() => handleMessengerSend(item)}
                    className="bg-gradient-to-r from-[#0084FF] to-[#A200FF] hover:opacity-90 text-white text-xs font-bold py-2.5 px-2 rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                  >
                    💬 Messenger
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SosList;