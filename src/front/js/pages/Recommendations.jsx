import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

// Función para obtener el póster desde TMDb
const fetchPosterFromTMDb = async (title) => {
  const apiKey = '26d0b6690b6ca551bd0a22504613e5a9'; // Asegúrate de reemplazar esto con tu clave de TMDb
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const posterPath = data.results[0].poster_path;
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch poster from TMDb:", error);
    return null;
  }
};

export const Recommendations = () => {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations } = location.state || { recommendations: [] };
  const [hoveredTitle, setHoveredTitle] = useState(null);
  const [posters, setPosters] = useState({}); // Estado para guardar los posters

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

  const handleAlternativeRecommendations = async () => {
    try {
      const newRecommendations = await actions.getRecommendations("dame más recomendaciones", Array.from(store.viewedRecommendations));
      navigate('/recommendations', { state: { recommendations: newRecommendations } });
    } catch (error) {
      console.error("Failed to fetch alternative recommendations:", error);
    }
  };

  useEffect(() => {
    const fetchAllPosters = async () => {
      const newPosters = {};
      for (const rec of recommendations) {
        const poster = await fetchPosterFromTMDb(rec.title); // Aquí usamos la función fetchPosterFromTMDb
        newPosters[rec.title] = poster || rec.poster_url;  // Usa el póster de TMDb o el original si no se encuentra
      }
      setPosters(newPosters);
    };
    fetchAllPosters();
  }, [recommendations]);

  return (
    <div className="recommendations-container mt-5">
      <h1 className="recommendations-title mb-4 text-center">Recomendaciones</h1>
      <p className="text-center text-light">Según tus preferencias, te recomendamos:</p>
      {recommendations.length > 0 ? (
        <div className="row justify-content-center">
          {recommendations.map((rec, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="recommendation-card">
                <div className="card-header">
                  <img src={posters[rec.title]} alt={rec.title} />
                  <div className="title">
                    <h5>{rec.title}</h5>
                    <p>IMDb Rating: {rec.imdb_rating}</p>
                    <button
                      className={`btn-nav btn-sm ${isFavorite(rec.title) ? 'btn-success' : 'btn-warning'}`}
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
                <div className="card-details m-3">
                  <p>Duración: {rec.duration} minutos</p>
                  <p>Disponible en: {rec.platforms}</p>
                  <p>{rec.description}</p>
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
          className="btn-nav mt-3" 
          onClick={() => navigate('/recommendation-wizard')}
        >
          Volver a Buscar
        </button>
        <button 
          className="btn-nav mt-3 ml-3" 
          onClick={handleAlternativeRecommendations}
        >
          Recomendaciones Alternativas
        </button>
      </div>
    </div>
  );
};
