import React, { useState, useEffect } from "react";

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
      const response = await fetch(
        `http://localhost:8080/api/v1/consumption-records?profile=${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      const data = await response.json();
      if (Array.isArray(data.data)) {
        // Create an object to keep track of item quantities
        const itemQuantities = {};
  
        // Map over the data to extract the required item details
        data.data.forEach((item) => {
          const itemId = item.item.id;
          if (itemQuantities[itemId]) {
            itemQuantities[itemId].quantity += item.quantity; // Increment quantity if item already exists
          } else {
            // Add new item with quantity set to the fetched quantity
            itemQuantities[itemId] = {
              id: itemId,
              name: item.item.name.trim(),
              category: item.item.category,
              calories: item.item.calories,
              protein: item.item.protein,
              fat: item.item.fat,
              quantity: item.quantity,
            };
          }
        });
  
        // Convert the object back to an array for setting the state
        const itemsDetails = Object.values(itemQuantities);
        setConsumedItems(itemsDetails);
      } else {
        setConsumedItems([]);
      }
    } catch (error) {
      console.error("Error fetching consumed items:", error);
      setConsumedItems([]);
    }
  };
  

  const generateShoppingList = async () => {
    try {
      const token = getToken();
      // Join the names of the selected items with commas
      const items = selectedItems.map((item) => item.name.trim()).join(",");
      const response = await fetch(
        `http://localhost:8080/api/v1/shopping-lists/generate?items=${items}&days=7`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.flag && data.code === 200) {
        setShoppingList(data.data);
      } else {
        console.error("Failed to generate shopping list:", data.message);
        setShoppingList([]);
      }
    } catch (error) {
      console.error("Error generating shopping list:", error);
      setShoppingList([]);
    }
  };

  const handleItemSelect = (item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );
    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const addToFavorites = (userId, shoppingListId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("User not authenticated");
      return;
    }

    fetch(
      `http://localhost:8080/api/v1/shopping-lists/assign?userId=${userId}&shoppingListId=${shoppingListId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.flag && data.code === 200) {
          alert("Shopping list added to favorites successfully!");
        } else {
          console.error(
            "Failed to add shopping list to favorites:",
            data.message
          );
        }
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });
  };

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  return (
    <div
      className="bg-dark min-vh-100 d-flex justify-content-center align-items-start"
      style={{ marginLeft: "250px", marginTop: "70px", overflow: "auto" }}
    >
      <div
        className="bg-white p-4 rounded text-black"
        style={{
          marginTop: "100px",
          overflowY: "auto",
          maxHeight: "80vh",
          width: "1000px",
        }}
      >
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
              <th scope="col">Quantity</th>
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
                <td>{item.quantity}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.some(
                      (selectedItem) => selectedItem.id === item.id
                    )}
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
          <div className="mb-4">
            <h2 className="mb-3">Generated Shopping Lists</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {shoppingList.map((list) => (
                <div key={list.id} className="col">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{list.name}</h5>
                      <ul className="list-group list-group-flush mb-3">
                        {list.items.map((item, index) => (
                          <li key={index} className="list-group-item">
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="card-text mb-3">
                        <span className="fw-bold">Cost:</span> $
                        {list.cost.toFixed(2)}
                      </p>
                      <p className="card-text mb-3">{list.description}</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToFavorites(1, list.id)}
                      >
                        Add to Favorites
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;