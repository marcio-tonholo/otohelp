import React from 'react';
import './MentorCard.css';

const MentorCard = ({ mentor, onClick }) => {
  return (
    <div className="mentor-card" onClick={onClick}>
      <div className="mentor-avatar">
        {mentor.profilePicture ? (
          <img src={mentor.profilePicture} alt={mentor.name} />
        ) : (
          <div className="avatar-placeholder">{mentor.name.charAt(0)}</div>
        )}
      </div>

      <div className="mentor-content">
        <h3 className="mentor-name">{mentor.name}</h3>

        <div className="mentor-specialization">{mentor.specialization}</div>

        {mentor.bio && (
          <p className="mentor-bio">{mentor.bio.substring(0, 100)}...</p>
        )}

        <div className="mentor-stats">
          <div className="stat">
            <span className="label">Experiência</span>
            <span className="value">{mentor.yearsOfExperience} anos</span>
          </div>
          <div className="stat">
            <span className="label">Avaliação</span>
            <span className="value">
              ⭐ {mentor.rating?.averageRating?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <div className="stat">
            <span className="label">Alunos</span>
            <span className="value">{mentor.totalStudents || 0}</span>
          </div>
        </div>

        <button className="btn-view-mentor">Ver Perfil</button>
      </div>
    </div>
  );
};

export default MentorCard;
