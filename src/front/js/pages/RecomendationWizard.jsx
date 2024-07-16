import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export const RecommendationWizard = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    type: '',
    duration: '',
    genre: '',
    specific: '',
  });
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleFetchRecommendations = async () => {
    const prompt = `Quiero ver ${preferences.type}, que dure ${preferences.duration} minutos, del género ${preferences.genre}, con características ${preferences.specific}`;
    const recommendations = await actions.getRecommendations(prompt);
    setRecommendations(recommendations);
    setStep(5); // Avanzar al paso de resultados
  };

  switch (step) {
    case 1:
      return (
        <div className="container mt-5">
          <h2>¿Qué te gustaría ver hoy?</h2>
          <button className="btn btn-primary m-2" onClick={() => { setPreferences({ ...preferences, type: 'película' }); nextStep(); }}>Película</button>
          <button className="btn btn-primary m-2" onClick={() => { setPreferences({ ...preferences, type: 'serie' }); nextStep(); }}>Serie</button>
          <button className="btn btn-primary m-2" onClick={() => { setPreferences({ ...preferences, type: 'cualquiera' }); nextStep(); }}>Me da igual</button>
        </div>
      );
    case 2:
      return (
        <div className="container mt-5">
          <h2>¿Cuánto tiempo tienes?</h2>
          <input type="text" name="duration" value={preferences.duration} onChange={handleChange} className="form-control mb-3" placeholder="Duración en minutos" />
          <button className="btn btn-secondary m-2" onClick={prevStep}>Atrás</button>
          <button className="btn btn-primary m-2" onClick={nextStep}>Siguiente</button>
        </div>
      );
    case 3:
      return (
        <div className="container mt-5">
          <h2>¿Qué género te gusta?</h2>
          <input type="text" name="genre" value={preferences.genre} onChange={handleChange} className="form-control mb-3" placeholder="Género" />
          <button className="btn btn-secondary m-2" onClick={prevStep}>Atrás</button>
          <button className="btn btn-primary m-2" onClick={nextStep}>Siguiente</button>
        </div>
      );
    case 4:
      return (
        <div className="container mt-5">
          <h2>¿Algo específico que quieras ver?</h2>
          <input type="text" name="specific" value={preferences.specific} onChange={handleChange} className="form-control mb-3" placeholder="Características específicas" />
          <button className="btn btn-secondary m-2" onClick={prevStep}>Atrás</button>
          <button className="btn btn-primary m-2" onClick={handleFetchRecommendations}>Obtener Recomendaciones</button>
        </div>
      );
    case 5:
      return (
        <div className="container mt-5">
          <h2>Recomendaciones</h2>
          {recommendations && recommendations.length > 0 ? (
            <ul className="list-group">
              {recommendations.map((rec, index) => (
                <li key={index} className="list-group-item">
                  {rec.message.content}
                  <br />
                  IMDb Rating: {rec.rating}
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron recomendaciones.</p>
          )}
          <button className="btn btn-primary mt-3" onClick={() => setStep(1)}>Reiniciar Búsqueda</button>
        </div>
      );
    default:
      return <div />;
  }
};