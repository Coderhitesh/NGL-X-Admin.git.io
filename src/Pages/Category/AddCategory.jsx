import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        MainCategory: "",
        image: null,
        previewImage: null // State to hold the preview image
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first file from the input
        setFormData((prevData) => ({
            ...prevData,
            image: file, // Update file property
            previewImage: URL.createObjectURL(file) // Set preview image URL
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData(); // Create a new FormData object
            formDataToSend.append('MainCategory', formData.MainCategory); // Append title
            formDataToSend.append('images', formData.image); // Append file

            const response = await axios.post(
                "http://localhost:4000/api/create-category",
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            toast.success('Category Created');
            console.log(response.data);
            setIsLoading(false);
            setFormData({
                MainCategory: "",
                image: null,
                previewImage: null
            });

        } catch (error) {
            toast.error('Internal Error');
            console.error("Error creating category:", error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <input type="text" onChange={handleChange} name='MainCategory' value={formData.MainCategory} className="form-control" id="categoryName" required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="categoryImage" className="form-label">Category Image</label>
                        <input type="file" onChange={handleFileChange} name='images' className="form-control" id="categoryImage" required />
                    </div>
                    {formData.previewImage && (
                        <div className="col-12">
                            <img src={formData.previewImage} alt="Category Preview" style={{ width: '100px', height: '100px' }} />
                        </div>
                    )}
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Category"}</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCategory;
