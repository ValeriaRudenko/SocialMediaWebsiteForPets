import React, { createContext, useContext, useState } from 'react';

const PageContext = createContext();

export const usePageContext = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePageContext must be used within a PageProvider');
    }
    return context;
};

export const PageProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('signUp');

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const value = {
        currentPage,
        handlePageChange,
    };

    return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
