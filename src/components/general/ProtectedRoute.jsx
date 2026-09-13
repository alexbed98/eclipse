import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// protection pour s'assurer que ce soit un joueur connecte
// qui tente d'acceder a la page
export function ProtectedRoute({ children }) {
    const { player, loading } = useAuth();

    if (loading) return <div>Chargement en cours...</div>
    if (!player) return <Navigate to='/login' replace />;

    return children;
}

// protection pour s'assurer que ce soit un admin
// qui tente d'acceder a la page
export function AdminRoute({ children }) {
    const { player, loading } = useAuth();

    if (loading) return <div>Chargement en cours...</div>
    if (!player || !player.est_admin) return <Navigate to='/' replace />;

    return children;
}