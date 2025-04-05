import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaUsers, FaSignOutAlt } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineGridView, MdPostAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/Appbar";
import "../App.css"; 
import LogoutModal from "./LogoutModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user")) || { fullName: "John Doe" };

  
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setSelectedMenu("Dashboard");
        break;
      case "/dashboard/employees":
        setSelectedMenu("Employees");
        break;
      case "/dashboard/attendance":
        setSelectedMenu("Attendance");
        break;
      case "/dashboard/candidates":
        setSelectedMenu("Candidates");
        break;
      case "/dashboard/leaves":
        setSelectedMenu("Leaves");
        break;
      default:
        setSelectedMenu("Dashboard");
    }
  }, [location]);

  const handleLogoutClick = () => {
    setIsModalOpen(true); 
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    setIsModalOpen(false); 
  };

  const handleCancel = () => {
    setIsModalOpen(false); 
  };
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="logo">LOGO</h1>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            name="search"
          />
        </div>

        <label className="sidebar-label">Recruitment</label>
        <Link to="/dashboard/candidates" className="sidebar-link">
          <IoMdPeople className="sidebar-icon" /> Candidates
        </Link>

        <label className="sidebar-label">Organisation</label>
        <Link to="/dashboard/employees" className="sidebar-link">
          <FaUsers className="sidebar-icon" /> Employees
        </Link>

        <Link to="/dashboard/attendance" className="sidebar-link">
          <MdOutlineGridView className="sidebar-icon" /> Attendance
        </Link>

        <Link to="/dashboard/leave" className="sidebar-link">
          <MdPostAdd className="sidebar-icon" /> Leaves
        </Link>

        <label className="sidebar-label">Others</label>
        <button className="logout-btn" onClick={handleLogoutClick}>
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <AppBar selectedMenu={selectedMenu} user={user} /> 
        <div className="content-area">
          <Outlet /> 
        </div>
      </div>
      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Dashboard;
