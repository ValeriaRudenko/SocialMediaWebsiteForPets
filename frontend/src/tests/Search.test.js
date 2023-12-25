import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Search from '../components/Search';

test('renders search page with input field', () => {
    render(<Search />);

    expect(screen.getByLabelText('Search by Nickname:')).toBeInTheDocument();
});

test('search input updates search state', () => {
    render(<Search />);

    fireEvent.change(screen.getByLabelText('Search by Nickname:'), { target: { value: 'test' } });

    // Replace 'test' with the expected search value
    expect(screen.getByLabelText('Search by Nickname:')).toHaveValue('test');
});

// Add more tests for filtering users, handling API responses, etc.
