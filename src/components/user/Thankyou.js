import React from "react";
import { Link } from "react-router-dom";

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
      <Link to="/" className="input-group-text btn btn-dark ">Back to Home</Link>
      </div>
      
    </div>
  );
}
