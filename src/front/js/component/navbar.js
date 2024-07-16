import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand mb-0 h1">IANA</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
			{/* Recordatorio q esto && es q si la expresión de la izquierda es true, y si es así, renderiza la expresión q tng a la dcha */}
            {!store.isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">About</Link>
                </li>
              </>
            )}
            {store.isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/movies" className="nav-link">Películas</Link>
                </li>
                <li className="nav-item">
                  <Link to="/series" className="nav-link">Series</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!store.isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Log In</Link>
                </li>
              </>
            )}
            {store.isLoggedIn && (
              <div className="dropdown">
                <button className="btn btn-link nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-user"></i> {/* Icono de usuario */}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><Link to="/favorites" className="dropdown-item">Favoritos</Link></li>
                  <li><Link to="/edit-profile" className="dropdown-item">Editar Perfil</Link></li>
                  <li><button className="dropdown-item" onClick={actions.logout}>Logout</button></li>
                </ul>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};