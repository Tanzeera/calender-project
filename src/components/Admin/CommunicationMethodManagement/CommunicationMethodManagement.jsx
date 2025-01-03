import React, { useState, useEffect } from "react";
import MethodForm from "./MethodForm";
import MethodList from "./MethodList";
import "../../../styles/AdminModule.css";
import { getMethods, updateMethod, addMethod, deleteMethod } from "../../../services/communicationMethodService";

const CommunicationMethodManagement = ({ companyId }) => { // Add companyId as a prop
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    let data = await getMethods(companyId); // Pass companyId to fetch methods for the specific company
    if (data.length === 0) {
      data = await getMethods(companyId); // Retry fetch if no data is returned
    }
    setMethods(data);
  };
  
  const handleAddOrUpdate = async (method) => {
    if (method.id) {
      await updateMethod(companyId, method); // Pass companyId to update the method for the company
    } else {
      await addMethod(companyId, method); // Pass companyId to add the method to the company
    }
    fetchMethods(); // Refresh methods list
    setSelectedMethod(null);
    setIsModalOpen(false);
  };
  
  const handleDelete = async (id) => {
    await deleteMethod(companyId, id); // Pass companyId to delete the method for the company
    fetchMethods(); // Refresh methods list
  };

  const handleAddMethod = () => {
    setSelectedMethod(null);
    setIsModalOpen(true);
  };

  const handleEditMethod = (method) => {
    setSelectedMethod(method);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMethod(null);
    setIsModalOpen(false);
  };

  return (
    <div className="communication-method-management">
      <div className="header-row">
        <h3 className="card-title">Communication Method Management</h3>
        <button className="primary" onClick={handleAddMethod}>
          Add Communication Method
        </button>
      </div>
      <div className="card-content">
        <MethodList
          methods={methods}
          onEdit={handleEditMethod}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              ×
            </button>
            <MethodForm
              companyId={companyId}  // Pass companyId here
              onSubmit={handleAddOrUpdate}
              selectedMethod={selectedMethod}
              clearSelection={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationMethodManagement;
