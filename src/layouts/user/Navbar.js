/* eslint-disable jsx-a11y/alt-text */

import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import logo from "../../images/logo1.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Navbar() {
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
      <li className="nav-item">
        <button
          type="button"
          className="nav-link btn btn-danger btn-sm text-white"
          onClick={logoutSubmit}
        >
          Logout
        </button>
      </li>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to="#">
          <img src={logo} width={400} height={60} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-1 mb-lg-0">{AuthButton}</ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
