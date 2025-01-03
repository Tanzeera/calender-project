
const readDataFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : []; 
};

// Helper function to write data to localStorage
const writeDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data, null, 2)); // Save data in a readable format
};

// Get all companies
export const getCompanies = async () => {
  return readDataFromLocalStorage('companies'); // Fetch companies from localStorage
};

// Update communication details for the specific company
export const updateCompanyCommunicationDetails = async (companyId, communicationDetails) => {
  const companies = readDataFromLocalStorage('companies');
  const companyIndex = companies.findIndex((company) => company.id === companyId);

  if (companyIndex !== -1) {
    const company = companies[companyIndex];
    company.communicationDetails = communicationDetails; // Update communication details
    companies[companyIndex] = company; // Update the company in the array
    writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
  } else {
    console.error("Company not found for updating communication details");
  }
};

// Add a new company
export const addCompany = async (company) => {
  const companies = readDataFromLocalStorage('companies');
  company.id = Date.now(); // Generate unique ID using Date.now()
  companies.push(company); // Add the new company to the array
  writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
};

// Update an existing company
export const updateCompany = async (updatedCompany) => {
  const companies = readDataFromLocalStorage('companies');
  const index = companies.findIndex((company) => company.id === updatedCompany.id);
  if (index !== -1) {
    companies[index] = updatedCompany; // Replace old company with updated one
    writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
  } else {
    console.error("Company not found for update");
  }
};

// Delete a company
export const deleteCompany = async (id) => {
  const companies = readDataFromLocalStorage('companies');
  const index = companies.findIndex((company) => company.id === id);
  if (index !== -1) {
    companies.splice(index, 1); // Remove the company from the array
    writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
  } else {
    console.error("Company not found for deletion");
  }
};
