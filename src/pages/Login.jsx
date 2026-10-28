import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Form from '../components/general/Form';
import '../css/auth.css'
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const loginFields = [
        { id: 'email', name: 'email', label: 'Courriel :', type: 'email', placeholder: 'exemple@domain.com'},
        { id: 'password', name: 'password', label: 'Mot de passe :', type: 'password', placeholder: '••••••••' }
    ];

    // On récupère refreshPlayer depuis le contexte
    const { refreshPlayer } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    adresse_courriel: formData.email,
                    mot_de_passe: formData.password
                })
            });

            if (!res.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await res.json();
            
            // 1. On stocke le token d'abord
            localStorage.setItem("token", data.token);

            // 2. On appelle refreshPlayer pour charger proprement le joueur ET sa monnaie via /me
            await refreshPlayer();

            // 3. On redirige vers l'accueil
            navigate('/');
        } catch (err) {
            console.error(err);
            setErrorMessage("courriel ou mot de passe incorrect");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion</h2>
                <p className="auth-subtitle">Entrez vos identifiants pour accéder à votre compte</p>

                <Form
                    fields={loginFields}
                    values={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    buttonText="Se connecter"
                    errorMessage={errorMessage}
                />

                <div className="auth-footer">
                    <Link to="/register" className="auth-link">Je n'ai pas de compte</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;