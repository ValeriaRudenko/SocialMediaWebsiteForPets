import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [avatar, setAvatar] = useState(null);
    const [fullName, setFullName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [type, setPetType] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        // Fetch user profile data when the component mounts
        fetchProfileData();
    }, []); // Empty dependency array ensures the effect runs only once
    const handleSignOut = async () => {

        // Delete the token from session storage
        sessionStorage.removeItem('token');
        // Redirect or perform any additional actions after sign-out
        // For example, you can navigate to the login page
        window.location.reload();


    };

    const fetchProfileData = async () => {
        try {
            // Get the token from wherever you stored it (e.g., session storage)
            const token = sessionStorage.getItem('token');
            // Make a GET request to the server endpoint with the token in the headers
            const response = await axios.post('http://localhost:5000/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Extract data from the response
            const userData = response.data;
            // Update state with the fetched data
            setFullName(userData.fullName);
            setAge(userData.age);
            setBreed(userData.breed);
            setPetType(userData.type);
            console.log(userData.id)
            // const avatarResponse = await axios.get(`http://localhost:5000/api/avatarbyid/${userData.id}`, {
            //     userId: userData.id,
            // });
            // setAvatar(avatarResponse.data);

        } catch (error) {
            console.error('Error fetching profile data:', error.message || error);
        }
    };



    const handleAvatarClick = () => {
        // Trigger the file input click
        document.getElementById('avatar-upload').click();

        // If an avatar is already selected, upload it
        if (avatar) {
            handleImageUpload();
        }
    };

    const handleInputChange = (event, setValue) => {
        setValue(event.target.value);
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            // Get the token from wherever you stored it (e.g., session storage)
            const token = sessionStorage.getItem('token');
            // Prepare the data you want to send to the server
            const userData = {
                fullName,
                age,
                breed,
                type,
            };
            // Make a POST request to the server endpoint with the token in the headers
            const response = await axios.post('http://localhost:5000/api/profile', userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Log or handle the server response as needed
            console.log(response.data);
            // Update local state or perform any additional actions
            setIsEditMode(false);
        } catch (error) {
            // Handle errors, log, or show an error message to the user
            console.error('Error saving data:', error.message || error);
        }
    };

    const handleImageUpload = async (event) => {
        try {
            const token = sessionStorage.getItem('token');
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('image', file); // 'image' should match the fieldname used in multer.single()

            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data); // Log or handle the server response
        } catch (error) {
            console.error('Error uploading image:', error.message || error);
        }
        fetchProfileData();
    };

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col d-flex justify-content-center">
                <div id="profile-container" className="container">
                    <form>
                        <h2 id="profile-heading">User Profile</h2>
                        <img
                            id="avatar-image"
                            className={avatar ? 'avatar-with-image' : ''}
                            src={avatar}
                            alt="Avatar"
                            onClick={handleAvatarClick}
                        />
                        <div>
                            {(!avatar || false) && (
                                <div>
                                    <label className="upload-label" id="upload-label" htmlFor="avatar-upload">
                                        Upload Avatar
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                </div>
                            )}
                            {avatar && (
                                <div>
                                    <label className="upload-label" id="delete-avatar" onClick={() => setAvatar(null)}>
                                        Delete Avatar
                                    </label>
                                    <label className="upload-label" id="upload-label" htmlFor="avatar-upload">
                                        Change Avatar
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                </div>
                            )}

                            <div>
                                {isEditMode ? (
                                    <div>
                                        <label htmlFor="fullName">Full Name:</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={fullName}
                                            onChange={(event) => handleInputChange(event, setFullName)}
                                        />
                                    </div>
                                ) : (
                                    <p>
                                        <strong>Full Name:</strong> {fullName}
                                    </p>
                                )}

                                {isEditMode ? (
                                    <div>
                                        <label htmlFor="age">Age:</label>
                                        <input
                                            type="text"
                                            id="age"
                                            value={age}
                                            onChange={(event) => handleInputChange(event, setAge)}
                                        />
                                    </div>
                                ) : (
                                    <p>
                                        <strong>Age:</strong> {age}
                                    </p>
                                )}

                                {isEditMode ? (
                                    <div>
                                        <label htmlFor="Breed">Breed:</label>
                                        <input
                                            type="text"
                                            id="breed"
                                            value={breed}
                                            onChange={(event) => handleInputChange(event, setBreed)}
                                        />
                                    </div>
                                ) : (
                                    <p>
                                        <strong>Breed:</strong> {breed}
                                    </p>
                                )}
                                {isEditMode ? (
                                    <div>
                                        <label htmlFor="PetType">Pet type:</label>
                                        <input
                                            type="text"
                                            id="type"
                                            value={type}
                                            onChange={(event) => handleInputChange(event, setPetType)}
                                        />
                                    </div>
                                ) : (
                                    <p>
                                        <strong>Pet type:</strong> {type}
                                    </p>
                                )}

                                {isEditMode ? (
                                    <button className="button_in_cont" type="button" onClick={handleSaveClick}>
                                        Save
                                    </button>
                                ) : (
                                    <button className="button_in_cont" type="button" onClick={handleEditClick}>
                                        Edit
                                    </button>
                                )}
                                <button className="button_in_cont" type="button" onClick={handleSignOut}>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="col"></div>
        </div>
    );
};

export default Profile;
