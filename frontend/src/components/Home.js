import React, {useEffect, useState} from 'react';
// import './Home.css';
// Схема для моделі поста
// const postSchema = new mongoose.Schema({
//     nickname: String,
//     caption: String,
//     imagePath: String,
// });

const Home = () => {
    const [randomPosts, setRandomPosts] = useState([]);
    const [comment, setComment] = useState('');

    const handleSendComment = (postId) => {
        // Handle sending comment logic (you can implement this later)
        console.log(`Sending comment for post ${postId}: ${comment}`);
        setComment(''); // Clear the input field after sending comment
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
                        {/* Display Random Posts */}
                        {/*{randomPosts.map((post) => (*/}
                        {/*    <div key={post._id} className="col">*/}
                        {/*        <img src={post.imagePath} alt="Post" />*/}
                        {/*        <p>{post.nickname}</p>*/}
                        {/*        <p>{post.caption}</p>*/}

                        {/* Input field for comments */}
                        <input
                            type="text"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Type your comment"
                        />

                        {/* Button to send comments */}
                        <button>Send Comment</button>
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
        // ))}
        // </div>
    );
};

export default Home;
