import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import axios from "axios";
import swal from "sweetalert";

export function UpdateProduct(props) {
  const product_id  = props.match.params.id;
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category_id: "",
    color_id: "",
    price: "",
    sizes: [],
    image_avatar: null,
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleInput = (e) => {
    e.persist();
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (e, index) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => {
      const updatedSizes = [...prevProduct.sizes];
      if (updatedSizes.length === 0) {
        updatedSizes.push({ size_id: value, quantity: "" });
      } else {
        if (value === "") {
          // Retain the previous size_id if not selected
          updatedSizes[index] = { ...updatedSizes[index], quantity: "" };
        } else {
          updatedSizes[index] = { ...updatedSizes[index], [name]: value };
        }
      }
      return { ...prevProduct, sizes: updatedSizes };
    });
  };
  
  
  const handleImageAvatar = (e) => {
    setProduct({ ...product, image_avatar: e.target.files[0] });
  };

  const handleImages = (e) => {
    setProduct({ ...product, images: e.target.files });
  };

  useEffect(() => {
    document.title = "Update Product";
    // Fetch categories
    axios
      .get("/api/get-categories")
      .then((response) => {
        if (response.data.status === 200) {
          setCategories(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch colors
    axios
      .get("/api/get-colors")
      .then((response) => {
        if (response.data.status === 200) {
          setColors(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch sizes
    axios
      .get("/api/get-sizes")
      .then((response) => {
        if (response.data.status === 200) {
          setSizes(response.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get(`/api/get-product/${product_id}`).then((response) => {
      if (response.data.status === 200) {
        const productData = response.data.data;
        setProduct({
          name: productData.name,
          description: productData.description,
          category_id: productData.category_id,
          color_id: productData.color_id,
          price: productData.price,
          sizes: productData.sizes.map((size) => ({
            size_id: size.id,
            quantity: size.pivot.quantity,
          })),
          image_avatar: productData.image_avatar,
          images: productData.images,
        });
        console.log(productData)
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-product");
      }
      setLoading(false);
    });
  }, [product_id, history]);

  const submitProduct = (e) => {
    e.preventDefault();

    if (!product.sizes) {
      // Handle the case when product.sizes is undefined or null
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category_id", product.category_id);
      formData.append("color_id", product.color_id);
      formData.append("price", product.price);
      if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach((size, index) => {
          formData.append(`sizes[${index}][id]`, size.size_id);
          formData.append(`sizes[${index}][quantity]`, size.quantity);
        });
      }
      formData.append("image_avatar", product.image_avatar);
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          formData.append("images[]", product.images[i]);
        }
      }

      axios
        .post(`/api/auth/update-product/${product_id}`, formData)
        .then((response) => {
          if (response.data.status === 200) {
            swal("Success", response.data.message, "success");
            console.log(response.data);
            history.push("/admin/view-product")
            
          } else if (response.data.status === 422) {
            swal("All fields are mandatory", "", "error");
            console.log(response.data.errors);
          } else if (response.data.status === 404) {
            swal("Error", response.data.message, "error");
            history.push("/admin/view-product");
          }
          //setLoading(false);
        });
        
        
    } catch (err) {
      console.error(err);
    }
  };

  const addSizeField = () => {
    setProduct((prevProduct) => {
      const prevSizes = prevProduct.sizes || []; // Initialize as empty array if undefined
      return {
        ...prevProduct,
        sizes: [...prevSizes, { id: "", quantity: "" }],
      };
    });
  };

  const removeSizeField = (index) => {
    setProduct((prevProduct) => {
      const updatedSizes = [...prevProduct.sizes];
      updatedSizes.splice(index, 1);
      return { ...prevProduct, sizes: updatedSizes };
    });
  };

  return (
    <>
      <div className="container p-4">
        <div className="card">
          <div className="card-header">
            <h4>
              Update Product
              <Link
                to="/admin/view-product"
                className="btn btn-secondary btn-md float-end"
              >
                <i className="bi bi-arrow-left-circle"></i> View Product
              </Link>
            </h4>
          </div>
          <div className="card-body">
            <form onSubmit={submitProduct} encType="multipart/form-data">
              <div className="px-2 row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="name" className="form-label">
                    Product Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                    onChange={handleInput}
                    value={product.name}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="price" className="form-label">
                    Product Price:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    required
                    onChange={handleInput}
                    value={product.price}
                    max={10000000}
                    min={10000}
                  />
                </div>
                <div className="mb-3 col-md-12">
                  <label htmlFor="description" className="form-label">
                    Description:
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    required
                    onChange={handleInput}
                    value={product.description}
                  ></textarea>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="category_id" className="form-label">
                    Category:
                  </label>
                  <select
                    name="category_id"
                    className="form-control"
                    onChange={handleInput}
                    value={product.category_id}
                  >
                    <option value="">Select Category</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="color_id" className="form-label">
                    Color:
                  </label>
                  <select
                    name="color_id"
                    className="form-control"
                    onChange={handleInput}
                    value={product.color_id}
                  >
                    <option value="">Select Color</option>
                    {colors.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {product.sizes &&
                    product.sizes.map((size, index) => (
                      <div key={index} className="row">
                        <div className="col-md-6">
                          <label htmlFor="size_id" className="form-label">
                            Size:
                          </label>
                          <select
                            name="size_id"
                            className="form-control"
                            onChange={(e) => handleSizeChange(e, index)}
                            value={size.size_id}
                            required
                          >
                            <option value="">Select Size</option>
                            {sizes.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.size}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3 col-md-5">
                          <label htmlFor="quantity" className="form-label">
                            Product Quantity:
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            name="quantity"
                            required
                            onChange={(e) => handleSizeChange(e, index)}
                            value={size.quantity}
                            max={1000}
                            min={1}
                          />
                        </div>
                        <div className="col-md-1 pt-4">
                          {product.sizes.length > 1 && (
                            <i
                              class="bi bi-dash-circle-fill"
                              style={{ fontSize: 20 }}
                              onClick={() => removeSizeField(index)}
                            ></i>
                          )}
                        </div>
                      </div>
                    ))}
                  <div className="col-md-12 mb-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addSizeField}
                    >
                      <i class="bi bi-plus-circle-fill"></i> Add Size
                    </button>
                  </div>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="image_avatar" className="form-label">
                    Image Avatar:
                  </label>
                  <input
                    type="file"
                    name="image_avatar"
                    id="image_avatar"
                    className="form-control"
                    onChange={handleImageAvatar}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="images" className="form-label">
                    Images:
                  </label>
                  <input
                    type="file"
                    name="images"
                    id="images"
                    className="form-control"
                    multiple
                    onChange={handleImages}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-dark float-end my-3 mx-2"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
