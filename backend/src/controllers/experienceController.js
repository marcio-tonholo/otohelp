const Experience = require('../models/Experience');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Criar experiência (apenas mentores)
exports.createExperience = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      procedure,
      complexity,
      environment,
      location,
      scheduledDate,
      duration,
      maxStudents,
      price,
      prerequisites,
      learningOutcomes,
      image,
    } = req.body;

    const experience = new Experience({
      mentor: req.user.id,
      title,
      description,
      type,
      procedure,
      complexity,
      environment,
      location,
      scheduledDate,
      duration,
      maxStudents,
      price,
      prerequisites,
      learningOutcomes,
      image,
      status: 'scheduled',
    });

    await experience.save();

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todas as experiências com filtros
exports.getAllExperiences = async (req, res) => {
  try {
    const {
      procedure,
      type,
      mentor,
      minComplexity,
      maxPrice,
      city,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = '-scheduledDate',
    } = req.query;

    let filter = { status: { $ne: 'cancelled' } };

    if (procedure) {
      filter.procedure = { $regex: procedure, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (mentor) {
      filter.mentor = mentor;
    }

    if (minComplexity) {
      const complexityLevels = { basico: 0, intermediario: 1, avancado: 2 };
      filter.complexity = {
        $in: Object.keys(complexityLevels).filter(
          (level) => complexityLevels[level] >= complexityLevels[minComplexity],
        ),
      };
    }

    if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) };
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) filter.scheduledDate.$gte = new Date(startDate);
      if (endDate) filter.scheduledDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const experiences = await Experience.find(filter)
      .populate('mentor', 'name specialization rating.averageRating')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sort);

    const total = await Experience.countDocuments(filter);

    res.json({
      success: true,
      data: experiences,
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

// Obter experiência por ID
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate(
      'mentor',
      'name bio specialization rating',
    );

    if (!experience) {
      return res.status(404).json({ error: 'Experiência não encontrada' });
    }

    // também incluir bookings relacionados (com estudante e mentor)
    const bookings = await Booking.find({ experience: experience._id })
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    const expObj = experience.toObject();
    expObj.bookings = bookings;

    res.json({
      success: true,
      data: expObj,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar experiência (apenas proprietário)
exports.updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ error: 'Experiência não encontrada' });
    }

    // Verificar se é o mentor proprietário
    if (experience.mentor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Não autorizado a atualizar essa experiência' });
    }

    // Rastrear mudanças
    const changes = {};
    const fieldsToTrack = ['title', 'scheduledDate', 'duration', 'maxStudents', 'price', 'location', 'status'];
    
    fieldsToTrack.forEach(field => {
      if (req.body[field] !== undefined) {
        const oldValue = experience[field];
        const newValue = req.body[field];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes[field] = { old: oldValue, new: newValue };
        }
      }
    });

    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Se houve mudanças relevantes, notificar alunos inscritos
    if (Object.keys(changes).length > 0) {
      try {
        // Encontrar todos os bookings aprovados para esta experiência
        const bookings = await Booking.find({
          experience: req.params.id,
          status: { $in: ['aprovado', 'pending'] }
        }).select('student');

        // Criar notificações para cada aluno
        const notifications = bookings.map(booking => ({
          recipient: booking.student,
          type: 'experience_updated',
          title: 'Experiência atualizada',
          message: `A experiência "${experience.title}" foi atualizada. Verifique os novos detalhes.`,
          experience: req.params.id,
          changes: changes,
        }));

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      } catch (notificationError) {
        console.error('Erro ao criar notificações:', notificationError);
        // Não bloquear a atualização se as notificações falharem
      }
    }

    res.json({
      success: true,
      data: experience,
      changesNotified: Object.keys(changes).length > 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar experiência
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ error: 'Experiência não encontrada' });
    }

    if (experience.mentor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Não autorizado a deletar essa experiência' });
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Experiência deletada com sucesso',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar por procedimento
exports.searchByProcedure = async (req, res) => {
  try {
    const { procedure, page = 1, limit = 10 } = req.query;

    if (!procedure) {
      return res.status(400).json({ error: 'Procedimento é obrigatório' });
    }

    const skip = (page - 1) * limit;

    const experiences = await Experience.find({
      procedure: { $regex: procedure, $options: 'i' },
      status: { $ne: 'cancelled' },
    })
      .populate('mentor', 'name specialization rating')
      .limit(parseInt(limit))
      .skip(skip)
      .sort('-scheduledDate');

    const total = await Experience.countDocuments({
      procedure: { $regex: procedure, $options: 'i' },
    });

    res.json({
      success: true,
      data: experiences,
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

// Buscar por mentor
exports.searchByMentor = async (req, res) => {
  try {
    const { mentorId, page = 1, limit = 10 } = req.query;

    if (!mentorId) {
      return res.status(400).json({ error: 'ID do mentor é obrigatório' });
    }

    const skip = (page - 1) * limit;

    const experiences = await Experience.find({
      mentor: mentorId,
      status: { $ne: 'cancelled' },
    })
      .populate('mentor', 'name specialization rating')
      .limit(parseInt(limit))
      .skip(skip)
      .sort('-scheduledDate');

    const total = await Experience.countDocuments({
      mentor: mentorId,
    });

    res.json({
      success: true,
      data: experiences,
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
