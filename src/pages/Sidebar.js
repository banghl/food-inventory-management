import React from "react";
import { BiFridge, BiBook, BiFoodMenu, BiFolder, BiBarChart, BiCart, BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import "../Styles/Sidebar.css"; 

function Sidebar() {
  return (
    <div className="bg-white">
      <div className="m-2">
      <span className="fs-4 fw-bold ">Food Diary</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <Link to="/" className="list-group-item list-group-item-action py-2 my-1">
          <BiFridge className="icon" /> Fridge
        </Link>
        <Link to="/recipes" className="list-group-item list-group-item-action py-2 my-1">
          <BiBook className="icon" /> Recipes
        </Link>
        <Link to="/meals" className="list-group-item list-group-item-action py-2 my-1">
          <BiFoodMenu className="icon" /> Meals
        </Link>
        <Link to="/portfolio" className="list-group-item list-group-item-action py-2 my-1">
          <BiFolder className="icon" /> Portfolio
        </Link>
        <Link to="/statistic" className="list-group-item list-group-item-action py-2 my-1">
          <BiBarChart className="icon" /> Statistic
        </Link>
        <Link to="/shopping-list" className="list-group-item list-group-item-action py-2 my-1">
          <BiCart className="icon" /> Shopping List
        </Link>
        <Link to="/login" className="list-group-item list-group-item-action py-2 my-1">
          <BiLogOut className="icon" /> Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
