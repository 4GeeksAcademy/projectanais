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
      setError("Please fill in all fields.");
      return;
    }
    try {
      const errorResponse = await actions.signup(email, password, navigate);
      if (errorResponse) {
        setError(errorResponse);
      } else {
        navigate('/login');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay-panel">
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button className="ghost" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </div>
  );
};
