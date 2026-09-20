import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Form from '../components/general/Form';
import '../css/auth.css'

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const loginFields = [
        { id: 'email', name: 'email', label: 'Courriel :', type: 'email', placeholder: 'exemple@domain.com'},
        { id: 'password', name: 'password', label: 'Mot de passe :', type: 'password', placeholder: '••••••••' }
    ];

    const { setPlayer } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adresse_courriel: formData.email,
                mot_de_passe: formData.password
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

export default Login