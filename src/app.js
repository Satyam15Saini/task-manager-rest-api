const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Serve static files for the demo frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
