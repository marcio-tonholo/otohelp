const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  platformCommission: {
    type: Number,
    // 15-30% sobre o valor
  },
  mentorEarnings: {
    type: Number,
    // price - platformCommission
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado', 'concluido', 'cancelado'],
    default: 'pendente',
  },
  paymentStatus: {
    type: String,
    enum: ['pendente', 'concluido', 'falhou', 'reembolsado'],
    default: 'pendente',
  },
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
      createdAt: Date,
    },
  ],
  paymentId: String, // ID da transação (Stripe, etc)
  studentReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: Date,
  },
  mentorReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Índices
bookingSchema.index({ student: 1 });
bookingSchema.index({ mentor: 1 });
bookingSchema.index({ experience: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
