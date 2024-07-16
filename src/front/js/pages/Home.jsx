import React from 'react';

export const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="jumbotron text-center bg-light shadow-sm p-4">
            <h1 className="display-4">¡Bienvenido a IANA!</h1>
            <p className="lead">¿Qué te gustaría ver hoy?</p>
            <hr className="my-4" />
            <p className='m-4'>Explora nuestra colección de películas y series. Encuentra recomendaciones personalizadas solo para ti.</p>
            <div>
              <a className="btn btn-primary btn-lg m-2" href="/movies" role="button">Buscar Películas</a>
              <a className="btn btn-secondary btn-lg m-2" href="/series" role="button">Buscar Series</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};