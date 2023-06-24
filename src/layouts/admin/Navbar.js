import React, { useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Navbar = ({ handleSidebarToggle }) => {
  const history = useHistory();

  const logoutSubmit = (e) => {
    e.preventDefault();

    axios.post(`api/auth/logout`).then((result) => {
      if (result.data.status === 200) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_name");
        console.log(result.data.message);
        history.push("/");
      }
    });
  };

  var AuthButton = "";
  if (!localStorage.getItem("auth_token")) {
    AuthButton = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Register
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );
  } else {
    AuthButton = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/login" onClick={logoutSubmit}>
            Logout
          </Link>
        </li>
      </ul>
    );
  }
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <div className="sb-topnav mx-3 navbar navbar-expand navbar-dark">
        {/* <!-- Navbar Brand--> */}
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          onClick={handleSidebarToggle}
        >
          <i class="fas fa-bars"></i>
        </button>
        <Link className="navbar-brand ps-3" to="/admin">
          Store Management
        </Link>
        {/* <!-- Sidebar Toggle--> */}

        {/* <!-- Navbar Search--> */}
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          {/* <!-- Navbar--> */}
          {AuthButton}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
