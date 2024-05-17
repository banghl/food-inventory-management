import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Table,
  Container,
  Row,
  Col
} from "react-bootstrap";

function MealPlanner() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [days, setDays] = useState(1);
  const [maxMealsPerDay, setMaxMealsPerDay] = useState(1);
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [favouriteMeals, setFavouriteMeals] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchItems = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:8080/api/v1/items", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        setItems(responseData.data);
      } else {
        console.error("Failed to fetch items:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleGenerateMealPlanner = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    const selectedItemsNames = selectedItems.map((item) => item.name).join(",");
    const apiUrl = `http://localhost:8080/api/v1/meals/suggestion?items=${selectedItemsNames}&days=${days}&maxMealPerDays=${maxMealsPerDay}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        setMealSuggestions(responseData.data);
      } else {
        console.error(
          "Failed to fetch meal suggestions:",
          responseData.message
        );
      }
    } catch (error) {
      console.error("Error fetching meal suggestions:", error);
    }
  };

  const splitMealsByDate = () => {
    const mealsByDate = {};

    mealSuggestions.forEach((meal, index) => {
      const mealDate = new Date();
      mealDate.setDate(mealDate.getDate() + 1);
      mealDate.setDate(mealDate.getDate() + Math.floor(index / maxMealsPerDay));
      const formattedDate = mealDate.toDateString();

      if (!mealsByDate[formattedDate]) {
        mealsByDate[formattedDate] = [meal];
      } else {
        mealsByDate[formattedDate].push(meal);
      }
    });

    return mealsByDate;
  };

  const addToFavourite = async (mealId) => {
    const profileId = localStorage.getItem("profileId");
    if (!profileId) {
      alert("Profile ID not found. Please log in again.");
      return;
    }
    if (favouriteMeals.some(meal => meal.id === mealId)) {
      alert('This meal is already in your favourites.');
      return;
    }
  
    const apiUrl = `http://localhost:8080/api/v1/meals/add-to-favorite?mealId=${mealId}&profileId=${profileId}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }
  
      const responseData = await response.json();
      if (responseData.flag) {
        alert('Meal added to favourites successfully!');
      } else {
        console.error("Failed to add meal to favourites:", responseData.message);
      }
    } catch (error) {
      console.error("Error adding meal to favourites:", error);
    }
    
  };
  

  return (
    <Container fluid className="bg-dark min-vh-100 pt-5" style={{ marginLeft: '200px' }}>
      <Row className="justify-content-center">
        <Col>
          <div className="bg-white p-4 rounded text-black" style={{ overflowY: "auto", maxHeight: "90vh", width:"1000px" }}>
            <h1>Meal Planner</h1>
            <Form>
              <FormGroup controlId="formDays">
                <FormLabel>Days</FormLabel>
                <FormControl
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Enter number of days"
                />
              </FormGroup>
              <FormGroup controlId="formMaxMealsPerDay">
                <FormLabel>Max Meals Per Day</FormLabel>
                <FormControl
                  type="number"
                  value={maxMealsPerDay}
                  onChange={(e) => setMaxMealsPerDay(e.target.value)}
                  placeholder="Enter max meals per day"
                />
              </FormGroup>
              <br></br>
              <Button onClick={handleGenerateMealPlanner}>Generate Meal</Button>
            </Form>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Quantity</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Calories</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                      />
                    </td>
                    <td>{item.stock}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.calories}</td>
                    <td>{item.expiryDate.join("/")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              <h2 className="mt-4 mb-3">Suggested Meals</h2>
              {mealSuggestions.length === 0 && <p>No meal suggestions available.</p>}
              {Object.entries(splitMealsByDate()).map(([date, meals]) => (
                <div key={date} className="mb-4 p-3 bg-light border-left border-success">
                  <h3 className="mb-3">{date}</h3>
                  {meals.map((meal) => (
                    <div key={meal.id} className="border p-3 mb-3 rounded">
                      <h4>{meal.name}</h4>
                      <p className="mb-1"><strong>Cooking Time:</strong> {meal.cookingTime}</p>
                      <p className="mb-1"><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
                      <p className="mb-1"><strong>Dietary Lists:</strong> {meal.dietaryLists.join(", ")}</p>
                      <p className="mb-0"><strong>Cooking Method:</strong> {meal.cookingMethod}</p>
                      <Button onClick={() => addToFavourite(meal.id)} className="mt-2">Add to Favourite</Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MealPlanner;
