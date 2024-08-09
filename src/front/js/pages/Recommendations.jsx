import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { useContext } from 'react';

export const Recommendations = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations } = location.state || { recommendations: [] };

  const handleMoreRecommendations = async () => {
    const prompt = "películas ganadoras del Oscar"; // Define aquí el prompt necesario para las recomendaciones
    const newRecommendations = await actions.getRecommendations(prompt, Array.from(store.viewedRecommendations));
    navigate('/recommendations', { state: { recommendations: newRecommendations } });
  };

  return (
    <div className="mt-5">
      <h1 className="wizard-question mb-4">Recomendaciones</h1>
      <p className="text-center">Según tus preferencias, te recomendamos:</p>
      {recommendations.length > 0 ? (
        <div className="row justify-content-center">
          {recommendations.map((rec, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="recommendation-card">
                <div className="card-header">
                  <img src={rec.poster_url} alt={rec.title} />
                  <div className="title">
                    <h5>{rec.title}</h5>
                    <p>IMDb Rating: {rec.imdb_rating}</p>
                  </div>
                </div>
                <div className="card-details">
                  <div className="details">
                    <p>Duración: {rec.duration} minutos</p>
                    <p>Disponible en: {rec.platforms}</p>
                    <p>{rec.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning text-center" role="alert">
          No se encontraron recomendaciones para esta búsqueda.
        </div>
      )}
      <div className="text-center">
        <button
          className="btn-nav"
          onClick={() => navigate('/recommendation-wizard')}
        >
          Volver a Buscar
        </button>
        <button
          className="btn-nav ms-3"
          onClick={handleMoreRecommendations}
        >
          Recomendaciones alternativas
        </button>
      </div>
    </div>
  );
};
