const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/hospital')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);

// Stats endpoint for dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const Patient = require('./models/Patient');
    const Doctor = require('./models/Doctor');
    const Appointment = require('./models/Appointment');

    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today }
    });

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});