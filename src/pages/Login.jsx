import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../css/auth.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { setPlayer } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adresse_courriel: email,
                mot_de_passe: password
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Identifiants invalides');
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem("token", data.token)

                setPlayer(data.joueur);

                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage("courriel ou mot de passe incorrect")
            })
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Connexion</h2>
                <p className="auth-subtitle">Entrez vos identifiants pour accéder à votre compte</p>

                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="form-section">
                        <label htmlFor="email">Courriel: </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            placeholder="exemple@domaine.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="password">Mot de passe: </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMessage && <div className="auth-error">{errorMessage}</div>}

                    <button type="submit" className="form-button">
                        Se connecter
                    </button>

                </form>

                <div className="auth-footer">
                    <Link to="/register" className="auth-link">Je n'ai pas de compte</Link>
                </div>
            </div>
        </div>
    );
}

export default Login