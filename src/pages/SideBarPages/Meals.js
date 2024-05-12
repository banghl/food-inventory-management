import React, { useState } from 'react';
import { Button, Form, FormGroup, FormLabel, FormControl, Table } from 'react-bootstrap';

function MealPlanner() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);

  // Function to handle item selection
  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    const itemName = e.target.options[e.target.selectedIndex].text;
    setSelectedItems([...selectedItems, { id: itemId, name: itemName }]);
  };

  // Function to generate meal plan
  const handleGenerateMealPlan = () => {
    // Your logic to generate meal plan goes here
    // For now, we'll just log the selected items
    console.log(selectedItems);
    // You can set the generated meal plan to state or perform further actions
  };

  return (
    <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="bg-white p-4 rounded text-black container-fluid d-flex align-items-center">
        <div className="container mt-4">
          <h2>Meal Planner</h2>
          <Form>
            <FormGroup>
              <FormLabel>Select Items from Fridge:</FormLabel>
              <FormControl as="select" onChange={handleItemSelect}>
                <option value="">Select an item</option>
                {/* Example options, replace with actual items from fridge */}
                <option value="1">Milk</option>
                <option value="2">Eggs</option>
                <option value="3">Chicken</option>
              </FormControl>
            </FormGroup>
            <Button variant="primary" onClick={handleGenerateMealPlan}>Generate Meal Plan</Button>
          </Form>
          
          <div className="mt-4">
            <h3>Selected Items:</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealPlanner;
