import React, {useState} from 'react';
import './Profile.css';

// Profile.js

const Profile = () => {
    const [avatar, setAvatar] = useState(null);
    const [fullName, setFullName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [pettype, setPetType] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const handleUpload = (event) => {
        const file = event.target.files[0];
        setAvatar(file);
    };
    const handleAvatarClick = () => {
        document.getElementById('avatar-upload').click();
    };
    const handleInputChange = (event, setValue) => {
        setValue(event.target.value);
    };
    const handleEditClick = () => {
        setIsEditMode(true);
    };
    const handleSaveClick = () => {
        setIsEditMode(false);
        // Perform any save/update action here (e.g., send data to the server).
    };
    const handleDeleteAvatar = () => {
        setAvatar(null);
    };

    return (
        <div id="profile-container" className="container">
            <form>
            <h2 id="profile-heading">User Profile</h2>
            <img
                id="avatar-image"
                className={avatar ? 'avatar-with-image' : ''}
                src={avatar ? URL.createObjectURL(avatar) : 'default-avatar.jpg'}
                alt="Avatar"
                onClick={handleAvatarClick}
            />
            <div>
                {(!avatar || avatar === null) && (
                    <div>
                        <label className="upload-label" id="upload-label" htmlFor="avatar-upload">
                            Upload Avatar
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleUpload}
                            hidden
                        />
                    </div>
                )}
                {avatar && (
                    <div>
                        <button className="upload-label" id="delete-avatar" onClick={handleDeleteAvatar}>
                            Delete Avatar
                        </button>
                        <label className="upload-label" id="upload-label" htmlFor="avatar-upload">
                            Change Avatar
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleUpload}
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
                                id="pettype"
                                value={pettype}
                                onChange={(event) => handleInputChange(event, setPetType)}
                            />
                        </div>
                    ) : (
                        <p>
                            <strong>Pet type:</strong> {pettype}
                        </p>
                    )}

                    {isEditMode ? (
                        <button onClick={handleSaveClick}>Save</button>
                    ) : (
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                </div>
            </div>
            </form>
        </div>
    );
};

export default Profile;
