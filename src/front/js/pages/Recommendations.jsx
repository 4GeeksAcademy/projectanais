import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Recommendations = () => {
  const location = useLocation();
  const { recommendations } = location.state || { recommendations: [] };
  const navigate = useNavigate();

  // Función para reiniciar la búsqueda
  const handleRestart = () => {
    navigate('/wizard');
  };

  return (
    <div className="container mt-5">
      <h2>Recomendaciones</h2>
      <p>Según tus preferencias de hoy, te recomiendo:</p>
      <div className="row">
        {recommendations.map((rec, index) => (
          <div key={index} className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <img src={rec.poster_url || 'https://via.placeholder.com/150'} className="card-img-top" alt={rec.title} />
              <div className="card-body">
                <h5 className="card-title">{rec.title}</h5>
                <p className="card-text">IMDb Rating: {rec.imdb_rating || 'N/A'}</p>
                <p className="card-text">Disponible en: {rec.platforms || 'Plataformas desconocidas'}</p>
                <button className="btn btn-primary" onClick={() => alert('Más detalles próximamente...')}>Más Detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3" onClick={handleRestart}>Reiniciar Búsqueda</button>
    </div>
  );
};