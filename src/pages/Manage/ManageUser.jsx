import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ManageUser() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`http://localhost:8080/api/v1/users`, {
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
                setUsers(responseData.data);
            } else {
                console.error("Failed to fetch users:", responseData.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []); // Trigger fetchUsers when currentPage changes

    return (
        <div className="bg-white p-4 rounded text-black"
            style={{
                width: "100%",
                height: "100%",
            }}>
            <table className="table table-striped text-dark">
                <thead>
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Roles</th>
                        <th scope="col">Profiles</th>
                        <th scope="col">Shopping Lists</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.roles}</td>
                            <td>{user.numberOfProfiles}</td>
                            <td>{user.numberOfShoppingLists}</td>
                            <td>
                                <Button variant="danger" style={{ marginRight: "5px" }}>
                                    <FaTrash />
                                </Button>
                                <Button variant="primary" style={{ marginLeft: "5px" }}>
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
