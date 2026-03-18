import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingStore } from '../store/useExperienceStore';
import { bookingAPI, experienceAPI } from '../api/client';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceEditModal from '../components/ExperienceEditModal';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, fetchBookings } = useBookingStore();
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const [loadingChat, setLoadingChat] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mentor experiences
  const [experiences, setExperiences] = useState([]);
  const [isExpLoading, setIsExpLoading] = useState(true);
  const [expError, setExpError] = useState('');
  const [editingExperience, setEditingExperience] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      // mentors see all requests; students should see todas as suas reservas
      fetchBookings({
        status: user.userType === 'mentor' ? undefined : undefined,
      });

      if (user.userType === 'mentor') {
        fetchMentorExperiences();
      }
    }
  }, [user, fetchBookings]);

  const fetchMentorExperiences = async () => {
    setIsExpLoading(true);
    setExpError('');

    try {
      const response = await experienceAPI.getAllExperiences({
        mentor: user._id,
        sort: '-scheduledDate',
      });
      setExperiences(response.data.data || []);
    } catch (err) {
      setExpError(err.response?.data?.error || 'Erro ao carregar suas experiências');
    } finally {
      setIsExpLoading(false);
    }
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setIsEditModalOpen(true);
  };

  const handleSaveExperience = async (updatedData) => {
    setIsSaving(true);
    setExpError('');
    try {
      await experienceAPI.updateExperience(editingExperience._id, updatedData);
      setSuccess('Experiência atualizada com sucesso! Alunos inscritos foram notificados.');
      setIsEditModalOpen(false);
      setEditingExperience(null);
      fetchMentorExperiences();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setExpError(err.response?.data?.error || 'Erro ao salvar experiência');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingExperience(null);
  };

  const toggleChat = async (booking) => {
    if (expandedBooking?._id === booking._id) {
      setExpandedBooking(null);
      return;
    }

    setExpandedBooking(booking);
    setLoadingChat(prev => ({ ...prev, [booking._id]: true }));
    try {
      const resp = await bookingAPI.getMessages(booking._id);
      setMessages(prev => ({ ...prev, [booking._id]: resp.data.data || [] }));
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      setLoadingChat(prev => ({ ...prev, [booking._id]: false }));
    }
  };

  const handleSendMessage = async (bookingId) => {
    if (!newMessage[bookingId]?.trim()) return;

    try {
      await bookingAPI.addMessage(bookingId, { text: newMessage[bookingId] });
      const resp = await bookingAPI.getMessages(bookingId);
      setMessages(prev => ({ ...prev, [bookingId]: resp.data.data || [] }));
      setNewMessage(prev => ({ ...prev, [bookingId]: '' }));
      setSuccess('Mensagem enviada!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar mensagem');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta inscrição?')) return;

    try {
      await bookingAPI.cancelBooking(bookingId);
      setSuccess('Inscrição cancelada com sucesso');
      setTimeout(() => setSuccess(''), 2000);
      await fetchBookings();
      setExpandedBooking(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cancelar');
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await bookingAPI.approveBooking(bookingId);
      setSuccess('Solicitação aprovada com sucesso!');
      setTimeout(() => setSuccess(''), 2000);
      await fetchBookings();
      setExpandedBooking(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao aprovar');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    if (!window.confirm('Tem certeza que deseja rejeitar esta solicitação?')) return;

    try {
      await bookingAPI.rejectBooking(bookingId);
      setSuccess('Solicitação rejeitada.');
      setTimeout(() => setSuccess(''), 2000);
      await fetchBookings();
      setExpandedBooking(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao rejeitar');
    }
  };

  if (!user) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard de {user.userType === 'mentor' ? 'Mentor' : 'Aluno'}</h1>

        <div className="dashboard-content">
          <section className="welcome-section">
            <h2>Bem-vindo, {user.name}!</h2>
            <p>Email: {user.email}</p>

            {user.userType === 'student' && (
              <div className="student-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate('/experiences')}
                >
                  Explorar Experiências
                </button>
              </div>
            )}

          </section>

          <section className="bookings-section">
            <h3>
              {user.userType === 'mentor'
                ? 'Solicitações de Alunos'
                : 'Minhas Reservas'}
            </h3>

            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            {bookings && bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking._id} className={`booking-card ${expandedBooking?._id === booking._id ? 'expanded' : ''}`}>
                    <div className="booking-header">
                      <div className="booking-title-status">
                        <h4>{booking.experience?.title}</h4>
                        <span className={`status status-${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="booking-details">
                      <p className="booking-procedure">
                        <strong>Procedimento:</strong> {booking.experience?.procedure}
                      </p>
                      <p className="booking-user">
                        <strong>{user.userType === 'mentor' ? 'Aluno' : 'Mentor'}:</strong>{' '}
                        {user.userType === 'mentor'
                          ? booking.student?.name
                          : booking.mentor?.name}
                      </p>
                      {user.userType === 'mentor' && (
                        <p className="booking-email">
                          <strong>Email:</strong> {booking.student?.email}
                        </p>
                      )}
                      {user.userType === 'student' && (
                        <>
                          <p className="booking-date">
                            <strong>Data:</strong>{' '}
                            {new Date(booking.experience?.scheduledDate).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="booking-time">
                            <strong>Horário:</strong>{' '}
                            {new Date(booking.experience?.scheduledDate).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="booking-location">
                            <strong>Local:</strong> {booking.experience?.location?.hospital}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="booking-actions">
                      {user.userType === 'mentor' &&
                        booking.status === 'pendente' && (
                          <>
                            <button
                              className="btn-small btn-secondary"
                              onClick={() => toggleChat(booking)}
                            >
                              {expandedBooking?._id === booking._id ? 'Fechar Chat' : 'Chat'}
                            </button>
                            <button
                              className="btn-small btn-primary"
                              onClick={() => handleApproveBooking(booking._id)}
                            >
                              Aprovar
                            </button>
                            <button
                              className="btn-small btn-danger"
                              onClick={() => handleRejectBooking(booking._id)}
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                      {user.userType === 'mentor' &&
                        booking.status !== 'pendente' && (
                          <>
                            <button
                              className="btn-small btn-secondary"
                              onClick={() => toggleChat(booking)}
                            >
                              {expandedBooking?._id === booking._id ? 'Fechar Chat' : 'Chat'}
                            </button>
                          </>
                        )}
                      {user.userType === 'student' && (
                        <>
                          <button
                            className="btn-small btn-secondary"
                            onClick={() => toggleChat(booking)}
                          >
                            {expandedBooking?._id === booking._id ? 'Fechar Chat' : 'Abrir Chat'}
                          </button>
                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>

                    {/* Chat expandido */}
                    {expandedBooking?._id === booking._id && (
                      <div className="chat-expanded">
                        {loadingChat[booking._id] ? (
                          <p className="loading-chat">Carregando mensagens...</p>
                        ) : (
                          <>
                            <div className="chat-header">
                              <h4>{user.userType === 'mentor' ? booking.student?.name : booking.mentor?.name}</h4>
                            </div>
                            <div className="chat-messages">
                              {messages[booking._id]?.length > 0 ? (
                                messages[booking._id].map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`chat-msg ${
                                      msg.sender._id === user._id ? 'mine' : 'theirs'
                                    }`}
                                  >
                                    <span className="sender">{msg.sender.name}</span>
                                    <p>{msg.text}</p>
                                    <span className="time">
                                      {new Date(msg.createdAt).toLocaleString('pt-BR')}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="no-messages">Nenhuma mensagem ainda.</p>
                              )}
                            </div>

                            <div className="chat-input-group">
                              <textarea
                                value={newMessage[booking._id] || ''}
                                onChange={(e) =>
                                  setNewMessage(prev => ({
                                    ...prev,
                                    [booking._id]: e.target.value,
                                  }))
                                }
                                placeholder="Digite sua mensagem..."
                                rows="2"
                              />
                              <button
                                className="btn-small btn-primary"
                                onClick={() => handleSendMessage(booking._id)}
                              >
                                Enviar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary">
                {user.userType === 'mentor'
                  ? 'Nenhuma solicitação de alunos ainda.'
                  : 'Nenhuma reserva ainda.'}
              </p>
            )}
          </section>

          {user.userType === 'mentor' && (
            <section className="experiences-section">
              <div className="experiences-header">
                <h3>Minhas Experiências</h3>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/create-experience')}
                >
                  + Nova Experiência
                </button>
              </div>

              {expError && <div className="error-message">{expError}</div>}
              {isExpLoading ? (
                <div className="loading">Carregando experiências...</div>
              ) : experiences.length === 0 ? (
                <p className="text-secondary">
                  Você ainda não criou nenhuma experiência.
                </p>
              ) : (
                <div className="experiences-grid">
                  {experiences.map((exp) => (
                    <div key={exp._id} className="experience-card-container">
                      <div
                        className="experience-card-wrapper"
                        onClick={() => navigate(`/experience/${exp._id}`)}
                      >
                        <ExperienceCard experience={exp} />
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn-small btn-secondary"
                          onClick={() => handleEditExperience(exp)}
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {isEditModalOpen && editingExperience && (
            <ExperienceEditModal
              experience={editingExperience}
              onSave={handleSaveExperience}
              onClose={handleCloseModal}
              isLoading={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
