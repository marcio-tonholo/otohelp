const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema(
  {
    specialization: {
      type: String,
      required: true,
    },
    yearOfGraduation: {
      type: Number,
      required: true,
    },
    city: String,
    learningObjectives: [
      {
        type: String,
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
    ],
    proceduresOfInterest: [String],
    currentLevel: {
      type: String,
      enum: ['iniciante', 'intermediario', 'avancado'],
      required: true,
    },
    preferences: {
      preferredCities: [String],
      maxBudget: Number,
      preferredMentor: mongoose.Schema.Types.ObjectId,
      preferredDates: [Date],
    },
    bookingsHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    completedExperiences: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  { discriminatorKey: 'userType' },
);

const Student = User.discriminator('student', studentSchema);

module.exports = Student;
