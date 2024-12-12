import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { signInUser } from './firebaseAuth';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMessage('Username or Email and Password are required.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
   
    try {
      if (!emailRegex.test(usernameOrEmail)) {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernameOrEmail, password }),
        });
   
        const data = await response.json();
   
        if (response.ok) {
          if (data.message === 'Username is not registered') {
            setErrorMessage(data.message);
          } else if (data.message === 'Username is registered') {
            const { email } = data;
   
            if (email) {
              try {
                await signInUser(email, password);
                const userId = usernameOrEmail;
                localStorage.setItem('userID', userId);
   
                await fetch('http://localhost:5000/storeUserIdUsername', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId }),
                });
                navigate('/recursion');
              } catch (error) {
                setErrorMessage('Invalid credentials');
              }
            } else {
              setErrorMessage('Invalid credentials');
            }
          }
        } else {
          setErrorMessage(data.message || 'Backend error');
        }
      } else {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernameOrEmail, password }),
        });
   
        const data = await response.json();
   
        if (response.ok) {
          if (data.message === 'Email is not registered') {
            setErrorMessage(data.message);
          } else if (data.message === 'Email is registered') {
            try {
              await signInUser(usernameOrEmail, password);
              const emailCheckResponse = await fetch('http://localhost:5000/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usernameOrEmail }),
              });
   
              const emailCheckData = await emailCheckResponse.json();
   
              if (emailCheckResponse.ok) {
                const userId = emailCheckData.userId;
                localStorage.setItem('userID', userId);
                await fetch('http://localhost:5000/storeUserIdUsername', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId }),
                });
                navigate('/recursion');
              } else {
                console.log(emailCheckData.message); 
              }
            } catch (error) {
              console.error('Error occurred while checking email:', error);
              setErrorMessage('Invalid Credentials');
            }
          }
        } else {
          setErrorMessage(data.message || 'Backend error');
        }
      }
    } catch (error) {
      setErrorMessage('An error occurred');
    }
  };

  const submitForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage('Please enter your email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, forgotPasswordEmail);
        setForgotPasswordMessage("Password reset email sent.");
      } else {
        setForgotPasswordMessage("Error verifying email.");
      }
    } catch (error) {
      setForgotPasswordMessage("Failed to send reset email.");
    }
  };

  return (
    <div className="right-section">
      <div className="login">
        <h2>Sign in</h2>
        <form onSubmit={handleLogin}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="input-group">
            <label>Email or Username</label>
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="options">
            <p
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setIsForgotPasswordOpen(true)}
            >
              Forgot Password?
            </p>
          </div>
          <button type="submit" className="signin-button">Sign in</button>
        </form>

        {isForgotPasswordOpen && (
          <>
            <div className="modal-overlay" onClick={() => setIsForgotPasswordOpen(false)}></div>
            <div className="forgot-password-modal">
              <button className="close-button" onClick={() => setIsForgotPasswordOpen(false)}>×</button>
              <h3>Reset Password</h3>
              <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
              />
              </div>
              <button className="submit-button" onClick={submitForgotPassword}>Submit</button>
              <p>{forgotPasswordMessage}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;