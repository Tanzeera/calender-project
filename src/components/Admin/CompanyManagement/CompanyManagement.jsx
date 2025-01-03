import React, { useState, useEffect } from "react";
import CompanyList from "./CompanyList";
import CompanyForm from "./CompanyForm";
import CommunicationMethodManagement from "../CommunicationMethodManagement/CommunicationMethodManagement";

import "../../../styles/AdminModule.css";
import {
  getCompanies,
  updateCompany,
  addCompany,
  deleteCompany,
} from "../../../services/companyService";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleAddOrUpdate = async (company) => {
    try {
      if (company.id) {
        await updateCompany(company);
      } else {
        await addCompany(company);
      }
      fetchCompanies();
      setSelectedCompany(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating company:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleOpenCommunicationMethods = (companyId) => {
    setSelectedCompanyId(companyId);
    setIsCommunicationModalOpen(true);
  };

  const handleCloseCommunicationModal = () => {
    setIsCommunicationModalOpen(false);
    setSelectedCompanyId(null);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };

  return (
    <div className="company-management-container">
      <header className="header">
        <h2>Admin Module</h2>
      </header>
      <main className="body-content">
        <CompanyList
          companies={companies}
          onEdit={handleEditCompany}
          onDelete={handleDelete}
          handleAddCompany={handleAddCompany}
          handleOpenCommunicationMethods={handleOpenCommunicationMethods}
        />

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
              <CompanyForm
                onSubmit={handleAddOrUpdate}
                selectedCompany={selectedCompany}
              />
            </div>
          </div>
        )}

        {isCommunicationModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="close-btn"
                onClick={handleCloseCommunicationModal}
              >
                ×
              </button>
              <CommunicationMethodManagement companyId={selectedCompanyId} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyManagement;
