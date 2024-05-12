import React from 'react';
import { BiFridge, BiBook, BiFoodMenu, BiCart, BiBarChart, BiLogOut } from 'react-icons/bi';
import "../Styles/Sidebar.css";

function Sidebar({ onSelectCategory, onLogout }) {
  return (
    <div className="bg-white">
      <div className="m-2">
        <span className="fs-4 fw-bold">Food Diary</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <button className="list-group-item list-group-item-action py-2 my-1" onClick={() => onSelectCategory('fridge')}>
          <BiFridge className="icon" /> Fridge
        </button>
        <button className="list-group-item list-group-item-action py-2 my-1" onClick={() => onSelectCategory('recipes')}>
          <BiBook className="icon" /> Recipes
        </button>
        <button className="list-group-item list-group-item-action py-2 my-1" onClick={() => onSelectCategory('meals')}>
          <BiFoodMenu className="icon" /> Meals Planner
        </button>
        <button className="list-group-item list-group-item-action py-2 my-1" onClick={() => onSelectCategory('shopping-list')}>
          <BiCart className="icon" /> Shopping List
        </button>
        <button className="list-group-item list-group-item-action py-2 my-1" onClick={() => onSelectCategory('statistic')}>
          <BiBarChart className="icon" /> Statistic
        </button>
        <button className="list-group-item list-group-item-action py-2 my-1" onClick={onLogout}>
          <BiLogOut className="icon" /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
