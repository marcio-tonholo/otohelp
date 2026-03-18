import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import './NotificationBell.css';

const NotificationBell = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.userType === 'student') {
      fetchNotifications();
      // Verificar notificações a cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications({ unreadOnly: 'true' });
      setNotifications(response.data.data || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Erro ao carregar notificações:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.filter(n => n._id !== notificationId)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
    }
  };

  if (!isAuthenticated || user?.userType !== 'student') {
    return null;
  }

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>Nenhuma notificação não lida</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification._id} className="notification-item">
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    {notification.changes && (
                      <div className="notification-changes">
                        <strong>Mudanças:</strong>
                        {Object.entries(notification.changes).map(([field, change]) => (
                          <div key={field} className="change-item">
                            <span className="change-field">{field}:</span>
                            <span className="change-value">
                              {typeof change.old === 'object' 
                                ? JSON.stringify(change.old) 
                                : String(change.old)}
                              {' → '}
                              {typeof change.new === 'object' 
                                ? JSON.stringify(change.new) 
                                : String(change.new)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <small className="notification-time">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </small>
                  </div>
                  <button
                    className="close-notification"
                    onClick={() => handleMarkAsRead(notification._id)}
                    title="Marcar como lida"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
