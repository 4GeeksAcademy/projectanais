import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      setError("Por favor, rellene todos los campos.");
      return;
    }

    const errorResponse = await actions.signup(email, password, navigate);
    if (errorResponse) {
      setError(errorResponse);
    } else {
      // Guardo el token y redirijo al user dentr de la aplicación
      await actions.login(email, password);
      navigate('/recommendation-wizard');  
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Crea tu Cuenta</h1>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit" className="form-btn">Sign Up</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay-panel">
          <h1>¡Hola de nuevo!</h1>
          <p>Ingresa tus datos personales y accede a tu cuenta.</p>
          <button className="ghost" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </div>
  );
};
