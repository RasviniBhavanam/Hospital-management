import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios.get('http://localhost:5000/api/doctors')
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        alert('Cannot connect to backend. Make sure server is running on port 5000');
      });
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();

    if (!newDoctor.name.trim() || !newDoctor.specialty.trim()) {
      alert('Please fill in all fields');
      return;
    }

    axios.post('http://localhost:5000/api/doctors/add', newDoctor)
      .then(response => {
        setDoctors([...doctors, response.data]);
        setNewDoctor({ name: '', specialty: '' });
        alert('Doctor added successfully!');
      })
      .catch(error => {
        alert('Error: ' + (error.response?.data || error.message));
      });
  };

  const handleUpdateDoctor = (id, e) => {
    e.preventDefault();

    axios.post(`http://localhost:5000/api/doctors/update/${id}`, selectedDoctor)
      .then(response => {
        const updateDoc = { ...selectedDoctor, _id: id };
        setDoctors(doctors.map(doctor => (doctor._id === id ? updateDoc : doctor)));
        setSelectedDoctor(null);
        setIsEditMode(false);
        alert('Doctor updated successfully!');
      })
      .catch(error => {
        alert('Error updating doctor');
      });
  };

  const handleDeleteDoctor = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      axios.delete(`http://localhost:5000/api/doctors/delete/${id}`)
        .then(response => {
          setDoctors(doctors.filter(doctor => doctor._id !== id));
          alert('Doctor deleted successfully!');
        })
        .catch(error => {
          alert('Error deleting doctor');
        });
    }
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setSelectedDoctor(null);
    setIsEditMode(false);
  };

  return (
    <div className='main-doc-container'>
      <div className='form-sections'>
        <h4>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h4>
        <form onSubmit={isEditMode ? (e) => handleUpdateDoctor(selectedDoctor._id, e) : handleAddDoctor}>
          <label>Name:</label>
          <input
            type="text"
            required
            placeholder="Enter doctor name"
            value={isEditMode ? (selectedDoctor?.name || '') : newDoctor.name}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedDoctor({ ...selectedDoctor, name: e.target.value });
              } else {
                setNewDoctor({ ...newDoctor, name: e.target.value });
              }
            }}
          />

          <label>Specialty:</label>
          <input
            type="text"
            required
            placeholder="Enter specialty"
            value={isEditMode ? (selectedDoctor?.specialty || '') : newDoctor.specialty}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedDoctor({ ...selectedDoctor, specialty: e.target.value });
              } else {
                setNewDoctor({ ...newDoctor, specialty: e.target.value });
              }
            }}
          />

          <button type="submit">
            {isEditMode ? 'Update Doctor' : 'Add Doctor'}
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
      </div>

      <div className='doctors-section'>
        <h3>Doctors ({doctors.length})</h3>
        <div className="doctor-list">
          {doctors.length === 0 ? (
            <p style={{ color: '#999', marginTop: '20px' }}>No doctors yet. Add one to get started!</p>
          ) : (
            doctors.map(doctor => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onEdit={handleEditDoctor}
                onDelete={handleDeleteDoctor}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;