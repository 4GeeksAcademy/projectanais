import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';

export const Movies = () => {
  const { actions } = useContext(Context);
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handlePromptSubmit = async (event) => {
    event.preventDefault();
    const data = await actions.getRecommendations(prompt);
    setRecommendations(data);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="jumbotron text-center bg-light shadow-sm m-4">
            <h1 className="display-4">Buscar Películas</h1>
            <p className="lead">Ingrese sus preferencias para recibir recomendaciones.</p>
            <form onSubmit={handlePromptSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escriba el tipo de película, director, etc."
                  value={prompt}
                  onChange={handlePromptChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Obtener Recomendaciones</button>
            </form>
          </div>
          <div className="recommendations mt-5">
            {recommendations.length > 0 && (
              <div>
                <h2>Recomendaciones:</h2>
                {recommendations.map((movie, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <h3 className="card-title">{movie.title}</h3>
                      <p className="card-text">{movie.description}</p>
                      <button className="btn btn-primary" onClick={() => actions.addFavoriteMovie(movie.id)}>Agregar a Favoritos</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};