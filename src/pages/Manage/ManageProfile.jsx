import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function ManageProfile() {
    const [profiles, setProfiles] = useState([]);

    const fetchProfiles = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:8080/api/v1/profiles", {
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
                setProfiles(responseData.data);
            } else {
                console.error("Failed to fetch profiles:", responseData.message);
            }
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    return (
        <div className="bg-white p-4 rounded text-black" style={{ width: "100%", height: "100%" }}>
            <table className="table table-striped text-dark">
                <thead>
                    <tr>
                        <th scope="col">Profile ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Age</th>
                        <th scope="col">Dietary</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((profile) => (
                        <tr key={profile.id}>
                            <td>{profile.id}</td>
                            <td>{profile.name}</td>
                            <td>{profile.age}</td>
                            <td>{profile.dietary}</td>
                            <td>{profile.description}</td>
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
    );
}
