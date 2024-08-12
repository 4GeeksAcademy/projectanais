import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Recommendations = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations } = location.state || { recommendations: [] };
  const [hoveredTitle, setHoveredTitle] = useState(null);

  const isFavorite = (title) => {
    return store.favorites.some(favorite => favorite.title === title);
  };

  const handleToggleFavorite = async (recommendation) => {
    const favoriteData = {
      title: recommendation.title,
      imdb_rating: recommendation.imdb_rating,
      platforms: recommendation.platforms,
      poster_url: recommendation.poster_url,
      duration: recommendation.duration,
      description: recommendation.description,
    };

    const token = store.token;
    if (!token || token.split('.').length !== 3) {
      console.error("Invalid JWT Token");
      return;
    }

    try {
      if (isFavorite(recommendation.title)) {
        const favorite = store.favorites.find(fav => fav.title === recommendation.title);
        await actions.deleteFavorite(favorite.id);
      } else {
        await actions.addFavorite(favoriteData);
      }
      console.log("Favorite added or removed successfully.");
    } catch (error) {
      console.error("Failed to add or remove favorite:", error);
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
                </div>
                <div className="card-details">
                  <p>Duración: {rec.duration} minutos</p>
                  <p>Disponible en: {rec.platforms}</p>
                  <p>{rec.description}</p>
                </div>
                <div className="card-footer">
                  <button
                    className={`btn btn-sm ${isFavorite(rec.title) ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => handleToggleFavorite(rec)}
                    onMouseEnter={() => setHoveredTitle(rec.title)}
                    onMouseLeave={() => setHoveredTitle(null)}
                  >
                    {isFavorite(rec.title) && hoveredTitle === rec.title
                      ? 'Eliminar de favoritos'
                      : isFavorite(rec.title)
                      ? '★ Añadido a favoritos'
                      : '★ Añadir a favoritos'}
                  </button>
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