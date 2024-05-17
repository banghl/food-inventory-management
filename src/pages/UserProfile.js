import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function UserProfileModal({ show, handleClose, name, age, diet, allergies }) {
  const labelStyle = {
    fontWeight: "bold", 
    padding: "5px", 
    width: "200px", 
  };

  const textStyle = {
    marginLeft: "10px", 
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label style={labelStyle}>Name:</Form.Label>
            <span style={textStyle}>{name}</span>
          </Form.Group>

          <Form.Group controlId="formAge">
            <Form.Label style={labelStyle}>Age:</Form.Label>
            <span style={textStyle}>{age}</span>
          </Form.Group>

          <Form.Group controlId="formDietaryPreferences">
            <Form.Label style={labelStyle}>Dietary Preferences:</Form.Label>
            <span style={textStyle}>{diet}</span>
          </Form.Group>
          <Form.Group controlId="formAllergies">
            <Form.Label style={labelStyle}>Allergies:</Form.Label>
            <span style={textStyle}>{allergies}</span>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserProfileModal;
