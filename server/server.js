require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const attendRoutes = require('./routes/attendRoutes');
const leaveRoutes = require('./routes/leaveRoute');

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://psquare-frontend-m8zs.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attend', attendRoutes);
app.use('/api/leaves', leaveRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
