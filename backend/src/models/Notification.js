const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['experience_updated', 'booking_approved', 'booking_rejected', 'experience_cancelled'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  read: {
    type: Boolean,
    default: false,
  },
  changes: {
    type: Object, // { field: { old: value, new: value } }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
