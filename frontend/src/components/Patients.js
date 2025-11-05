import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Patients.css';
import PatientCard from './PatientCard';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => alert('Cannot connect to backend'));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();

    const patientData = {
      name: newPatient.name,
      age: Number(newPatient.age),
      gender: newPatient.gender
    };

    axios.post('http://localhost:5000/api/patients/add', patientData)
      .then(response => {
        setPatients([...patients, response.data]);
        setNewPatient({ name: '', age: '', gender: '' });
        alert('Patient added successfully!');
      })
      .catch(error => {
        console.error('Error details:', error.response?.data);
        alert('Error adding patient');
      });
  };

  const handleUpdatePatient = (id, e) => {
    e.preventDefault();

    const patientData = {
      name: selectedPatient.name,
      age: Number(selectedPatient.age),
      gender: selectedPatient.gender
    };

    axios.post(`http://localhost:5000/api/patients/update/${id}`, patientData)
      .then(response => {
        const updatePat = { ...patientData, _id: id };
        setPatients(patients.map(patient => (patient._id === id ? updatePat : patient)));
        setSelectedPatient(null);
        setIsEditMode(false);
        alert('Patient updated!');
      })
      .catch(error => alert('Error updating patient'));
  };

  const handleDeletePatient = (id) => {
    if (window.confirm('Delete this patient?')) {
      axios.delete(`http://localhost:5000/api/patients/delete/${id}`)
        .then(response => {
          setPatients(patients.filter(patient => patient._id !== id));
          alert('Patient deleted!');
        })
        .catch(error => alert('Error deleting patient'));
    }
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setSelectedPatient(null);
    setIsEditMode(false);
  };

  return (
    <div className='patient-main'>
      <div className='form-sections'>
        <h4>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h4>
        <form onSubmit={isEditMode ? (e) => handleUpdatePatient(selectedPatient._id, e) : handleAddPatient}>
          <label>Name:</label>
          <input
            type="text"
            required
            placeholder="Enter patient name"
            value={isEditMode ? (selectedPatient?.name || '') : newPatient.name}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedPatient({ ...selectedPatient, name: e.target.value });
              } else {
                setNewPatient({ ...newPatient, name: e.target.value });
              }
            }}
          />

          <label>Age:</label>
          <input
            type="number"
            required
            min="0"
            max="150"
            placeholder="Enter age"
            value={isEditMode ? (selectedPatient?.age || '') : newPatient.age}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedPatient({ ...selectedPatient, age: e.target.value });
              } else {
                setNewPatient({ ...newPatient, age: e.target.value });
              }
            }}
          />

          <label>Gender:</label>
          <select
            required
            value={isEditMode ? (selectedPatient?.gender || '') : newPatient.gender}
            onChange={(e) => {
              if (isEditMode) {
                setSelectedPatient({ ...selectedPatient, gender: e.target.value });
              } else {
                setNewPatient({ ...newPatient, gender: e.target.value });
              }
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit">
            {isEditMode ? 'Update Patient' : 'Add Patient'}
          </button>

          {isEditMode && (
            <button type="button" onClick={handleCancelEdit} style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className='patients-section'>
        <h3>Patients ({patients.length})</h3>
        <div className="patient-list">
          {patients.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '20px' }}>
              No patients yet. Add one to get started!
            </p>
          ) : (
            patients.map(patient => (
              <PatientCard
                key={patient._id}
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;