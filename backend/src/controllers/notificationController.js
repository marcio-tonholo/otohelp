const Notification = require('../models/Notification');

// Obter notificações do usuário
exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const filter = { recipient: req.user.id };

    if (unreadOnly === 'true') {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .populate('experience', 'title')
      .sort('-createdAt')
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marcar notificação como lida
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marcar todas as notificações como lidas
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
