import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [popularPosts, setPopularPosts] = useState([]);
    const [comments, setComments] = useState({}); // Store comments for each post using post ID as keys

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

    const [commentInputs, setCommentInputs] = useState({}); // Separate comment input state for each post

    const handleSendComment = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                setCommentInputs({}); // Clear all comment input fields
                console.error('User not authenticated. Please sign in.');
                return;
            }

            const response = await axios.post(
                'http://localhost:5000/api/comments',
                {
                    text: commentInputs[postId] || '', // Get the comment from the correct input field
                    postId: postId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Comment sent successfully:', response.data.message);

            // Clear the input field after sending comment
            setCommentInputs((prevInputs) => ({
                ...prevInputs,
                [postId]: '',
            }));

            // Fetch updated comments for the specific post
            fetchCommentsForPost(postId);

        } catch (error) {
            console.error('Error sending comment:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleCommentChange = (postId, e) => {
        const newCommentInputs = { ...commentInputs, [postId]: e.target.value };
        setCommentInputs(newCommentInputs);
    };

    const fetchCommentsForPost = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/comments/${postId}`);
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: response.data.comments,
            }));
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error.message || error);
        }
    };

    // Fetch comments for each post when the component mounts
    useEffect(() => {
        popularPosts.forEach((post) => {
            fetchCommentsForPost(post._id);
        });
    }, [popularPosts]);

    return (
        <div className="container">
            <h2 className="text-center mb-4">Popular Posts</h2>
            <div className="row">
                {popularPosts.map((post) => (
                    <div key={post._id} className="col-lg-4 mb-4">
                        <div className="card">
                            <img className="card-img-top" src={`http://localhost:5000/api/posts/${post._id}/image`} alt="Post" />
                            <div className="card-body">
                                <h5 className="card-title">{post.label}</h5>
                                <p className="card-text">{post.text}</p>
                                <p className="card-text">
                                    <small className="text-muted">{post.author.username}</small>
                                </p>
                            </div>

                            {/* Comments Section */}
                            <div className="card-footer">
                                {comments[post._id] &&
                                    comments[post._id].map((comment) => (
                                        <div key={comment._id} className="mb-2">
                                            <p className="mb-0">{comment.text}</p>
                                        </div>
                                    ))}
                            </div>

                            {/* Input field for comments */}
                            <div className="card-footer">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={commentInputs[post._id] || ''}
                                    onChange={(e) => handleCommentChange(post._id, e)}
                                    placeholder="Type your comment"
                                />
                                {/* Button to send comments */}
                                <button className="btn btn-primary" onClick={() => handleSendComment(post._id)}>
                                    Send Comment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
