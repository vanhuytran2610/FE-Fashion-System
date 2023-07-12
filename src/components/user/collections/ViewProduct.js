import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { Loading } from "../../Loading";
import ReactPaginate from "react-paginate";
import axios from "axios";
import swal from "sweetalert";

export function ViewProduct(props) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(product.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;
    

    const category_id = props.match.params.id;
    axios.get(`/api/get-products/${category_id}`).then((response) => {
      if (isMounted) {
        if (response.data.status === 200) {
          setProduct(response.data.data.product);
          setCategory(response.data.data.category);
          document.title = response.data.data.category.category;
          setLoading(false);
          console.log(response.data.data);
        } else if (response.data.status === 400) {
          history.push("/");
        } else if (response.data.status === 404) {
          history.push("/");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [history, props.match.params.id]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedProducts = product.slice(offset, offset + itemsPerPage);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
        <div className="my-3 mx-3">
          <div className="container">
            <div className="row mt-5">
              <h3 className="text-uppercase fw-bold col-md-10">
                {category.category}
              </h3>
              <h5 className="col-md-2 text-end mt-2">
                Result: {product.length}{" "}
                {product.length <= 1 ? "Item" : "Items"}
              </h5>
            </div>
            <hr></hr>
            <div className="row my-5">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((item, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card h-100 w-100 border-0 my-1">
                      <Link to={`/category/${item.category_id}/${item.id}`}>
                        <img
                          src={`http://localhost:8000/${item.image_avatar}`}
                          alt={item.name}
                          className="w-100"
                        />
                      </Link>
                      <div className="row">
                        <Link
                          to={`/category/${item.category_id}/${item.id}`}
                          className="link-secondary text-decoration-none col-sm-7"
                        >
                          <p style={{ fontSize: "80%" }}>{item.name}</p>
                        </Link>
                        <p
                          className="link-secondary col-sm-5 text-end"
                          style={{ fontSize: "80%" }}
                        >
                          {item.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="d-flex justify-content-center vh-100 ">
                  <h4>
                    <i className="bi bi-box"></i>
                  </h4>
                  <h4 className="mx-3">No products found</h4>
                </div>
              )}
            </div>
            {paginatedProducts.length > 0 && (
              <div className="d-flex justify-content-end">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination justify-content-end"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
