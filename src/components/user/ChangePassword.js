import React, { useState } from "react";

import axios from "axios";

export function ChangePassword() {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.new_password !== passwords.confirm_password) {
      setError("New password and confirm password do not match");
      return;
    }

    const requestData = {
        old_password: passwords.old_password,
        password: passwords.new_password,
        confirm_password: passwords.confirm_password
      };

    axios
      .post("/api/change-password", requestData)
      .then((response) => {
        if (response.data.status === 200) {
          setSuccess(response.data.message);
          setError("");
        } else if (response.data.status === 422) {
          setError("Validation Error: Please check your inputs");
          console.log(response.data.errors);
        } else {
          setError("An error occurred while changing the password");
          setSuccess("");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("An error occurred while changing the password");
        setSuccess("");
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>CHANGE PASSWORD</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label>Old Password</label>
                  <input
                    type="password"
                    name="old_password"
                    className="form-control"
                    value={passwords.old_password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    className="form-control"
                    value={passwords.new_password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    className="form-control"
                    value={passwords.confirm_password}
                    onChange={handleChange}
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <div className="form-group mb-3">
                  <button type="submit" className="btn btn-secondary">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
