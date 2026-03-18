import React, { useState, useEffect } from 'react';
import './ExperienceEditModal.css';

const ExperienceEditModal = ({ experience, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    procedure: '',
    complexity: '',
    environment: '',
    location: {
      city: '',
      address: '',
      hospital: '',
    },
    scheduledDate: '',
    duration: '',
    maxStudents: '',
    price: '',
    prerequisites: [],
    learningOutcomes: [],
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData({
        ...experience,
        scheduledDate: experience.scheduledDate?.split('T')[0] || '',
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.procedure) {
      setError('Título e procedimento são obrigatórios');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Experiência</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Título */}
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Procedimento */}
          <div className="form-group">
            <label htmlFor="procedure">Procedimento *</label>
            <input
              type="text"
              id="procedure"
              name="procedure"
              value={formData.procedure}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Tipo */}
          <div className="form-group">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Selecione</option>
              <option value="cirurgia">Cirurgia</option>
              <option value="ambulatorio">Ambulatório</option>
              <option value="observership">Observership</option>
              <option value="mentoria_online">Mentoria Online</option>
              <option value="discussao_casos">Discussão de Casos</option>
              <option value="treinamento_especifico">Treinamento Específico</option>
            </select>
          </div>

          {/* Complexidade */}
          <div className="form-group">
            <label htmlFor="complexity">Complexidade</label>
            <select
              id="complexity"
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Selecione</option>
              <option value="basico">Básico</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              rows="3"
            />
          </div>

          {/* Ambiente */}
          <div className="form-group">
            <label htmlFor="environment">Ambiente</label>
            <input
              type="text"
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Localização */}
          <div className="form-section-title">Localização</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location.hospital">Hospital/Clínica</label>
              <input
                type="text"
                id="location.hospital"
                name="location.hospital"
                value={formData.location?.hospital || ''}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location.city">Cidade</label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location?.city || ''}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location.address">Endereço</label>
            <input
              type="text"
              id="location.address"
              name="location.address"
              value={formData.location?.address || ''}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Data e hora */}
          <div className="form-section-title">Agendamento</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="scheduledDate">Data *</label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duração (horas)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                disabled={isLoading}
                min="0.5"
                step="0.5"
              />
            </div>
          </div>

          {/* Vagas e Preço */}
          <div className="form-section-title">Detalhes</div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxStudents">Número de Vagas</label>
              <input
                type="number"
                id="maxStudents"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                disabled={isLoading}
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Valor (R$)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isLoading}
                min="0"
              />
            </div>
          </div>

          {/* Pré-requisitos */}
          <div className="form-section-title">
            Pré-requisitos
            <button
              type="button"
              className="btn-small btn-secondary"
              onClick={() => addArrayItem('prerequisites')}
            >
              + Adicionar
            </button>
          </div>
          {formData.prerequisites?.map((prereq, idx) => (
            <div key={idx} className="form-group">
              <div className="array-input-row">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => handleArrayChange('prerequisites', idx, e.target.value)}
                  placeholder="Ex: Conhecimento de anatomia"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn-small btn-danger"
                  onClick={() => removeArrayItem('prerequisites', idx)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          {/* Objetivos de Aprendizado */}
          <div className="form-section-title">
            Objetivos de Aprendizado
            <button
              type="button"
              className="btn-small btn-secondary"
              onClick={() => addArrayItem('learningOutcomes')}
            >
              + Adicionar
            </button>
          </div>
          {formData.learningOutcomes?.map((outcome, idx) => (
            <div key={idx} className="form-group">
              <div className="array-input-row">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleArrayChange('learningOutcomes', idx, e.target.value)}
                  placeholder="Ex: Entender a técnica cirúrgica"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn-small btn-danger"
                  onClick={() => removeArrayItem('learningOutcomes', idx)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          {/* Botões */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceEditModal;
