const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`❌ Erro ao conectar MongoDB:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
