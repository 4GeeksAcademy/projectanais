import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Context } from "../store/appContext";

const Auth = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  useEffect(() => {
    setIsRightPanelActive(location.pathname === "/signup");
  }, [location.pathname]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const data = await actions.login(email, password);
    handleReset();
    if (data) {
      navigate('/recommendation-wizard');
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    try {
      const errorResponse = await actions.signup(email, password, navigate);
      if (errorResponse) {
        setError(errorResponse);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Log in</h1>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
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
          <Link to="/reset-password">Forgot your password?</Link>
          <button type="submit">Log In</button>
        </form>
      </div>
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignupSubmit}>
          <h1>Create Account</h1>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>¡Hola de nuevo!</h1>
            <p>Ingresa tus datos personales y accede a tu cuenta.</p>
            <button className="ghost" id="signIn" onClick={() => navigate('/login')}>Log In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Ingresa tus datos personales y comienza tu aventura con nosotros.</p>
            <button className="ghost" id="signUp" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;