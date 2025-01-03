import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation(); // Get the current location

  // Fetch notifications from local storage and calculate the count
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || {
      overdue: [],
      dueToday: [],
      upcoming: [],
    };

    const totalCount = [
      ...storedNotifications.overdue.filter((notification) => !notification.dismissed),
      ...storedNotifications.dueToday.filter((notification) => !notification.dismissed),
      ...storedNotifications.upcoming.filter((notification) => !notification.dismissed),
    ].length;

    setNotificationCount(totalCount);

    // Listen for notification updates
    const handleNotificationUpdate = (event) => {
      const updatedNotifications = event.detail;
      const updatedCount = [
        ...updatedNotifications.overdue.filter((notification) => !notification.dismissed),
        ...updatedNotifications.dueToday.filter((notification) => !notification.dismissed),
        ...updatedNotifications.upcoming.filter((notification) => !notification.dismissed),
      ].length;

      setNotificationCount(updatedCount);
    };

    window.addEventListener("notificationUpdated", handleNotificationUpdate);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("notificationUpdated", handleNotificationUpdate);
    };
  }, []);

  // Helper function to determine if the current route matches the icon's route
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1C4E80" }}>
      <Toolbar>
        {/* Brand Name */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User Dashboard
        </Typography>

        {/* Navigation Tabs */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            component={Link}
            to="/user/dashboard"
            color={isActive("/user/dashboard") ? "primary" : "inherit"} // Highlight active tab
            sx={{ marginLeft: 2 }}
          >
            <HomeIcon />
            <Typography
              variant="body1"
              sx={{
                marginLeft: 1,
                color: isActive("/user/dashboard") ? "white" : "inherit", // White text when active
              }}
            >
              Dashboard
            </Typography>
          </IconButton>

          <IconButton
            component={Link}
            to="/user/calendar"
            color={isActive("/user/calendar") ? "primary" : "inherit"} // Highlight active tab
            sx={{ marginLeft: 2 }}
          >
            <CalendarIcon />
            <Typography
              variant="body1"
              sx={{
                marginLeft: 1,
                color: isActive("/user/calendar") ? "white" : "inherit", // White text when active
              }}
            >
              Calendar
            </Typography>
          </IconButton>

          <IconButton
            component={Link}
            to="/user/notifications"
            color={isActive("/user/notifications") ? "primary" : "inherit"} // Highlight active tab
            sx={{ marginLeft: 2 }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography
              variant="body1"
              sx={{
                marginLeft: 1,
                color: isActive("/user/notifications") ? "white" : "inherit", // White text when active
              }}
            >
              Notifications
            </Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
