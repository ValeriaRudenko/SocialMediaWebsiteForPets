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


    return (
        <div>
            <h2>Popular posts</h2>

            {/* Display Random Posts */}
            <div className="row">
<<<<<<< Updated upstream
                {randomPosts.map(post => (
                    <div key={post._id} className="col-md-4">
                        <div className="container">
                            <img src={post.imagePath} alt="Post"/>
                            <p>{post.nickname}</p>
                            <p>{post.caption}</p>
=======
                {popularPosts.map((post) => (
                    <div key={post._id} className="col-lg-4 col-md-6 mb-4">
                        <div className="card p-3" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <img
                                className="card-img-top"
                                src={`data:image/jpeg;base64,${post.imageData}`} // Assuming post.imageData is base64 image data
                                alt="Post"
                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                            />
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
>>>>>>> Stashed changes
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
export default Home;