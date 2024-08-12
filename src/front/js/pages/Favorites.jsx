import React, { useContext } from 'react';
import { Context } from '../store/appContext';

export const Favorites = () => {
  const { store, actions } = useContext(Context);

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
                    onClick={() => actions.removeFavorite(index)}
                  >
                    Eliminar de favoritos
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