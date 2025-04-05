import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalBox: {
      width: '500px',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      fontFamily: 'sans-serif',
    },
    header: {
      backgroundColor: '#480083',
      color: 'white',
      padding: '16px',
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'center',
    },
    body: {
      padding: '30px 20px 25px',
      textAlign: 'center',
    },
    message: {
      fontSize: '16px',
      marginBottom: '24px',
      color: '#333',
    },
    actions: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
    },
    cancelBtn: {
      backgroundColor: '#480083',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '10px 30px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(72, 0, 131, 0.3)',
      transition: 'all 0.2s ease-in-out',
    },
    logoutBtn: {
      backgroundColor: 'transparent',
      color: '#d60000',
      border: '1px solid #d60000',
      borderRadius: '20px',
      padding: '10px 30px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modalBox}>
        <div style={styles.header}>Log Out</div>
        <div style={styles.body}>
          <p style={styles.message}>Are you sure you want to log out?</p>
          <div style={styles.actions}>
            <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button style={styles.logoutBtn} onClick={onConfirm}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
