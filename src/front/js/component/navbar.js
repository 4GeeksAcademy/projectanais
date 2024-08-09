import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm w-100">
  <div className="container-fluid px-3"> {/* Añadir `px-3` para padding horizontal */}
    <Link to="/" className="navbar-brand">IANA</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <Link to="/about" className="nav-link">About</Link>
        </li>
        {store.isLoggedIn && (
          <li className="nav-item">
            <Link to="/recommendation-wizard" className="nav-link">Tu recomendación de hoy</Link>
          </li>
        )}
      </ul>
      <ul className="navbar-nav ms-auto">
        {!store.isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Log In</Link>
            </li>
          </>
        ) : (
          <li className="nav-item dropdown">
            <button className="btn btn-link nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user"></i> {/* Icono de usuario */}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><Link to="/favorites" className="dropdown-item">Favoritos</Link></li>
              <li><Link to="/edit-profile" className="dropdown-item">Editar Perfil</Link></li>
              <li><button className="dropdown-item" onClick={actions.logout}>Logout</button></li>
            </ul>
          </li>
        )}
      </ul>
    </div>
  </div>
</nav>
  );
};