const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email inválido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    crm: {
      type: String,
      required: true,
      unique: true,
    },
    crmState: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['mentor', 'student'],
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    documents: {
      crm: String,
      rqe: String,
      identity: String,
      certificates: [String],
    },
    status: {
      type: String,
      enum: ['pending_validation', 'active', 'inactive', 'suspended'],
      default: 'pending_validation',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { discriminatorKey: 'userType', collection: 'users' },
);

// Hash password antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
