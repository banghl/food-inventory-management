import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import UserProfileModal from './UserProfile';
import "../Styles/Header.css";

function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <>
      <div className="position-absolute top-0 end-0 m-3">
        <Dropdown>
          <Dropdown.Toggle
            variant="secondary"
            id="dropdown-basic"
            className="custom-toggle"
            onClick={handleProfileClick}
          >
            User Profile
          </Dropdown.Toggle>
        </Dropdown>
      </div>
      <UserProfileModal show={showProfileModal} handleClose={handleCloseProfileModal} />
    </>
  );
}

export default Header;
