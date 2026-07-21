import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface ForumProps { user: User | null; }

interface DBMessage {
    id: string; content: string; category: string; created_at: string; user_id: string;
    profiles: { pseudo: string | null; detector: string | null; } | null;
}

interface CategoryStat {
    category_name: string;
    category: string;
    post_count: number;
    last_post_at: string | null;
    last_post_author: string | null;
}

const ITEMS_PER_PAGE = 10;

const Forum: React.FC<ForumProps> = ({ user }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categoriesStats, setCategoriesStats] = useState<CategoryStat[]>([]);
    const [messages, setMessages] = useState<DBMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');

    // États pour la création d'un salon/sujet
    const [isCreatingTopic, setIsCreatingTopic] = useState(false);
    const [newRoomTitle, setNewRoomTitle] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sending, setSending] = useState(false);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Charger la liste dynamique des salons depuis ta vue SQL
    useEffect(() => {
        if (!activeCategory) {
            fetchCategoriesStats();
        }
    }, [activeCategory]);

    useEffect(() => {
        if (!activeCategory) return;
        setPage(0);
        setHasMore(true);
        fetchMessages(activeCategory, 0, false);
    }, [activeCategory]);

    const fetchCategoriesStats = async () => {
        try {
            const { data, error } = await supabase
                .from('forum_category_stats')
                .select('*')
                // Optionnel : trier pour afficher les salons avec l'activité la plus récente en premier
                .order('last_post_at', { ascending: false });

            if (error) throw error;
            setCategoriesStats(data || []);
        } catch (err) {
            console.error('Erreur récupération des salons:', err);
        }
    };

    const fetchMessages = async (category: string, pageIndex: number, append: boolean) => {
        if (pageIndex === 0) setLoading(true);
        else setLoadingMore(true);

        const from = pageIndex * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        try {
            const { data, error } = await supabase
                .from('forum_messages')
                .select(`id, content, category, created_at, user_id, profiles (pseudo, detector)`)
                .eq('category', category)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            const fetchedMessages = (data as any) || [];
            if (fetchedMessages.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }

            const chronological = [...fetchedMessages].reverse();
            if (append) {
                setMessages(prev => [...chronological, ...prev]);
            } else {
                setMessages(chronological);
            }
        } catch (err) {
            console.error('Erreur récupération messages:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        if (activeCategory) {
            fetchMessages(activeCategory, nextPage, true);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newMessage.trim()) return;

        const targetCategory = activeCategory || newRoomTitle.trim();
        if (!targetCategory) return;

        setSending(true);
        try {
            const { error } = await supabase
                .from('forum_messages')
                .insert({
                    content: newMessage.trim(),
                    category: targetCategory,
                    user_id: user.id
                });

            if (error) throw error;

            setNewMessage('');
            setNewRoomTitle('');
            setIsCreatingTopic(false);
            setActiveCategory(targetCategory);

            // 👉 C'est ici qu'on rafraîchit les messages instantanément !
            await fetchMessages(targetCategory, 0, false);

        } catch (err) {
            console.error('Erreur envoi message:', err);
            alert("Impossible de publier.");
        } finally {
            setSending(false);
        }
    };

    const formatRelativeTime = (dateString: string | null) => {
        if (!dateString) return '';
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now.getTime() - past.getTime();

        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 1) return "À l'instant";
        if (diffInMins < 60) return `Il y a ${diffInMins} min`;
        if (diffInHours < 24) return `Il y a ${diffInHours} h`;
        return `Il y a ${diffInDays} j`;
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    if (!user) {
        return (
            <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">Veuillez vous connecter pour accéder au forum privé.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">

            {/* EN-TÊTE DU FORUM */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6">
                <div className="text-left">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">
                        Le Forum des <span className="text-amber-600">Prospecteurs</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 text-left">
                        {activeCategory ? `Sujet : ${activeCategory}` : "Espace d'échange et discussions de l'association."}
                    </p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    {!activeCategory && (
                        <button
                            onClick={() => {
                                setIsCreatingTopic(!isCreatingTopic);
                                setNewRoomTitle('');
                                setNewMessage('');
                            }}
                            className="text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm"
                        >
                            {isCreatingTopic ? '❌ Annuler' : '➕ Créer un salon'}
                        </button>
                    )}

                    {activeCategory && (
                        <button
                            onClick={() => { setActiveCategory(null); setIsCreatingTopic(false); }}
                            className="text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition flex items-center gap-2"
                        >
                            ⬅️ Retour à la liste
                        </button>
                    )}
                </div>
            </div>

            {/* FORMULAIRE DE CRÉATION D'UN NOUVEAU SALON */}
            {!activeCategory && isCreatingTopic && (
                <div className="mb-8 bg-white p-6 rounded-2xl border border-amber-200 shadow-sm text-left max-w-2xl mx-auto">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        📂 Ouvrir un nouveau salon de discussion
                    </h2>
                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Nom du salon / Sujet</label>
                            <input
                                type="text"
                                required
                                value={newRoomTitle}
                                onChange={(e) => setNewRoomTitle(e.target.value)}
                                placeholder="Ex: Demande d'aide pour un PX-5 OnePiece..."
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm placeholder:text-gray-400 font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Votre premier message</label>
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                rows={4} required disabled={sending}
                                placeholder="Expliquez votre problème ou lancez le débat ici..."
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm resize-none placeholder:text-gray-400"
                            />
                        </div>

                        <button
                            type="submit" disabled={sending}
                            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition"
                        >
                            {sending ? 'Création...' : 'Créer le salon et publier'}
                        </button>
                    </form>
                </div>
            )}

            {/* VUE 1 : LISTE DYNAMIQUE DES SALONS CRÉÉS */}
            {!activeCategory && (
                <div className="space-y-4 text-left">
                    {categoriesStats.length === 0 ? (
                        <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-400 font-medium">
                            Aucun salon n'a encore été créé. Lancez le tout premier ! 🚀
                        </div>
                    ) : (
                        categoriesStats.map((room) => (
                            <div
                                key={room.category}
                                onClick={() => { if (!isCreatingTopic) setActiveCategory(room.category); }}
                                className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isCreatingTopic ? 'opacity-40 cursor-not-allowed' : 'hover:border-amber-200 cursor-pointer'}`}
                            >
                                <div className="space-y-1 text-left">
                                    {/* Le titre du salon est directement la valeur de room.category */}
                                    <h3 className="text-base font-bold text-gray-900 hover:text-amber-600 transition">
                                        💬 {room.category_name}
                                    </h3>
                                </div>

                                <div className="flex sm:flex-col items-start sm:items-end text-xs text-gray-400 font-medium whitespace-nowrap min-w-[180px] gap-1 mt-2 sm:mt-0 text-left sm:text-right">
                                    <span className="text-amber-700 font-semibold bg-amber-50/70 px-2 py-0.5 rounded-md mb-0.5 inline-block">
                                        {room.post_count} message{room.post_count > 1 ? 's' : ''}
                                    </span>
                                    {room.last_post_author && (
                                        <span className="text-gray-400 text-[11px]">
                                            Dernier par <strong className="text-gray-600">{room.last_post_author || 'Anonyme'}</strong>
                                            <br className="hidden sm:inline" /> ({formatRelativeTime(room.last_post_at)})
                                        </span>

                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* VUE 2 : À L'INTÉRIEUR D'UN SALON UNIQUE */}
            {activeCategory && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Liste des messages du fil */}
                    <div className="lg:col-span-2 flex flex-col gap-4 text-left">
                        {loading ? (
                            <div className="text-center py-10 font-medium text-gray-500">Chargement des messages...</div>
                        ) : (
                            <>
                                {hasMore && (
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="w-full text-center text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50/50 hover:bg-amber-50 py-2.5 rounded-xl border border-dashed border-amber-200 transition"
                                    >
                                        {loadingMore ? 'Chargement...' : '▲ Voir les messages précédents'}
                                    </button>
                                )}

                                {messages.map((msg) => (
                                    <div key={msg.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-2.5 mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center font-bold text-amber-800 text-xs">
                                                    {(msg.profiles?.pseudo?.[0] || 'P').toUpperCase()}
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="text-sm font-bold text-gray-900">{msg.profiles?.pseudo || 'Anonyme'}</h4>
                                                    {msg.profiles?.detector && (
                                                        <span className="text-[9px] font-semibold text-amber-700 bg-amber-50/70 px-1.5 py-0.2 rounded inline-block mt-0.5">
                                                            🛠️ {msg.profiles.detector}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">{formatDate(msg.created_at)}</span>
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                            {msg.content}
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Formulaire de réponse au salon actuel */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24 text-left">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                            <span>✍️</span> Ajouter une réponse
                        </h3>

                        <form onSubmit={handleSendMessage} className="space-y-3">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                rows={4} required disabled={sending}
                                placeholder="Écrivez votre message..."
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-sm resize-none placeholder:text-gray-400"
                            />
                            <button
                                type="submit" disabled={sending}
                                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-xl text-xs shadow-md transition"
                            >
                                {sending ? 'Envoi...' : 'Répondre'}
                            </button>
                        </form>
                    </div>

                </div>
            )}

        </div>
    );
};

export default Forum;