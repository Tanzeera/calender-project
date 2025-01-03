import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCompanies } from '../../services/companyService';
import '../../styles/Calender.css';
// Localizer using moment.js
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [selectedView, setSelectedView] = useState('month');
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch company data asynchronously
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCompanies = await getCompanies();
        console.log("Fetched Companies: ", fetchedCompanies);

        // Process the fetched companies and add communication details
        const companiesWithCommunications = await Promise.all(
          fetchedCompanies.map((company) => ({
            ...company,
            communicationDetails: company.communicationDetails || [],
            communications: company.communications || [],
            scheduledCommunications: company.scheduledCommunications || [],
          }))
        );

        // Extract communications and scheduled communications for calendar events
        const allCommunications = companiesWithCommunications.flatMap((company) => {
          const communications = company.communications || [];
          const scheduledCommunications = company.scheduledCommunications || [];

          // Map all communications to be "previously communicated" (black)
          const formattedCommunications = communications.map((comm) => {
            // Ensure that the date is parsed correctly using moment and fallback to a default date if invalid
            const startDate = moment(comm.date, 'YYYY-MM-DD', true).isValid()
              ? moment(comm.date, 'YYYY-MM-DD').toDate()
              : new Date(); // Fallback to current date if invalid
            const endDate = moment(startDate).add(30, 'minutes').toDate(); // Ensure a small duration

            return {
              title: `${comm.name}: ${comm.description}`,
              start: startDate,
              end: endDate,
              type: 'previous',
              communicationType: comm.name,
              backgroundColor: '#000000', // Set communications to black
            };
          });

          // Map scheduled communications to red, yellow, or blue based on date
          const formattedScheduledEvents = scheduledCommunications.map((comm) => {
            const eventDate = moment(comm.date, 'YYYY-MM-DD', true).isValid()
              ? moment(comm.date, 'YYYY-MM-DD').toDate()
              : new Date(); // Fallback to current date if invalid
            const today = moment().toDate();
            let backgroundColor = '#4A5568'; // Default gray for past events

            // Determine the color based on the event date
            if (eventDate < today) {
              backgroundColor = '#EF4444'; // Red for overdue
            } else if (eventDate.toDateString() === today.toDateString()) {
              backgroundColor = '#F59E0B'; // Yellow for today
            } else {
              backgroundColor = '#2B6CB0'; // Blue for upcoming
            }

            return {
              title: `${comm.name}: ${comm.description}`,
              start: eventDate,
              end: eventDate,
              type: 'upcoming', // Keep it as scheduled
              communicationType: comm.name,
              backgroundColor, // Dynamically set background color for scheduled events
            };
          });

          return [...formattedCommunications, ...formattedScheduledEvents];
        });

        console.log("All Communications: ", allCommunications);
        setEvents(allCommunications);
      } catch (error) {
        console.error("Error fetching companies or communications: ", error);
      }
    };

    fetchData();
  }, []);

  // Event Style Getter for different event types
  const eventStyleGetter = (event) => {
    let backgroundColor = event.backgroundColor || '#4A5568'; // default gray

    if (event.type === 'previous') {
      backgroundColor = '#000000'; // black for previous communications
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: 'white',
        border: 'none',
        display: 'block',
        padding: '2px 5px',
        cursor: 'pointer',
      },
    };
  };

  // Handle navigation and change of views
  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleNavigate = (direction) => {
    const newDate = moment(selectedDate).add(direction === 'back' ? -1 : 1, 'month').toDate();
    setSelectedDate(newDate); // Update selectedDate to trigger calendar update
  };

  return (
    <Box sx={{ padding: 3, marginTop: '20px' }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Calendar View
          </Typography>
          <IconButton color="inherit" onClick={() => handleNavigate('back')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" sx={{ paddingLeft: 2, paddingRight: 2 }}>
            {moment(selectedDate).format('MMMM YYYY')}
          </Typography>
          <IconButton color="inherit" onClick={() => handleNavigate('forward')}>
            <ArrowForwardIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Legend for event color meanings */}
      <Box sx={{ marginTop: 3, padding: 2, backgroundColor: '#f1f1f1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#EF4444', borderRadius: '50%', marginRight: 2 }} />
          <Typography variant="body1">Overdue</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#F59E0B', borderRadius: '50%', marginRight: 2 }} />
          <Typography variant="body1">Due Today</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#2B6CB0', borderRadius: '50%', marginRight: 2 }} />
          <Typography variant="body1">Upcoming</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#000000', borderRadius: '50%', marginRight: 2 }} />
          <Typography variant="body1">Previously Made</Typography>
        </Box>
      </Box>

      {/* Calendar Component */}
      <div style={{ marginTop: '20px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          view={selectedView}
          onView={handleViewChange}
          date={selectedDate} // Use date instead of defaultDate
          onNavigate={(date) => setSelectedDate(date)} // Update the date when calendar is navigated
          min={new Date('2000-01-01')} // Set minimum date for calendar
          max={new Date('2100-01-01')} // Set maximum date for calendar
        />
      </div>

    </Box>
  );
};

export default CalendarView;
