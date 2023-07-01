import React, { useEffect, useState } from "react";

import axios from "axios";
import swal from "sweetalert";

export function Profile() {
  const [userProfile, setUserProfile] = useState({
    firstname: "",
    lastname: "",
    province_code: "",
    district_code: "",
    ward_code: "",
    address: "",
    phone: "",
    email: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchProvinces();
  }, []);

  const fetchProfile = () => {
    axios
      .get("/api/profile")
      .then((response) => {
        const userData = response.data.data;
        setUserProfile(userData);
        fetchDistricts(userData.province_code);
        fetchWards(userData.district_code);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      province_code: selectedProvince,
      district_code: "",
      ward_code: "",
    }));
    fetchDistricts(selectedProvince);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      district_code: selectedDistrict,
      ward_code: "",
    }));
    fetchWards(selectedDistrict);
  };

  const handleWardChange = (e) => {
    const selectedWard = e.target.value;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      ward_code: selectedWard,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/update-profile", userProfile)
      .then((response) => {
        swal("Success", response.data.message, "success");
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>PERSONAL DETAILS</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={userProfile.email}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        email: e.target.value,
                      })
                    }
                    disabled
                  />
                </div>
                <div className="form-group mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-control"
                    value={userProfile.firstname}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        firstname: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-control"
                    value={userProfile.lastname}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        lastname: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Province</label>
                  <select
                    name="province"
                    className="form-select"
                    value={userProfile.province_code}
                    onChange={handleProvinceChange}
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                      <option
                        key={province.code}
                        value={province.code}
                      >
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
                    value={userProfile.district_code}
                    onChange={handleDistrictChange}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option
                        key={district.code}
                        value={district.code}
                      >
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
                    value={userProfile.ward_code}
                    onChange={handleWardChange}
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
                    type="text"
                    name="address"
                    className="form-control"
                    value={userProfile.address}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={userProfile.phone}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group mb-3">
                  <button type="submit" className="btn btn-secondary">
                    Save
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
