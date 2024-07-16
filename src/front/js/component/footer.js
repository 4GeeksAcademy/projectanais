import React, { Component } from "react";
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start">
      <div className="text-center p-3">
        © 2024 IANA: -
        <Link to="/privacy-policy" className="text-dark">Privacy Policy</Link>
      </div>
    </footer>
  );
};


