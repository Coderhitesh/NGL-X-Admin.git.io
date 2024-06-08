import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddShopBanner = () => {
    const [formData, setData] = useState({
        BtnTitle: '',
        image: null,
        active: false
    });
    const [isLoading, setIsloding] = useState(false);
    
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setData(prevData => ({
                ...prevData,
                active: checked
            }));
        } else if (type === 'file') {
            setData(prevData => ({
                ...prevData,
                image: event.target.files[0]
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsloding(true);
        
        const data = new FormData();
        data.append('BtnTitle', formData.BtnTitle);
        data.append('images', formData.image);
        data.append('active', formData.active.toString());

        try {
           await axios.post('http://localhost:4000/api/create-sales-banners', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsloding(false);

            toast.success("Shop Banner Added Successfully !!");
            window.location.href = '/all-shop-banners';
        } catch (error) {
            setIsloding(false);

            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Shop Banner</h4>
                </div>
                <div className="links">
                    <Link to="/all-shop-banners" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="BtnTitle" className="form-label">Shop Banner Name</label>
                        <input type="text" onChange={handleChange} name='BtnTitle' value={formData.BtnTitle} className="form-control" id="saleBannerTitle" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="image" className="form-label">Shop Banner Image</label>
                        <input type="file" onChange={handleChange} name='images' className="form-control" id="saleBannerImage" />
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" onChange={handleChange} type="checkbox" name="active" id="active" checked={formData.active} />
                            <label className="form-check-label" htmlFor="active">
                                Active 
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className="btn btn-primary">
                            {isLoading ? "Please Wait..." : "Add Shop Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddShopBanner;
