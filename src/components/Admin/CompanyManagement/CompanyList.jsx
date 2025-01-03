import React from "react";
import "../../../styles/AdminModule.css";

const CompanyList = ({ companies, onEdit, onDelete, handleAddCompany, handleOpenCommunicationMethods}) => {
  return (
    <div className="admin-card">
      <div className="header-row">
        <h3 className="card-title">Company Management</h3>
        <button className="primary" onClick={handleAddCompany}>
          Add Company
        </button>
      </div>
      <div className="card-content">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>LinkedIn</th>
              <th>Emails</th>
              <th>Phone Numbers</th>
              <th>Comments</th>
              <th>Communication Periodicity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.location}</td>
                <td>
                  <a href={company.linkedIn} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </td>
                <td>{company.emails.join(", ")}</td>
                <td>{company.phoneNumbers.join(", ")}</td>
                <td>{company.comments}</td>
                <td>{company.communicationPeriodicity}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => onEdit(company)}>
                    Edit
                  </button>
                  <button className="btn btn-primary" onClick={() => handleOpenCommunicationMethods(company.id)}>
                  Communication Methods
                  </button>                 
             <button className="btn btn-danger" onClick={() => onDelete(company.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
