import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UserProfileModal({ show, handleClose,name,age,diet, description }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Label>{name}</Form.Label>
          </Form.Group>

          <Form.Group controlId="formAge">
            <Form.Label>Age</Form.Label>
            <Form.Label>{age}</Form.Label>
          </Form.Group>

          <Form.Group controlId="formDietaryPreferences">
            <Form.Label>Dietary Preferences</Form.Label>
            <Form.Label>{diet}</Form.Label>
          </Form.Group>

          <Form.Group controlId="formFoodAllergies">
            <Form.Label>Description</Form.Label>
            <Form.Label>{description}</Form.Label>
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
