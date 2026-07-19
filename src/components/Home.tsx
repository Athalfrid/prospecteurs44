import React from 'react';

// Types locaux pour notre flux d'actualités
interface EventItem {
  id: string;
  type: 'member_new' | 'birthday' | 'departure' | 'event';
  title: string;
  description: string;
  date: string;
}

const Home: React.FC = () => {
  // Simulation de données pour le flux de la vie du club
  // Plus tard, cela viendra directement de ta table Supabase
  const latestEvents: EventItem[] = [
    {
      id: '1',
      type: 'member_new',
      title: 'Bienvenue à Thomas !',
      description: 'Nouveau prospecteur équipé d\'un Deus II qui rejoint le 44.',
      date: 'Hier'
    },
    {
      id: '2',
      type: 'birthday',
      title: '🎂 Joyeux Anniversaire !',
      description: 'Un bon anniversaire à notre doyen Jean-Pierre !',
      date: '18 Juil.'
    },
    {
      id: '3',
      type: 'event',
      title: 'Sortie Groupe',
      description: 'Grosse dépollution prévue dimanche matin en forêt.',
      date: 'En cours'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-r py-20 px-6 text-center md:py-32 md:px-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 bg-[url('https://images.unsplash.com/photo-1590012314607-cda9d9b6a9a9?auto=format&fit=crop&q=80&w=1200')]" />
        <div className="relative max-w-4xl mx-auto">
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Loire-Atlantique - 44
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
            Prospecteurs<span className="text-amber-600">44</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Passionnés d'histoire, de détection de métaux et d'entraide. Nous arpentons notre belle région pour préserver le patrimoine et dépolluer nos sols.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5">
              Découvrir l'association
            </button>
          </div>
        </div>
      </section>

      {/* 2. ENCART D'URGENCE SOS */}
      <section className="max-w-6xl mx-auto -mt-12 px-6 relative z-10">
        <div className="bg-white border border-red-100 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📍 Service SOS Objets Perdus
            </h2>
            <p className="text-gray-600 max-w-xl">
              Vous avez perdu une bague, une alliance ou vos clés dans votre jardin ou à la plage ? Nos membres bénévoles mettent leur matériel à votre service pour vous aider à les retrouver.
              <span className="block mt-1 font-medium text-amber-600">Service 100% gratuit et bénévole.</span>
            </p>
          </div>
          <button className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition">
            Lancer une alerte SOS
          </button>
        </div>
      </section>

      {/* 3. L'ACTUALITÉ ET LA VIE DE L'ASSOCIATION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900">La vie du club</h2>
            <p className="text-gray-500 mt-1">Ce qu'il se passe en ce moment chez les Prospecteurs44.</p>
          </div>
          <button className="text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1 transition">
            Accéder au forum privé &rarr;
          </button>
        </div>

        {/* Grille des derniers événements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    event.type === 'member_new' ? 'bg-green-50 text-green-700 border border-green-200' :
                    event.type === 'birthday' ? 'bg-pink-50 text-pink-700 border border-pink-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {event.type === 'member_new' && 'Nouveau'}
                    {event.type === 'birthday' && 'Anniversaire'}
                    {event.type === 'event' && 'Événement'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{event.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CHARTE & ETHIQUE DE L'ASSOCIATION */}
      <section className="bg-gray-900 text-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Une pratique responsable et légale</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
            Prospecteurs44 s'engage au strict respect de la législation française (Art. L.542-1 du code du patrimoine). Toutes nos sorties se font avec l'autorisation obligatoire des propriétaires des terrains, et nos membres participent activement à la dépollution des zones prospectées en ramassant les déchets métalliques.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;