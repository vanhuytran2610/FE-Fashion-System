import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import axios from "axios";
import logo from "../../images/logo1.png";

function Navbar({ handleSidebarToggle }) {
  const history = useHistory();
  const [cart, setCart] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    axios.get(`/api/cart`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setCart(res.data.data);
          console.log(res.data.data);
        } else if (res.data.status === 401) {
          console.log(res.data.message);
        }
      }
    });

    if (localStorage.getItem("auth_name")) {
      const authName = localStorage.getItem("auth_name");
      const [firstName, lastName] = authName.split(" ");
      setFirstname(firstName);
      setLastname(lastName);
    }

    return () => {
      isMounted = false;
    };
  }, [history]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`/api/products/search?search=${searchTerm}`);
      // Process the search results as per your requirement
      console.log(response.data);
      // Redirect to search results page
      history.push(`/search?term=${searchTerm}`);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutSubmit = (e) => {
    e.preventDefault();

    axios.post(`api/auth/logout`).then((result) => {
      if (result.data.status === 200) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_name");
        console.log(result.data.message);
        window.location.reload();
        history.push("/");
      }
    });
  };

  let AuthButton = null;
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
      <>
        <li className="nav-item dropdown">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </Link>
          <ul
            className="dropdown-menu dropdown-menu-end"
            style={{ width: "50%" }}
            aria-labelledby="navbarDropdown"
          >
            <li>
              <Link className="dropdown-item" to="/info">
                {firstname} {lastname}
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/change-password">
                Change Password
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/order-list">
                Order
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="/login"
                onClick={logoutSubmit}
              >
                Logout
              </Link>
            </li>
          </ul>
        </li>
      </>
    );
  }

  return (
    <nav className="sb-topnav navbar navbar-expand-lg bg-body-tertiary">
      <div className="sb-topnav mx-3 navbar navbar-expand-lg">
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 text-secondary"
          id="sidebarToggle"
          onClick={handleSidebarToggle}
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link className="navbar-brand ps-3" to="/">
          <img src={logo} width={200} height={30} alt="Logo" />
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

        {/* <!-- Navbar--> */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4"></ul>
        <div
          className="collapse navbar-collapse my-2"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <form
              className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0 text-end"
              onSubmit={handleSearchSubmit}
            >
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search for..."
                  aria-label="Search for..."
                  aria-describedby="btnNavbarSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-secondary"
                  id="btnNavbarSearch"
                  type="submit"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
            <li>
              <div className="mt-2 mx-2">
                <Link
                  className="text-secondary text-decoration-none"
                  to="/cart"
                >
                  <i className="bi bi-bag-fill"></i>({cart.length})
                </Link>
              </div>
            </li>
            {AuthButton}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
