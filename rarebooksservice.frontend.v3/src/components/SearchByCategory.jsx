// src/components/SearchByCategory.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchBooksByCategory } from '../api';
import BookList from './BookList.jsx';
import { Typography, Box, AppBar, Toolbar, Container } from '@mui/material';

const SearchByCategory = () => {
    const { categoryId } = useParams();
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleSearch = async (page = 1) => {
        try {
            const response = await searchBooksByCategory(categoryId, page);
            setBooks(response.data.items);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Ошибка поиска книг по категориям:', error);
        }
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [categoryId, currentPage]);

    return (
        <div className="container">
            <header className="header">
                <h1><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Rare Books Service</Link></h1>
            </header>
            <Box>
                <Typography variant="h4">Книги по категории: {categoryId}</Typography>
                <BookList
                    books={books}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    onPageChange={handleSearch}
                />
            </Box>
            <footer className="footer">
                <p>&copy; 2024 Rare Books Service. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SearchByCategory;
