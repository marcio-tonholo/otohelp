const Booking = require('../models/Booking');
const Experience = require('../models/Experience');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

// Criar booking (aluno solicita vaga)
exports.createBooking = async (req, res) => {
  try {
    const { experienceId } = req.body;

    const experience =
      await Experience.findById(experienceId).populate('mentor');

    if (!experience) {
      return res.status(404).json({ error: 'Experiência não encontrada' });
    }

    if (experience.currentStudents >= experience.maxStudents) {
      return res.status(400).json({ error: 'Essa experiência está cheia' });
    }

    // Verificar se aluno já tem booking para essa experiência
    const existingBooking = await Booking.findOne({
      experience: experienceId,
      student: req.user.id,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: 'Você já tem uma reserva para essa experiência' });
    }

    // Calcular comissão da plataforma (20% por padrão)
    const platformCommissionRate = 0.2;
    const platformCommission = Math.round(
      experience.price * platformCommissionRate,
    );
    const mentorEarnings = experience.price - platformCommission;

    const booking = new Booking({
      experience: experienceId,
      student: req.user.id,
      mentor: experience.mentor._id,
      price: experience.price,
      platformCommission,
      mentorEarnings,
      status: 'pendente',
      paymentStatus: 'pendente',
    });

    await booking.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mentor aprova booking
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    if (booking.mentor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    if (booking.status !== 'pendente') {
      return res
        .status(400)
        .json({ error: 'Apenas bookings pendentes podem ser aprovados' });
    }

    booking.status = 'aprovado';
    booking.approvedAt = new Date();
    await booking.save();

    // Atualizar o número de alunos na experiência
    const experience = await Experience.findById(booking.experience);
    experience.currentStudents += 1;
    await experience.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mentor rejeita booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    if (booking.mentor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    if (booking.status !== 'pendente') {
      return res
        .status(400)
        .json({ error: 'Apenas bookings pendentes podem ser rejeitados' });
    }

    booking.status = 'rejeitado';
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Completar booking
exports.completeBooking = async (req, res) => {
  try {
    const { studentReview } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    if (booking.mentor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    booking.status = 'concluido';
    booking.completedAt = new Date();

    if (studentReview) {
      booking.mentorReview = {
        ...studentReview,
        createdAt: new Date(),
      };
    }

    await booking.save();

    // Atualizar estatísticas do mentor
    const mentor = await Mentor.findById(booking.mentor);
    mentor.totalStudents += 1;
    mentor.totalEarnings += booking.mentorEarnings;

    // Atualizar rating
    if (studentReview && studentReview.rating) {
      const currentReviews = mentor.rating.totalReviews;
      const currentRating = mentor.rating.averageRating;

      mentor.rating.averageRating =
        (currentRating * currentReviews + studentReview.rating) /
        (currentReviews + 1);
      mentor.rating.totalReviews += 1;
    }

    await mentor.save();

    // Atualizar estatísticas do aluno
    const student = await Student.findById(booking.student);
    student.completedExperiences += 1;
    student.totalSpent += booking.price;
    await student.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancelar booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    // Aluno pode cancelar booking pendente ou aprovado
    if (
      booking.student.toString() === req.user.id &&
      ['pendente', 'aprovado'].includes(booking.status)
    ) {
      booking.status = 'cancelado';
      booking.cancelledAt = new Date();
      await booking.save();
    } else {
      return res
        .status(403)
        .json({ error: 'Não autorizado a cancelar esse booking' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter bookings (para mentor - suas reservas, para aluno - suas solicitações)
exports.getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter = {};

    // Se for mentor, mostrar bookings que ele recebeu
    if (req.user.userType === 'mentor') {
      filter.mentor = req.user.id;
    } else {
      // Se for aluno, mostrar bookings que ele fez
      filter.student = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('experience', 'title procedure')
      .populate('student', 'name email')
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

// Adicionar review (aluno avalia mentor)
exports.addStudentReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o aluno pode avaliar' });
    }

    booking.studentReview = {
      rating,
      comment,
      createdAt: new Date(),
    };

    // Atualizar rating do mentor
    const mentor = await Mentor.findById(booking.mentor);
    const currentReviews = mentor.rating.totalReviews;
    const currentRating = mentor.rating.averageRating;

    mentor.rating.averageRating =
      (currentRating * currentReviews + rating) / (currentReviews + 1);
    mentor.rating.totalReviews += 1;
    await mentor.save();

    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// mensagens entre aluno e mentor vinculadas a um booking
exports.getMessages = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'messages.sender',
      'name userType',
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    if (
      booking.student.toString() !== req.user.id &&
      booking.mentor.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    res.json({ success: true, data: booking.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking não encontrado' });
    }

    if (
      booking.student.toString() !== req.user.id &&
      booking.mentor.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    booking.messages = booking.messages || [];
    booking.messages.push({
      sender: req.user.id,
      text,
      createdAt: new Date(),
    });

    await booking.save();
    const populated = await booking.populate('messages.sender', 'name userType');
    res.json({ success: true, data: populated.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
