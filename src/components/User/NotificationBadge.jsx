import React from "react";
import "../../../styles/UserModule.css";

const NotificationBadge = ({ overdueCount, dueTodayCount }) => {
  return (
    <div className="notification-badge">
      <span className="badge">
        {overdueCount + dueTodayCount > 0 ? overdueCount + dueTodayCount : 0}
      </span>
      <div className="notification-details">
        <p>{overdueCount} Overdue Communications</p>
        <p>{dueTodayCount} Communications Due Today</p>
      </div>
    </div>
  );
};

export default NotificationBadge;
