import React, { useState, useEffect } from "react";
import { Button, Spinner, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProfileSelection = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: "",
    dietary: "",
    allergies: "",
    description: "",
  });

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setIsLoggedIn(!!token);
    if (token && userId) {
      fetchProfileData(userId);
    }
  }, [token, userId]);

  const fetchProfileData = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/profiles/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setProfileData(data.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelection = (Id) => {
    navigate("/");
    localStorage.setItem("profileId", Id);
  };

  const handleAddProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/profiles/add?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProfile),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfileData([...profileData, data.data]);
        setShowModal(false);
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to add profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  return (
    <>
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
                {profileData.map((profile) => (
                  <Button
                    key={profile.id}
                    onClick={() => handleProfileSelection(profile.id)}
                    variant="warning"
                    className="btn-lg rounded-circle mx-2 mb-2"
                    style={{ width: "100px", height: "100px" }}
                  >
                    {profile.name}
                  </Button>
                ))}
                <Button
                  variant="warning"
                  className="btn-lg rounded-circle mx-2 mb-2"
                  style={{ width: "100px", height: "100px", fontSize: "40px" }}
                  onClick={() => setShowModal(true)}
                >
                  +
                </Button>
              </div>
            </>
          ) : (
            <p className="text-white">Please log in to view profiles.</p>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={newProfile.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                name="age"
                value={newProfile.age}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dietary Preferences</Form.Label>
              <Form.Select
                name="dietary"
                value={newProfile.dietary}
                onChange={handleInputChange}
              >
                <option value="">Select dietary preference</option>
                <option value="DAIRY_FREE">Dairy Free</option>
                <option value="GLUTEN_FREE">Gluten Free</option>
                <option value="LOW_CARB">Low Carb</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Allergies</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter allergies"
                name="allergies"
                value={newProfile.allergies}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter a brief description"
                name="description"
                value={newProfile.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProfile}>
            Save Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileSelection;
