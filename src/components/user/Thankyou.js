import { Link } from "react-router-dom";
import React from "react";

export function Thankyou() {
  return (
    <div className="mt-5">
      <h1 className="align-items-center justify-content-center d-flex">
        <i className="bi bi-cart-check-fill"></i>
      </h1>
      <h4 className="align-items-center justify-content-center d-flex">
        Thank you for your order
      </h4>
      <div className="align-items-center justify-content-center d-flex my-5">
        <Link to="/" className="input-group-text btn btn-dark mx-3">
          Back to Home
        </Link>
        <Link to="/order-list" className="input-group-text btn btn-dark mx-3">
          My Order List
        </Link>
      </div>
    </div>
  );
}
