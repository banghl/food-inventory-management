import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Fridge from './pages/SideBarPages/Fridge';
import Recipes from './pages/SideBarPages/Recipes';
import Meals from './pages/SideBarPages/Meals';
import FavouriteMeals from './pages/SideBarPages/FavouriteMeals';
import ShoppingList from './pages/SideBarPages/ShoppingList';
import Sidebar from './pages/Sidebar';
import Statistics from './pages/SideBarPages/Statistics';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('fridge'); 
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleChangeProfile = () =>{
    navigate('/profile');
  }

  
  let content;
  switch (selectedCategory) {
    case 'fridge':
      content = <Fridge />;
      break;
    case 'recipes':
      content = <Recipes />;
      break;
    case 'meals':
      content = <Meals />;
      break;
    case 'shopping-list':
      content = <ShoppingList />;
      break;
    case 'statistic':
      content = <Statistics />;
      break;
    case 'favourites':
        content = <FavouriteMeals/>;
        break;
    default:
      content = <Home />;
  }

  return (
    <div className="container-fluid bg-dark min-vh-100">
      <div className="row">
        <div className="col-2 bg-white vh-100">
          <Sidebar onSelectCategory={setSelectedCategory} onLogout={handleLogout} onChangeProfile ={handleChangeProfile}/>
        </div>
        <div className="col-auto">
          {content}
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;
