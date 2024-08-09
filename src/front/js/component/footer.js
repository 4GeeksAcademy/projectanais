import React, { Component } from "react";
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer bg-light text-center text-lg-start">
      <div className="container-fluid">
        <div className="text-center p-3">
          © 2024 IANA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
