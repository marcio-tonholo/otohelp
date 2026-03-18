import React from 'react';
import { formatDate, formatCurrency } from '../utils/helpers';
import './ExperienceCard.css';

const ExperienceCard = ({ experience, onClick }) => {
  return (
    <div className="experience-card" onClick={onClick}>
      {experience.image && (
        <div className="experience-image">
          <img src={experience.image} alt={experience.title} />
        </div>
      )}

      <div className="experience-content">
        <div className="experience-type">
          <span className="badge">{experience.type}</span>
          <span className="complexity">{experience.complexity}</span>
        </div>

        <h3 className="experience-title">{experience.title}</h3>
        <p className="experience-procedure">
          Procedimento: {experience.procedure}
        </p>

        <div className="experience-meta">
          <span className="date">{formatDate(experience.scheduledDate)}</span>
          <span className="duration">{experience.duration}h</span>
          <span className="capacity">
            {experience.currentStudents}/{experience.maxStudents}
          </span>
        </div>

        <div className="experience-footer">
          <div className="price">
            <span className="label">A partir de</span>
            <span className="value">{formatCurrency(experience.price)}</span>
          </div>
          <button className="btn-view">Ver Detalhes</button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
