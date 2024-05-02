import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Home from "./pages/Home";
import Fridge from "./pages/SideBarPages/Fridge";
import Recipes from './pages/SideBarPages/Recipes';
import Meals from './pages/SideBarPages/Meals';
import ShoppingList from './pages/SideBarPages/ShoppingList';

function App() {
  return (
    <div className="container-fluid bg-dark min-vh-100">
      <div className="row">
        <div className="col-2 bg-white vh-100">
          <Sidebar />
        </div>
        <div className="col-auto">
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;

