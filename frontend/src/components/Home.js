import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PORT = window.env.PORT
const IP = window.env.IP
const Home = () => {
    const [popularPosts, setPopularPosts] = useState([]);
    const [comments, setComments] = useState({}); // Store comments for each post using post ID as keys
    const [commentInputs, setCommentInputs] = useState({}); // Separate comment input state for each post

    useEffect(() => {
        // Fetch popular posts when the component mounts
        const fetchPopularPosts = async () => {
            console.log( `http://${IP}:${PORT}/api/posts`);
            try {
                const response = await axios.get( `http://${IP}:${PORT}/api/posts`);
                setPopularPosts(response.data.posts);
            } catch (error) {
                console.error('Error fetching popular posts:', error.message || error);
            }
        };

        fetchPopularPosts();
    }, []);

    const handleSendComment = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');

            if (!token) {
                setCommentInputs({}); // Clear all comment input fields
                console.error('User not authenticated. Please sign in.');
                return;
            }

            const response = await axios.post(
                `http://${IP}:${PORT}/api/comments`,
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
            const response = await axios.get(`http://${IP}:${PORT}/api/comments/${postId}`);
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: response.data.comments,
            }));
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error.message || error);
        }
    };

    const renderCommentInput = (post) => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            // If no valid token, return null (comment input will not be rendered)
            return null;
        }

        return (
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
        );
    };

    useEffect(() => {
        popularPosts.forEach((post) => {
            fetchCommentsForPost(post._id);
        });
    }, [popularPosts]);

    return (
        <div className="container text-center mt-5">
            <h2 className="mb-4">Popular Posts</h2>
            <div className="row">
                {popularPosts.map((post) => (
                    <div key={post._id} className="col-lg-4 col-md-6 mb-4">
                        <div className="card p-3" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            {post.imageData && (
                                <img
                                    className="card-img-top"
                                    src={`data:image/jpeg;base64,${post.imageData}`}
                                    alt="Addition"
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title mb-3">{post.label}</h5>
                                <p className="card-text mb-2">{post.text}</p>
                                <p className="card-text">
                                    <small className="text-muted">Posted by {post.author.username}</small>
                                </p>
                            </div>
                            <div className="card-footer">
                                {comments[post._id] &&
                                    comments[post._id].map((comment) => (
                                        <div key={comment._id} className="mb-2">
                                            <strong>{comment.autor.username}:</strong>
                                            <p className="mb-0">{comment.text}</p>
                                        </div>
                                    ))}
                            </div>
                            {renderCommentInput(post)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;