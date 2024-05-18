import React, { useState, useEffect } from 'react';

function ShoppingList() {
  const [consumedItems, setConsumedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    fetchConsumedItems();
  }, []);

  const fetchConsumedItems = async () => {
    try {
      const token = getToken();
      const profileId = localStorage.getItem("profileId");
      const response = await fetch(`http://localhost:8080/api/v1/consumption-records?profile=${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (Array.isArray(data.data)) {
        // Map over the data to extract the required item details
        const itemsDetails = data.data.map(item => ({
          id: item.item.id, // Assuming item.item.id is unique
          name: item.item.name.trim(),
          category: item.item.category,
          calories: item.item.calories,
          protein: item.item.protein,
          fat: item.item.fat,
        }));
        setConsumedItems(itemsDetails);
      } else {
        setConsumedItems([]);
      }
    } catch (error) {
      console.error('Error fetching consumed items:', error);
      setConsumedItems([]);
    }
  };
  
  const generateShoppingList = async () => {
    try {
      const token = getToken();
      // Join the names of the selected items with commas
      const items = selectedItems.map(item => item.name.trim()).join(',');
      const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/generate?items=${items}&days=7`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.flag && data.code === 200) {
        setShoppingList(data.data);
      } else {
        console.error('Failed to generate shopping list:', data.message);
        setShoppingList([]);
      }
    } catch (error) {
      console.error('Error generating shopping list:', error);
      setShoppingList([]);
    }
  };

  const handleItemSelect = (item) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  return (
    <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-start" style={{ marginLeft: '200px', overflow: 'auto' }}>
      <div className="bg-white p-4 rounded text-black" style={{ marginTop: "100px", overflowY: "auto", maxHeight: "80vh", width: "1000px" }}>
        <h1>Shopping List</h1>
        <h2>Consumed Items</h2>
        <table className="table table-striped text-dark text-center">
          <thead>
            <tr>
              <th scope="col">Item Name</th>
              <th scope="col">Category</th>
              <th scope="col">Calories</th>
              <th scope="col">Protein</th>
              <th scope="col">Fat</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {consumedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.calories}</td>
                <td>{item.protein}</td>
                <td>{item.fat}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                    onChange={() => handleItemSelect(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary mb-3" onClick={generateShoppingList}>
          Generate Shopping List
        </button>
        {shoppingList.length > 0 && (
          <div>
            <h2>Generated Shopping Lists</h2>
            {shoppingList.map(list => (
              <div key={list.id} className="card mb-3">
                <div className="card-body">
                  <h3 className="card-title">{list.name}</h3>
                  <ul className="list-group list-group-flush">
                    {list.items.map((item, index) => (
                      <li key={index} className="list-group-item">{item}</li>
                    ))}
                  </ul>
                  <p className="card-text">Cost: ${list.cost.toFixed(2)}</p>
                  <p className="card-text">Description: {list.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;
