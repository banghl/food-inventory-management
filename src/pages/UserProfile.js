import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UserProfileModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>

          <Form.Group controlId="formAge">
            <Form.Label>Age</Form.Label>
            <Form.Control type="number" placeholder="Enter your age" />
          </Form.Group>

          <Form.Group controlId="formDietaryPreferences">
            <Form.Label>Dietary Preferences</Form.Label>
            <Form.Control as="select">
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formFoodAllergies">
            <Form.Label>Food Allergies</Form.Label>
            <Form.Control type="text" placeholder="Enter your food allergies" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserProfileModal;
