import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBanner = () => {
    const [isLoading, setIsloding] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        active: true,
        image: null, // Add file property to formData
    });
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first file from the input
        setFormData((prevData) => ({
            ...prevData,
            file: file, // Update file property
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
        // console.log(formData)
        try {
            const formDataToSend = new FormData(); // Create a new FormData object
            formDataToSend.append('title', formData.title); // Append title
            formDataToSend.append('active', formData.active); // Append active
            formDataToSend.append('images', formData.file); // Append file
            console.log(formDataToSend)
            const response = await axios.post(
                "http://localhost:4000/api/create-banners",
                formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            );
            console.log(response.data);
            toast.success('Banner Created')
            setMessage("Banner created successfully!");
        } catch (error) {
            toast.error('Server Error')
            console.error("Error creating banner:", error);
            setMessage("Error creating banner. Please try again.");
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="title" className="form-label">Banner Name</label>
                        <input type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange} className="form-control" id="title" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bannerImage" className="form-label">Banner Image</label>
                        <input type="file" onChange={handleFileChange} name='bannerImage' className="form-control" id="bannerImage" />
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" onChange={(e) => setFormData((prevData) => ({
                                ...prevData,
                                active: e.target.checked
                            }))} type="checkbox" name="active" id="active" checked={formData.active} />
                            <label className="form-check-label" htmlFor="active">
                                Active
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Banner"}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddBanner;