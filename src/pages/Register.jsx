import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Form from '../components/general/Form'
import '../css/auth.css'

function Register() {
    const [formData, setFormData] = useState({ email: '', alias: '', lastname: '', firstname: '', password: '', passwordValidate: '' })
    const [errorMessage, setErrorMessage] = useState('');

    const registerFields = [
        { id: 'email', name: 'email', label: 'Courriel :', type: 'email', placeholder: 'exemple@domain.com'  },
        { id: 'alias', name: 'alias', label: 'Alias :', placeholder: 'John_Smith123'  },
        { id: 'firstname', name: 'firstname', label: 'Prénom :', placeholder: 'John' },
        { id: 'lastname', name: 'lastname', label: 'Nom :',  placeholder: 'Smith'  },
        { id: 'password', name: 'password', label: 'Mot de passe :', type: 'password', placeholder: '••••••••' },
        { id: 'passwordValidate', name: 'passwordValidate', label: 'Confirmation :', type: 'password', placeholder: '••••••••' }
    ];

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Valider que les 2 mots de passe soient identiques
        if (formData.password != formData.passwordValidate) {
            setErrorMessage("Les mots de passe doivent être identiques");
            return;
        }

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                alias: formData.alias,
                nom: formData.lastname,
                prenom: formData.firstname,
                adresse_courriel: formData.email,
                mot_de_passe: formData.password
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

                <Form
                    fields={registerFields}
                    values={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    buttonText="S'inscrire"
                    errorMessage={errorMessage}
                    isGrid={true}
                />

                <div className="auth-footer">
                        <Link to="/login" className="auth-link">J'ai déjà un compte</Link>
                </div>
            </div>
        </div>
    );
}

export default Register