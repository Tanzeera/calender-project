import axios from "axios";

const API_BASE_URL = "https://api.example.com";

// Fetch companies assigned to the user
export const getCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

// Fetch communications for a specific company
export const getCommunications = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies/${companyId}/communications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching communications:", error);
    throw error;
  }
};

// Log a new communication for a company
export const logCommunication = async (companyId, communicationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/companies/${companyId}/communications`, communicationData);
    return response.data;
  } catch (error) {
    console.error("Error logging communication:", error);
    throw error;
  }
};
