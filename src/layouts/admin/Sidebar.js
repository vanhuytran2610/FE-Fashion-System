import { Link } from "react-router-dom";
import React from "react";

const Sidebar = ({ sidebarOpen }) => {
  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav my-2">
          <Link className="nav-link" to="/admin/dashboard">
            <div className="sb-nav-link-icon">
              <i class="bi bi-speedometer"></i>
            </div>
            Dashboard
          </Link>
          <Link className="nav-link" to="/admin/view-category">
            <div className="sb-nav-link-icon">
              <i class="bi bi-card-checklist"></i>
            </div>
            Categories
          </Link>
          <Link
            className="nav-link collapsed"
            to="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseProducts"
            aria-expanded="false"
            aria-controls="collapseProducts"
          >
            <div className="sb-nav-link-icon">
              <i class="bi bi-box-seam-fill"></i>
            </div>
            Products
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </Link>
          <div
            className="collapse"
            id="collapseProducts"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link className="nav-link" to="/admin/view-product">
                View Product
              </Link>
              <Link className="nav-link" to="/admin/add-product">
                Create New Product
              </Link>
            </nav>
          </div>
          <Link
            className="nav-link collapsed"
            to="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseProfiles"
            aria-expanded="false"
            aria-controls="collapseProfiles"
          >
            <div className="sb-nav-link-icon">
              <i class="bi bi-person-lines-fill"></i>
            </div>
            Profile
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </Link>
          <div
            className="collapse"
            id="collapseProfiles"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link className="nav-link" to="/admin/info">
                View Profile
              </Link>
              <Link className="nav-link" to="/admin/change-password">
                Change Password
              </Link>
            </nav>
          </div>
          <Link
            className="nav-link"
            to="/admin/orders"
          >
            <div className="sb-nav-link-icon">
              <i class="bi bi-wallet-fill"></i>
            </div>
            Order List
          </Link>
          <Link
            className="nav-link"
            to="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="sb-nav-link-icon">
              <i class="bi bi-shop-window"></i>
            </div>
            Shopping
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
