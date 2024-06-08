import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [allTags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    categories: '',
    productName: '',
    description: '',

    mainPrice: '',
    afterdiscount: '',

    tags: '',
    files: [],
    stockQuantity: ''
  });
  const [isLoading, setIsloding] = useState(false)
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);
    const previews = fileArray.map(file => URL.createObjectURL(file));

    setFormData((prevFormData) => ({
      ...prevFormData,
      files: fileArray
    }));
    setImagePreviews(previews);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: val
    });
  };

  const handleFetch = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/get-category');
      setCategories(res.data.data)
      console.log(res.data.data)
      console.log(categories)
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  }

  const handleTags = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/get-tags');
      setTags(res.data.data)
      console.log(allTags)
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  }

  useEffect(() => {
    handleFetch();
    handleTags();
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloding(true);

    try {
      const formDataToSubmit = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== 'files') {
          formDataToSubmit.append(key, formData[key]);
        }
      }
      if (formData.files) {
        formData.files.forEach((file) => {
          formDataToSubmit.append('images', file);
        });
      }

      const response = await axios.post('http://localhost:4000/api/createProduct', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      toast.success('Product Added Successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error("An Error Occurred");
    } finally {
      setIsloding(false);
    }
  };


  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-product" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div class="col-md-4">
            <label htmlFor="categoryName" class="form-label">State</label>
            <select onChange={handleChange} name='categories' value={formData.categoryName} className="form-select" id="categoryName">
              <option selected>Category</option>
              {categories && categories.map((category, index) => {
                return <option key={index}>{category.MainCategory}</option>;
              })}
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

          {/* <div className="col-12">
                        <label className="form-label">Product Points</label>
                        {formData.productPoints.map((point, index) => (
                            <div key={index} className="d-flex mb-2">
                                <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => handlePointsChange(e, index)}
                                    className="form-control me-2"
                                />
                                <button type="button" onClick={() => handleRemovePoint(index)} className="btn btn-danger">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPoint} className="btn btn-primary">Add Point</button>
                    </div> */}

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

          {/* <div className="col-md-4">
                        <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
                        <input type="number" min="1" max="80" onChange={(e) => {
                            handleChange(e);
                            if (e.target.value !== '') {
                                const price = parseFloat(formData.price);
                                const discountPercentage = parseFloat(e.target.value);
                                const discountedPrice = price - (price * (discountPercentage / 100));
                                setFormData(prevState => ({
                                    ...prevState,
                                    discountPrice: discountedPrice.toFixed(2)
                                }));
                            }
                        }} name='discountPercentage' value={formData.discountPercentage} className="form-control" id="discountPercentage" />
                    </div> */}


          {/* <div className="col-md-4">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" onChange={handleChange} name='tags' value={formData.tags} className="form-control" id="tag" />
          </div> */}

          <div class="col-md-4">
            <label htmlFor="tag" class="form-label">Tag</label>
            <select onChange={handleChange} name='tags' value={formData.tag} className="form-select" id="tag">
              <option selected>Select Tag</option>
              {allTags && allTags.map((tags, index) => {
                return <option key={index}>{tags.title}</option>;
              })}
            </select>
          </div>

          {/* <div className="col-md-4">
                        <label htmlFor="sku" className="form-label">SKU</label>
                        <input type="text" onChange={handleChange} name='sku' value={formData.sku} className="form-control" id="sku" />
                    </div> */}

          {/* <div className="col-md-4">
                        <label htmlFor="inStock" className="form-label">In Stock</label>
                        <input type="checkbox" onChange={handleChange} name='inStock' checked={formData.inStock} className="form-check-input" id="inStock" />
                    </div> */}

          <div className="col-md-4">
            <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
            <input type="number" onChange={handleChange} name='stockQuantity' value={formData.stockQuantity} className="form-control" id="stockQuantity" />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Product"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProduct;