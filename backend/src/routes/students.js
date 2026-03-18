const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.get(
  '/profile',
  protect,
  authorize(['student']),
  studentController.getStudentProfile,
);
router.put(
  '/profile',
  protect,
  authorize(['student']),
  studentController.updateStudentProfile,
);
router.get(
  '/dashboard',
  protect,
  authorize(['student']),
  studentController.getStudentDashboard,
);
router.get(
  '/booking-history',
  protect,
  authorize(['student']),
  studentController.getStudentBookingHistory,
);

module.exports = router;
