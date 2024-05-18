import React, { useState, useEffect } from 'react';

function FavouriteShoppingList() {
  const [favouriteShoppingLists, setFavouriteShoppingLists] = useState([]);

  useEffect(() => {
    fetchFavouriteShoppingLists();
  }, []);

  const fetchFavouriteShoppingLists = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/view/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const data = await response.json();
      if (data.flag) {
        setFavouriteShoppingLists(data.data);
      } else {
        console.error('Failed to fetch favorite shopping lists:', data.message);
      }
    } catch (error) {
      console.error('Error fetching favorite shopping lists:', error);
    }
  };

  const deleteShoppingList = async (userId, shoppingListId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/v1/shoppinglists/delete/${userId}/${shoppingListId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`HTTP ${response.status}: ${message}`);
      }

      const data = await response.json();
      if (data.flag) {
        setFavouriteShoppingLists(favouriteShoppingLists.filter(list => list.id !== shoppingListId));
      } else {
        console.error('Failed to delete shopping list:', data.message);
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  return (
    <div>
      <h1>Favorite Shopping Lists</h1>
      {favouriteShoppingLists.length > 0 ? (
        <ul>
          {favouriteShoppingLists.map(list => (
            <li key={list.id}>
              <div>
                <h3>{list.name}</h3>
                <p>Cost: ${list.cost.toFixed(2)}</p>
                <p>Description: {list.description}</p>
                <button onClick={() => deleteShoppingList(localStorage.getItem('userId'), list.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorite shopping lists found.</p>
      )}
    </div>
  );
}

export default FavouriteShoppingList;