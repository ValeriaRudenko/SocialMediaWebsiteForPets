import React, { useState } from 'react';
import axios from 'axios';
const PORT = window.env.PORT
const IP = window.env.IP

const AddAddition = () => {
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState('');
    const [text, setText] = useState('');
    const [additionMessage, setAdditionMessage] = useState('');

    const handleAddAddition = async () => {
        try {

            const formData = new FormData();
            formData.append('image', image);
            formData.append('label', label);
            formData.append('text', text);


            const response = await axios.post(`http://${IP}:${PORT}/api/additions`, formData, {
            });

            console.log('Addition Created Successfully:', response.data.message);
            setAdditionMessage(response.data.message);
        } catch (error) {
            console.error('Error Creating Addition:', error.response ? error.response.data.message : error.message);
            setAdditionMessage(error.response ? error.response.data.message : 'Internal server error');
        }
    };

    return (
        <div className="row">
            <div className="col"></div>
            {/* Empty column */}
            <div className="col d-flex justify-content-center">
                <div className="container">
                    <h2>Add a New Addition</h2>
                    <form encType="multipart/form-data">
                        <label>
                            <p>Image:</p>
                            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </label>
                        <label>
                            <p>Label:</p>
                            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
                        </label>
                        <label>
                            <p>Text:</p>
                            <textarea value={text} onChange={(e) => setText(e.target.value)} />
                        </label>
                        <button className="button_in_cont" type="button" onClick={handleAddAddition}>
                            Add Addition
                        </button>
                    </form>
                    {additionMessage && <p>{additionMessage}</p>}
                </div>
            </div>
            <div className="col"></div>
            {/* Empty column */}
        </div>
    );
};

export default AddAddition;
