// LoginModal.js
import React from 'react';

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  loginError,
  handleLoginSubmit,
  setShowRegisterModal,
}) => {
  if (!showLoginModal) return null;

  return (
    <div className="popup-overlay" onClick={() => setShowLoginModal(false)}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowLoginModal(false)}>
          ×
        </button>
        <h2>Admin Login</h2>
        {loginError && <p className="error-message">{loginError}</p>}
        <form id="login-form" onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button
          className="join-admin-btn"
          onClick={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        >
          Join as Admin
        </button>
      </div>
    </div>
  );
};

export default LoginModal;