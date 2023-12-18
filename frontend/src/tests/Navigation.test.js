import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navigation from './Navigation';

test('renders navigation bar with buttons', () => {
    render(<Navigation />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Additions')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
});

test('clicking on navigation buttons changes location', () => {
    render(<Navigation />);

    fireEvent.click(screen.getByText('Home'));
    // Add assertions based on expected behavior when clicking other buttons
    // Example: expect(window.location.href).toBe('/');

    // Repeat for other buttons
});

// Add more tests for authentication status, conditional rendering, etc.
