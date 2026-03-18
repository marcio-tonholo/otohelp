const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protect, authorize } = require('../middleware/auth');

// Rotas públicas
router.get('/', experienceController.getAllExperiences);
router.get('/search/procedure', experienceController.searchByProcedure);
router.get('/search/mentor', experienceController.searchByMentor);
router.get('/:id', experienceController.getExperienceById);

// Rotas protegidas (apenas mentores)
router.post(
  '/',
  protect,
  authorize(['mentor']),
  experienceController.createExperience,
);
router.put(
  '/:id',
  protect,
  authorize(['mentor']),
  experienceController.updateExperience,
);
router.delete(
  '/:id',
  protect,
  authorize(['mentor']),
  experienceController.deleteExperience,
);

module.exports = router;
