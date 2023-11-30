import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from './redux/actions/userActions';

const App = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
      <div>
        <h1>User List</h1>
        <ul>
          {users.map((user) => (
              <li key={user._id}>{user.username}</li>
          ))}
        </ul>
      </div>
  );
};

export default App;
