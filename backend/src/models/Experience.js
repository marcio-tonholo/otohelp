const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'cirurgia',
      'ambulatorio',
      'observership',
      'mentoria_online',
      'discussao_casos',
      'treinamento_especifico',
    ],
    required: true,
  },
  procedure: {
    type: String,
    required: true,
  },
  complexity: {
    type: String,
    enum: ['basico', 'intermediario', 'avancado'],
  },
  environment: String,
  location: {
    city: String,
    address: String,
    hospital: String,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // em horas
    required: true,
  },
  maxStudents: {
    type: Number,
    required: true,
    default: 5,
  },
  currentStudents: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
  prerequisites: [String],
  learningOutcomes: [String],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Índices para melhor performance
experienceSchema.index({ mentor: 1 });
experienceSchema.index({ scheduledDate: 1 });
experienceSchema.index({ procedure: 1 });
experienceSchema.index({ type: 1 });

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
