import React from "react";
import { Link } from "react-router-dom";
import { BiFridge, BiBook, BiFoodMenu, BiFolder, BiBarChart, BiCart, BiLogOut } from "react-icons/bi";
import "../Styles/Sidebar.css"; 

function Sidebar({ onSelectCategory, selectedCategory }) {
  return (
    <div className="bg-white">
      <div className="m-2">
        <span className="fs-4 fw-bold">Food Diary</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <Link to="/fridges" className={`list-group-item list-group-item-action py-2 my-1 ${selectedCategory === '/' ? 'active' : ''}`} onClick={() => onSelectCategory('/')}>
          <BiFridge className="icon" /> Fridge
        </Link>
        <Link to="/recipes" className={`list-group-item list-group-item-action py-2 my-1 ${selectedCategory === '/recipes' ? 'active' : ''}`} onClick={() => onSelectCategory('/recipes')}>
          <BiBook className="icon" /> Recipes
        </Link>
        <Link to="/meals" className={`list-group-item list-group-item-action py-2 my-1 ${selectedCategory === '/meals' ? 'active' : ''}`} onClick={() => onSelectCategory('/meals')}>
          <BiFoodMenu className="icon" /> Meals Planner
        </Link>
        <Link to="/shopping-list" className={`list-group-item list-group-item-action py-2 my-1 ${selectedCategory === '/shopping-list' ? 'active' : ''}`} onClick={() => onSelectCategory('/shopping-list')}>
          <BiCart className="icon" /> Shopping List
        </Link>
        <Link to="/statistic" className={`list-group-item list-group-item-action py-2 my-1 ${selectedCategory === '/statistic' ? 'active' : ''}`} onClick={() => onSelectCategory('/statistic')}>
          <BiBarChart className="icon" /> Statistic
        </Link>
        <Link to="/login" className={`list-group-item list-group-item-action py-2 my-1 ${selectedCategory === '/login' ? 'active' : ''}`} onClick={() => onSelectCategory('/login')}>
          <BiLogOut className="icon" /> Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
