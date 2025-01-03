// Helper function to read data from localStorage
const readDataFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : []; // Return parsed data if it exists, else return empty array
};

// Helper function to write data to localStorage
const writeDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data, null, 2)); // Save data in a readable format
};

// Get all communication methods for a specific company
export const getMethods = async (companyId) => {
  const companies = readDataFromLocalStorage('companies');
  const company = companies.find((company) => company.id === companyId);

  if (company) {
    return company.communicationDetails || []; // Return communication methods for that company
  }
  return []; // Return empty array if company not found
};

// Add a new communication method for a specific company
export const addMethod = async (companyId, method) => {
  const companies = readDataFromLocalStorage('companies');
  const company = companies.find((company) => company.id === companyId);

  if (company) {
    method.id = Date.now(); // Generate unique ID using Date.now()
    company.communicationDetails = company.communicationDetails || [];
    company.communicationDetails.push(method); // Add the method to the company's communication details
    writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
  } else {
    console.error("Company not found for adding method");
  }
};

// Add user communication details inside the company object
export const addUserCommunication = (companyId, userId, communicationMethod) => {
  const companies = readDataFromLocalStorage('companies');
  const company = companies.find((company) => company.id === companyId);

  if (company) {
    // Add user communications field if it doesn't exist
    company.userCommunications = company.userCommunications || [];

    const userCommIndex = company.userCommunications.findIndex(
      (userComm) => userComm.userId === userId
    );

    if (userCommIndex !== -1) {
      // If user communication record exists, update it with the new communication attempt
      company.userCommunications[userCommIndex].communications.push({
        ...communicationMethod,
        userId, // Add userId to the communication record
        date: new Date().toLocaleDateString(),
      });
    } else {
      // Create a new user communication record if it doesn't exist
      company.userCommunications.push({
        userId,
        communications: [
          {
            ...communicationMethod,
            userId,
            date: new Date().toLocaleDateString(),
          },
        ],
      });
    }

    writeDataToLocalStorage('companies', companies); // Save updated companies with user communications back to localStorage
  } else {
    console.error("Company not found for adding user communication");
  }
};

// Update an existing communication method for a specific company
export const updateMethod = async (companyId, updatedMethod) => {
  const companies = readDataFromLocalStorage('companies');
  const company = companies.find((company) => company.id === companyId);

  if (company) {
    const index = company.communicationDetails.findIndex((method) => method.id === updatedMethod.id);
    if (index !== -1) {
      company.communicationDetails[index] = updatedMethod; // Replace old method with updated one
      writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
    } else {
      console.error("Method not found for update");
    }
  } else {
    console.error("Company not found for updating method");
  }
};

// Delete a communication method for a specific company
export const deleteMethod = async (companyId, id) => {
  const companies = readDataFromLocalStorage('companies');
  const company = companies.find((company) => company.id === companyId);

  if (company) {
    const index = company.communicationDetails.findIndex((method) => method.id === id);
    if (index !== -1) {
      company.communicationDetails.splice(index, 1); // Remove the method from the company's details
      writeDataToLocalStorage('companies', companies); // Save updated companies back to localStorage
    } else {
      console.error("Method not found for deletion");
    }
  } else {
    console.error("Company not found for deleting method");
  }
};
