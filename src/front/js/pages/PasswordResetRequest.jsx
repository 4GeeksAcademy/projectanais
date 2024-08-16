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
        if (message === "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico") {
            alert(message);
            navigate('/login'); 
        } else {
            alert(message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Restablece tu contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="emailInput">Dirección de correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-primary mt-3">Enviar enlace de restablecimiento</button>
                </div>
            </form>
            <Link to="/login" className="btn btn-link">Volver a iniciar sesión</Link>
        </div>
    );
};

export default PasswordResetRequest;


// Esto no lo he conseguido sacar