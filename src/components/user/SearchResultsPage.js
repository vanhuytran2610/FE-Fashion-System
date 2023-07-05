import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

function SearchResultsPage({ location }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const term = query.get("term");
    setSearchTerm(term);
    document.title = "Search";

    // Make the API call to retrieve search results based on the search term
    axios
      .get(`/api/products/search?search=${term}`)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location.search]);

  return (
    <div>
      <h2 className="m-4">Search Results for "{searchTerm}"</h2>
      {searchResults.length > 0 ? (
        <div className="my-3 mx-3">
          <div className="container">
            <h5 className="text-end mt-2">
              Result: {searchResults.length}{" "}
              {searchResults.length <= 1 ? "Item" : "Items"}
            </h5>
            <hr></hr>
            <div className="row my-5">
            {searchResults.map((product) => (
              <>
                  <div className="col-md-4">
                    <div className="card h-100 w-100 border-0 my-1">
                      <Link
                        to={`/category/${product.category_id}/${product.id}`}
                      >
                        <img
                          src={`http://localhost:8000/${product.image_avatar}`}
                          alt={product.name}
                          className="w-100"
                        />
                      </Link>
                      <div className="row">
                        <Link
                          to={`/category/${product.category_id}/${product.id}`}
                          className="link-secondary text-decoration-none col-sm-7"
                        >
                          <p style={{ fontSize: "80%" }}>{product.name}</p>
                        </Link>
                        <p
                          className="link-secondary col-sm-5 text-end"
                          style={{ fontSize: "80%" }}
                        >
                          {product.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          VND
                        </p>
                      </div>
                    </div>
                  </div>
              </>
            ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center vh-100">
          <h4>
            <i className="bi bi-box"></i>
          </h4>
          <h4 className="mx-3">No products found</h4>
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;
