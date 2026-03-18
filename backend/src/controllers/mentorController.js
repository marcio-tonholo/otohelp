const Mentor = require('../models/Mentor');
const Booking = require('../models/Booking');

// Obter todos os mentores
exports.getAllMentors = async (req, res) => {
  try {
    const { specialization, city, minRating, page = 1, limit = 10 } = req.query;

    // base filter: only mentors; do not restrict by verification/status so new mentors show up
    let filter = {
      userType: 'mentor',
    };

    if (specialization) {
      filter.specialization = specialization;
    }

    if (city) {
      filter['availability.cities'] = city;
    }

    if (minRating) {
      filter['rating.averageRating'] = { $gte: parseFloat(minRating) };
    }

    const skip = (page - 1) * limit;

    const mentors = await Mentor.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password -documents');

    const total = await Mentor.countDocuments(filter);

    res.json({
      success: true,
      data: mentors,
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

// Obter mentor por ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).select(
      '-password -documents',
    );

    if (!mentor || mentor.userType !== 'mentor') {
      return res.status(404).json({ error: 'Mentor não encontrado' });
    }

    res.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar perfil do mentor
exports.updateMentorProfile = async (req, res) => {
  try {
    const {
      specialization,
      subspecializations,
      bio,
      yearsOfExperience,
      procedures,
      environments,
      modalitiesOffered,
      pricing,
      availability,
      profilePicture,
    } = req.body;

    const mentor = await Mentor.findByIdAndUpdate(
      req.user.id,
      {
        specialization,
        subspecializations,
        bio,
        yearsOfExperience,
        procedures,
        environments,
        modalitiesOffered,
        pricing,
        availability,
        profilePicture,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter dashboard do mentor
exports.getMentorDashboard = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.user.id);

    if (!mentor || mentor.userType !== 'mentor') {
      return res.status(404).json({ error: 'Mentor não encontrado' });
    }

    const bookings = await Booking.find({ mentor: req.user.id })
      .populate('student', 'name email')
      .populate('experience', 'title procedure');

    const stats = {
      totalStudents: mentor.totalStudents,
      totalEarnings: mentor.totalEarnings,
      averageRating: mentor.rating.averageRating,
      totalReviews: mentor.rating.totalReviews,
      pendingBookingRequests: bookings.filter((b) => b.status === 'pendente')
        .length,
      recentBookings: bookings.slice(-5).reverse(),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter procedimentos do mentor
exports.getMentorProcedures = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor || mentor.userType !== 'mentor') {
      return res.status(404).json({ error: 'Mentor não encontrado' });
    }

    res.json({
      success: true,
      data: mentor.procedures,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
