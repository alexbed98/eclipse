import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import Sale from '../components/general/Sale'

function Market() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

    setLoading(true);

    fetch(`http://localhost:5000/api/market`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Problème lors du chargement du marché');
        }
        return response.json();
      })
      .then((data) => {
        setSales(data);
      })
      .catch((error) => {
        console.error("Erreur: ", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement du marché...</p>;
  if (error) return <p>Erreur : {error}</p>;

    return (
        <div className='market-container'>
            <h2>Marché</h2>
            {sales.map((sale) => (
                <div key={sale.id_sale}>
                    <Sale sale={sale}/>
                </div>
            ))}
        </div>
    );
}

export default Market