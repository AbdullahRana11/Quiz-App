import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './Quiz.css';

const StudentQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    if (!location.state?.subjectId) {
      navigate('/student/dashboard');
      return;
    }

    fetchQuiz(location.state.subjectId);
  }, [location, navigate]);

  const fetchQuiz = async (subjectId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/student/quiz/${subjectId}`);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch quiz', error);
      alert('Failed to load quiz. Please try again.');
      navigate('/student/dashboard');
    }
  };

  const handleOptionSelect = (optionLabel) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: optionLabel
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit?')) return;
    
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qid, ans]) => ({
        question_id: parseInt(qid),
        answer: ans
      }));

      const payload = {
        student_id: user.id,
        subject_id: location.state.subjectId,
        answers: formattedAnswers
      };

      const response = await axios.post(`${config.API_BASE_URL}/api/student/quiz/submit`, payload);
      alert(`Quiz Submitted! Your Score: ${response.data.score}/${response.data.total}`);
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Failed to submit quiz', error);
      alert('Failed to submit quiz.');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Quiz...</div>;

  const question = questions[currentQuestion];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="quiz-title">Question {currentQuestion + 1} of {questions.length}</h2>
          <span className="subject-id">Subject ID: {location.state.subjectId}</span>
        </div>

        <p className="question-text">{question.text}</p>

        <div className="options-list">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(optionLabels[idx])}
              className={`option-btn ${
                answers[question.id] === optionLabels[idx] ? 'selected' : ''
              }`}
            >
              <span className="option-label">{optionLabels[idx]}.</span> {opt}
            </button>
          ))}
        </div>

        <div className="quiz-footer">
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-success"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
