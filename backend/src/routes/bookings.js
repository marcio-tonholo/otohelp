const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Rotas protegidas
router.post(
  '/',
  protect,
  authorize(['student']),
  bookingController.createBooking,
);
router.get('/', protect, bookingController.getBookings);
router.put(
  '/:id/approve',
  protect,
  authorize(['mentor']),
  bookingController.approveBooking,
);
router.put(
  '/:id/reject',
  protect,
  authorize(['mentor']),
  bookingController.rejectBooking,
);
router.put(
  '/:id/complete',
  protect,
  authorize(['mentor']),
  bookingController.completeBooking,
);
router.put(
  '/:id/cancel',
  protect,
  authorize(['student']),
  bookingController.cancelBooking,
);
router.post(
  '/:id/review',
  protect,
  authorize(['student']),
  bookingController.addStudentReview,
);

// chat dentro do booking
router.get('/:id/messages', protect, bookingController.getMessages);
router.post('/:id/messages', protect, bookingController.addMessage);

module.exports = router;
