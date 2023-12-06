import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users'); // replace with your actual API endpoint
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.message || error);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredUsers = users.filter(user => {
        const similarity = user.username.toLowerCase().includes(search.toLowerCase());
        return similarity;
    });

    return (
        <div className="container">
            <h2 className="text-center mt-5">Search Page</h2>

            <div className="row mt-3">
                <div className="col d-flex justify-content-center">
                    <form>
                        <label htmlFor="searchNickname" className="form-label">Search by Nickname:</label>
                        <input type="text" className="form-control" id="searchNickname" placeholder="Enter nickname" onChange={handleSearch} />
                    </form>
                </div>
            </div>

            {/* Additional content for search results can be added here */}
            <div className="row mt-3">
                <div className="col d-flex justify-content-center">
                    <ul>
                        {filteredUsers.map(user => (
                            <div key={user._id}>
                                <a href={`/user/${user._id}`} className="found">{user.username}</a>
                                <button  type="button" className="found">{user.username}</button>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Search;
