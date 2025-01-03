import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import CompanyCard from "./CompanyCard";
import { getCompanies } from "../../services/companyService";
import "../../styles/UserModule.css";
import Navbar from "./Navbar";

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [highlightDisabled, setHighlightDisabled] = useState({});
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [hoveredCommunication, setHoveredCommunication] = useState(null);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCompanies = await getCompanies();
      const companiesWithCommunications = await Promise.all(
        fetchedCompanies.map((company) => ({
          ...company,
          communicationDetails: company.communicationDetails || [],
          communications: company.communications || [],
          scheduledCommunications: company.scheduledCommunications || [],
        }))
      );
      setCompanies(companiesWithCommunications);
    };
    fetchData();
  }, []);

  const getLastFiveCommunications = (communications = []) => {
    return communications.slice(-5).map((comm) => ({
      _id: comm.id,
      communicationDate: comm.date,
      method: comm.name,
      notes: comm.description,
    }));
  };

  const toggleCompanySelection = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]
    );
  };

  const toggleHighlight = (companyId) => {
    setHighlightDisabled((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const handleLogCommunication = (companyId) => {
    const selectedCompany = companies.find((company) => company.id === companyId);
  
    // Check if communication methods are available
    if (!selectedCompany || !selectedCompany.communicationDetails || selectedCompany.communicationDetails.length === 0) {
      alert("No communication method added for this company.");
      return;
    }
  
    setIsScheduling(false); // Not scheduling, only logging
    setCurrentCompany(companyId);
    setSelectedType(""); // Reset selected type for logging
    setDescription(""); // Reset description for logging
    setOpenModal(true);
  };
  

  const handleScheduleCommunication = (companyId) => {
    const selectedCompany = companies.find((company) => company.id === companyId);
    if (!selectedCompany || !selectedCompany.communicationDetails) {
      alert("No communication sequence available for this company.");
      return;
    }

    const scheduledComms = selectedCompany.scheduledCommunications;

    if (scheduledComms.length >= 2) {
      setErrorMessage(
        "You can only schedule up to 2 communications. Please complete or cancel an existing one."
      );
    } else {
      setErrorMessage(""); // Clear any previous error messages
    }

    setIsScheduling(true); // Enable scheduling mode
    setCurrentCompany(companyId);
    setSelectedType(""); // Reset selected type for scheduling
    setSelectedDate(""); // Reset selected date for scheduling
    setOpenModal(true); // Open the modal for scheduling
  };

  const handleModalSubmit = () => {
    if (!selectedType || (isScheduling && !selectedDate) || (!isScheduling && !description)) {
      alert("All fields are required.");
      return;
    }
  
    const newCommunication = {
      name: selectedType,
      description: isScheduling ? "Scheduled Communication" : description,
      date: isScheduling ? selectedDate : new Date().toLocaleDateString(),
    };
  
    const updatedCompanies = companies.map((company) =>
      company.id === currentCompany
        ? {
            ...company,
            scheduledCommunications: isScheduling
              ? [...company.scheduledCommunications, newCommunication]
              : company.scheduledCommunications,
            communications: !isScheduling
              ? [newCommunication, ...company.communications]
              : company.communications,
          }
        : company
    );
  
    // Update companies in local storage
    localStorage.setItem("companies", JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
  
    if (isScheduling) {
      // Retrieve existing notifications or initialize categories
      const storedNotifications =
        JSON.parse(localStorage.getItem("notifications")) || {
          overdue: [],
          dueToday: [],
          upcoming: [],
        };
  
      // Create new notification
      const newNotification = {
        companyId: currentCompany,
        type: selectedType,
        date: selectedDate,
        dismissed: false,
      };
  
      // Categorize notification
      const today = new Date().toISOString().split("T")[0];
      const notificationDate = new Date(selectedDate);
      const category =
        notificationDate < new Date(today)
          ? "overdue"
          : notificationDate.toISOString().split("T")[0] === today
          ? "dueToday"
          : "upcoming";
  
      // Add the new notification to the relevant category
      storedNotifications[category] = [...storedNotifications[category], newNotification];
  
      // Save updated notifications back to local storage
      localStorage.setItem("notifications", JSON.stringify(storedNotifications));
  
      // Dispatch custom event to update Navbar
      const event = new CustomEvent("notificationUpdated", {
        detail: storedNotifications,
      });
      window.dispatchEvent(event);
    }
  
    // Reset modal state
    setOpenModal(false);
    setSelectedType("");
    setDescription("");
    setSelectedDate("");
  };
  

  const handleCancelNext = (companyId, scheduledId) => {
    // Find the company whose scheduled communication needs to be cancelled
    const updatedCompanies = companies.map((company) =>
      company.id === companyId
        ? {
            ...company,
            // Filter out the specific scheduled communication by its ID
            scheduledCommunications: company.scheduledCommunications.filter(
              (scheduled) => scheduled.id !== scheduledId
            ),
          }
        : company
    );
  
    // Save the updated companies list in local storage
    localStorage.setItem("companies", JSON.stringify(updatedCompanies));
    setCompanies(updatedCompanies);
  
    // Remove the corresponding notification
    const storedNotifications =
      JSON.parse(localStorage.getItem("notifications")) || {
        overdue: [],
        dueToday: [],
        upcoming: [],
      };
  
    // Filter the relevant notification categories
    const updatedNotifications = {
      overdue: storedNotifications.overdue.filter(
        (notification) => notification.scheduledId !== scheduledId
      ),
      dueToday: storedNotifications.dueToday.filter(
        (notification) => notification.scheduledId !== scheduledId
      ),
      upcoming: storedNotifications.upcoming.filter(
        (notification) => notification.scheduledId !== scheduledId
      ),
    };
  
    // Save the updated notifications back to local storage
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  
    // Optionally dispatch event to update UI
    const event = new CustomEvent("notificationUpdated", {
      detail: updatedNotifications,
    });
    window.dispatchEvent(event);
  };  
  
  

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }} className="user-dashboard">
      
      <Grid container direction="column" className="grid-cols-1">
  {companies.length === 0 ? (
    <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
      No companies added
    </Typography>
  ) : (
    companies.map((company) => (
      <CompanyCard
        key={company.id}
        company={company}
        isSelected={selectedCompanies.includes(company.id)}
        highlightDisabled={highlightDisabled}
        lastFiveDates={getLastFiveCommunications(company.communications)}
        onToggleSelection={() => toggleCompanySelection(company.id)}
        onToggleHighlight={() => toggleHighlight(company.id)}
        onScheduleNext={() => handleScheduleCommunication(company.id)}
        onLogCommunication={() => handleLogCommunication(company.id)}
        onCancelNext={handleCancelNext}
      />
    ))
  )}
</Grid>


      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{isScheduling ? "Schedule Communication" : "Select Communication"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Communication Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={!!errorMessage}
              
            >
              {companies
                .find((company) => company.id === currentCompany)
                ?.communicationDetails.flatMap((comm) =>
                  comm.sequence.map((seq) => (
                    <MenuItem key={seq.id} value={seq.name}>
                      {seq.name}
                    </MenuItem>
                  ))
                )}
            </Select>
          </FormControl>

          {isScheduling && (
            <TextField
              margin="dense"
              label="Scheduled Date"
              type="date"
              fullWidth
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={!!errorMessage}
            />
          )}

          {!isScheduling && (
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!!errorMessage}
            />
          )}

          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleModalSubmit} disabled={!!errorMessage || !selectedType}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDashboard;
