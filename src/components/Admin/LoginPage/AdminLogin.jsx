import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/AdminModule.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Check for admin credentials (could be extended with actual validation)
    if (username === "admin" && password === "admin123") {
      // Store login state in localStorage or session
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/companies"); // Redirect to the admin page
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="primary">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
