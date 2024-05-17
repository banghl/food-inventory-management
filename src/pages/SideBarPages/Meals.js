import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Table,
} from "react-bootstrap";

function MealPlanner() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [days, setDays] = useState(1);
  const [maxMealsPerDay, setMaxMealsPerDay] = useState(1);
  const [mealSuggestions, setMealSuggestions] = useState([]);

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

  return (
    <div
      className="bg-dark min-vh-100 d-flex justify-content-center align-items-start"
      style={{ marginInlineStart: "30%", width: "100%" }}
    >
      <div
        className="bg-white p-4 rounded text-black"
        style={{
          marginTop: "100px",
          width: "100%",
          height: "800px",
          overflowY: "scroll",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Meal Planner</h1>
        </div>

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
          <Button onClick={handleGenerateMealPlanner}>
            Generate Meal Planner
          </Button>
        </Form>

        <Table className="table table-striped text-dark">
          <thead>
            <tr>
              <th scope="col">Select</th>
              <th scope="col">Quantity</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Calories</th>
              <th scope="col">Expiry Date</th>
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
          <h2>Suggested Meals</h2>
          {mealSuggestions.length === 0 && (
            <p>No meal suggestions available.</p>
          )}
          {Object.entries(splitMealsByDate()).map(([date, meals]) => (
            <div key={date}>
              <h3>{date}</h3>
              {meals.map((meal) => (
                <div key={meal.id}>
                  <h4>{meal.name}</h4>
                  <p>Cooking Time: {meal.cookingTime}</p>
                  <p>Ingredients: {meal.ingredients.join(", ")}</p>
                  <p>Dietary Lists: {meal.dietaryLists.join(", ")}</p>
                  <p>Cooking Method: {meal.cookingMethod}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MealPlanner;
