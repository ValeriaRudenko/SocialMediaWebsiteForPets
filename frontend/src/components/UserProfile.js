import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Profile.css';
import './Sign.css';
import { useParams } from 'react-router-dom';

const PORT = window.env.BACKENDPORT;
const IP = window.env.IP;

const UserProfile = () => {
    const [avatar, setAvatar] = useState(null);
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [type, setPetType] = useState('');
    const [name, setName] = useState('User123');
    const [posts, setPosts] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const { id } = useParams();

    const fetchProfileData = useCallback(async () => {
        try {
            const response = await axios.post(`http://${IP}:${PORT}/api/profilebyid`, {
                id,
            });

            const userData = response.data;
            setAge(userData.age);
            setBreed(userData.breed);
            setPetType(userData.type);
            setName(userData.fullName);

            const avatarResponse = await axios.get(`http://${IP}:${PORT}/api/avatarbyid/${id}`, {
                userId: id,
            });
            setAvatar(avatarResponse.data);
        } catch (error) {
            console.error('Error fetching profile data:', error.message || error);
        }
    }, [id]);

    const fetchUserPosts = useCallback(async () => {
        try {
            const response = await axios.get(`http://${IP}:${PORT}/api/posts/${id}`);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching user posts:', error.message || error);
        }
    }, [id]);

    const checkSubscriptionStatus = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                `http://${IP}:${PORT}/api/checksubscription`,
                {
                    subscribedUserId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsFollowed(response.data.isSubscribed);
        } catch (error) {
            console.error('Error checking subscription status:', error.message || error);
        }
    }, [id]);

    const handleFollowButtonClick = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                `http://${IP}:${PORT}/api/subscribe`,
                {
                    subscribedUserId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
            const response = await axios.post(
                `http://${IP}:${PORT}/api/unsubscribe`,
                {
                    subscribedUserId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

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
    }, [fetchProfileData, fetchUserPosts, checkSubscriptionStatus, id]);

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
                                    <button onClick={handleUnfollowButtonClick}>Unfollow</button>
                                ) : (
                                    <button onClick={handleFollowButtonClick}>Follow</button>
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
