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

    const handleFollowButtonClick = async () => {
        try {
            const token = sessionStorage.getItem('token');
            // Make a POST request to the server endpoint with the token in the headers
            const response = await axios.post('http://localhost:5000/api/subscribe', {
                subscribedUserId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                setIsFollowed(true);
            } else {
                console.error('Failed to follow user:', response.data.message);
            }
        } catch (error) {
            console.error('Error following user:', error.message || error);
        }
    };

    const handleUnfollowButtonClick = async () => {
        try {
            const token = sessionStorage.getItem('token');
            // Make a POST request to the server endpoint with the token in the headers
            const response = await axios.post('http://localhost:5000/api/unsubscribe', {
                subscribedUserId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setIsFollowed(false);
            } else {
                console.error('Failed to unfollow user:', response.data.message);
            }
        } catch (error) {
            console.error('Error unfollowing user:', error.message || error);
        }
    };

    useEffect(() => {
        fetchProfileData();
        fetchUserPosts();
        checkSubscriptionStatus();
    }, [id]);

    const fetchProfileData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/profilebyid', {
                id,
            });

            const userData = response.data;
            setAge(userData.age);
            setBreed(userData.breed);
            setPetType(userData.type);
            setName(userData.fullName);

            const avatarResponse = await axios.get(`http://localhost:5000/api/avatarbyid/${id}`, {
                userId: id,
            });
            setAvatar(avatarResponse.data);
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

    const checkSubscriptionStatus = async () => {
        try {
            const token = sessionStorage.getItem('token');
            // Make a POST request to the server endpoint with the token in the headers
            const response = await axios.post('http://localhost:5000/api/checksubscription', {
                subscribedUserId: id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsFollowed(response.data.isSubscribed);
        } catch (error) {
            console.error('Error checking subscription status:', error.message || error);
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
                            src={`data:image/jpeg;base64,${avatar}`}

                            alt="Avatar"
                        />
                        <div>
                            <div>
                                {isFollowed ? (
                                    <button onClick={handleUnfollowButtonClick}>
                                        Unfollow
                                    </button>
                                ) : (
                                    <button onClick={handleFollowButtonClick}>
                                        Follow
                                    </button>
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
                                    src={`data:image/jpeg;base64,${post.imageData}`}
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
