export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR');
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const calculateMentorEarnings = (price, commissionRate = 0.2) => {
  return price * (1 - commissionRate);
};

export const calculateCommission = (price, commissionRate = 0.2) => {
  return price * commissionRate;
};
