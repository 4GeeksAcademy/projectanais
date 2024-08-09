import React from 'react';
import { Link } from 'react-router-dom';

export const HomeGuest = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="jumbotron text-center bg-light shadow-lg p-5 rounded">
            <h1 className="display-4">¡Bienvenido a IANA!</h1>
            <p className="lead">Tu portal personalizado para recomendaciones de películas y series.</p>
            <hr className="my-4" />
            <p>Para explorar nuestras recomendaciones personalizadas de películas y series, por favor regístrate o inicia sesión.</p>
            <div>
              <Link className="btn btn-primary btn-lg m-2" to="/signup" role="button">Sign Up</Link>
              <Link className="btn btn-secondary btn-lg m-2" to="/login" role="button">Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};