import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from './AppointmentCard';
import './Appointment.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctorName: '',
    date: ''
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = () => {
    axios.get('http://localhost:5000/api/appointments')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  };

  const fetchDoctors = () => {
    axios.get('http://localhost:5000/api/doctors')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  };

  const fetchPatients = () => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
      });
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();

    if (!newAppointment.patientName || !newAppointment.doctorName || !newAppointment.date) {
      alert('Please fill in all fields');
      return;
    }

    axios.post('http://localhost:5000/api/appointments/add', newAppointment)
      .then(response => {
        setAppointments([...appointments, response.data]);
        setNewAppointment({ patientName: '', doctorName: '', date: '' });
        alert('Appointment added successfully!');
      })
      .catch(error => {
        alert('Error: ' + (error.response?.data || error.message));
      });
  };

  const handleUpdateAppointment = (id, e) => {
    e.preventDefault();

    axios.post(`http://localhost:5000/api/appointments/update/${id}`, selectedAppointment)
      .then(response => {
        const updateApp = { ...selectedAppointment, _id: id };
        setAppointments(appointments.map(appointment =>
          appointment._id === id ? updateApp : appointment
        ));
        setSelectedAppointment(null);
        setIsEditMode(false);
        alert('Appointment updated successfully!');
      })
      .catch(error => {
        alert('Error updating appointment');
      });
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      axios.delete(`http://localhost:5000/api/appointments/delete/${id}`)
        .then(response => {
          setAppointments(appointments.filter(appointment => appointment._id !== id));
          alert('Appointment deleted successfully!');
        })
        .catch(error => {
          alert('Error deleting appointment');
        });
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment({
      patientName: appointment.patientName,
      doctorName: appointment.doctorName,
      date: appointment.date.split('T')[0],
      _id: appointment._id
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setSelectedAppointment(null);
    setIsEditMode(false);
  };

  return (
    <div className='flex-row' style={{ width: "100%", padding: "20px" }}>
      <div className='flex-column add-form'>
        <h4>{isEditMode ? 'Edit Appointment' : 'Add New Appointment'}</h4>
        <form
          className="appointment-form"
          onSubmit={isEditMode ? (e) => handleUpdateAppointment(selectedAppointment._id, e) : handleAddAppointment}
        >
          <label>Patient Name:</label>
          <select
            required
            value={isEditMode ? (selectedAppointment?.patientName || '') : newAppointment.patientName}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedAppointment({ ...selectedAppointment, patientName: e.target.value });
              } else {
                setNewAppointment({ ...newAppointment, patientName: e.target.value });
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient.name}>
                {patient.name}
              </option>
            ))}
          </select>

          <label>Doctor Name:</label>
          <select
            required
            value={isEditMode ? (selectedAppointment?.doctorName || '') : newAppointment.doctorName}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedAppointment({ ...selectedAppointment, doctorName: e.target.value });
              } else {
                setNewAppointment({ ...newAppointment, doctorName: e.target.value });
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>

          <label>Date:</label>
          <input
            type="date"
            required
            value={isEditMode ? (selectedAppointment?.date || '') : newAppointment.date}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedAppointment({ ...selectedAppointment, date: e.target.value });
              } else {
                setNewAppointment({ ...newAppointment, date: e.target.value });
              }
            }}
          />

          <button type="submit">
            {isEditMode ? 'Update Appointment' : 'Add Appointment'}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{ marginTop: '10px', backgroundColor: '#6c757d' }}
            >
              Cancel
            </button>
          )}
        </form>

        {(doctors.length === 0 || patients.length === 0) && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '5px',
            color: '#856404'
          }}>
            <strong>Note:</strong> Please add {doctors.length === 0 ? 'doctors' : ''}
            {doctors.length === 0 && patients.length === 0 ? ' and ' : ''}
            {patients.length === 0 ? 'patients' : ''} first before creating appointments.
          </div>
        )}
      </div>

      <div className='appointments'>
        <h3>Appointments ({appointments.length})</h3>
        <div className="appointment-list">
          {appointments.length === 0 ? (
            <p style={{ color: '#999', marginTop: '20px' }}>No appointments yet. Add one to get started!</p>
          ) : (
            appointments.map(appointment => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;