import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import './Sign.css';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const [avatar, setAvatar] = useState(null);
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [type, setPetType] = useState('');
    const [name, setName] = useState('User123');
    const [posts, setPosts] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const { id } = useParams();

    const handleFollowButtonClick = () => {
        setIsFollowed(!isFollowed);
    };

    useEffect(() => {
        fetchProfileData();
        fetchUserPosts();
    }, [id]); // Fetch data when the user ID changes

    const fetchProfileData = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/profilebyid', {
                id,
            });

            const userData = response.data;
            setAge(userData.age);
            setBreed(userData.breed);
            setPetType(userData.type);
            setName(userData.fullName);

            // Fetch the avatar image
            const avatarResponse = await axios.get('http://localhost:5000/api/avatar', {
                headers: {
                    Authorization: `Bearer ${id}`,
                },
            });

            // Process the image response and set the avatar state
            const avatarBlob = await avatarResponse.data.blob();
            if (avatarBlob.type.startsWith('image/jpeg') || avatarBlob.type.startsWith('image/png')) {
                const objectURL = URL.createObjectURL(avatarBlob);
                setAvatar(objectURL);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error.message || error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching user posts:', error.message || error);
        }
    };

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col d-flex justify-content-center">
                <div id="profile-container" className="container">
                    <form>
                        <div className="name-container">
                            <h3>{name}</h3>
                        </div>
                        <img
                            id="avatar-image"
                            className={avatar ? 'avatar-with-image' : ''}
                            src={avatar}
                            alt="Avatar"
                        />
                        <div>
                            <div>
                                {isFollowed ? (
                                    <label className="upload-label" id="upload-label" htmlFor="unfollow-label"
                                           onClick={handleFollowButtonClick}>
                                        Unfollow
                                    </label>
                                ) : (
                                    <label className="upload-label" id="upload-label" htmlFor="follow-label"
                                           onClick={handleFollowButtonClick}>
                                        Follow
                                    </label>
                                )}
                            </div>
                            <div>
                                <p>Name: {name}</p>
                                <p>Pet type: {type}</p>
                                <p>Breed: {breed}</p>
                                <p>Age: {age}</p>
                            </div>
                        </div>
                    </form>
                    <div className="posts-container">
                        <h4>Posts:</h4>
                        {posts.map((post) => (
                            <div key={post._id} className="user-post">
                                <img
                                    className="card-img-top"
                                    src={`data:image/jpeg;base64,${post.imageData}`} // Assuming post.imageData is base64 image data
                                    alt="Post"
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                />
                                <div>
                                    <p>Label: {post.label}</p>
                                    <p>Text: {post.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
};

export default UserProfile;
