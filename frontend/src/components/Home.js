import React, {useEffect, useState} from 'react';

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
            <div className="row">
                {randomPosts.map(post => (
                    <div key={post._id} className="col-md-4">
                        <div className="container">
                            <img src={post.imagePath} alt="Post"/>
                            <p>{post.nickname}</p>
                            <p>{post.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );


};
            export default Home;