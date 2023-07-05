/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable default-case */

import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";

import { Loading } from "../Loading";
import QRImg from "../../images/QR.png";
import ReactDOM from "react-dom";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

export function Checkout() {
  const history = useHistory();
  if (!localStorage.getItem("auth_token")) {
    history.push("/");
    swal("Warning", "Login to go to Cart Page", "error");
  }

  const navigateBack = () => {
    history.goBack();
  };

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const [checkoutInput, setCheckoutInput] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    address: "",
    province_code: "",
    district_code: "",
    ward_code: "",
  });
  const [error, setError] = useState([]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  var total_price_all = 0;
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = () => {
    axios.get("/api/getProvince").then((response) => {
      setProvinces(response.data.province);
    });
  };

  const fetchDistricts = (provinceCode) => {
    axios.get(`/api/getDistrict/${provinceCode}`).then((response) => {
      if (response.data.status === 404) {
        console.log(response.data.message);
      }
      setDistricts(response.data.district);
    });
  };

  const fetchWards = (districtCode) => {
    axios.get(`/api/getWard/${districtCode}`).then((response) => {
      if (response.data.status === 404) {
        console.log(response.data.message);
      }
      setWards(response.data.ward);
    });
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setCheckoutInput((prevState) => ({
      ...prevState,
      province: selectedProvince,
      district: "", // Reset district value
      ward: "", // Reset ward value
    }));
    fetchDistricts(selectedProvince);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setCheckoutInput((prevState) => ({
      ...prevState,
      district: selectedDistrict,
      ward: "", // Reset ward value
    }));
    fetchWards(selectedDistrict);
  };

  const handleWardChange = (e) => {
    const selectedWard = e.target.value;
    setCheckoutInput((prevState) => ({
      ...prevState,
      ward: selectedWard,
    }));
  };

  useEffect(() => {
    let isMounted = true;
    document.title = "Checkout";

    axios.get(`/api/cart`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setCart(res.data.data);
          console.log(cart);

          if (!res.data.data[0].user) {
            swal("Warning", "You are ordered", "warning").then(
              history.push("/")
            );
          }
          setLoading(false);
          setCheckoutInput((prevState) => ({
            ...prevState,
            firstname: res.data.data[0].user.firstname || "",
            lastname: res.data.data[0].user.lastname || "",
            phone: res.data.data[0].user.phone || "",
            email: res.data.data[0].user.email || "",
            address: res.data.data[0].user.address || "",
            province_code: res.data.data[0].user.province_code,
            district_code: res.data.data[0].user.district_code,
            ward_code: res.data.data[0].user.ward_code,
          }));
          // Auto-select province if code is available
          const provinceCode = res.data.data[0].user.province_code;
          if (provinceCode) {
            fetchDistricts(provinceCode);
            setCheckoutInput((prevState) => ({
              ...prevState,
              province: provinceCode,
            }));
          }
        } else if (res.data.status === 401) {
          history.push("/");
          swal("Warning", res.data.message, "error");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [history]);

  useEffect(() => {
    const districtCode = checkoutInput.district_code;
    const wardCode = checkoutInput.ward_code;

    if (districtCode && wardCode) {
      fetchWards(districtCode);
      setCheckoutInput((prevState) => ({
        ...prevState,
        district: districtCode,
        ward: wardCode,
      }));
    }
  }, [checkoutInput.district_code]);

  const handleInput = (e) => {
    e.persist();
    setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
  };

  const submitOrder = (e, payment_mode) => {
    e.preventDefault();

    const selectedProvince = checkoutInput.province;
    const selectedDistrict = checkoutInput.district;
    const selectedWard = checkoutInput.ward;

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      // Province, district, or ward is not selected
      return;
    }

    var data = {
      firstname: checkoutInput.firstname,
      lastname: checkoutInput.lastname,
      phone: checkoutInput.phone,
      email: checkoutInput.email,
      address: checkoutInput.address,
      province_code: selectedProvince,
      district_code: selectedDistrict,
      ward_code: selectedWard,
      payment_mode: payment_mode,
      status: 0,
    };

    switch (payment_mode) {
      case "cash":
        swal({
          title: "Are you sure you want to pay this order?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((confirm) => {
          if (confirm) {
            axios.post(`/api/place-order`, data).then((res) => {
              if (res.data.status === 200) {
                swal("Success", res.data.message, "success").then(() => {
                  window.location.replace("/thankyou");
                });

                setError([]);
              } else if (res.data.status === 422) {
                swal("All fields are mandatory", "", "error");
                setError(res.data.errors);
              } else if (res.data.status === 400) {
                swal("Error", res.data.message, "error").then(() => {
                  window.location.replace("/");
                });
              } else if (res.data.status === 401) {
                swal("Error", res.data.message, "error").then(() => {
                  window.location.replace("/");
                });
              } else if (res.data.status === 500) {
                swal("Error", res.data.message, "error").then(() => {
                  window.location.replace("/");
                });
              }
            });
          }
        });

        break;

      default:
        break;
    }
  };

  if (loading) {
    return <Loading />;
  }

  var checkout_HTML = "";
  if (cart.length > 0) {
    checkout_HTML = (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Personal Information</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>
                        <span className="required text-danger">*</span> First
                        Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        onChange={handleInput}
                        value={checkoutInput.firstname}
                        className="form-control"
                        required
                      />
                      <small className="text-danger">{error.firstname}</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>
                        <span className="required text-danger">*</span> Last
                        Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        onChange={handleInput}
                        value={checkoutInput.lastname}
                        className="form-control"
                        required
                      />
                      <small className="text-danger">{error.lastname}</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>
                        <span className="required text-danger">*</span> Phone
                        Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        onChange={handleInput}
                        value={checkoutInput.phone}
                        className="form-control"
                        required
                      />
                      <small className="text-danger">{error.phone}</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>
                        <span className="required text-danger">*</span> Email
                        Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        onChange={handleInput}
                        value={checkoutInput.email}
                        className="form-control"
                        required
                      />
                      <small className="text-danger">{error.email}</small>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-3">
                      <label>
                        <span className="required text-danger">*</span> Full
                        Address
                      </label>
                      <textarea
                        rows="3"
                        name="address"
                        onChange={handleInput}
                        value={checkoutInput.address}
                        className="form-control"
                        required
                      ></textarea>
                      <small className="text-danger">{error.address}</small>
                    </div>
                  </div>
                  <div className="form-group mb-3">
                    <label>
                      <span className="required text-danger">*</span> Province
                    </label>
                    <select
                      name="province"
                      className="form-select"
                      onChange={handleProvinceChange}
                      value={checkoutInput.province}
                      required
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
                    <label>
                      <span className="required text-danger">*</span> District
                    </label>
                    <select
                      name="district"
                      className="form-select"
                      onChange={handleDistrictChange}
                      value={checkoutInput.district}
                      required
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
                    <label>
                      <span className="required text-danger">*</span> Ward
                    </label>
                    <select
                      name="ward"
                      className="form-select"
                      onChange={handleWardChange}
                      value={checkoutInput.ward}
                      required
                    >
                      <option value="">Select Ward</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12 mt-3">
                    <div className="form-group text-end">
                      <button
                        type="button"
                        className="btn btn-danger mx-1"
                        onClick={navigateBack}
                      >
                        Back to Cart
                      </button>
                      <button
                        type="button"
                        className="btn btn-warning mx-1"
                        onClick={(e) => submitOrder(e, "cash")}
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th width="50%">Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => {
                  var totalCartPrice =
                    item.product.price * item.product_quantity;
                  total_price_all += totalCartPrice;
                  return (
                    <tr key={idx}>
                      <td>{item.product.name}</td>
                      <td>
                        {item.product.price.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}{" "}
                        VND
                      </td>
                      <td>{item.product_quantity}</td>
                      <td>
                        {String(totalCartPrice).replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}{" "}
                        VND
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="2" className="text-end fw-bold">
                    Total
                  </td>
                  <td colSpan="2" className="text-end fw-bold">
                    {String(total_price_all).replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}{" "}
                    VND
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else {
    checkout_HTML = (
      <div>
        <div className="card card-body py-5 text-center shadow-sm">
          <h4>Your Shopping Cart is Empty. You are in Checkout Page.</h4>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="py-4">
        <div className="container">{checkout_HTML}</div>
      </div>
    </div>
  );
}
