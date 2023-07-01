import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

export function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const [linkClicked, setLinkClicked] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setLinkClicked(true);
  };

  const handleClickInfo = (link) => {
    setSelectedLink(link);
  }

  useEffect(() => {
    let isMounted = true;

    axios
      .get("/api/get-categories")
      .then((response) => {
        if (isMounted) {
          if (response.data.status === 200) {
            setCategories(response.data.data);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <nav
      className="sb-sidenav accordion sb-sidenav-light"
      id="sidenavAccordion"
    >
      <div className="sb-sidenav-menu">
        <div className="nav my-2">
          {categories.map((category) => (
            <Link
              className={`nav-link link-secondary text-uppercase ${
                selectedCategory === category.id && linkClicked ? "fw-bold" : ""
              }`}
              to={`/category/${category.id}`}
              onClick={() => handleClick(category.id)}
            >
              {category.category}
            </Link>
          ))}
          {/* <Link
            className="nav-link collapsed"
            to="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseProducts"
            aria-expanded="false"
            aria-controls="collapseProducts"
          >
            <div className="text-secondary">INFOS</div>
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </Link> */}
          {/* <div
            className="collapse"
            id="collapseProducts"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link className={selectedLink === "about" ? "nav-link fw-bold link-secondary" : "nav-link link-secondary"} to="/about" onClick={() => handleClickInfo("about")}>
                About Us
              </Link>
              <Link className={selectedLink === "contact" ? "nav-link fw-bold link-secondary" : "nav-link link-secondary"} to="/contact" onClick={() => handleClickInfo("contact")}>
                Contact Us
              </Link>
            </nav>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
