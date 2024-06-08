import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const { id } = useParams();

    const [formData, setFormData] = useState({
        MainCategory: '',
        CatImg: null,
        previewImage: null
    });

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file,
                previewImage: URL.createObjectURL(file)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/get-category`);
            const res2 = res.data.data;
            const response = res2.filter((item) => item._id === id);
            const category = response[0];
            if (category) {
                setFormData({
                    MainCategory: category.MainCategory,
                    image: null,
                    previewImage: category.CatImg
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching category:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true);
        console.log(formData)
        const data = new FormData();
        data.append('categoryName', formData.MainCategory);
        if (formData.image) {
            data.append('image', formData.CatImg);
        }
        console.log('data',data)

        try {
            const response = await axios.post(`http://localhost:4000/api/update-category/${id}`, data);
            toast.success("Category Updated Successfully!");
            setBtnLoading(false);
            console.log("response",response)
            // window.location.href = '/all-category';
        } catch (error) {
            setBtnLoading(false);
            console.error('Error updating category:', error);
            toast.error(error.response?.data?.msg || 'An error occurred');
        }
    };

    useEffect(() => {
        handleFetch();
    }, [id]);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form className="row g-3" onSubmit={handleSubmit}>
                        <div className="col-md-6">
                            <label htmlFor="categoryName" className="form-label">Category Name</label>
                            <input type="text" onChange={handleChange} name='MainCategory' value={formData.MainCategory} className="form-control" id="categoryName" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="categoryImage" className="form-label">Category Image</label>
                            <input type="file" onChange={handleChange} name='CatImg' className="form-control" id="categoryImage" />
                        </div>
                        {formData.previewImage && (
                            <div className="col-12">
                                <img src={formData.previewImage} alt="Category Preview" style={{ width: '100px', height: '100px' }} />
                            </div>
                        )}
                        <div className="col-12 text-center">
                            <button type="submit" className={`${btnLoading ? 'not-allowed' : 'allowed'}`} disabled={btnLoading}>
                                {btnLoading ? "Please Wait..." : "Update Category"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditCategory;
