import React, { useState, useEffect } from 'react';

function Fridge() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/items');
      const responseData = await response.json();
      if (responseData.flag) {
        setItems(responseData.data);
      } else {
        console.error('Failed to fetch items:', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-start" style={{ marginLeft: '200px' }}>
      <div className="bg-white p-4 rounded text-black" style={{ marginTop: '100px' }}>
        <h1>Fridge</h1>
        <table className="table table-striped text-dark">
          <thead>
            <tr>
              <th scope="col">Quantity</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Stock Status</th>
              <th scope="col">Expiry Date</th>
              <th scope="col">Days Left</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.stock}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.stockStatus}</td>
                <td>{item.expiryDate.join('/')}</td>
                <td>{item.daysLeft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fridge;
