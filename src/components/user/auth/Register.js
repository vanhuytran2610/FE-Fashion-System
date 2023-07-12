import React, { useEffect, useState } from "react";

import Navbar from "../../../layouts/frontend/Navbar";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

function Register() {
  const history = useHistory();
  const [registerInput, setRegister] = useState({
    email: "",
    password: "",
    confirm_password: "",
    firstname: "",
    lastname: "",
    province_code: "",
    district_code: "",
    ward_code: "",
    address: "",
    phone: "",
    error_list: [],
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    document.title = "REGISTER";
    fetchProvinces();
  }, []);

  const fetchProvinces = () => {
    axios.get("/api/getProvince").then((response) => {
      setProvinces(response.data.province);
    });
  };

  const fetchDistricts = (provinceCode) => {
    axios.get(`/api/getDistrict/${provinceCode}`).then((response) => {
      setDistricts(response.data.district);
    });
  };

  const fetchWards = (districtCode) => {
    axios.get(`/api/getWard/${districtCode}`).then((response) => {
      setWards(response.data.ward);
    });
  };

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
    //console.log(e.target.email);
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setRegister((prevState) => ({
      ...prevState,
      province: selectedProvince,
      district: "", // Reset district value
      ward: "", // Reset ward value
    }));
    fetchDistricts(selectedProvince);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setRegister((prevState) => ({
      ...prevState,
      district: selectedDistrict,
      ward: "", // Reset ward value
    }));
    fetchWards(selectedDistrict);
  };

  const handleWardChange = (e) => {
    const selectedWard = e.target.value;
    setRegister((prevState) => ({
      ...prevState,
      ward: selectedWard,
    }));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const selectedProvince = registerInput.province;
    const selectedDistrict = registerInput.district;
    const selectedWard = registerInput.ward;

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      // Province, district, or ward is not selected
      return;
    }

    const data = {
      email: registerInput.email,
      password: registerInput.password,
      confirm_password: registerInput.confirm_password,
      firstname: registerInput.firstname,
      lastname: registerInput.lastname,
      province_code: selectedProvince,
      district_code: selectedDistrict,
      ward_code: selectedWard,
      address: registerInput.address,
      phone: registerInput.phone,
    };

    try {
      axios.get("/sanctum/csrf-cookie").then((res) => {
        axios.post(`api/register`, data).then((result) => {
          if (result.data.status === 201) {
            localStorage.setItem("auth_token", result.data.token);
            localStorage.setItem("auth_name", result.data.data.firstname + " " + result.data.data.lastname);
            console.log(result.data.data);
            history.push("/");
            window.location.reload();
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
                  <div className="form-group mb-3">
                    <label>Province</label>
                    <select
                      name="province"
                      className="form-select"
                      onChange={handleProvinceChange}
                      value={registerInput.province}
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label>District</label>
                    <select
                      name="district"
                      className="form-select"
                      onChange={handleDistrictChange}
                      value={registerInput.district}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label>Ward</label>
                    <select
                      name="ward"
                      className="form-select"
                      onChange={handleWardChange}
                      value={registerInput.ward}
                    >
                      <option value="">Select Ward</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <label>Address</label>
                    <input
                      type=""
                      name="address"
                      className="form-control"
                      onChange={handleInput}
                      value={registerInput.address}
                    ></input>
                  </div>
                  <div className="form-group mb-3">
                    <label>Phone</label>
                    <input
                      type=""
                      name="phone"
                      className="form-control"
                      onChange={handleInput}
                      value={registerInput.phone}
                    ></input>
                  </div>

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
