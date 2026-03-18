const Student = require('../models/Student');

// Obter perfil do aluno
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate(
      'bookingsHistory',
    );

    if (!student || student.userType !== 'student') {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar perfil do aluno
exports.updateStudentProfile = async (req, res) => {
  try {
    const {
      specialization,
      yearOfGraduation,
      city,
      learningObjectives,
      proceduresOfInterest,
      currentLevel,
      preferences,
    } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      {
        specialization,
        yearOfGraduation,
        city,
        learningObjectives,
        proceduresOfInterest,
        currentLevel,
        preferences,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter dashboard do aluno
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate(
      'bookingsHistory',
    );

    if (!student || student.userType !== 'student') {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const stats = {
      completedExperiences: student.completedExperiences,
      totalSpent: student.totalSpent,
      learningObjectives: student.learningObjectives,
      currentLevel: student.currentLevel,
      recentBookings: student.bookingsHistory.slice(-5).reverse(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter histórico de reservas
exports.getStudentBookingHistory = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { student: req.user.id };
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('experience', 'title procedure')
      .populate('mentor', 'name specialization')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
