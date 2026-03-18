import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Aprenda Cirurgias com os Melhores Especialistas</h1>
            <p>
              Conecte-se com mentores experientes e aprenda habilidades práticas
              em cirurgias, procedimentos ambulatoriais e muito mais.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/experiences')}
                  >
                    Explorar Experiências
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Ir para Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/register')}
                  >
                    Começar Agora
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate('/login')}
                  >
                    Fazer Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Por que escolher OtoHelp?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🏥</div>
              <h3>Experiências Reais</h3>
              <p>
                Aprenda em cirurgias atuais, ambulatórios e procedimentos
                supervisionados.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Mentores Especializados</h3>
              <p>
                Conheça especialistas experientes em suas áreas de interesse.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎓</div>
              <h3>Aprendizado Prático</h3>
              <p>
                Desenvolva habilidades práticas com supervisão direta de
                especialistas.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Preços Justos</h3>
              <p>
                Acesso a educação de qualidade com preços acessíveis e
                transparentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>Como Funciona</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Registre-se</h3>
              <p>Crie sua conta como mentor ou aluno.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Busque Experiências</h3>
              <p>Encontre experiências por procedimento ou mentor.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Solicite Vaga</h3>
              <p>Solicite uma vaga na experiência desejada.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Aprenda</h3>
              <p>Participe da experiência e aprenda na prática.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Pronto para começar?</h2>
          <p>
            Junte-se a centenas de médicos aprendendo com os melhores
            especialistas.
          </p>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Registrar Agora
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
