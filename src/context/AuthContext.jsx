import { createContext, useContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(null);

    // fonction pour recharger les infos du joueur
    const refreshPlayer = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/me`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Impossible de rafraîchir le joueur");
            }

            const data = await res.json();
            setPlayer(data);
            setCurrency(data.nbPiece);
        } catch (err) {
            console.error("Erreur lors du rafraîchissement du joueur:", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            refreshPlayer().finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    // fonction pour se deconnecter
    const logout = () => {
        localStorage.removeItem("token");
        setPlayer(null);
        setCurrency(null);
    };

    return (
        <AuthContext.Provider value={{ player, setPlayer, loading, logout, currency, setCurrency, refreshPlayer }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}