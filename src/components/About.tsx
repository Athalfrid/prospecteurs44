import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
                
                {/* EN-TÊTE DE LA PAGE */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-4">
                    <span className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                        Association loi 1901 • Loire-Atlantique (44)
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Qui sont les <span className="text-amber-600">Prospecteurs44</span> ?
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Fondée par des passionnés de détection de métaux et d'histoire locale, l'association Prospecteurs44 réunit les amateurs et passionnés de prospection de notre département. Notre démarche repose sur le partage de notre loisir, le respect de la législation en vigueur et la valorisation du patrimoine enfoui.
                    </p>
                </div>

                {/* NOS MISSIONS EN GRILLE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                            🌿
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Préservation et Dépollution</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Au-delà de la recherche, nos sorties sont aussi l'occasion de nettoyer la nature. Nous ramassons régulièrement les déchets métalliques et pollutions abandonnés dans les champs et les forêts de la région.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg">
                            🤝
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Sauvetage d'objets (SOS)</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Clés égarées, alliances perdues dans l'herbe ou bijoux de famille volatilisés : nos équipes se mobilisent bénévolement pour venir en aide aux personnes dans le besoin grâce à notre matériel de précision.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
                            📜
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Déontologie et Respect</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Nous pratiquons notre loisir dans le strict respect de la loi : accord préalable des propriétaires des terrains, interdiction formelle de fouiller les sites archéologiques protégés et déclaration des découvertes d'intérêt historique.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                            🗺️
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Partage et Convivialité</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Entre sorties de groupe sur les terrains du 44, identification des trouvailles et échanges sur notre espace membre, la bonne humeur et l'entraide sont les maîtres mots de notre communauté.
                        </p>
                    </div>
                </div>

                {/* APPEL À L'ACTION */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 text-center space-y-4">
                    <h2 className="text-2xl font-black tracking-tight">Envie de rejoindre l'aventure ?</h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                        Que vous soyez prospecteur aguerri ou simple citoyen cherchant à signaler un objet perdu, n'hésitez pas à interagir avec nous.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            to="/declarer-sos"
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow"
                        >
                            🚨 Déclarer une perte
                        </Link>
                        <Link
                            to="/connexion"
                            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition border border-slate-700"
                        >
                            Espace Membre
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;