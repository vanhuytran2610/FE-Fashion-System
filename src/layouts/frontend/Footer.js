import { Link } from "react-router-dom";
import React from "react";

const Footer = ({ total, onCheckout }) => {
  return (
    <div
      className="navbar fixed-bottom navbar-light bg-light"
      style={{ height: "9%" }}
    >
      <div className="container-fluid">
        <div
          className="navbar-brand ms-auto"
          style={{ fontWeight: "600", fontSize: "110%" }}
        >
          Total &nbsp;&nbsp;{" "}
          {String(total).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND &nbsp;&nbsp;
        </div>
        <div className="navbar-brand">
          <button type="button" className="input-group-text btn btn-dark" onClick={onCheckout}>
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
