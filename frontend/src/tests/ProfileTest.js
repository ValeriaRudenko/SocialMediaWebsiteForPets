import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';

test('renders profile with user details', () => {
    render(<UserProfile />);

    // Replace 'User123' with the expected user name
    expect(screen.getByText('User123')).toBeInTheDocument();
    // Add more assertions based on the expected content of the profile
});

test('follow/unfollow button click toggles follow status', () => {
    render(<UserProfile />);

    const followButton = screen.getByText('Follow');
    fireEvent.click(followButton);
    expect(screen.getByText('Unfollow')).toBeInTheDocument();

    fireEvent.click(followButton);
    expect(screen.getByText('Follow')).toBeInTheDocument();
});
