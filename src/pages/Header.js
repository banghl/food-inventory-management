import React from "react";
import { Dropdown } from "react-bootstrap";
import "../Styles/Header.css";

function Header() {
  return (
    <div className="container-fluid bg-dark">
      <div className="row">
        <div className="col"></div>
        <div className="col d-flex justify-content-end align-items-center">
          <Dropdown>
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="custom-toggle"
            >
              User Profile
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Header;
