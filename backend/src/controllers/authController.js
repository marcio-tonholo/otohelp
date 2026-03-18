const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

// Registrar novo usuário
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      crm,
      crmState,
      userType,
      specialization,
      yearsOfExperience,
      yearOfGraduation,
      currentLevel,
    } = req.body;

    // Validações
    if (!name || !email || !password || !crm || !userType) {
      return res
        .status(400)
        .json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Validar campos específicos por tipo
    if (userType === 'mentor' && (!specialization || !yearsOfExperience)) {
      return res.status(400).json({
        error:
          'Especialidade e anos de experiência são obrigatórios para mentores',
      });
    }

    if (
      userType === 'student' &&
      (!specialization || !yearOfGraduation || !currentLevel)
    ) {
      return res.status(400).json({
        error:
          'Especialidade, ano de formação e nível atual são obrigatórios para alunos',
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já registrado' });
    }

    let user;

    if (userType === 'mentor') {
      // novos mentores já ficam ativos/verificados para simplificar
      user = new Mentor({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        crm,
        crmState,
        userType: 'mentor',
        specialization,
        yearsOfExperience: parseInt(yearsOfExperience),
        status: 'active',
        isVerified: true,
      });
    } else if (userType === 'student') {
      user = new Student({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        crm,
        crmState,
        userType: 'student',
        specialization,
        yearOfGraduation: parseInt(yearOfGraduation),
        currentLevel,
      });
    } else {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }

    await user.save();

    // Criar token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: error.message || 'Erro ao registrar' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password',
    );

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Criar token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: error.message || 'Erro ao fazer login' });
  }
};

// Obter usuário atual
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (no backend não é necessário, mas pode ser útil para revogar tokens)
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
};
