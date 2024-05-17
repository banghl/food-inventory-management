import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import UserProfileModal from './UserProfile';
import "../Styles/Header.css";

function Header() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setName] = useState("");
  const [profileAge, setAge] = useState("");
  const [profileDiet, setDiet] = useState("");
  const [profileDes, setDes] = useState("");
  const [profileAl, setAl] = useState("");

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const profileId = localStorage.getItem("profileId")
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  
  useEffect(() => {
    // Extract userId from userInfo
   
    if (token && userId) {
      fetchProfileData();
    }
  }, []);

  const fetchProfileData = async () => {
    try {
      
      const response = await fetch(
        `http://localhost:8080/api/v1/profiles/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("data profile",data)
        setName(data.data.name)
        setAge(data.data.age)
        setDiet(data.data.dietary)
        setDes(data.data.description)
        setAl(data.data.allergies)
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } 
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
      <UserProfileModal show={showProfileModal} handleClose={handleCloseProfileModal} name={profileName} age={profileAge} diet={profileDiet} description={profileDes} allergies={profileAl} />
    </>
  );
}

export default Header;
