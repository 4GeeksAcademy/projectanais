import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const HomeGuest = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = '26d0b6690b6ca551bd0a22504613e5a9'; // Es gratis de momento más fácil así 
      const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=es-ES`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMovies(data.results);
      } else {
        setError('Error fetching movies');
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Sección primera de Bienvenida */}
      <div className="text-center text-light bg-dark py-5 welcome-section">
        <h1 className="display-4 mb-3">Te damos la bienvenida</h1>
        <p className="lead mb-4">
          Deja que te guiemos hacia tus próximas películas y series favoritas.
          <br />
          Explora recomendaciones hechas justo para ti.
        </p>
        <Link to="/signup" className="btn btn-transparent">Sign Up</Link>
      </div>

      {/* Sección de Películas en Tendencia */}
      <div className="container my-5">
        {error && <p className="text-danger text-center">{error}</p>}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {movies.map((movie) => (
            <div key={movie.id} className="col">
              <div className="card bg-dark text-white h-100">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title text-center">{movie.title}</h5>
                  <p className="card-text text-center">IMDb Rating: {movie.vote_average}</p>
                  <p className="card-text text-center">Fecha de estreno: {movie.release_date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Recomendaciones Personalizadas */}
      <div className="bg-dark text-center text-light py-5 perso-section">
        <h2 className="mb-3">Descubre tus próximas películas y series favoritas sin esfuerzo</h2>
        <p className="lead">Regístrate para recibir recomendaciones personalizadas basadas en tus preferencias.</p>
        <Link to="/signup" className="btn btn-transparent">Descubre tus recomendaciones</Link>
      </div>

      {/* Sección de Llamada a la Acción Final */}
      <div className="text-center text-light bg-dark py-5 end-section">
        <h2 className="mb-3">¿Listo para empezar?</h2>
        <p className="lead">Únete a nuestra comunidad y descubre contenido increíble.</p>
        <Link to="/signup" className="btn btn-transparent">Sign Up</Link>
      </div>
    </div>
  );
};
