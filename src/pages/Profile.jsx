import { useState, useEffect, use } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Form from '../components/general/Form';

function Profile() {
    const { player, setPlayer, loading } = useAuth();

    const [ isEditing, setIsEditing ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ succesMessage, setSuccesMessage ] = useState('');

    if (loading) {
        return <div>Chargement du profil en cours...</div>
    }

    const [formData, setFormData] = useState({
        email: '',
        alias: '',
        firstname: '',
        lastname: '',
        password: '',
        passwordValidate: ''
    });

    const profileFields = [
        { id: 'email', name: 'email', label: 'Courriel :', type: 'email' },
        { id: 'alias', name: 'alias', label: 'Alias :' },
        { id: 'firstname', name: 'firstname', label: 'Prénom :' },
        { id: 'lastname', name: 'lastname', label: 'Nom :' },

        { id: 'password', name: 'password', label: 'Nouveau mot de passe :', type: 'password', placeholder: 'Optionnel', required: false },
        { id: 'passwordValidate', name: 'passwordValidate', label: 'Confirmation :', type: 'password', placeholder: 'Optionnel', required: false }
    ];
    
    useEffect(() => {
        if (player) {
            setFormData({
                email: player.adresse_courriel || '',
                alias: player.alias || '',
                firstname: player.prenom || '',
                lastname: player.nom || '',
                password: '',
                passwordValidate: ''
            });
        }
    }, [player]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        if (formData.password && formData.password !== formData.passwordValidate) {
            setErrorMessage("Les mots de passe doivent être identiques");
            return;
        }

        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                alias: formData.alias,
                nom: formData.lastname,
                prenom: formData.firstname,
                adresse_courriel: formData.email,
                mot_de_passe: formData.password || undefined 
            })
        })
            .then((res) => {
                if (!res.ok) throw new Error('Échec de la mise à jour du profil');
                return res.json();
            })
            .then((data) => {
                setPlayer(data.player);
                setIsEditing(false); 
                setSuccesMessage('Profil modifié avec succès');
                
                setTimeout(() => {
                    setSuccesMessage('');
                }, 5000);
                
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage("Erreur lors de la mise à jour du profil");
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-card auth-card-wide">
                <h2>Vos informations personnelles</h2>
                <p className="auth-subtitle"></p>

                <Form
                    fields={profileFields}
                    values={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    buttonText={isEditing ? "Confirmer les modifications" : "Modifier le profil"}
                    isGrid={true}
                    disabled={!isEditing}
                    errorMessage={errorMessage}
                />

                {succesMessage && <div className='success-message'>{succesMessage}</div>}

            </div>
        </div>
    );
}

export default Profile