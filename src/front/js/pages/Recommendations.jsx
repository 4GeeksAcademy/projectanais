import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Recommendations = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations } = location.state || { recommendations: [] };

  const isFavorite = (title) => {
    return store.favorites.some(favorite => favorite.title === title);
  };

  const handleToggleFavorite = (recommendation) => {
    const isAlreadyFavorite = isFavorite(recommendation.title);

    if (isAlreadyFavorite) {
      // Eliminar de favoritos
      const favoriteIndex = store.favorites.findIndex(fav => fav.title === recommendation.title);
      actions.removeFavorite(favoriteIndex);
    } else {
      // Añadir a favoritos
      const dataToSend = {
        title: recommendation.title,
        imdb_rating: recommendation.imdb_rating,
        platforms: recommendation.platforms,
        poster_url: recommendation.poster_url,
        duration: recommendation.duration,
        description: recommendation.description,
      };
      actions.addFavorite(dataToSend);
    }
  };

  return (
    <div className="mt-5">
      <h1 className="mb-4 text-center text-green">Recomendaciones</h1>
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
                  <button
                    className={`btn btn-sm ${isFavorite(rec.title) ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => handleToggleFavorite(rec)}
                  >
                    {isFavorite(rec.title) ? '★ Añadido a favoritos' : '★ Añadir a favoritos'}
                  </button>
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
          className="btn btn-primary mt-3" 
          onClick={() => navigate('/recommendation-wizard')}
        >
          Volver a Buscar
        </button>
      </div>
    </div>
  );
};
