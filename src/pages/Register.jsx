import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../css/auth.css'

function Register() {
    const [email, setEmail] = useState('');
    const [alias, setAlias] = useState('');
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordValidate, setPasswordValidate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { setPlayer } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Valider que les 2 mots de passe soient identiques
        if (password != passwordValidate) {
            setErrorMessage("Les mots de passe doivent être identiques");
            return;
        }

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alias: alias,
                nom: lastname,
                prenom: firstname,
                adresse_courriel: email,
                mot_de_passe: password
            })
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Entrée(s) invalide(s)');
                }
                return res.json();
            })
            .then(() => {
                navigate('/login');
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage("Échec de la création du compte, vérifiez vos informations")
            })
    };

    return (
        <div className="auth-container">
            <div className="auth-card auth-card-wide">
                <h2>Création de compte</h2>
                <p className="auth-subtitle">Entrez vos informations personnelles</p>

                <form onSubmit={handleSubmit} className="register-form">

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
                        <label htmlFor="alias">Alias: </label>
                        <input
                            id="alias"
                            type="text"
                            value={alias}
                            placeholder="alias_123"
                            onChange={(e) => setAlias(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="firstname">Prénom: </label>
                        <input
                            id="firstname"
                            type="text"
                            value={firstname}
                            placeholder="John"
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="lastname">nom: </label>
                        <input
                            id="lastname"
                            type="text"
                            value={lastname}
                            placeholder="Smith"
                            onChange={(e) => setLastname(e.target.value)}
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

                    <div className="form-section">
                        <label htmlFor="passwordValidate">Confirmation du mot de passe: </label>
                        <input
                            id="passwordValidate"
                            type="password"
                            placeholder="••••••••"
                            value={passwordValidate}
                            onChange={(e) => setPasswordValidate(e.target.value)}
                            required
                        />
                    </div>

                    {errorMessage && <div className="auth-error">{errorMessage}</div>}

                    <button type="submit" className="form-button">
                        S'inscrire
                    </button>

                </form>

                <div className="auth-footer">
                        <Link to="/login" className="auth-link">J'ai déjà un compte</Link>
                </div>
            </div>
        </div>
    );
}

export default Register