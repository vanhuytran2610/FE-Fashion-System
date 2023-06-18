import React, { useState } from "react";

import Navbar from "../../../layouts/user/Navbar";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();
  const [registerInput, setRegister] = useState({
    email: "",
    password: "",
    confirm_password: "",
    firstname: "",
    lastname: "",
    // role: '',
    // address: '',
    // phone: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
    //console.log(e.target.email);
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: registerInput.email,
      password: registerInput.password,
      confirm_password: registerInput.confirm_password,
      firstname: registerInput.firstname,
      lastname: registerInput.lastname,
      // role: registerInput.role,
      // address: registerInput.address,
      // phone: registerInput.phone
    };
    // console.log(data);
    // console.log(data.password);
    // console.log(data.confirm_password);
    // console.log(data.firstname);
    // console.log(data.lastname);

    try {
      axios.get("/sanctum/csrf-cookie").then((res) => {
        axios.post(`api/register`, data).then((result) => {
          if (result.data.status === 201) {
            localStorage.setItem("auth_token", result.data.token);
            localStorage.setItem("auth_name", result.data.data.firstname);
            console.log(result.data.message);
            history.push("/");
          } else {
            setRegister({ ...registerInput, error_list: result.data.error });
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>PERSONAL DETAILS</h4>
              </div>
              <div className="card-body">
                <form onSubmit={registerSubmit}>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleInput}
                      value={registerInput.email}
                      className="form-control"
                    ></input>
                    <span>{registerInput.error_list.email}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      onChange={handleInput}
                      value={registerInput.password}
                    ></input>
                    <span>{registerInput.error_list.password}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirm_password"
                      className="form-control"
                      onChange={handleInput}
                      value={registerInput.confirm_password}
                    ></input>
                    <span>{registerInput.error_list.confirm_password}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      className="form-control"
                      onChange={handleInput}
                      value={registerInput.firstname}
                    ></input>
                    <span>{registerInput.error_list.firstname}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      className="form-control"
                      onChange={handleInput}
                      value={registerInput.lastname}
                    ></input>
                    <span>{registerInput.error_list.lastname}</span>
                  </div>
                  {/* <div className="form-group mb-3">
                                        <label>Province</label>
                                        <select class="form-select" aria-label="Default select example">
                                            <option selected>Province</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>District</label>
                                        <select class="form-select" aria-label="Default select example">
                                            <option selected>District</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Ward</label>
                                        <select class="form-select" aria-label="Default select example">
                                            <option selected>Ward</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Address</label>
                                        <input type="" name="address" className="form-control" onChange={handleInput} value={registerInput.address}></input>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Phone</label>
                                        <input type="" name="phone" className="form-control" onChange={handleInput} value={registerInput.phone}></input>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Role</label>
                                        <input type="" name="role" className="form-control" onChange={handleInput} value={registerInput.role}></input>
                                    </div> */}
                  <div className="form-group mb-3">
                    <button type="submit" className="btn btn-secondary">
                      Register
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

export default Register;
