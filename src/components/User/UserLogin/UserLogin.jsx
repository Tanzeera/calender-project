import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // To handle navigation after login
import "../../../styles/UserModule.css"; // Import the CSS file for styling

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple login validation for demonstration
    if (email === "user@example.com" && password === "password123") {
      // Store user login information in localStorage (if needed)
      localStorage.setItem("isLoggedIn", true);
      
      // Redirect to the dashboard page
      navigate("/user/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <div className="login-container">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button
            className="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
      </div>
    </Box>
  );
};

export default UserLogin;
