const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Não autorizado para acessar essa rota' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const authorize = (userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
