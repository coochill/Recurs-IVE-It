import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom'; 
import './signup.css';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hideSignUpOnPages = ['/landing']; 

  const shouldRenderSignUp = !hideSignUpOnPages.includes(location.pathname);

  if (!shouldRenderSignUp) {
    return null; 
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setSuccessMessage(null); 
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({ username: '', email: '', password: '' }); 
        setSuccessMessage('Proceed to Sign In'); 
        navigate('/AuthPage'); 
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred during sign-up.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server.');
    }
  };
  

  return (
    <div className="signup-card">
      <div className="signup">
        <h2 className="site-title">Sign Up Page</h2>
        {successMessage && <p className="success-text">{successMessage}</p>}
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setShowPasswordModal(true)}
                onBlur={() => setShowPasswordModal(false)}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-icon"
              />
            </div>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        </div>

      {showPasswordModal && (
        <div className="password-modal">
          <div className="password-modal-content">
            <h3>Password must contain:</h3>
            <ul>
              <li>At least 6 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@$!%*?.&)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;