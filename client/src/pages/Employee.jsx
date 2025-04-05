import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employee.css";
import { BASE_URL } from "../config";

export const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    search: '',
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const filteredEmployees = employees.filter((employee) => {
    const matchesPosition = filters.position ? employee.position === filters.position : true;
  
    const searchText = filters.search.toLowerCase();
    const matchesSearch =
      employee.fullName.toLowerCase().includes(searchText) ||
      employee.email.toLowerCase().includes(searchText) ||
      employee.phoneNumber.includes(searchText);
  
    return matchesPosition && matchesSearch;
  });
  
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employees`, {
        withCredentials: true,
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  };

  
  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setShowModal(true);
  };

 
  const handleSave = async () => {
    if (!editEmployee) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/employees/${editEmployee._id}`,
        editEmployee,
        {
          withCredentials: true,
        }
      );

      // Update employees list with the edited employee
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === response.data._id ? response.data : emp
        )
      );

      setShowModal(false); // Close modal after saving
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/employees/${id}`, {
        withCredentials: true,
      });
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp._id !== id)
      );
      setShowActionMenu(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="employees-container">
    <div className="filter-section">
        <div style={{ display: "flex", gap: "20px" }}>

          <select
            name="position"
            className="dropdown"
            value={filters.position} onChange={handleFilterChange}
          >
            <label>Internal</label>
            <option>Full Time</option>
            <option>Junior</option>
            <option>Senior</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />

          
        </div>
      </div>
      
      <table className="employees-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.fullName}</td>
              <td>{employee.email}</td>
              <td>{employee.phoneNumber}</td>
              <td>{employee.position}</td>
              <td>{employee.department || "N/A"}</td>
              <td>{formatDate(employee.date_of_joining)}</td>
              <td>
                <div className="action-menu">
                  <button
                    className="dots-btn"
                    onClick={() =>
                      setShowActionMenu(
                        showActionMenu === employee._id ? null : employee._id
                      )
                    }
                  >
                    ⋮
                  </button>
                  {showActionMenu === employee._id && (
                    <div className="menu-popup">
                      <button onClick={() => handleEdit(employee)}>Edit</button>
                      <button onClick={() => handleDelete(employee._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      {showModal && editEmployee && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Employee</h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>

            <div className="form-container">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editEmployee.fullName}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editEmployee.email}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editEmployee.phoneNumber}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <select
                  name="position"
                  value={editEmployee.position}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      position: e.target.value,
                    })
                  }
                >
                  <option>Intrern</option>
                  <option>fullName</option>
                  <option>Junior </option>
                  <option>senior </option>
                  <option>Tram lead </option>
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={editEmployee.department}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      department: e.target.value,
                    })
                  }
                >
                  <option>Designer</option>
                  <option>Developer</option>
                  <option>Human Resource</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Joining</label>
                <input
                  type="date"
                  name="date_of_joining"
                  value={
                    editEmployee.date_of_joining
                      ? editEmployee.date_of_joining.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      date_of_joining: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
