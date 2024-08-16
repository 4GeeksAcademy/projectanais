import React from "react";
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer bg-light text-center text-lg-start">
      <div className="container-fluid">
        <div className="text-center p-3">
          © 2024 IANA. Todos los derechos reservados. 
          <Link to="/privacy-policy" className="text-decoration-none ms-2">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  );
};