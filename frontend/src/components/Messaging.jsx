import React, { useEffect, useState, useCallback, useRef } from "react";
import { getMessages, getConversations, getMatchedUsers, sendMessage } from "../api";
import apiInstance from "../api";
import { showToast } from '../utils/toastConfig';
import axios from "axios";
import { Link } from "react-router-dom";
import Message from './Message';

// Adjuk hozzá a getImageUrl függvényt
const getImageUrl = (profilePicture) => {
  if (!profilePicture) return null;
  if (profilePicture.startsWith('http')) return profilePicture;
  return `http://127.0.0.1:8000${profilePicture}`;
};

const Messaging = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const messagesEndRef = useRef(null);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [lastMessageId, setLastMessageId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // ScrollToBottom függvény useCallback-be csomagolva
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []); // üres függőségi tömb, mert a ref nem változik

    // 1. Beszélgetések lekérése
    const fetchConversations = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const conversationsData = await getConversations();
            if (conversationsData) {
                setConversations(conversationsData);
            }
        } catch (error) {
            console.error("Hiba a beszélgetések lekérésekor:", error);
            setError("Nem sikerült betölteni a beszélgetéseket.");
        }
    }, []); // Üres függőségi tömb

    // 2. Matched felhasználók lekérése - optimalizált verzió
    const fetchMatchedUsers = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await getMatchedUsers();
            
            if (response?.data && Array.isArray(response.data)) {
                setMatchedUsers(prevUsers => {
                    if (JSON.stringify(prevUsers) !== JSON.stringify(response.data)) {
                        return response.data;
                    }
                    return prevUsers;
                });
            }
        } catch {  // Eltávolítottuk a nem használt _ paramétert
            // Debug üzenet eltávolítva
        }
    }, []);

    // 3. Profiladatok frissítése
    const refreshProfileData = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/login";
                return;
            }
            
            // Csak a beszélgetéseket frissítjük
            const conversationsResponse = await getConversations();
            
            if (conversationsResponse) {
                setConversations(conversationsResponse);
                
                // Ellenőrizzük, hogy a kiválasztott beszélgetés érvényes-e
                const savedConversationId = localStorage.getItem("selectedConversationId");
                if (savedConversationId) {
                    const conversationExists = conversationsResponse.some(
                        conv => conv.id.toString() === savedConversationId
                    );
                    
                    if (!conversationExists) {
                        localStorage.removeItem("selectedConversationId");
                        setSelectedConversationId(null);
                    } else {
                        setSelectedConversationId(savedConversationId);
                    }
                }
            }
        } catch (error) {
            console.error("Hiba a profiladatok frissítésekor:", error);
            if (error.response?.status === 401) {
                window.location.href = "/login";
                return;
            }
        }
    }, []);

    // 4. Kezdeti betöltés és frissítés - optimalizált verzió
    useEffect(() => {
        let isMounted = true;
        let matchedUsersInterval;

        const loadInitialData = async () => {
            if (!isMounted) return;

            const token = sessionStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/login";  
                return;
            }
    
            setLoading(true);
            try {
                await Promise.all([fetchMatchedUsers(), fetchConversations()]);
            } catch (error) {
                console.error("Error loading data:", error);
                if (error.response?.status === 401) {
                    window.location.href = "/login";
                }
                setError("Hiba történt az adatok betöltésekor");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        // Csak egy helyen állítjuk be a matched users frissítését
        matchedUsersInterval = setInterval(() => {
            if (document.visibilityState === 'visible' && !isCreatingConversation) {
                fetchMatchedUsers();
            }
        }, 60000); // 1 perc

        return () => {
            isMounted = false;
            if (matchedUsersInterval) {
                clearInterval(matchedUsersInterval);
            }
        };
    }, [fetchMatchedUsers, fetchConversations, isCreatingConversation]);

    // Üzenetek polling - optimalizált verzió
    useEffect(() => {
        let isComponentMounted = true;
        let pollInterval = null;

        const startPolling = () => {
            if (!selectedConversationId || !isComponentMounted) return;

            const poll = async () => {
                try {
                    // Csak akkor kérjük le az üzeneteket, ha van kiválasztott beszélgetés
                    if (!selectedConversationId) return;

                    const messagesResponse = await getMessages(selectedConversationId);
                    if (!isComponentMounted) return;

                    // Csak akkor frissítünk, ha van új üzenet
                    if (messagesResponse?.length > 0) {
                        const newLastMessageId = messagesResponse[messagesResponse.length - 1].id;
                        if (newLastMessageId !== lastMessageId) {
                            setMessages(messagesResponse);
                            setLastMessageId(newLastMessageId);
                            scrollToBottom();
                        }
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        setSelectedConversationId(null);
                    }
                }
            };

            // Első lekérés azonnal
            poll();
            
            // Polling beállítása hosszabb intervallummal
            pollInterval = setInterval(poll, 15000); // 15 másodperc

            return () => {
                if (pollInterval) {
                    clearInterval(pollInterval);
                }
            };
        };

        const cleanup = startPolling();

        return () => {
            isComponentMounted = false;
            if (cleanup) cleanup();
        };
    }, [selectedConversationId, lastMessageId, scrollToBottom]);

    // Profiladatok egyszeri betöltése - csak sikeres bejelentkezés után
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        let isMounted = true;

        const loadProfile = async () => {
            try {
                await refreshProfileData();
            } catch (error) {
                if (error.response?.status === 401) {
                    window.location.href = "/login";
                }
                console.error("Hiba a profil betöltésekor:", error);
            }
        };

        if (isMounted) {
            loadProfile();
        }

        return () => {
            isMounted = false;
        };
    }, [refreshProfileData]);

    // Üzenetek megjelenítésének scrollozása
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // WebSocket kapcsolat kezelése - optimalizált verzió
    useEffect(() => {
        if (!selectedConversationId) return;

        const token = sessionStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        let ws = null;
        let cleanup = false;

        const connectWebSocket = () => {
            try {
                ws = new WebSocket(
                    `ws://127.0.0.1:8000/ws/chat/${selectedConversationId}/?token=${token}`
                );
                
                ws.onopen = () => {
                    console.log("WebSocket kapcsolat létrejött");
                    setSocket(ws);
                };

                ws.onclose = () => {
                    console.log("WebSocket kapcsolat lezárult");
                    if (!cleanup) {
                        setTimeout(connectWebSocket, 1000); // Újracsatlakozási kísérlet
                    }
                };

                ws.onmessage = (e) => {
                    if (cleanup) return;
                    try {
                        const data = JSON.parse(e.data);
                        if (data.message) {
                            setMessages(prevMessages => {
                                // Ellenőrizzük, hogy az üzenet már szerepel-e a listában
                                const messageExists = prevMessages.some(msg => 
                                    msg.id === data.message.id || 
                                    (msg.content === data.message.content && 
                                     msg.sender_name === data.message.sender_name)
                                );
                                
                                if (!messageExists) {
                                    scrollToBottom();
                                    return [...prevMessages, data.message];
                                }
                                return prevMessages;
                            });
                        }
                    } catch {
                        // Csendes hiba kezelés
                    }
                };
            } catch (error) {
                console.error("WebSocket kapcsolódási hiba:", error);
            }
        };

        connectWebSocket();

        return () => {
            cleanup = true;
            if (ws) {
                ws.close();
            }
        };
    }, [selectedConversationId, scrollToBottom]);

    // Módosítsuk az üzenetküldést
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim() || !selectedConversationId || isSending) return;

        const username = sessionStorage.getItem("username");
        const messageToSend = messageContent.trim();
        
        setIsSending(true);
        setMessageContent('');  // Azonnal töröljük az input mezőt

        try {
            if (socket && socket.readyState === WebSocket.OPEN) {
                // WebSocket üzenetküldés
                socket.send(JSON.stringify({
                    message: {
                        content: messageToSend,
                        sender_name: username
                    }
                }));
                // A szerver visszaküldi az üzenetet, így nem kell külön megjeleníteni
            } else {
                // Hagyományos API hívás
                const response = await sendMessage(selectedConversationId, messageToSend);
                setMessages(prev => [...prev, { 
                    ...response, 
                    sender_name: username,
                    created_at: new Date().toISOString(),
                    is_read: false
                }]);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Üzenetküldési hiba:', error);
            showToast('Nem sikerült elküldeni az üzenetet.', 'error');
            setMessageContent(messageToSend); // Hiba esetén visszaállítjuk az üzenetet
        } finally {
            setIsSending(false);
        }
    };

    // Beszélgetés létrehozása
    const createConversation = async (matchId) => {
        if (isCreatingConversation) return;
        
        try {
            setIsCreatingConversation(true);
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            // Először létrehozzuk a beszélgetést
            const response = await axios.post(
                "http://127.0.0.1:8000/api/messages/conversations/create/",
                { match_id: matchId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (response.data) {
                const newConversationId = response.data.id.toString();
                
                // Frissítjük a beszélgetéseket
                await refreshProfileData();
                
                // Csak ezután állítjuk be a selectedConversationId-t
                setSelectedConversationId(newConversationId);
                localStorage.setItem("selectedConversationId", newConversationId);
                
                // Lekérjük az üzeneteket
                const messagesResponse = await getMessages(newConversationId);
                if (messagesResponse) {
                    setMessages(messagesResponse);
                    if (messagesResponse.length > 0) {
                        setLastMessageId(messagesResponse[messagesResponse.length - 1].id);
                        scrollToBottom();
                    }
                }
            }
        } catch (error) {
            console.error("Hiba a beszélgetés létrehozásakor:", error);
            alert("Nem sikerült létrehozni a beszélgetést!");
            setSelectedConversationId(null);
            setMessages([]);
        } finally {
            setIsCreatingConversation(false);
        }
    };

    // Token ellenőrzése és beállítása
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        
        // Most már működni fog az apiInstance
        apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }, []);

    // Kezdeti adatok betöltése
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const matchedUsersResponse = await getMatchedUsers();
                if (matchedUsersResponse) {
                    setMatchedUsers(matchedUsersResponse);
                }

                const lastConvId = localStorage.getItem("selectedConversationId");
                if (lastConvId) {
                    setSelectedConversationId(lastConvId);
                    const messagesData = await getMessages(lastConvId);
                    if (messagesData) {
                        setMessages(messagesData);
                        if (messagesData.length > 0) {
                            setLastMessageId(messagesData[messagesData.length - 1].id);
                        }
                    }
                }
            } catch (error) {
                console.error("Adatok betöltési hiba:", error);
                setError("Nem sikerült betölteni az adatokat. Kérjük, jelentkezz be újra!");
                if (error.response?.status === 401) {
                    sessionStorage.clear();
                    window.location.href = "/login";
                }
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    if (loading) {
        return <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fatal-red mx-auto"></div>
            <p className="mt-4 text-fatal-gray">Betöltés...</p>
        </div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">
            <p>{error}</p>
        </div>;
    }

    // Ha nincs match, mutassuk ezt az üzenetet
    if (!matchedUsers || matchedUsers.length === 0) {
        return (
            <div className="container mx-auto p-4 max-w-6xl">
                <div className="bg-fatal-light rounded-lg shadow-xl p-8 border-2 border-fatal-red text-center">
                    <span className="material-icons text-fatal-red text-6xl mb-4">
                        favorite_border
                    </span>
                    <h2 className="text-2xl font-bold text-fatal-dark mb-4">
                        Még nincs egyezésed
                    </h2>
                    <p className="text-fatal-gray mb-6">
                        Kezdj el böngészni a profilok között, és találd meg a tökéletes párod!
                    </p>
                    <Link 
                        to="/swipe"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-fatal-red text-fatal-light rounded-fatal
                                 hover:bg-fatal-hover transition-colors duration-200"
                    >
                        <span className="material-icons">favorite</span>
                        Profilok böngészése
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl bg-fatal-dark min-h-screen">
            <div className="bg-fatal-light rounded-lg shadow-xl p-6 border-2 border-fatal-red">
                <h2 className="text-3xl font-bold mb-6 text-fatal-dark border-b-2 border-fatal-red pb-4 flex items-center">
                    <span className="material-icons text-fatal-red mr-2">chat</span>
                    Üzenetek
                </h2>

                {isCreatingConversation && (
                    <div className="absolute inset-0 bg-fatal-light/50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fatal-red"></div>
                    </div>
                )}

                {matchedUsers && matchedUsers.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-fatal-red">Aktív beszélgetések</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matchedUsers.map(match => {
                                const otherUsername = match.user2_username;
                                const otherUserProfile = match.other_user_profile;
                                const isActive = selectedConversationId === match.id.toString();
                                
                                return (
                                    <button 
                                        key={match.id}
                                        onClick={() => createConversation(match.id)}
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left
                                                  ${isActive 
                                                    ? 'border-fatal-red bg-fatal-dark text-fatal-light shadow-md'
                                                    : 'hover:border-fatal-red hover:shadow-sm'}`}
                                        disabled={isCreatingConversation}
                                    >
                                        <div className="flex items-center gap-3">
                                            {otherUserProfile?.profile_picture ? (
                                                <img 
                                                    src={getImageUrl(otherUserProfile.profile_picture)}
                                                    alt={`${otherUsername} profilképe`}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-fatal-red"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-fatal-gray flex items-center justify-center">
                                                    <span className="material-icons text-fatal-light">person</span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold">{otherUsername}</h4>
                                                    {match.unread_messages_count > 0 && (
                                                        <span className="bg-fatal-red text-fatal-light text-xs px-2 py-1 rounded-full">
                                                            {match.unread_messages_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-fatal-gray">
                                                    Match: {new Date(match.created_at).toLocaleDateString()}
                                                </div>
                                                {!isActive && (
                                                    <div className="flex items-center text-sm text-fatal-red mt-1">
                                                        <span className="material-icons text-sm mr-1">add</span>
                                                        Beszélgetés indítása
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Üzenetek megjelenítése */}
                {selectedConversationId && (
                    <div className="mt-6 border-t-2 border-fatal-red pt-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-fatal-dark flex items-center">
                                <span className="material-icons mr-2">chat</span>
                                Beszélgetés: {
                                    conversations.find(c => c.id.toString() === selectedConversationId)
                                        ?.other_participant.username
                                }
                            </h3>
                        </div>
                        <div className="border-2 border-fatal-red rounded-lg p-4 h-[500px] overflow-y-auto mb-6 bg-fatal-light">
                            {messages && messages.length > 0 ? (
                                <div className="space-y-4">
                                    {messages.map((msg, index) => {
                                        const isOwnMessage = msg.sender_name === sessionStorage.getItem("username");
                                        
                                        return (
                                            <Message 
                                                key={`${msg.id}-${index}`}
                                                message={msg}
                                                isOwnMessage={isOwnMessage}
                                            />
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <span className="material-icons text-4xl text-gray-300 mb-2">
                                        chat_bubble_outline
                                    </span>
                                    <p className="text-gray-500">
                                        Még nincsenek üzenetek. Kezdj el beszélgetni!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Üzenetküldő űrlap */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                className="flex-1 p-3 border-2 border-fatal-red rounded-lg
                                         focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                                         bg-fatal-light text-fatal-dark placeholder-gray-400"
                                placeholder="Írj egy üzenetet..."
                            />
                            <button 
                                onClick={handleSendMessage}
                                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2
                                          transition-colors duration-200 ${
                                    !selectedConversationId || !messageContent.trim()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-fatal-red text-fatal-light hover:bg-red-700'
                                }`}
                            >
                                <span className="material-icons">send</span>
                                Küldés
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
