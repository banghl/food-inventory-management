import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ManageUser() {
    const [food, setFood] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:8080/api/v1/profiles/users/2`, {
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
    }, []); // Trigger fetchItems when currentPage changes

    

    console.log("food: ", food);

    return (
        <div className="bg-white p-4 rounded text-black"
            style={{
                
                width: "100%",
                height: "100%",
               
            }}>
            <table className="table table-striped text-dark">
                <thead>
                    <tr>
                        <th scope="col">Users'ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Age</th>
                        <th scope="col">Description</th>
                        <th scope="col">Dietary</th>
                    </tr>
                </thead>
                <tbody>
                    {food.map((user) => (
                        <tr key={user.id}>
                           <td>
                            {user.id}
                           </td>
                           <td>
                            {user.name}
                           </td>
                           <td>
                            {user.age}
                           </td>
                           <td>
                            {user.description}
                           </td>
                           <td>
                            {user.dietary}
                           </td>
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
