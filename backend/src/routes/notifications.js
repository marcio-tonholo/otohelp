const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Proteger todas as rotas
router.use(protect);

// Obter notificações
router.get('/', notificationController.getNotifications);

// Marcar notificação como lida
router.put('/:id/read', notificationController.markAsRead);

// Marcar todas como lidas
router.put('/mark-all/as-read', notificationController.markAllAsRead);

module.exports = router;
