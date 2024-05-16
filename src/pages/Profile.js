import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ProfileSelection = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // State to hold userId

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId1 = userInfo.getItem("id"); // Extract userId from userInfo
    setUserId(userId1); // Store userId in state
    setIsLoggedIn(!!token);
    if (token && userId) {
      fetchProfileData(userId);
    }
  }, []);

  console.log("id",userId)

  const fetchProfileData = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/v1/profiles/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      if (data.flag && data.code === 200) {
        setProfileData(data.data);
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelection = (profileId) => {
    navigate("/");
    console.log(profileId);
  };

  console.log(profileData);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
      }}
    >
      <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <h2 className="text-white mb-5">Choose Your Profile</h2>
        {loading ? (
          <Spinner animation="border" variant="light" />
        ) : isLoggedIn ? (
          <>
            <div className="d-flex flex-wrap justify-content-center mb-3">
              {profileData.map((profile, index) => {
                console.log(`Key for profile at index ${index}: ${profile.id}`);
                return (
                  <Button
                    key={profile.id}
                    onClick={() => handleProfileSelection(profile.id)}
                    variant="warning"
                    className="btn-lg rounded-circle mx-2 mb-2"
                    style={{ width: "100px", height: "100px" }}
                  >
                    {profile.name}
                  </Button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-white">Please log in to view profiles.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSelection;
