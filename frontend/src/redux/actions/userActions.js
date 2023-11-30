import axios from 'axios';

export const getUsers = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/users'); // Replace with your backend API endpoint
            dispatch({ type: 'GET_USERS', payload: response.data });
        } catch (error) {
            console.error('Error getting users:', error);
        }
    };
};
