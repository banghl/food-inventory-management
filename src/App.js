import React from "react";
import Home from "./pages/Home";
import Sidebar from "./pages/Sidebar";

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
