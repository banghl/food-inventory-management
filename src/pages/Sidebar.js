import React from "react";
import { BiFridge, BiBook, BiFoodMenu, BiFolder, BiBarChart, BiCart } from "react-icons/bi"; // Import Bootstrap Icons
import "../Styles/Sidebar.css"; 

function Sidebar() {
  return (
    <div className="bg-white">
      <div className="m-2">
        <span className="brand-name fs-4">App Name</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <a className="list-group-item list-group-item-action py-2 my-1">
          <BiFridge className="icon" /> Fridge
        </a>
        <a className="list-group-item list-group-item-action py-2 my-1">
          <BiBook className="icon" /> Recipes
        </a>
        <a className="list-group-item list-group-item-action py-2 my-1">
          <BiFoodMenu className="icon" /> Meals
        </a>
        <a className="list-group-item list-group-item-action py-2 my-1">
          <BiFolder className="icon" /> Portfolio
        </a>
        <a className="list-group-item list-group-item-action py-2 my-1">
          <BiBarChart className="icon" /> Statistic
        </a>
        <a className="list-group-item list-group-item-action py-2 my-1">
          <BiCart className="icon" /> Shopping List
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
