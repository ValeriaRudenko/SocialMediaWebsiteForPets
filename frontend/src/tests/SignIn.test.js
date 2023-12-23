import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignIn from '../components/SignIn';

test('renders sign-in form', () => {
    render(<SignIn />);

    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
});

test('sign in with valid credentials', async () => {
    render(<SignIn />);

    // Mock axios.post to simulate a successful sign-in
    const mockPost = jest.spyOn(require('axios'), 'post');
    mockPost.mockResolvedValueOnce({ data: { token: 'mockToken', message: 'Sign In Successful' } });

    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign In'));

    // Wait for the asynchronous sign-in process to complete
    await waitFor(() => {
        expect(screen.getByText('Sign In Successful')).toBeInTheDocument();
    });

    // Ensure that the token is stored in sessionStorage
    expect(sessionStorage.getItem('token')).toBe('mockToken');
});

// Add more tests for error scenarios, edge cases, etc.
