import React, { useContext, useEffect } from 'react';
import { Context } from '../store/appContext';

export const Favorites = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!store.token || store.token.split('.').length !== 3) {
        console.error("Invalid JWT Token");
        return;
      }
      await actions.getFavorites();
    };

    fetchFavorites(); // Llama a la función para obtener los favoritos cuando se monta el componente
  }, [store.token]); // Dependencia en store.token para asegurar que se llama cuando el token esté disponible

  return (
    <div className="container mt-5">
      <h1 className="text-center">Mis Favoritos</h1>
      <div className="row">
        {store.favorites.length > 0 ? (
          store.favorites.map((favorite, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card">
                <img src={favorite.poster_url} className="card-img-top" alt={favorite.title} />
                <div className="card-body">
                  <h5 className="card-title">{favorite.title}</h5>
                  <p className="card-text">IMDb Rating: {favorite.imdb_rating}</p>
                  <p className="card-text">Duración: {favorite.duration} minutos</p>
                  <p className="card-text">Disponible en: {favorite.platforms}</p>
                  <p className="card-text">{favorite.description}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => actions.deleteFavorite(favorite.id)}>
                    Eliminar de Favoritos
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning text-center" role="alert">
            No tienes favoritos aún.
          </div>
        )}
      </div>
    </div>
  );
};