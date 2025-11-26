import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    // Health check
    axios.get(`${config.API_BASE_URL}/`)
      .then(res => console.log("Backend Health Check:", res.data))
      .catch(err => console.error("Backend Health Check Failed:", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { id: parseInt(id), password, name: role === 'student' ? name : undefined };
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/login/${role}`, payload);
      
      localStorage.setItem('user', JSON.stringify(response.data));
      
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'instructor') navigate('/instructor/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.detail || err.message || 'Login failed';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Quiz System Login</h2>
        <p style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>
          API: {config.API_BASE_URL}
        </p>
        
        <div className="role-selector">
          {['student', 'instructor', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`role-btn ${role === r ? 'active' : ''}`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>ID</label>
            <input
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          
          {role === 'student' && (
            <div className="form-group">
              <label>Name (Optional for Login)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Required for new registration"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary login-btn"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
