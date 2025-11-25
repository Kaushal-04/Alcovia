const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now, restrict in production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const checkinRoutes = require('./routes/checkin');
const interventionRoutes = require('./routes/intervention');

app.use('/daily-checkin', checkinRoutes);
app.use('/assign-intervention', interventionRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (studentId) => {
    console.log(`Student ${studentId} registered on socket ${socket.id}`);
    socket.join(`student_${studentId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
