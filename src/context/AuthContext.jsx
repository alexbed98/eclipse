import { createContext, useContext, useState, useEffect } from "react";

// creation d'un contexte qui va permettre de retrouver le user
// connecte facilement en utilisant le hook useAuth
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetch('http://localhost:5000/api/me', {
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
                })
                .catch((err) => {
                    console.error("Erreur d'authentification initiale:", err);
                    setPlayer(null);
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
    };

    return (
        <AuthContext.Provider value={{ player, setPlayer, loading, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)
}
