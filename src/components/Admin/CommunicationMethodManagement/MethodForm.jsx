import React, { useState, useEffect } from "react";
import "../../../styles/AdminModule.css";

const MethodForm = ({ onSubmit, selectedMethod, companyId }) => {
  const defaultMethods = [
    { id: "1", name: "LinkedIn Post" },
    { id: "2", name: "LinkedIn Message" },
    { id: "3", name: "Email" },
    { id: "4", name: "Phone Call" },
    { id: "5", name: "Other", isOther: true }, // "Other" method with isOther flag
  ];

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    sequence: defaultMethods,
    mandatory: false,
    otherName: "", // Store the name of the "Other" method
  });

  const [selectedIndex, setSelectedIndex] = useState(null); // To track the first selected item

  useEffect(() => {
    if (selectedMethod) {
      setFormState({
        ...selectedMethod,
        sequence: selectedMethod.sequence || defaultMethods,
      });
    }
  }, [selectedMethod]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formState, companyId }); // Pass companyId when submitting the method
    setFormState({
      name: "",
      description: "",
      sequence: defaultMethods,
      mandatory: false,
      otherName: "",
    });
  };  

  // Function to swap two items in the sequence array
  const swapItems = (index1, index2) => {
    const updatedSequence = [...formState.sequence];
    const temp = updatedSequence[index1];
    updatedSequence[index1] = updatedSequence[index2];
    updatedSequence[index2] = temp;
    setFormState((prev) => ({
      ...prev,
      sequence: updatedSequence,
    }));
  };

  const handleItemClick = (index, e) => {
    // Prevent the event from triggering a swap when clicking on the input field
    if (e.target.tagName === "INPUT") return;

    if (selectedIndex === null) {
      // Select the first item to swap
      setSelectedIndex(index);
    } else {
      // Swap with the selected item and reset selected index
      if (selectedIndex !== index) {
        swapItems(selectedIndex, index);
      }
      setSelectedIndex(null); // Reset the selected index after swapping
    }
  };

  // Handle changes in the "Other" method name
  const handleOtherChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      otherName: e.target.value,
    }));
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Method Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formState.name}
          onChange={handleChange}
          placeholder="Enter Method Name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formState.description}
          onChange={handleChange}
          placeholder="Enter Description"
        ></textarea>
      </div>
      <div className="form-group">
        <label>Sequence (Click to Swap)</label>
        <ul style={styles.list}>
          {formState.sequence.map((item, index) => (
            <li
              key={item.id}
              onClick={(e) => handleItemClick(index, e)} // Handle click to swap
              style={{
                ...styles.item,
                backgroundColor: selectedIndex === index ? "#d3d3d3" : "#f9f9f9", // Highlight selected item
              }}
            >
              {item.name}
              {item.isOther && selectedIndex === index && (
                <div style={styles.otherInputContainer}>
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={formState.otherName}
                    onChange={handleOtherChange}
                    style={styles.otherInput}
                    onClick={(e) => e.stopPropagation()} // Prevent the click from propagating to the parent <li>
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="mandatory"
            checked={formState.mandatory}
            onChange={handleChange}
          />
          Mandatory
        </label>
      </div>
      <button type="submit" className="primary">
        Save
      </button>
    </form>
  );
};

const styles = {
  list: {
    padding: 0,
    listStyle: "none",
    margin: 0,
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  item: {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
  },
  otherInputContainer: {
    marginTop: "10px",
  },
  otherInput: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
};

export default MethodForm;
