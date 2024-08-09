import React from 'react';

export const Home = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="jumbotron text-center bg-light shadow-lg p-5 rounded">
            <h1 className="display-4">¡Bienvenido a IANA!</h1>
            <p className="lead">Descubre tu próxima película o serie favorita.</p>
            <hr className="my-4" />
            <p>Explora nuestra colección de recomendaciones personalizadas solo para ti. Ya sea que estés buscando una película para ver en solitario o una serie para maratonear, tenemos algo para todos.</p>
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