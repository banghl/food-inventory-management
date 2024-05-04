import React from 'react'

function ShoppingList() {
  return (
    <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-start" style={{ marginLeft: '600px'}}>
      <div className="bg-white p-4 rounded text-black" style={{ marginTop: '100px' }}>
        <h1>Shopping List</h1>
        <table className="table table-striped text-dark">
          <thead>
            <tr>
              <th scope="col">Item Name</th>
              <th scope="col">Number</th>
              <th scope="col">Category</th>
            </tr>
          </thead>
          <tbody>
            {/* Your table rows go here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShoppingList