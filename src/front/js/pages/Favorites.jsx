import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

export const Favorites = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getFavorites();
  }, []);

  console.log("Favorite Movies:", store.favoriteMovies);
  console.log("Favorite Series:", store.favoriteSeries);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Mis Favoritos</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>Películas</h2>
          <ul className="list-group">
            {store.favoriteMovies.map((favorite) => (
              <li key={favorite.movie_id} className="list-group-item">
                {favorite.movie_title}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2>Series</h2>
          <ul className="list-group">
            {store.favoriteSeries.map((favorite) => (
              <li key={favorite.series_id} className="list-group-item">
                {favorite.series_title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};