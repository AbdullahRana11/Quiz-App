import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('quiz');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchSubjects();
    fetchResults(parsedUser.id);
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/student/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    }
  };

  const fetchResults = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/student/results/${studentId}`);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to fetch results', error);
    }
  };

  const startQuiz = (subjectId) => {
    navigate('/student/quiz', { state: { subjectId } });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {user.name}</h1>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>

        <div className="dashboard-card">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              Take Quiz
            </button>
            <button
              className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              My Results
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'quiz' ? (
              <div className="subjects-grid">
                {subjects.map((subject) => (
                  <div key={subject.id} className="subject-card">
                    <h3 className="subject-title">{subject.name}</h3>
                    <button
                      onClick={() => startQuiz(subject.id)}
                      className="btn btn-primary start-quiz-btn"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>{result.subject}</td>
                        <td>{result.score}</td>
                        <td>
                          <span className={`grade-badge grade-${result.grade}`}>
                            {result.grade}
                          </span>
                        </td>
                        <td>{result.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '1rem' }}>No attempts yet.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
