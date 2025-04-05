import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Leaves.css";

export const Leave = () => {
  const [employees, setEmployees] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [document, setDocument] = useState(null);
  const [tableSearchQuery, setTableSearchQuery] = useState(""); // For table search
  const [modalSearchQuery, setModalSearchQuery] = useState(""); // For modal search
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); 
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [approvedLeavesOnly, setApprovedLeavesOnly] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchAllLeaves();
    fetchApprovedLeaves();
  }, []);

  useEffect(() => {
    filterLeaves();
  }, [leaves, tableSearchQuery, statusFilter]);

  const fetchAllLeaves = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/leaves/all`, {
        withCredentials: true,
      });
      setLeaves(response.data);
      setFilteredLeaves(response.data); 

      const approved = response.data.filter((leave) => leave.status === "Approved");
      setApprovedLeaves(
        approved.map((leave) => ({
          name: leave.fullName || "N/A",
          date: new Date(leave.startDate),
        }))
      );
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchApprovedLeaves = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/leaves`, {
        withCredentials: true,
      });
      setApprovedLeavesOnly(response.data);
    } catch (error) {
      console.error("Error fetching approved leaves:", error);
    }
  };

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

  const handleTableSearchChange = (e) => {
    setTableSearchQuery(e.target.value);
  };

  const handleModalSearchChange = (e) => {
    setModalSearchQuery(e.target.value);
    setShowSearchResults(true);
   
    if (e.target.value === "") {
      setSelectedEmployee(null);
    }
  };

  const handleSearchSelect = (employee) => {
    setSelectedEmployee(employee);
    setModalSearchQuery(employee.fullName);
    setShowSearchResults(false); 
  };

  const handleFileChange = (e) => setDocument(e.target.files[0]);

  const handleSave = async () => {
    if (!selectedEmployee || !leaveDate || !reason) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("employee", selectedEmployee._id);
      formData.append("fullName", selectedEmployee.fullName);
      formData.append("startDate", leaveDate);
      formData.append("endDate", leaveDate);
      formData.append("reason", reason);
      if (document) formData.append("document", document);

      const response = await axios.post(`${BASE_URL}/leaves`, formData, {
        withCredentials: true,
      });

      fetchAllLeaves();
      fetchApprovedLeaves(); 
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving leave:", error);
    }
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setLeaveDate("");
    setReason("");
    setDocument(null);
    setModalSearchQuery("");
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/leaves/${leaveId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === leaveId ? { ...leave, status: newStatus } : leave
        )
      );

      if (newStatus === "Approved") {
        const leave = leaves.find((leave) => leave._id === leaveId);
        if (leave) {
          setApprovedLeaves((prev) => [
            ...prev,
            {
              name: leave.fullName || "N/A",
              date: new Date(leave.startDate),
            },
          ]);
        }
      }
      
      fetchApprovedLeaves();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const handleFilterStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filterLeaves = () => {
    const filtered = leaves.filter((leave) => {
      const matchesSearchQuery = !tableSearchQuery || 
        leave.fullName?.toLowerCase().includes(tableSearchQuery.toLowerCase());

      const matchesStatus =
        !statusFilter || leave.status === statusFilter;

      return matchesSearchQuery && matchesStatus;
    });
    setFilteredLeaves(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  
  const handleSearchBlur = () => {
    
    setTimeout(() => setShowSearchResults(false), 300);
  };

  return (
    <div className="leave-container">
      <div className="table-section">
        <div className="filter-section">
          <div style={{ display: "flex", gap: "20px" }}>
            <select
              name="status"
              className="status-dropdown"
              value={statusFilter}
              onChange={handleFilterStatusChange}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={tableSearchQuery}
              onChange={handleTableSearchChange}
            />
            <button className="add-btn" onClick={() => setShowModal(true)}>
              Add Leave
            </button>
          </div>
        </div>
        <table className="employees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Docs</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.fullName || "N/A"}</td>
                <td>{formatDate(leave.startDate)}</td>
                <td>{leave.reason}</td>
                <td>
                  <select
                    value={leave.status}
                    onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  {leave.document ? (
                    <a
                      href={`${BASE_URL}/${leave.document}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="right-section">
        <div className="calendar-section">
          <h3>Leave Calendar</h3>
          <Calendar
            style={{ width: "100%" }}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const leave = approvedLeaves.find(
                  (leave) => leave.date.toDateString() === date.toDateString()
                );
                return leave ? <p className="leave-marker">{leave.name}</p> : null;
              }
            }}
          />
          <div className="approved-leaves-list" style={{ marginTop: "20px" }}>
            {approvedLeavesOnly.length > 0 ? (
              approvedLeavesOnly.map((leave) => (
                <div key={leave._id} className="approved-leave-item">
                  <div className="employee-name">{leave.fullName || "N/A"}</div>
                  <div className="leave-date">{formatDate(leave.startDate)}</div>
                </div>
              ))
            ) : (
              <div className="no-leaves">No approved leaves</div>
            )}
          </div>
        </div>
      
       
      </div>

      {showModal && (
        <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <h2>Add Leave</h2>
            <button className="close-btn" onClick={handleModalClose}>
              ×
            </button>
            <div className="form-container">
              <div className="form-group">
                <label>Employee Name</label>
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search Employee Name"
                  value={modalSearchQuery}
                  onChange={handleModalSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {showSearchResults && (
                  <div className="search-results">
                    {employees
                      .filter((employee) =>
                        employee.fullName
                          .toLowerCase()
                          .includes(modalSearchQuery.toLowerCase())
                      )
                      .map((employee) => (
                        <div
                          key={employee._id}
                          className="search-item"
                          onMouseDown={(e) => {
                            e.preventDefault(); 
                            handleSearchSelect(employee);
                          }}
                        >
                          {employee.fullName}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Leave Date</label>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  placeholder="Enter Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Upload Document</label>
                <input type="file" onChange={handleFileChange} />
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