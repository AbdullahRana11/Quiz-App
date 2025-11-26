import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './Dashboard.css';

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    difficulty: 'Easy'
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.subject_id) {
      fetchQuestions(parsedUser.subject_id);
      fetchStudents(parsedUser.subject_id);
      fetchGrades(parsedUser.subject_id);
    }
  }, [navigate]);

  const fetchQuestions = async (subjectId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/instructor/questions/${subjectId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  };

  const fetchStudents = async (subjectId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/instructor/students/${subjectId}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  const fetchGrades = async (subjectId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/instructor/grades/${subjectId}`);
      setGrades(response.data);
    } catch (error) {
      console.error('Failed to fetch grades', error);
    }
  };

  const resetForm = () => {
    setNewQuestion({
      text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      difficulty: 'Easy'
    });
    setEditingQuestionId(null);
  };

  const handleEditQuestion = (question) => {
    setNewQuestion({
      text: question.text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
      difficulty: question.difficulty
    });
    setEditingQuestionId(question.id);
    setActiveTab('add_question');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestionId) {
        await axios.put(`${config.API_BASE_URL}/api/instructor/question/update`, {
          ...newQuestion,
          id: editingQuestionId,
          subject_id: user.subject_id
        });
        alert('Question updated successfully');
      } else {
        await axios.post(`${config.API_BASE_URL}/api/instructor/question/add`, {
          ...newQuestion,
          subject_id: user.subject_id
        });
        alert('Question added successfully');
      }
      resetForm();
      fetchQuestions(user.subject_id);
      if (editingQuestionId) setActiveTab('questions');
    } catch (error) {
      console.error('Failed to save question', error);
      alert('Failed to save question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${config.API_BASE_URL}/api/instructor/question/delete/${user.subject_id}/${questionId}`);
      fetchQuestions(user.subject_id);
    } catch (error) {
      console.error('Failed to delete question', error);
      alert('Failed to delete question');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="instructor-container">
      <div className="instructor-content">
        <div className="instructor-header">
          <h1 className="instructor-title">Instructor Dashboard - {user.name}</h1>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>

        <div className="instructor-card">
          <div className="tabs">
            {['questions', 'add_question', 'students', 'grades'].map((tab) => (
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
            {activeTab === 'questions' && (
              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q.id} className="question-item">
                    <div className="question-actions">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="question-text">{q.text}</p>
                    <div className="options-grid">
                      <p>A: {q.option_a}</p>
                      <p>B: {q.option_b}</p>
                      <p>C: {q.option_c}</p>
                      <p>D: {q.option_d}</p>
                    </div>
                    <div className="question-meta">
                      Correct: {q.correct_option} | Difficulty: {q.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'add_question' && (
              <form onSubmit={handleQuestionSubmit} className="form-container">
                <h2 style={{ marginBottom: '1rem' }}>{editingQuestionId ? 'Update Question' : 'Add New Question'}</h2>
                <div className="form-group">
                  <label>Question Text</label>
                  <textarea
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-grid">
                  {['a', 'b', 'c', 'd'].map((opt) => (
                    <div key={opt}>
                      <label>Option {opt.toUpperCase()}</label>
                      <input
                        type="text"
                        value={newQuestion[`option_${opt}`]}
                        onChange={(e) => setNewQuestion({ ...newQuestion, [`option_${opt}`]: e.target.value })}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="form-grid">
                  <div>
                    <label>Correct Option</label>
                    <select
                      value={newQuestion.correct_option}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value })}
                    >
                      {['A', 'B', 'C', 'D'].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Difficulty</label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    >
                      {['Easy', 'Medium', 'Hard'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="add-btn">
                    {editingQuestionId ? 'Update Question' : 'Add Question'}
                  </button>
                  {editingQuestionId && (
                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'students' && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((stu) => (
                      <tr key={stu.id}>
                        <td>{stu.id}</td>
                        <td>{stu.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '1rem' }}>No students found.</p>}
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g, idx) => (
                      <tr key={idx}>
                        <td>{g.student_name}</td>
                        <td>{g.score}</td>
                        <td>
                          <span className={`grade-badge grade-${g.grade}`}>
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
