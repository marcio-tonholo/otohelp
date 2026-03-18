import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { bookingAPI } from '../api/client';
import './MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // redirect to dashboard since student bookings now live there
    if (user && user.userType === 'student') {
      navigate('/dashboard');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && user.userType !== 'student') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, user, navigate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await bookingAPI.getBookings({});
      setBookings(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (booking) => {
    navigate(`/experience/${booking.experience._id}`);
  };

  const handleCancel = async (booking) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta inscrição?')) return;
    try {
      await bookingAPI.cancelBooking(booking._id);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cancelar inscrição');
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1>Minhas Experiências</h1>

        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="loading">Carregando...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não tem nenhuma inscrição.</p>
          </div>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Experiência</th>
                <th>Mentor</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.experience.title}</td>
                  <td>{b.mentor?.name}</td>
                  <td>
                    {new Date(b.experience.scheduledDate).toLocaleDateString(
                      'pt-BR'
                    )}
                  </td>
                  <td>{b.status}</td>
                  <td>
                    <button
                      className="btn-small btn-secondary"
                      onClick={() => handleRowClick(b)}
                    >
                      Gerenciar
                    </button>
                    <button
                      className="btn-small btn-danger"
                      style={{ marginLeft: '8px' }}
                      onClick={() => handleCancel(b)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
