import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // For navigation
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // To navigate after successful login

  // Clear input fields on page load or refresh
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, []);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Please fill out all fields');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
  
      // Token aur user information save karna
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user info as JSON
  
      navigate('/dashboard'); // Navigate to dashboard
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="left-side">
          <div className="card">
            <h2>Login</h2>
            {/* Email field */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            {/* Password field */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button onClick={handleLogin}>Login</button>
            <p className="switch-page">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
            {/* Clickable "Forgot Password" with no action 
            <p className="forgot-password">
              <a href="#" onClick={handleForgotPasswordClick}>
                Forgot Password?
              </a>
            </p>
            */}
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>

          </div>
        </div>
        <div className="right-side">
          <h2>Aiwane Tijarat O Sanat Hospital</h2>
          <img src="/images/logo.png" alt="Office Logo" className="office-logo" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
