const mongoose = require('mongoose');
const User = require('./User');

const mentorSchema = new mongoose.Schema(
  {
    specialization: {
      type: String,
      required: true,
      enum: [
        'Otologia',
        'Rinologia',
        'Laringologia',
        'Cirurgia estética facial',
        'Neurotologia',
        'Pediatria',
        'Outros',
      ],
    },
    subspecializations: [String],
    bio: {
      type: String,
      maxlength: 1000,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    procedures: [
      {
        name: String,
        complexity: {
          type: String,
          enum: ['basico', 'intermediario', 'avancado'],
        },
        frequency: String, // ex: "mensal", "semanal"
      },
    ],
    environments: [
      {
        type: String,
        enum: ['centro_cirurgico', 'ambulatorio', 'consultorio', 'laboratorio'],
      },
    ],
    modalitiesOffered: [
      {
        type: String,
        enum: [
          'cirurgia',
          'ambulatorio',
          'observership',
          'mentoria_online',
          'discussao_casos',
          'treinamento_especifico',
        ],
      },
    ],
    pricing: {
      surgeryCost: Number,
      shifCost: Number,
      dayCost: Number,
      mentorshipCost: Number,
    },
    availability: {
      datesAvailable: [Date],
      monthlyFrequency: String,
      cities: [String],
    },
    rating: {
      averageRating: {
        type: Number,
        default: 5,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { discriminatorKey: 'userType' },
);

const Mentor = User.discriminator('mentor', mentorSchema);

module.exports = Mentor;
