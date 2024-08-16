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
    genres: [],
    specific: '',
  });

  const handleGenreChange = (genre) => {
    setPreferences((prevPreferences) => {
      const newGenres = prevPreferences.genres.includes(genre)
        ? prevPreferences.genres.filter((g) => g !== genre)
        : [...prevPreferences.genres, genre];
      return { ...prevPreferences, genres: newGenres };
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleFetchRecommendations = async () => {
    const prompt = `Quiero ver ${preferences.type}, que dure ${preferences.duration}, del género ${preferences.genres.join(', ')}, con características ${preferences.specific}`;
    const recommendations = await actions.getRecommendations(prompt);
    navigate('/recommendations', { state: { recommendations } });
  };

  return (
    <div className="container mt-5 mb-5">
      {step === 1 && (
        <div className="wizard-step">
          <h2 className="wizard-question">¿Qué te gustaría ver hoy?</h2>
          <div className="wizard-options align-center">
            <button className="uiverse" onClick={() => { setPreferences({ ...preferences, type: 'película' }); nextStep(); }}>
              <div className="wrapper">
                <span>Película</span>
                {[...Array(12).keys()].map((i) => (
                  <div key={i} className={`circle circle-${i + 1}`}></div>
                ))}
              </div>
            </button>
            <button className="uiverse" onClick={() => { setPreferences({ ...preferences, type: 'serie' }); nextStep(); }}>
              <div className="wrapper">
                <span>Serie</span>
                {[...Array(12).keys()].map((i) => (
                  <div key={i} className={`circle circle-${i + 1}`}></div>
                ))}
              </div>
            </button>
            <button className="uiverse" onClick={() => { setPreferences({ ...preferences, type: 'cualquiera' }); nextStep(); }}>
              <div className="wrapper">
                <span>Me da igual</span>
                {[...Array(12).keys()].map((i) => (
                  <div key={i} className={`circle circle-${i + 1}`}></div>
                ))}
              </div>
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="wizard-step">
          <h2 className="wizard-question">¿Cuánto tiempo tienes?</h2>
          <div className="wizard-options align-center">
            <button className="uiverse" onClick={() => { setPreferences({ ...preferences, duration: 'menos de una hora' }); nextStep(); }}>
              <div className="wrapper">
                <span>Menos de una hora</span>
                {[...Array(12).keys()].map((i) => (
                  <div key={i} className={`circle circle-${i + 1}`}></div>
                ))}
              </div>
            </button>
            <button className="uiverse" onClick={() => { setPreferences({ ...preferences, duration: 'entre una hora y dos' }); nextStep(); }}>
              <div className="wrapper">
                <span>Entre una hora y dos</span>
                {[...Array(12).keys()].map((i) => (
                  <div key={i} className={`circle circle-${i + 1}`}></div>
                ))}
              </div>
            </button>
            <button className="uiverse" onClick={() => { setPreferences({ ...preferences, duration: 'más de dos horas' }); nextStep(); }}>
              <div className="wrapper">
                <span>Más de dos horas</span>
                {[...Array(12).keys()].map((i) => (
                  <div key={i} className={`circle circle-${i + 1}`}></div>
                ))}
              </div>
            </button>
          </div>
          <div className="wizard-navigation">
            <button className="btn-nav" onClick={prevStep}>Atrás</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="wizard-step">
          <h2 className="wizard-question">¿Qué género te gusta?</h2>
          <div className="wizard-options wizard-genres">
            {['Acción', 'Comedia', 'Drama', 'Terror', 'Romance', 'Ciencia Ficción', 'Anime', 'Infantil'].map((genre) => (
              <button
                key={genre}
                className={`uiverse ${preferences.genres.includes(genre) ? 'active' : ''}`}
                onClick={() => handleGenreChange(genre)}
              >
                <div className="wrapper">
                  <span>{genre}</span>
                  {[...Array(12).keys()].map((i) => (
                    <div key={i} className={`circle circle-${i + 1}`}></div>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="wizard-navigation">
            <button className="btn-nav" onClick={prevStep}>Atrás</button>
            <button className="btn-nav" onClick={nextStep}>Siguiente</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="wizard-step m-5">
          <h2 className="wizard-question">¿Algo específico que quieras ver?</h2>
          <div className="InputContainer mt-3">
            <input
              type="text"
              name="specific"
              value={preferences.specific}
              onChange={(e) => setPreferences({ ...preferences, specific: e.target.value })}
              className="input"
              placeholder="Características específicas"
            />
          </div>
          <div className="wizard-options align-center">
            {['Ganadora del Oscar', '+16', 'Basada en hechos reales', 'Dirigida por'].map((specific) => (
              <button
                key={specific}
                className={`uiverse ${preferences.specific.includes(specific) ? 'active' : ''}`}
                onClick={() => setPreferences({ ...preferences, specific })}
              >
                <div className="wrapper">
                  <span>{specific}</span>
                  {[...Array(12).keys()].map((i) => (
                    <div key={i} className={`circle circle-${i + 1}`}></div>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="wizard-navigation">
            <button className="btn-nav" onClick={prevStep}>Atrás</button>
            <button className="btn-nav" onClick={handleFetchRecommendations}>Obtener Recomendaciones</button>
          </div>
        </div>
      )}
    </div>
  );
};