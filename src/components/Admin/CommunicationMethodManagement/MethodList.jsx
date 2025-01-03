import React from "react";
import "../../../styles/AdminModule.css"; // Importing the CSS

const MethodList = ({ methods, onEdit, onDelete }) => {
  console.log("Methods received:", methods); // Debugging statement
  console.log("Methods in localStorage:", localStorage.getItem("methods"));

  return (
    <div className="card-content">
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Sequence</th>
              <th>Mandatory</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {methods.length > 0 ? (
              methods.map((method) => (
                <tr key={method.id}>
                  <td>{method.name}</td>
                  <td>{method.description}</td>
                  <td>
                    {/* Check if sequence is an array before calling map */}
                    {Array.isArray(method.sequence)
                      ? method.sequence.map((seq) => seq.name).join(", ")
                      : "No sequence available"}
                  </td>
                  <td>{method.mandatory ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => onEdit(method)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(method.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No communication methods available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MethodList;
