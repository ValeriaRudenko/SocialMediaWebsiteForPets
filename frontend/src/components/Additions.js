import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Additions = () => {
    const [allAdditions, setAllAdditions] = useState([]);
    const handlePageChange = (page) => {
        window.location.href = `/${page}`;
    };
    useEffect(() => {
        // Fetch all additions when the component mounts
        const fetchAllAdditions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/additions');
                setAllAdditions(response.data.additions);
            } catch (error) {
                console.error('Error fetching additions:', error.message || error);
            }
        };

        fetchAllAdditions();
    }, []);

    return (
        <div className="container">
            <h2 className="text-center mb-4">All Additions</h2>
            <button className="btn btn-primary mb-3" onClick={() => handlePageChange('addaddition')}>
                New addition
            </button>

            <div className="row">
                <div className="col"></div>
                <div className="col d-flex justify-content-center">
                    <div className="container">
                        {/* Display All Additions */}
                        {allAdditions.map((addition) => (
                            <div key={addition._id} className="col-lg-4 mb-4">
                                <div className="card">
                                    <img className="card-img-top" src={addition.image} alt="Addition" />
                                    <div className="card-body">
                                        <h5 className="card-title">{addition.label}</h5>
                                        <p className="card-text">{addition.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    );
};

export default Additions;
