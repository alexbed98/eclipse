import { createContext, useContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

// creation d'un contexte qui va permettre de retrouver le user
// connecte facilement en utilisant le hook useAuth
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetch(`${API_URL}/me`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        localStorage.removeItem("token");
                        throw new Error("Session invalide ou expiree");
                    }
                    return res.json();
                })
                .then((data) => {
                    setPlayer(data);
                    setCurrency(data.nbPiece)
                })
                .catch((err) => {
                    console.error("Erreur d'authentification initiale:", err);
                    setPlayer(null);
                    setCurrency(null)
                })
                .finally(() => {
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
        <AuthContext.Provider value={{ player, setPlayer, loading, logout, currency, setCurrency}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)
}
