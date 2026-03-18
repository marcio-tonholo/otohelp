const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', mentorController.getAllMentors);
router.get('/:id', mentorController.getMentorById);
router.get('/:id/procedures', mentorController.getMentorProcedures);
router.get(
  '/dashboard',
  protect,
  authorize(['mentor']),
  mentorController.getMentorDashboard,
);
router.put(
  '/profile',
  protect,
  authorize(['mentor']),
  mentorController.updateMentorProfile,
);

module.exports = router;
