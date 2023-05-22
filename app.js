const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const setupSwagger = require('./swagger');


dotenv.config();

const app = express();

app.use(express.json());

// Connection à MongoDB
mongoose.connect(process.env.MONGO_URI ?? 'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PASSWORD+'@apiexo.yxcza2f.mongodb.net/?retryWrites=true&w=majority',
{
   useNewUrlParser: true,
   useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
   console.log('Connecté à MongoDB');
});

// Importation des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const monkeyRoutes = require('./routes/monkey');

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/monkey', monkeyRoutes);

// Démarrez le serveur
app.listen(process.env.PORT || 8000, () => {
   console.log('Serveur en écoute sur le port 8000');
});

// Configurez Swagger
setupSwagger(app);
