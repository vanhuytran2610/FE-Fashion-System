import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Loading } from "../../Loading";
import Navbar from "../../../layouts/frontend/Navbar";
import axios from "axios";
import swal from "sweetalert";

function Login() {
  const history = useHistory();
  const [loginInput, setLogin] = useState({
    email: "",
    password: "",
    invalid: "",
    error: "",
    error_list: [],
  });

  useEffect(() => {
    document.title = "LOGIN"; // Set document title
  }, []);

  const handleInput = (e) => {
    e.persist();
    setLogin({ ...loginInput, [e.target.name]: e.target.value });
  };

  const loginSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: loginInput.email,
      password: loginInput.password,
    };

    axios.get("/sanctum/csrf-cookie").then((res) => {
      axios.post(`api/login`, data).then((result) => {
        if (result.data.status === 200) {
          localStorage.setItem("auth_token", result.data.token);
          localStorage.setItem(
            "auth_name",
            result.data.data.firstname + " " + result.data.data.lastname
          );
          localStorage.setItem("role_id", result.data.data.role_id);
          console.log(result.data.message);

          if (result.data.role === "Admin") {
            history.push("/admin/dashboard");
          } else if (result.data.role === "User") {
            history.push("/");
            window.location.reload();
          }
        } else if (result.data.status === "Invalid") {
          //setLogin({ ...loginInput, invalid: result.data.message });
          swal("Invalid", result.data.message, "warning");
        } else if (result.data.status === "Error") {
          //setLogin({ ...loginInput, error: result.data.message });
          swal("Error", result.data.message, "warning");
        } else {
          setLogin({ ...loginInput, error_list: result.data.error });
        }
      });
    });
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>LOG IN</h4>
              </div>
              <div className="card-body">
                <form onSubmit={loginSubmit}>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      onChange={handleInput}
                      value={loginInput.email}
                      required="Please"
                    ></input>
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      onChange={handleInput}
                      value={loginInput.password}
                      required
                    ></input>
                  </div>
                  <div className="form-group mb-3">
                    <button type="submit" className="btn btn-secondary">
                      Login
                    </button>
                  </div>

                  <div className="d-flex">
                    NEED AN ACCOUNT, PLEASE{" "}
                    <Link
                      className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-dark"
                      to="/register"
                    >
                      <p
                        className="text-dark mx-1"
                        style={{ fontWeight: "600" }}
                      >
                        REGISTER
                      </p>
                    </Link>{" "}
                    .
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
