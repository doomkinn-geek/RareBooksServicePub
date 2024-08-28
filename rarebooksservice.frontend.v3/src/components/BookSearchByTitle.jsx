// src/components/BookSearchByTitle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { searchBooksByTitle } from '../api';
import BookList from './BookList.jsx';
import { Typography, Box } from '@mui/material';

const BookSearchByTitle = () => {
    const { title } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const exactPhrase = query.get('exactPhrase') === 'true';
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchBooks = async (page = 1) => {
            try {
                const response = await searchBooksByTitle(title, exactPhrase, page);
                setBooks(response.data.items);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Ошибка поиска книг по названию:', error);
                setErrorMessage('Произошла ошибка при поиске книг. Пожалуйста, попробуйте позже.');
            }
        };

        fetchBooks(currentPage);
    }, [title, exactPhrase, currentPage]);

    return (
        <div className="container">
            <header className="header">
                <h1><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Rare Books Service</Link></h1>
            </header>
            <Box>
                <Typography variant="h4">Книги по названию: {title}</Typography>
                {errorMessage && <Typography variant="body1" color="error">{errorMessage}</Typography>}
                <BookList
                    books={books}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Box>
            <footer className="footer">
                <p>&copy; 2024 Rare Books Service. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default BookSearchByTitle;
