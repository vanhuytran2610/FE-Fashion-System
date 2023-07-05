import { Link } from "react-router-dom";
import React from "react";

function Page404() {
  const role_id = localStorage.getItem("role_id");

  return (
    <div className="container pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card card-body">
            <h1 className="text-center">404 | Page Not Found</h1>
          </div>
          <div className="text-center my-3">
          {role_id === "1" ? (
            <Link to="/admin" className="input-group-text btn btn-dark mx-3">
            Back to Home
          </Link>
          ): (
            <Link to="/" className="input-group-text btn btn-dark mx-3">
            Back to Home
          </Link>
          )}
          </div>
          
          
        </div>
      </div>
    </div>
  );
}

export default Page404;
