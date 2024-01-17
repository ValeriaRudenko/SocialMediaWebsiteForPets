import React, { useState } from 'react';
import axios from 'axios';
const PORT = window.env.BACKENDPORT
const IP = window.env.IP
const NewPost = () => {
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState('');
    const [text, setText] = useState('');
    const [postMessage, setPostMessage] = useState('');

    const handlePost = async () => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                setPostMessage('User not authenticated. Please sign in.');
                return;
            }

            const formData = new FormData();
            formData.append('image', image);
            formData.append('label', label);
            formData.append('text', text);

            const response = await axios.post(`http://${IP}:${PORT}/api/posts`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Post Created Successfully:', response.data.message);
            setPostMessage(response.data.message);
        } catch (error) {
            console.error('Error Creating Post:', error.response ? error.response.data.message : error.message);
            setPostMessage(error.response ? error.response.data.message : 'Internal server error');
        }
    };

    return (
        <div className="row">
            <div className="col"></div>
            {/* Empty column */}
            <div className="col d-flex justify-content-center">
                <div className="container">
                    <h2>Create a New Post</h2>
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
                        <button className="button_in_cont" type="button" onClick={handlePost}>
                            Create Post
                        </button>
                    </form>
                    {postMessage && <p>{postMessage}</p>}
                </div>
            </div>
            <div className="col"></div>
            {/* Empty column */}
        </div>
    );
};

export default NewPost;
