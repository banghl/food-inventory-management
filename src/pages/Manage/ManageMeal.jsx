import { useState,useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaTrash,FaEdit } from "react-icons/fa";
export default function ManageMeal() {
    const [food, setFood] = useState([]);

    const fetchItems = async () => {
        try {
          const token = localStorage.getItem("authToken");
          console.log("token", token);
          const response = await fetch("http://localhost:8080/api/v1/meals", {
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
            setFood(responseData.data);
          } else {
            console.error("Failed to fetch items:", responseData.message);
          }
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };

      useEffect(() => {
        fetchItems();
      }, []);

      console.log("food: ",food)

  return (
    <div className="bg-white p-4 rounded text-black"
    style={{
     
      width: "100%",
      height: "100%",
      
    }}>
        <table className="table table-striped text-dark">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Cooking Time</th>
            <th scope="col">Ingredients</th>
            <th scope="col">Dietary Lists</th>
          </tr>
        </thead>
        <tbody>
            {food.map((user) => (
                <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.cookingTime}</td>
                <td>{user.ingredients.join(', ')}</td>
                <td>{user.dietaryLists.join(', ')}</td>
                <td>
                    <Button
                      variant="danger"
                      
                      style={{ marginRight: "5px" }}
                    >
                      <FaTrash />
                    </Button>
                    <Button
                      variant="primary"
                     
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
  )
}
