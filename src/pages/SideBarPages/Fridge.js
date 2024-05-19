import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaTrash, FaEdit, FaUtensilSpoon } from "react-icons/fa";

function Fridge() {
  const [items, setItems] = useState([]);
  const [profileItems, setProfileItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [profileItemIds, setProfileItemIds] = useState([]);

  const [newItem, setNewItem] = useState({
    name: "",
    stock: "",
    category: "",
    expiryDate: "",
    calories: "",
    protein: "",
    fat: "",
    purchaseDate: "",
  });

  const [takeOutItem, setTakeOutItem] = useState(null);
  const [takeOutQuantity, setTakeOutQuantity] = useState(1);
  const [showTakeOutModal, setShowTakeOutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
    fetchProfileItems();
  }, []);

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

  const fetchProfileItems = async () => {
    try {
      const token = getToken();
      const profileId = localStorage.getItem("profileId");
      const response = await fetch(
        `http://localhost:8080/api/v1/items/itemByProfile/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        setProfileItems(responseData.data);
        const profileIds = responseData.data.map((item) => item.id);
        setProfileItemIds(profileIds);
      } else {
        console.error("Failed to fetch profile items:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching profile items:", error);
    }
  };

  const searchItems = async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:8080/api/v1/items/search?item=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        setItems(responseData.data);
      } else {
        console.error("Failed to search items:", responseData.message);
      }
    } catch (error) {
      console.error("Error searching items:", error);
    }
  };

  const addItem = async () => {
    try {
      const token = getToken();
      const profileId = localStorage.getItem("profileId");
      const url = editItemId
        ? `http://localhost:8080/api/v1/items/update/${editItemId}` // Update existing item
        : `http://localhost:8080/api/v1/items/${profileId}/add`; // Add new item
      const method = editItemId ? "PUT" : "POST";
  
      const capitalizedCategory =
        newItem.category.charAt(0).toUpperCase() + newItem.category.slice(1);
  
      // Set purchaseDate to current date if it's not set
      const currentDate = new Date();
      const formattedCurrentDate = currentDate.toISOString().split("T")[0];
      const itemToSubmit = {
        ...newItem,
        category: capitalizedCategory,
        purchaseDate: newItem.purchaseDate || formattedCurrentDate,
      };
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSubmit),
      });
  
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }
  
      const responseData = await response.json();
      if (responseData.flag) {
        fetchItems();
        fetchProfileItems();
        setShow(false);
        setNewItem({
          name: "",
          stock: "",
          category: "",
          expiryDate: "",
          calories: "",
          protein: "",
          fat: "",
          purchaseDate: "",
        });
        setEditItemId(null);
      } else {
        console.error("Failed to add/edit item:", responseData.message);
      }
    } catch (error) {
      console.error("Error adding/editing item:", error);
    }
  };
  
  const deleteItem = async (itemId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:8080/api/v1/items/delete/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        fetchItems();
        fetchProfileItems();
      } else {
        console.error("Failed to delete item:", responseData.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const handleClose = () => {
    setShow(false);
    setEditItemId(null);
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const calculateDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const differenceInTime = expiry.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };

  const handleTakeOut = async () => {
    try {
      const token = getToken();
      const profileId = localStorage.getItem("profileId");
      const itemId = takeOutItem.id;
  
      // API to transfer the item based on provided details
      const url = `http://localhost:8080/api/v1/consumption-records/transfer?profileId=${profileId}&itemId=${itemId}&quantity=${takeOutQuantity}`;
      const response = await fetch(url, {
        method: "POST",
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
        // Successfully transferred, now refresh the items list
        fetchItems();
        setShowTakeOutModal(false);
        setTakeOutQuantity(1);
        setTakeOutItem(null);
      } else {
        console.error("Failed to take out item:", responseData.message);
      }
    } catch (error) {
      console.error("Error taking out item:", error);
    }
  };
  

  const handleTakeOutConfirm = (item) => {
    setTakeOutItem(item);
    setShowTakeOutModal(true);
  };

  return (
    <div
      className="bg-dark min-vh-100 d-flex justify-content-center align-items-start "
      style={{ marginInlineStart: "30%", width: "1000px" }}
    >
      <div
        className="bg-white p-4 rounded text-black"
        style={{
          marginTop: "100px",
          width: "100%",
          height: "700px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Fridge</h1>
          <div>
            <input
              type="text"
              placeholder="Search for an item"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <Button variant="primary" onClick={searchItems}>
              Search
            </Button>
            <Button
              variant="primary"
              onClick={handleShow}
              style={{ marginLeft: "10px" }}
            >
              Add Item
            </Button>
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editItemId ? "Edit Item" : "Add Item"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formItemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                />
              </Form.Group>
              <Form.Group controlId="formItemQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={newItem.stock}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />
              </Form.Group>
              <Form.Group controlId="formItemCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={newItem.category}
                  onChange={handleChange}
                  placeholder="Select category"
                >
                  <option value="">Select a category</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="seafood">Seafood</option>
                  <option value="fruit">Fruit</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="bakery">Bakery</option>
                  <option value="beverages">Beverages</option>
                  <option value="spreads">Spreads</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formItemCalories">
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  type="number"
                  name="calories"
                  value={newItem.calories}
                  onChange={handleChange}
                  placeholder="Enter calories"
                />
              </Form.Group>
              <Form.Group controlId="formItemProtein">
                <Form.Label>Protein</Form.Label>
                <Form.Control
                  type="number"
                  name="protein"
                  value={newItem.protein}
                  onChange={handleChange}
                  placeholder="Enter protein"
                />
              </Form.Group>
              <Form.Group controlId="formItemFat">
                <Form.Label>Fat</Form.Label>
                <Form.Control
                  type="number"
                  name="fat"
                  value={newItem.fat}
                  onChange={handleChange}
                  placeholder="Enter fat"
                />
              </Form.Group>
              <Form.Group controlId="formItemExpiryDate">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  name="expiryDate"
                  value={newItem.expiryDate}
                  onChange={handleChange}
                  placeholder="Enter expiry date"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addItem}>
              {editItemId ? "Save Changes" : "Add Item"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showTakeOutModal}
          onHide={() => setShowTakeOutModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Take Out Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              How many {takeOutItem && takeOutItem.name} do you want to take
              out?
            </p>
            <Form.Group controlId="formTakeOutQuantity">
              <Form.Control
                type="number"
                value={takeOutQuantity}
                onChange={(e) => setTakeOutQuantity(parseInt(e.target.value))}
                placeholder="Enter quantity"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowTakeOutModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleTakeOut}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <table className="table table-striped text-dark">
          <thead>
            <tr>
              <th scope="col">Quantity</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Calories</th>
              <th scope="col">Protein</th>
              <th scope="col">Fat</th>
              <th scope="col">Expiry Date</th>
              <th scope="col">Stock Status</th>
              <th scope="col">Notes</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isProfileItem = profileItems.some(
                (profileItem) => profileItem.id === item.id
              );
              console.log(
                `Item ID: ${item.id}, Is Profile Item: ${isProfileItem}`
              );

              return (
                <tr
                  key={item.id}
                >
                  <td>{item.stock}</td>
                  <td style={{ fontWeight: isProfileItem ? "bold" : "normal", color: isProfileItem ? "red" : "inherit" }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.calories}</td>
                  <td>{item.protein}</td>
                  <td>{item.fat}</td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td className={item.stock === 1 ? "text-danger" : ""}>
                    {item.stock === 1 ? "Low Stock" : ""}
                  </td>
                  <td
                    className={
                      calculateDaysUntilExpiry(item.expiryDate) <= 0
                        ? "text-danger"
                        : calculateDaysUntilExpiry(item.expiryDate) <= 3
                        ? "text-warning"
                        : ""
                    }
                  >
                    {calculateDaysUntilExpiry(item.expiryDate) <= 0
                      ? "Expired"
                      : calculateDaysUntilExpiry(item.expiryDate) <= 3
                      ? "Near Expiry"
                      : ""}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => deleteItem(item.id)}
                      style={{ marginRight: "5px", fontSize: "0.7rem" }}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setNewItem(item);
                        setEditItemId(item.id);
                        setShow(true);
                      }}
                      style={{ marginLeft: "5px", fontSize: "0.7rem" }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleTakeOutConfirm(item)}
                      style={{ marginLeft: "5px",fontSize: "0.7rem" }}
                    >
                      <FaUtensilSpoon />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fridge;
