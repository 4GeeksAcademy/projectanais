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

    fetchFavorites();
  }, [store.token]);

  return (
    <div className="container mt-5">
      <h1 className="text-center text-light">Mis Favoritos</h1>
      <div className="row flex-nowrap overflow-auto">
        {store.favorites.length > 0 ? (
          store.favorites.map((favorite, index) => (
            <div key={index} className="card m-3" style={{ width: '18rem' }}>
              <img src={favorite.poster_url} className="card-img-top" alt={favorite.title} />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title text-center">{favorite.title}</h5>
                  <p className="card-text text-center">IMDb Rating: {favorite.imdb_rating}</p>
                  <p className="card-text text-center">Duración: {favorite.duration} minutos</p>
                  <p className="card-text text-center">Disponible en: {favorite.platforms}</p>
                  <p className="card-text">{favorite.description}</p>
                </div>
                <button
                  className="btn btn-warning mt-3 align-self-center"
                  onClick={() => actions.deleteFavorite(favorite.id)}>
                  Eliminar de Favoritos
                </button>
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
