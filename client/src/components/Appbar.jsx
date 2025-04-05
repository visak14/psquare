import React  from "react";
import { MdOutlineMail, MdNotifications } from "react-icons/md";
import "../App.css"; 

const AppBar = ({ selectedMenu, user }) => {
  const getInitials = (name) => {
    const words = name.split(" ");
    const initials = words.map((word) => word[0].toUpperCase()).join("");
    return initials;
  };

  return (
    <div className="appbar">
  
      <div className="selected-menu">
      <span>{selectedMenu}</span>
      </div>

   
      <div className="right-section">
        <MdOutlineMail className="icon" />
        <MdNotifications className="icon" />
        
   
        <div className="avatar-container">
          <span className="avatar">{getInitials(user.fullName)}</span>
        </div>

      
      </div>
    </div>
  );
};

export default AppBar;
