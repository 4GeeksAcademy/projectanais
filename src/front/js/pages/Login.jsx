import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom"; 

 const Login = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await actions.login(email, password);  
    handleReset();
    if (data) {
      navigate('/home'); 
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Sign in</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            value={email} onChange={handleEmail} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1"
            value={password} onChange={handlePassword} />
        </div>
        <div className="mb-3 text-center">
          <Link to="/reset-password" className="text-decoration-none">¿Olvidaste tu contraseña?</Link>  
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
        <button type="button" className="btn btn-secondary ms-3 mt-3"
          onClick={handleReset}>Cancel</button>
      </form>
    </div>
  );
};

export default Login;