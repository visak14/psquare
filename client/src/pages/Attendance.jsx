import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Employee.css";
import { BASE_URL } from "../config";

export const Attendence = () => {
  const [employees, setEmployees] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesStatus = filters.status ? employee.status === filters.status : true;
  
    const searchText = filters.search.toLowerCase();
    const matchesSearch =
      employee.fullName.toLowerCase().includes(searchText) ||
      employee.position.toLowerCase().includes(searchText) ||
      employee.department?.toLowerCase().includes(searchText);
  
    return matchesStatus && matchesSearch;
  });
  
 
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/attend`, { withCredentials: true });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      
      await axios.post(`${BASE_URL}/attend/marks`, {
        employeeId: id,
        status: newStatus
      }, {
        withCredentials: true
      });
  
      
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, status: newStatus } : emp
        )
      );
  
      console.log("Attendance marked and leave added if Present");
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error.message);
    }
  };
  
  

  return (
    <div className="employees-container">
     <div className="filter-section">
        <div style={{ display: "flex", gap: "20px" }}>

          <select
            name="position"
            className="dropdown"
            value={filters.status} onChange={handleFilterChange}
          >
            <label>Present</label>
            <option>Absent</option>
            <option>Medical Leave</option>
            <option>Work From Home</option>
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
            
            <th>Position</th>
            <th>Department</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.fullName}</td>
              <td>{employee.position}</td>
              <td>{employee.department || "N/A"}</td>
              <td>
                <select
                  value={employee.status}
                  onChange={(e) => handleStatusChange(employee.employee._id, e.target.value)}
                >
                  
                  <option value="Absent">Absent</option>
                  <option value="Present">Present</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Work from Home">Work from Home</option>
                  
                </select>
              </td>
              <td>
                <div className="action-menu">
                  <button
                    className="dots-btn"
                    onClick={() =>
                      setShowActionMenu(showActionMenu === employee._id ? null : employee._id)
                    }
                  >
                    ⋮
                  </button>
                 
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
    </div>
  );
};
