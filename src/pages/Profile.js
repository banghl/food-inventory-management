import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const ProfileSelection = () => {
  const navigate = useNavigate();

  const handleProfileSelection = (profile) => {
    navigate('/');
  };

  const handleAddProfile = () => {
    // Add your logic to add a new profile here
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
        <h2 className="text-white mb-5">Choose Your Profile</h2>
        <div className="d-flex flex-row justify-content-center align-items-center">
          <Button onClick={() => handleProfileSelection('profile1')} variant="warning" className="btn-lg rounded-circle mx-2" style={{ width: '100px', height: '100px' }}>Profile 1</Button>
          <Button onClick={() => handleProfileSelection('profile2')} variant="warning" className="btn-lg rounded-circle mx-2" style={{ width: '100px', height: '100px' }}>Profile 2</Button>
          <Button onClick={handleAddProfile} variant="warning" className="btn-lg rounded-circle mx-2" style={{ width: '100px', height: '100px' }}><FaPlus /></Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelection;
