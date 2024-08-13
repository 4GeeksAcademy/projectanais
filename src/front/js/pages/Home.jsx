import React, { useEffect, useState } from 'react';

export const Home = () => {
  const [latestReleases, setLatestReleases] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const API_KEY = '26d0b6690b6ca551bd0a22504613e5a9'; 
    
    const fetchLatestReleases = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`);
        const data = await response.json();
        setLatestReleases(data.results);
      } catch (error) {
        console.error('Error fetching latest releases:', error);
      }
    };

    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
        const data = await response.json();
        setTrendingMovies(data.results);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };

    fetchLatestReleases();
    fetchTrendingMovies();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-light mt-5">Últimos Estrenos</h2>
      <div className="row flex-nowrap overflow-auto mb-5" style={{ whiteSpace: 'nowrap' }}>
        {latestReleases.map((movie, index) => (
          <div key={index} className="col-10 col-sm-6 col-md-4 mb-4 d-inline-block mt-4">
            <div className="card h-100" style={{ borderRadius: '15px', minWidth: '200px' }}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} style={{ borderRadius: '15px 15px 0 0' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{movie.title}</h5>
                <p className="card-text text-center">Fecha de lanzamiento: {movie.release_date}</p>
                <p className="card-text text-center">IMDb Rating: {movie.vote_average}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-center text-light mt-5 mb-5">Tendencias de la Semana</h2>
      <div className="row flex-nowrap overflow-auto mb-5" style={{ whiteSpace: 'nowrap' }}>
        {trendingMovies.map((movie, index) => (
          <div key={index} className="col-10 col-sm-6 col-md-4 mb-4 d-inline-block">
            <div className="card h-100" style={{ borderRadius: '15px', minWidth: '200px' }}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} style={{ borderRadius: '15px 15px 0 0' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{movie.title}</h5>
                <p className="card-text text-center">Fecha de lanzamiento: {movie.release_date}</p>
                <p className="card-text text-center">IMDb Rating: {movie.vote_average}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
