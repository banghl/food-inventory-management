import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

function Fridge() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    stock: "",
    category: "",
    expiryDate: "",
    calories: "",
  });

  useEffect(() => {
    fetchItems();
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

  const addItem = async () => {
    try {
      const token = getToken();
      const url = editItemId
        ? `http://localhost:8080/api/v1/items/update/${editItemId}`
        : "http://localhost:8080/api/v1/items/add";
      const method = editItemId ? "PUT" : "POST";

      // Capitalize the first letter of the category
      const capitalizedCategory =
        newItem.category.charAt(0).toUpperCase() + newItem.category.slice(1);

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newItem, category: capitalizedCategory }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        // If the item was added or edited successfully, fetch the items again to update the list
        fetchItems();
        setShow(false); // Close the modal
        setNewItem({
          // Reset newItem state
          name: "",
          stock: "",
          category: "",
          expiryDate: "",
          calories: "",
        });
        setEditItemId(null); // Reset editItemId after adding/editing
      } else {
        console.error("Failed to add/edit item:", responseData.message);
      }
    } catch (error) {
      console.error("Error adding/editing item:", error);
    }
  };

  const deleteItem = async (itemId) => {
    // Accept itemId as parameter
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:8080/api/v1/items/delete/${itemId}`, // Use the itemId directly
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
        // If the item was deleted successfully, fetch the items again to update the list
        fetchItems();
      } else {
        console.error("Failed to delete item:", responseData.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const editItem = async (itemId) => {
    try {
      const token = getToken();
      const url = `http://localhost:8080/api/v1/items/update/${itemId}`; // Use itemId parameter
      const method = "PUT";

      // Filter out null values from newItem
      const filteredNewItem = Object.fromEntries(
        Object.entries(newItem).filter(([_, value]) => value !== null)
      );

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredNewItem),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const responseData = await response.json();
      if (responseData.flag) {
        // If the item was edited successfully, fetch the items again to update the list
        fetchItems();
        setShow(false); // Close the modal
        setNewItem({
          // Reset newItem state
          name: "",
          stock: "",
          category: "",
          expiryDate: "",
          calories: "",
        });
        setEditItemId(null); // Reset editItemId after editing
      } else {
        console.error("Failed to edit item:", responseData.message);
      }
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const handleClose = () => {
    setShow(false);
    setEditItemId(null); // Reset editItemId when closing the modal
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

  return (
    <div
      className="bg-dark min-vh-100 d-flex justify-content-center align-items-start "
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
          <h1>Fridge</h1>
          <Button variant="primary" onClick={handleShow}>
            Add Item
          </Button>
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
                  <option value="bakery">Bakery</option>
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
            {editItemId ? (
              <Button variant="primary" onClick={editItem}>
                Save Changes
              </Button>
            ) : (
              <Button variant="primary" onClick={addItem}>
                Add Item
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <table className="table table-striped text-dark">
          <thead>
            <tr>
              <th scope="col">Quantity</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Calories</th>
              <th scope="col">Expiry Date</th>
              <th scope="col">Stock Status</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.stock}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.calories}</td>
                <td>{item.expiryDate.join("/")}</td>
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
                    style={{ marginRight: "5px" }}
                  >
                    <FaTrash />
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setNewItem(item); // Set the item details in newItem state
                      setEditItemId(item.id); // Set the editItemId to the item's ID
                      setShow(true); // Show the modal
                    }}
                    style={{ marginLeft: "5px" }}
                  >
                    <FaEdit />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fridge;
