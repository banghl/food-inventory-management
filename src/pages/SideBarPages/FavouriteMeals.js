import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Pagination,
} from "react-bootstrap";

function FavouriteMeals() {
  const [favouriteMeals, setFavouriteMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const mealsPerPage = 6;

  useEffect(() => {
    const fetchFavouriteMeals = async () => {
      const userId = localStorage.getItem("userId");
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("authToken");
      const apiUrl = `http://localhost:8080/api/v1/meals/favorite?userId=${userId}&profileId=${profileId}`;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.flag) {
          setFavouriteMeals(data.data);
        } else {
          console.error("Failed to fetch favourite meals:", data.message);
        }
      } catch (error) {
        console.error("Error fetching favourite meals:", error);
      }
    };

    fetchFavouriteMeals();
  }, []);

  const handleClick = (meal) => {
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const handleDelete = async (mealId) => {
    const profileId = localStorage.getItem("profileId");
    const token = localStorage.getItem("authToken");
    const apiUrl = `http://localhost:8080/api/v1/meals/delete-from-favorite?mealId=${mealId}&profileId=${profileId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.flag) {
        setFavouriteMeals(favouriteMeals.filter((meal) => meal.id !== mealId));
      } else {
        console.error("Failed to delete favorite meal:", data.message);
      }
    } catch (error) {
      console.error("Error deleting favorite meal:", error);
    }
  };

  // Calculate the current meals to display
  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = favouriteMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(favouriteMeals.length / mealsPerPage); i++) {
    pageNumbers.push(i);
  }

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
            <h1>Favourite Meals</h1>
            <br></br>
            <Row>
              {currentMeals.length > 0 ? (
                currentMeals.map((meal) => (
                  <Col md={6} lg={4} key={meal.id} className="mb-4">
                    <Card className="h-100 m-auto meal-card">
                      <Card.Body>
                        <Card.Title>{meal.name}</Card.Title>
                        <Card.Text>Cooking Time: {meal.cookingTime}</Card.Text>
                        <Button
                          variant="primary"
                          onClick={() => handleClick(meal)}
                          style={{ marginRight: "10px" }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(meal.id)}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>No favourite meals available.</p>
              )}
            </Row>
            <Pagination className="justify-content-center">
              {pageNumbers.map((number) => (
                <Pagination.Item
                  key={number}
                  active={number === currentPage}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Col>
      </Row>
      {showModal && selectedMeal && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMeal.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Cooking Time: {selectedMeal.cookingTime}</p>
            <h3>Ingredients:</h3>
            <ul>
              {selectedMeal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3>Dietary Lists:</h3>
            <ul>
              {selectedMeal.dietaryLists.map((dietaryList, index) => (
                <li key={index}>{dietaryList}</li>
              ))}
            </ul>
            <h3>Cooking Method:</h3>
            <p>{selectedMeal.cookingMethod}</p>
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

export default FavouriteMeals;
