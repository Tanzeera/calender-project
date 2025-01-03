import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Badge, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCompanies } from '../../services/companyService'; // Adjust the import if needed

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    overdue: [],
    dueToday: [],
    upcoming: [],
  });

  // Function to handle closing a notification (dismiss)
  const handleCloseNotification = (type, index) => {
    const updatedNotifications = { ...notifications };
    updatedNotifications[type][index].dismissed = true; // Mark the notification as dismissed
    setNotifications(updatedNotifications);
    updateLocalStorage(updatedNotifications); // Update the local storage
        // Dispatch a custom event to notify other components
    const event = new CustomEvent('notificationUpdated', { detail: updatedNotifications });
    window.dispatchEvent(event); // Broadcast the event
  };

  // Function to update notifications in local storage
  const updateLocalStorage = (updatedNotifications) => {
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // Fetch and process notifications from local storage or from API
  useEffect(() => {
    const fetchData = async () => {
      let storedNotifications = localStorage.getItem('notifications');

      if (storedNotifications) {
        // If notifications exist in local storage, use them
        storedNotifications = JSON.parse(storedNotifications);
        setNotifications(storedNotifications);
      } else {
        // If no notifications in local storage, fetch from API
        const companies = await getCompanies();
        console.log('Fetched Companies: ', companies);

        // Calculate overdue, due today, and upcoming notifications
        const overdue = [];
        const dueToday = [];
        const upcoming = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        companies.forEach((company) => {
          const scheduledCommunications = company.scheduledCommunications;

          scheduledCommunications.forEach((comm) => {
            const commDate = new Date(comm.date);
            commDate.setHours(0, 0, 0, 0); // Normalize to midnight

            // Overdue logic: If the communication date is earlier than today
            if (commDate < today) {
              overdue.push({
                company: company,
                commDate: commDate,
                comm: comm,
                dismissed: false, // Add dismissed flag
              });
            }
            // Due today logic: If the communication date is today
            else if (
              commDate.getFullYear() === today.getFullYear() &&
              commDate.getMonth() === today.getMonth() &&
              commDate.getDate() === today.getDate()
            ) {
              dueToday.push({
                company: company,
                commDate: commDate,
                comm: comm,
                dismissed: false, // Add dismissed flag
              });
            }
            // Upcoming logic: If the communication date is in the future
            else if (commDate > today) {
              upcoming.push({
                company: company,
                commDate: commDate,
                comm: comm,
                dismissed: false, // Add dismissed flag
              });
            }
          });
        });

        const newNotifications = { overdue, dueToday, upcoming };
        setNotifications(newNotifications);
        updateLocalStorage(newNotifications); // Save new notifications to local storage
      }
    };

    fetchData();
  }, []);

  // Calculate total count of non-dismissed notifications
  const totalCount = [
    ...notifications.overdue.filter((notification) => !notification.dismissed),
    ...notifications.dueToday.filter((notification) => !notification.dismissed),
    ...notifications.upcoming.filter((notification) => !notification.dismissed),
  ].length;

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ position: 'relative', padding: 3, borderRadius: 2, boxShadow: 2 }}>
        {/* {totalCount > 0 && (
          <Badge
            badgeContent={totalCount}
            color="error"
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              fontSize: 14,
            }}
          />
        )} */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Notifications
          {notifications.overdue.length > 0 && (
            <Typography
              variant="caption"
              sx={{
                backgroundColor: '#f44336',
                color: '#fff',
                borderRadius: '12px',
                padding: '2px 8px',
                ml: 2,
              }}
            >
              {notifications.overdue.filter((n) => !n.dismissed).length} overdue
            </Typography>
          )}
        </Typography>

        <Grid container spacing={3}>
          {/* Overdue Notifications */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2, backgroundColor: '#ffe6e6', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 2 }}>
                Overdue Communications ({notifications.overdue.filter((n) => !n.dismissed).length})
              </Typography>
              <List>
                {notifications.overdue.map(
                  (notification, index) =>
                    !notification.dismissed && (
                      <ListItem
                        key={index}
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          boxShadow: 1,
                          marginBottom: 1,
                          '&:hover': { boxShadow: 3 },
                        }}
                      >
                        <ListItemText
                          primary={notification.company?.name || 'Unknown Company'}
                          secondary={
                            <>
                              <Typography variant="body2" color="textSecondary">
                                Due Date: {new Date(notification.commDate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Communication: {notification.comm?.name || 'Unknown Communication'}
                              </Typography>
                              <div style={{ marginTop: '4px' }}>
                                <Typography variant="body2" color="textSecondary">
                                  Description: {notification.comm?.description || 'No description available'}
                                </Typography>
                              </div>
                            </>
                          }
                        />
                        <IconButton
                          edge="end"
                          aria-label="close"
                          onClick={() => handleCloseNotification('overdue', index)}
                          sx={{ marginLeft: 'auto' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    )
                )}
              </List>
            </Paper>
          </Grid>

          {/* Due Today Notifications */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                Today's Communications ({notifications.dueToday.filter((n) => !n.dismissed).length})
              </Typography>
              <List>
                {notifications.dueToday.map(
                  (notification, index) =>
                    !notification.dismissed && (
                      <ListItem
                        key={index}
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          boxShadow: 1,
                          marginBottom: 1,
                          '&:hover': { boxShadow: 3 },
                        }}
                      >
                        <ListItemText
                          primary={notification.company?.name || 'Unknown Company'}
                          secondary={
                            <>
                              <Typography variant="body2" color="textSecondary">
                                Due Date: {new Date(notification.commDate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Communication: {notification.comm?.name || 'Unknown Communication'}
                              </Typography>
                              <div style={{ marginTop: '4px' }}>
                                <Typography variant="body2" color="textSecondary">
                                  Description: {notification.comm?.description || 'No description available'}
                                </Typography>
                              </div>
                            </>
                          }
                        />
                        <IconButton
                          edge="end"
                          aria-label="close"
                          onClick={() => handleCloseNotification('dueToday', index)}
                          sx={{ marginLeft: 'auto' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    )
                )}
              </List>
            </Paper>
          </Grid>

          {/* Upcoming Notifications */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#388e3c', mb: 2 }}>
                Upcoming Communications ({notifications.upcoming.filter((n) => !n.dismissed).length})
              </Typography>
              <List>
                {notifications.upcoming.map(
                  (notification, index) =>
                    !notification.dismissed && (
                      <ListItem
                        key={index}
                        sx={{
                          backgroundColor: '#fff',
                          borderRadius: 1,
                          boxShadow: 1,
                          marginBottom: 1,
                          '&:hover': { boxShadow: 3 },
                        }}
                      >
                        <ListItemText
                          primary={notification.company?.name || 'Unknown Company'}
                          secondary={
                            <>
                              <Typography variant="body2" color="textSecondary">
                                Due Date: {new Date(notification.commDate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Communication: {notification.comm?.name || 'Unknown Communication'}
                              </Typography>
                              <div style={{ marginTop: '4px' }}>
                                <Typography variant="body2" color="textSecondary">
                                  Description: {notification.comm?.description || 'No description available'}
                                </Typography>
                              </div>
                            </>
                          }
                        />
                        <IconButton
                          edge="end"
                          aria-label="close"
                          onClick={() => handleCloseNotification('upcoming', index)}
                          sx={{ marginLeft: 'auto' }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </ListItem>
                    )
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Notifications;
