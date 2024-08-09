import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      setError("Please fill in all fields.");
      return;
    }
    const data = await actions.login(email, password);  
    handleReset();
    if (data) {
      navigate('/recommendation-wizard'); 
    } else {
      setError("Invalid login credentials");
    }
  };

  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Log in</h1>
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
          <Link to="/reset-password">Forgot your password?</Link>
          <button type="submit">Log In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay-panel">
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start your journey with us</p>
          <button className="ghost" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;