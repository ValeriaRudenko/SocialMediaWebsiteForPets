import React, { useEffect, useState } from 'react';
import axios from 'axios';


const PORT = window.env.BACKENDPORT
const IP = window.env.IP
const Additions = () => {
    const [allAdditions, setAllAdditions] = useState([]);
    const handlePageChange = (page) => {
        window.location.href = `/${page}`;
    };
    useEffect(() => {
        // Fetch all additions when the component mounts
        const fetchAllAdditions = async () => {
            try {
                const response = await axios.get(`http://${IP}:${PORT}/api/additions`);
                setAllAdditions(response.data.additions);
            } catch (error) {
                console.error('Error fetching additions:', error.message || error);
            }
        };

        fetchAllAdditions();
    }, []);

    return (

            <div className="container text-center mt-5">
                <h2 className="mb-4">All Additions</h2>
                <button className="button_in_cont"  onClick={() => handlePageChange('addaddition')}>
                    New addition
                </button>
                <div className="row">
                    {allAdditions.map((addition) => (
                        <div key={addition._id} className="col-lg-4 col-md-6 mb-4">
                            <div className="card p-3" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                {addition.imageData && (
                                    <img
                                        className="card-img-top"
                                        src={`data:image/jpeg;base64,${addition.imageData}`}
                                        alt="Addition"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title mb-3">{addition.label}</h5>
                                    <p className="card-text mb-2">{addition.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

    );
};

export default Additions;
