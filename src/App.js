import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./components/Admin/LoginPage/AdminLogin";
import CommunicationMethodManagement from "./components/Admin/CommunicationMethodManagement/CommunicationMethodManagement";
import CompanyManagement from "./components/Admin/CompanyManagement/CompanyManagement";
import PrivateRoute from "./components/Admin/LoginPage/PrivateRoute";
import Navbar from "./components/User/Navbar";
import UserDashboard from "./components/User/UserDashboard";
import CalendarView from "./components/User/CalendarView";
import Notifications from "./components/User/Notifications";
import UserLogin from "./components/User/UserLogin/UserLogin"; // Import the UserLogin component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Module Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin/communication-methods"
          element={<PrivateRoute element={CommunicationMethodManagement} />}
        />
        <Route
          path="/admin/companies"
          element={<PrivateRoute element={CompanyManagement} />}
        />

        {/* User Module Routes */}
        <Route path="/" element={<UserLogin />} /> {/* User login route */}
        <Route
          path="/user/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="calendar" element={<CalendarView />} />
                <Route path="notifications" element={<Notifications />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
