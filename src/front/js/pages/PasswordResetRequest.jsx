import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../store/appContext';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = await actions.requestPasswordReset(email);
        if (message) {
            alert(message);
            navigate('/login'); // Navega a la página de login si el mensaje es exitoso
        } else {
            alert('Something went wrong, please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="emailInput">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary mt-3">Send Reset Link</button>
                </div>
            </form>
            <Link to="/login" className="btn btn-link">Back to login</Link>
        </div>
    );
};

export default PasswordResetRequest;