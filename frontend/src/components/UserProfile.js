import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Profile.css';
import './Sign.css';

const UserProfile = () => {
    const [avatar, setAvatar] = useState(null);
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [type, setPetType] = useState('');
    const [name, setName] = useState('User123');
    const [posts, setPostUses] = useState('');
    const [isFollowed, setIsFollowed] = useState(false); // Assume initial state, you can set it based on your logic

    const handleFollowButtonClick = () => {
        // Toggle follow status
        setIsFollowed(!isFollowed);
    };

    useEffect(() => {
        // Fetch user profile data when the component mounts
        fetchProfileData();
    }, []); // Empty dependency array ensures the effect runs only once

    const fetchProfileData = async () => {
        try {
            // Get the token from wherever you stored it (e.g., session storage)
            const token = sessionStorage.getItem('token');
            // Make a GET request to the server endpoint with the token in the headers
            const response = await axios.get('http://localhost:5000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Extract data from the response
            const userData = response.data;
            // Update state with the fetched data
            setAge(userData.age);
            setBreed(userData.breed);
            setPetType(userData.type);
            setName(userData.fullName);
            // Fetch the avatar image
            // const avatarResponse = await axios.get('http://localhost:5000/api/avatar', {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     }});
            fetch('http://localhost:5000/api/avatar', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    if (blob.type.startsWith('image/jpeg') || blob.type.startsWith('image/png')) {
                        // Check if the blob is of type JPEG or PNG
                        const objectURL = URL.createObjectURL(blob);
                        setAvatar(objectURL);
                    } else {
                        throw new Error('The response is not a JPEG or PNG image.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                });

        } catch (error) {
            console.error('Error fetching profile data:', error.message || error);
        }
    };

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col d-flex justify-content-center">
                <div id="profile-container" className="container">
                    <form>
                        {/* Display the person's name at the top of the container */}
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
                                {/* Conditionally render "Follow" or "Unfollow" button */}
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

                            {/* Additional profile details can be added here */}

                        </div>
                    </form>
                    <div className="posts-container">
                        <h4>Posts:</h4>
                    </div>
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
};

export default UserProfile;
