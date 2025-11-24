import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [newStudent, setNewStudent] = useState({ id: '', name: '', password: 'Student@123' });
  const [newInstructor, setNewInstructor] = useState({ id: '', name: '', password: 'Proff@123', subject_id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchStudents();
    fetchInstructors();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/instructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Failed to fetch instructors', error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/admin/student/add', newStudent);
      alert('Student added successfully');
      setNewStudent({ id: '', name: '', password: 'Student@123' });
      fetchStudents();
    } catch (error) {
      console.error('Failed to add student', error);
      alert('Failed to add student');
    }
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/admin/instructor/add', newInstructor);
      alert('Instructor added successfully');
      setNewInstructor({ id: '', name: '', password: 'Proff@123', subject_id: '' });
      fetchInstructors();
    } catch (error) {
      console.error('Failed to add instructor', error);
      alert('Failed to add instructor');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/student/delete/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Failed to delete student', error);
      alert('Failed to delete student');
    }
  };

  const handleUpdatePassword = async (type, id) => {
    const newPassword = prompt(`Enter new password for ${type} ID ${id}:`);
    if (!newPassword) return;

    try {
      await axios.put(`http://localhost:8000/api/admin/${type}/password`, {
        id: id,
        new_password: newPassword
      });
      alert('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password', error);
      alert('Failed to update password');
    }
  };

  const handleDeleteInstructor = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/instructor/delete/${id}`);
      fetchInstructors();
    } catch (error) {
      console.error('Failed to delete instructor', error);
      alert('Failed to delete instructor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>

        <div className="admin-card">
          <div className="tabs">
            {['students', 'add_student', 'instructors', 'add_instructor'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'students' && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((stu) => (
                      <tr key={stu.id}>
                        <td>{stu.id}</td>
                        <td>{stu.name}</td>
                        <td className="actions-cell">
                          <button
                            onClick={() => handleUpdatePassword('student', stu.id)}
                            className="btn-secondary"
                            style={{ marginRight: '0.5rem' }}
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(stu.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'add_student' && (
              <form onSubmit={handleAddStudent} className="form-container">
                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="number"
                    value={newStudent.id}
                    onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="add-btn">Add Student</button>
              </form>
            )}

            {activeTab === 'instructors' && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Subject ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.map((inst) => (
                      <tr key={inst.id}>
                        <td>{inst.id}</td>
                        <td>{inst.name}</td>
                        <td>{inst.subject_id}</td>
                        <td className="actions-cell">
                          <button
                            onClick={() => handleUpdatePassword('instructor', inst.id)}
                            className="btn-secondary"
                            style={{ marginRight: '0.5rem' }}
                          >
                            Update Password
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(inst.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'add_instructor' && (
              <form onSubmit={handleAddInstructor} className="form-container">
                <div className="form-group">
                  <label>Instructor ID</label>
                  <input
                    type="number"
                    value={newInstructor.id}
                    onChange={(e) => setNewInstructor({ ...newInstructor, id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newInstructor.name}
                    onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject ID</label>
                  <input
                    type="number"
                    value={newInstructor.subject_id}
                    onChange={(e) => setNewInstructor({ ...newInstructor, subject_id: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    value={newInstructor.password}
                    onChange={(e) => setNewInstructor({ ...newInstructor, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="add-btn">Add Instructor</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
