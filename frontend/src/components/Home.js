import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [popularPosts, setPopularPosts] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Fetch popular posts when the component mounts
        const fetchPopularPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts');
                setPopularPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching popular posts:', error.message || error);
            }
        };

        fetchPopularPosts();
    }, []);

    const handleSendComment = async (postId) => {
        try {
            // Handle sending comment logic
            const response = await axios.post('http://localhost:5000/api/comments', {
                text: comment,
                postId: postId,
            });

            console.log('Comment sent successfully:', response.data.message);
            setComment(''); // Clear the input field after sending comment
        } catch (error) {
            console.error('Error sending comment:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    return (
        <div>
            <h2>Popular posts</h2>
            <div className="row">
                <div className="col"></div>
                <div className="col d-flex justify-content-center">
                    <div className="container">
                        {/* Display Popular Posts */}
                        {popularPosts.map((post) => (
                            <div key={post._id} className="col">
                                <img src={`http://localhost:5000/api/posts/${post._id}/image`} alt="Post" />
                                <p>{post.author.username}</p>
                                <p>{post.label}</p>
                                <p>{post.text}</p>

                                {/* Input field for comments */}
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    placeholder="Type your comment"
                                />

                                {/* Button to send comments */}
                                <button onClick={() => handleSendComment(post._id)}>Send Comment</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    );
};

export default Home;
