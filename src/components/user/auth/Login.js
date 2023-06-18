import React, { useState } from "react";

import Navbar from "../../../layouts/user/Navbar";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

function Login() {
  const history = useHistory();
  const [loginInput, setLogin] = useState({
    email: "",
    password: "",
    invalid: "",
    error: "",
    error_list: [],
  });

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
          localStorage.setItem("auth_name", result.data.data.firstname);
          console.log(result.data.message);
          history.push("/");
          if (result.data.role === 'Admin') {
            history.push('/admin/dashboard');
          }
          else if (result.data.role === 'User') {
            history.push("/");
          }
        } else if (result.data.status === 'Invalid') {
            //setLogin({ ...loginInput, invalid: result.data.message });
            swal("Invalid",result.data.message, "warning");
        } 
        else if (result.data.status === 'Error') {
            //setLogin({ ...loginInput, error: result.data.message });
            swal("Error",result.data.message, "warning");
        }
        else {
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
