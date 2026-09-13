import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

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
            console.log("Succes! Voici la reponse du serveur: ", data);

            localStorage.setItem("token", data.token)
        })
        .catch((err) => {
            console.error(err);
            setErrorMessage("courriel ou mot de passe incorrect")
        })
    };

    return (
        <div>
            <p>Entrez vos informations de connexion</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Courriel: </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe: </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {errorMessage && <div className="errorMessage">{errorMessage}</div>}

                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}

export default Login