import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';

function FavouriteShoppingList() {
  const [favouriteShoppingLists, setFavouriteShoppingLists] = useState([]);
  const [selectedShoppingList, setSelectedShoppingList] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFavouriteShoppingLists();
  }, []);

  const fetchFavouriteShoppingLists = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/view/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const data = await response.json();
      if (data.flag) {
        setFavouriteShoppingLists(data.data);
      } else {
        console.error('Failed to fetch favorite shopping lists:', data.message);
      }
    } catch (error) {
      console.error('Error fetching favorite shopping lists:', error);
    }
  };

  const deleteShoppingList = async (userId, shoppingListId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/v1/shoppinglists/delete/userId=${userId}&shoppingListId=${shoppingListId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const data = await response.json();
      if (data.flag) {
        setFavouriteShoppingLists(favouriteShoppingLists.filter(list => list.id !== shoppingListId));
      } else {
        console.error('Failed to delete shopping list:', data.message);
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  const handleViewDetails = (list) => {
    setSelectedShoppingList(list);
    setShowModal(true);
  };

  return (
    <Container
      fluid
      className="bg-dark min-vh-100 pt-5"
      style={{ marginLeft: "90px", marginTop: "90px" }}
    >
      <Row className="justify-content-center">
        <Col lg={8}>
          <div
            className="bg-white p-4 rounded text-black"
            style={{ overflowY: "auto", maxHeight: "90vh", width: "1000px" }}
          >
            <h1>Favorite Shopping Lists</h1>
            <br></br>
            <Row>
              {favouriteShoppingLists.length > 0 ? (
                favouriteShoppingLists.map(list => (
                  <Col md={6} lg={4} key={list.id} className="mb-4">
                    <Card className="h-100 m-auto meal-card">
                      <Card.Body>
                        <Card.Title>{list.name}</Card.Title>
                        <Card.Text>Cost: ${list.cost.toFixed(2)}</Card.Text>
                        <Card.Text>Description: {list.description}</Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => handleViewDetails(list)}
                          style={{ marginRight: "10px" }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteShoppingList(localStorage.getItem('userId'), list.id)}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>No favorite shopping lists found.</p>
              )}
            </Row>
          </div>
        </Col>
      </Row>
      {showModal && selectedShoppingList && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedShoppingList.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Cost: ${selectedShoppingList.cost.toFixed(2)}</p>
            <p>Estimated Date: {selectedShoppingList.estimatedDate} days</p>
            <p>Description: {selectedShoppingList.description}</p>
            <h3>Items:</h3>
            <ul>
              {selectedShoppingList.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default FavouriteShoppingList;
