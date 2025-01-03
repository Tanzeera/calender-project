import React from "react";
import { Link } from "react-router-dom";

const UserModule = () => {
  return (
    <div>
      <h1>User Module</h1>
      <nav>
        <ul>
          <li><Link to="/user/dashboard">Dashboard</Link></li>
          <li><Link to="/user/calendar">Calendar View</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default UserModule;
