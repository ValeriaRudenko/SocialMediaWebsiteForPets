import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignUp from '../components/SignUp';

test('renders sign-up form', () => {
    render(<SignUp />);

    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
});

test('sign up with valid credentials', async () => {
    render(<SignUp />);

    // Mock axios.post to simulate a successful sign-up
    const mockPost = jest.spyOn(require('axios'), 'post');
    mockPost.mockResolvedValueOnce({ data: { token: 'mockToken', message: 'Sign Up Successful' } });

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign Up'));

    // Wait for the asynchronous sign-up process to complete
    await waitFor(() => {
        expect(screen.getByText('Sign Up Successful')).toBeInTheDocument();
    });

    // Ensure that the token is stored in sessionStorage
    expect(sessionStorage.getItem('token')).toBe('mockToken');
});

// Add more tests for error scenarios, edge cases, etc.
