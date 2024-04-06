import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Home() {
  return (
    <div className="container-fluid bg-dark min-vh-100">
      <div className="row">
        <div className="col-2 bg-white vh-100">
          <Sidebar />
        </div>
        <div className="col">
          <div className="d-flex justify-content-end">
            <Header />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
