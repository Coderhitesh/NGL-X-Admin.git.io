import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './EditProduct.css';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    mainPrice: '',
    afterdiscount: '',
    categories: '',
    tags: '',
    stockQuantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/getProductById/${id}`);
        const product = response.data.data;
        setFormData({
          productName: product.productName,
          description: product.description,
          mainPrice: product.mainPrice,
          afterdiscount: product.afterdiscount,
          categories: product.categories,
          tags: product.tags,
          stockQuantity: product.stockQuantity
        });
        setImagePreviews(product.images || []);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/get-category'),
          axios.get('http://localhost:4000/api/get-tags')
        ]);
        setCategories(categoriesResponse.data.data);
        setAllTags(tagsResponse.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
    fetchCategoriesAndTags();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    const previews = fileArray.map(file => URL.createObjectURL(file));
    setFormData((prevData) => ({
      ...prevData,
      files: fileArray
    }));
    setImagePreviews(previews);
  };

  // console.log("form",formData)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    console.log(formData)
 

    try {
      const response = await axios.put(`http://localhost:4000/api/updateProduct/${id}`, formData, {
       
      });
      console.log('res', response.data); // Debugging line
      toast.success('Product updated successfully!');
      navigate('/all-product');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Product</h4>
        </div>
        <div className="links">
          <Link to="/all-product" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="categoryName" className="form-label">Category</label>
            <select onChange={handleChange} name='categories' value={formData.categories} className="form-select" id="categoryName">
              <option value="">Select Category</option>
              {categories && categories.map((category, index) => (
                <option key={index} value={category.MainCategory}>{category.MainCategory}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="productName" className="form-label">Product Name</label>
            <input type="text" onChange={handleChange} name='productName' value={formData.productName} className="form-control" id="productName" />
          </div>

          <div className="col-12">
            <label htmlFor="productDescription" className="form-label">Product Description</label>
            <textarea onChange={handleChange} name='description' value={formData.description} className="form-control" id="productDescription" />
          </div>

          <div className="mb-2">
            {imagePreviews.length > 0 && (
              <div className="d-flex gap-2 align-items-start">
                {imagePreviews.map((src, index) => (
                  <img key={index} src={src} alt={`Preview ${index}`} className="img-thumbnail mb-2" style={{ width: '100px', height: '100px' }} />
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleFileChange}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="price" className="form-label">Price</label>
            <input type="number" onChange={handleChange} name='mainPrice' value={formData.mainPrice} className="form-control" id="price" />
          </div>

          <div className="col-md-4">
            <label htmlFor="discountPrice" className="form-label">After Discount Price</label>
            <input type="number" onChange={handleChange} name='afterdiscount' value={formData.afterdiscount} className="form-control" id="discountPrice" />
          </div>

          <div className="col-md-4">
            <label htmlFor="tag" className="form-label">Tag</label>
            <select onChange={handleChange} name='tags' value={formData.tags} className="form-select" id="tag">
              <option value="">Select Tag</option>
              {allTags && allTags.map((tag, index) => (
                <option key={index} value={tag.title}>{tag.title}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
            <input type="number" onChange={handleChange} name='stockQuantity' value={formData.stockQuantity} className="form-control" id="stockQuantity" />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Update Product"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProduct;
