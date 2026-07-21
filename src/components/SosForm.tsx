import React, { useState } from 'react';
import { supabase } from '../database/supabaseClient';

const SosForm: React.FC = () => {
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [objectType, setObjectType] = useState('Bague');
  const [lossDate, setLossDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  
  // NOUVEAUX ÉTATS POUR LE GPS
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FONCTION DE GÉOLOCALISATION
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoStatus("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setGeoLoading(true);
    setGeoStatus("Recherche des coordonnées satellites en cours...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGeoLoading(false);
        setGeoStatus("📍 Position capturée avec succès !");
      },
      (error) => {
        setGeoLoading(false);
        console.error(error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoStatus("❌ Vous avez refusé l'accès à la position.");
            break;
          default:
            setGeoStatus("❌ Impossible de récupérer la position exacte.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000 } // Force le GPS haute précision du smartphone
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: supabaseError } = await supabase
        .from('sos_alerts')
        .insert([
          {
            reporter_name: reporterName,
            reporter_contact: reporterContact,
            object_type: objectType,
            loss_date: lossDate ? lossDate : null,
            location_name: locationName,
            description: description,
            latitude: latitude, // ON ENVOIE LA LATITUDE
            longitude: longitude, // ON ENVOIE LA LONGITUDE
            status: 'en_cours'
          }
        ]);

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      setReporterName('');
      setReporterContact('');
      setLossDate('');
      setLocationName('');
      setDescription('');
      setLatitude(null);
      setLongitude(null);
      setGeoStatus(null);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="text-center mb-8">
        <span className="text-3xl">📍</span>
        <h2 className="mt-2 text-2xl font-black text-gray-900">Déclarer un Objet Perdu</h2>
        <p className="text-sm text-gray-500 mt-1">
          Remplissez ce formulaire pour alerter les prospecteurs de l'association.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
          🎉 Votre alerte SOS a bien été enregistrée ! Les membres de l'association vont analyser votre demande.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
          ❌ Erreur : {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Votre Nom / Prénom</label>
            <input 
              type="text" 
              required
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Contact (Tél ou Messenger)</label>
            <input 
              type="text" 
              required
              value={reporterContact}
              onChange={(e) => setReporterContact(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
              placeholder="06 12 34... ou lien profil FB"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Type d'objet</label>
            <select 
              value={objectType}
              onChange={(e) => setObjectType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm bg-white"
            >
              <option value="Bague">Alliance / Bague</option>
              <option value="Collier">Collier / Bracelet</option>
              <option value="Clés">Clés</option>
              <option value="Téléphone">Téléphone</option>
              <option value="Autre">Autre objet métallique</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Date de la perte</label>
            <input 
              type="date" 
              value={lossDate}
              onChange={(e) => setLossDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
        </div>

        {/* SECTION LIEU ET GEOLOCALISATION */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Lieu ou commune (44)</label>
          <input 
            type="text" 
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm mb-2"
            placeholder="Ex: Plage d'Oudon, Jardin privé à Vallet..."
          />
          
          {/* ENCART GÉOLOCALISATION */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              <p className="font-semibold text-gray-700">Vous êtes actuellement sur le lieu de la perte ?</p>
              {geoStatus ? (
                <p className="mt-0.5 text-amber-700 font-medium">{geoStatus}</p>
              ) : (
                <p className="mt-0.5">Ajoutez vos coordonnées GPS exactes pour aider les chercheurs.</p>
              )}
            </div>
            <button
              type="button"
              disabled={geoLoading}
              onClick={handleGeolocate}
              className="text-xs bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold py-2 px-3 rounded-lg transition shrink-0 shadow-sm"
            >
              {geoLoading ? "Calcul..." : "🎯 Me localiser sur place"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Description & Circonstances</label>
          <textarea 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm"
            placeholder="Donnez un maximum de détails (perdu en tondant la pelouse, couleur de l'or, taille...)"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform active:scale-95"
        >
          {loading ? "Envoi de l'alerte..." : "🚨 Lancer l'alerte SOS"}
        </button>
      </form>
    </div>
  );
};

export default SosForm;