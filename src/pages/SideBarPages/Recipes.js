import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Recipes() {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mealsPerPage] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    if (token) {
      fetchMeals(token);
    }
  }, []);

  const fetchMeals = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/meals", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setMeals(data.data);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const handleClick = (meal) => {
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const indexOfLastMeal = currentPage * mealsPerPage;
  const indexOfFirstMeal = indexOfLastMeal - mealsPerPage;
  const currentMeals = meals.slice(indexOfFirstMeal, indexOfLastMeal);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div
        className="bg-white p-4 rounded text-black w-100 w-lg-50 overflow-auto"
        style={{ marginLeft: "260px" }}
      >
        <h1 className="mb-5">Recipes</h1>
        {isLoggedIn ? (
          <div className="row justify-content-start">
            {currentMeals.map((meal) => (
              <div
                key={meal.id}
                className="col-12 col-sm-6 col-md-2 col-lg-5 mb-5"
              >
                <div className="card h-100 m-auto meal-card">
                  <div className="card-body">
                    <h5 className="card-title">{meal.name}</h5>
                    <span className="d-block mb-3 text-muted">
                      Cooking Time: {meal.cookingTime}
                    </span>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleClick(meal)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Please log in to view recipes.</p>
        )}
        {showModal && selectedMeal && (
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedMeal.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
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
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="pagination mt-3">
          {Array.from({ length: Math.ceil(meals.length / mealsPerPage) }).map(
            (_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
