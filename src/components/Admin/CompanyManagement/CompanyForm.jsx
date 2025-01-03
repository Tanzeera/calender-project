import React, { useState, useEffect } from "react";
import "../../../styles/AdminModule.css";

const CompanyForm = ({ onSubmit, selectedCompany }) => {
  const [company, setCompany] = useState({
    name: "",
    location: "",
    linkedIn: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    communicationPeriodicity: "",
  });

  useEffect(() => {
    if (selectedCompany) {
      setCompany({
        ...selectedCompany,
        emails: selectedCompany.emails.join(", "),
        phoneNumbers: selectedCompany.phoneNumbers.join(", "),
      });
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedCompany = {
      ...company,
      emails: company.emails.split(",").map((email) => email.trim()),
      phoneNumbers: company.phoneNumbers.split(",").map((phone) => phone.trim()),
    };
    onSubmit(formattedCompany);
    setCompany({
      name: "",
      location: "",
      linkedIn: "",
      emails: "",
      phoneNumbers: "",
      comments: "",
      communicationPeriodicity: "",
    });
  };

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3 className="card-title">{selectedCompany ? "Edit Company" : "Add Company"}</h3>
      </div>
      <div className="card-content">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={company.name}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-input"
            value={company.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="linkedIn" className="form-label">LinkedIn URL</label>
          <input
            type="url"
            id="linkedIn"
            name="linkedIn"
            className="form-input"
            value={company.linkedIn}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emails" className="form-label">Emails (comma-separated)</label>
          <input
            type="text"
            id="emails"
            name="emails"
            className="form-input"
            value={company.emails}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumbers" className="form-label">Phone Numbers (comma-separated)</label>
          <input
            type="text"
            id="phoneNumbers"
            name="phoneNumbers"
            className="form-input"
            value={company.phoneNumbers}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments" className="form-label">Comments</label>
          <textarea
            id="comments"
            name="comments"
            className="form-input form-textarea"
            value={company.comments}
            onChange={handleChange}
            placeholder="Additional Notes"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="communicationPeriodicity" className="form-label">Communication Periodicity</label>
          <input
            type="text"
            id="communicationPeriodicity"
            name="communicationPeriodicity"
            className="form-input"
            value={company.communicationPeriodicity}
            onChange={handleChange}
            placeholder="e.g., Every 2 weeks"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {selectedCompany ? "Update" : "Add"} Company
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
