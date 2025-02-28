// RegisterModal.js
import React from 'react';

const RegisterModal = ({
  showRegisterModal,
  setShowRegisterModal,
  registerForm,
  setRegisterForm,
  registerError,
  handleRegisterSubmit,
  setShowLoginModal,
}) => {
  if (!showRegisterModal) return null;

  return (
    <div className="popup-overlay" onClick={() => setShowRegisterModal(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowRegisterModal(false)}>
          ×
        </button>
        <h2>Admin Registration</h2>
        {registerError && <p className="error-message">{registerError}</p>}
        <form id="register-form" onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={registerForm.confirmPassword}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
            }
            required
          />
          <button type="submit">Register</button>
        </form>
        <button
          className="join-admin-btn"
          onClick={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;