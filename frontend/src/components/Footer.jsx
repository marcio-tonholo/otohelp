import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>OtoHelp Academy</h3>
            <p>Marketplace de mentoria médica procedural sob demanda.</p>
          </div>

          <div className="footer-section">
            <h4>Links</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/experiences">Experiências</a>
              </li>
              <li>
                <a href="/mentors">Mentores</a>
              </li>
              <li>
                <a href="/about">Sobre</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li>
                <a href="/faq">FAQ</a>
              </li>
              <li>
                <a href="/contact">Contato</a>
              </li>
              <li>
                <a href="/privacy">Privacidade</a>
              </li>
              <li>
                <a href="/terms">Termos</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 OtoHelp Academy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
