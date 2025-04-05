import React, { useEffect, useState } from "react";
import "./Candidates.css"; 
import axios from "axios";
import { BASE_URL } from "../config";
export const Candidates = () => {
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    position: "Designer",
    experience: "",
    status: "New",
    resume: null,
  });

  const [filters, setFilters] = useState({
    status: "",
    position: "",
    search: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = filters.status
      ? candidate.status === filters.status
      : true;
    const matchesPosition = filters.position
      ? candidate.position === filters.position
      : true;
    const searchText = filters.search.toLowerCase();
    const matchesSearch =
      candidate.fullName?.toLowerCase().includes(searchText) ||
      candidate.email?.toLowerCase().includes(searchText) ||
      candidate.phoneNumber?.toLowerCase().includes(searchText);

    return matchesStatus && matchesPosition && matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/candidates`);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };
 
  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("resume", formData.resume);

    try {
      const response = await axios.post(
        `${BASE_URL}/candidates/create`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCandidates([...candidates, response.data]);
      setShowModal(false);
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        position: "Designer",
        experience: "",
        resume: null,
      });
    } catch (error) {
      console.error("Error saving candidate:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/candidates/${id}`, { status: newStatus });

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate._id === id ? { ...candidate, status: newStatus } : candidate
        )
      );

      
      if (newStatus === "Selected") {
        await axios.post(`${BASE_URL}/candidates/${id}/move-to-employee`);
        
        setCandidates((prev) =>
          prev.filter((candidate) => candidate._id !== id)
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDownloadResume = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/candidates/${id}/resume`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/candidates/${id}`);
      setCandidates((prev) =>
        prev.filter((candidate) => candidate._id !== id)
      );
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <div className="candidates-container">
      <div className="filter-section">
        <div style={{ display: "flex", gap: "20px" }}>
          <select
            name="status"
            className="dropdown"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <label>Status</label>
            <option>New</option>
            <option>Scheduled</option>
            <option>Ongoing</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>

          <select
            name="position"
            className="dropdown"
            value={filters.position}
            onChange={handleFilterChange}
          >
            <label>Position</label>
            <option>Designer</option>
            <option>Developer</option>
            <option>Human Resource</option>
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

          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add Candidate
          </button>
        </div>
      </div>

    
      <table className="candidates-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Candidate Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((candidate, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{candidate.fullName} </td>
              <td>{candidate.email}</td>
              <td>{candidate.phoneNumber}</td>
              <td>{candidate.position}</td>
              <td>
                <select
                  value={candidate.status}
                  onChange={(e) =>
                    handleStatusChange(candidate._id, e.target.value)
                  }
                >
                  <option value="New">New</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>{candidate.experience}</td>
              <td style={{ position: "relative" }}>
                <button
                  className="menu-button"
                  onClick={() =>
                    setShowDropdown(
                      showDropdown === candidate._id ? null : candidate._id
                    )
                  }
                >
                  ⋮
                </button>

                {showDropdown === candidate._id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleDownloadResume(candidate._id)}>
                      Download Resume
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(candidate._id)}
                    >
                      Delete Candidate
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-header">Add New Candidate</h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>

            <div className="form-container">
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                >
                  <option value="">Select Position</option>
                  <option>Designer</option>
                  <option>Developer</option>
                  <option>Human Resource</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="experience"
                  placeholder="Experience (Years)"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <input type="file" name="resume" onChange={handleFileChange} />
              </div>
            </div>

            <div className="declaration">
              <input type="checkbox" id="declaration" />
              <label htmlFor="declaration">
                I hereby declare that the above information is true to the best
                of my knowledge and belief.
              </label>
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
