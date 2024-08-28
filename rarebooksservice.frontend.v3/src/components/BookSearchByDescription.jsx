// src/components/BookSearchByDescription.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { searchBooksByDescription } from '../api';
import BookList from './BookList.jsx';
import { Typography, Box } from '@mui/material';

const BookSearchByDescription = () => {
    const { description } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const exactPhrase = query.get('exactPhrase') === 'true';
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchBooks = async (page = 1) => {
            try {
                const response = await searchBooksByDescription(description, exactPhrase, page);
                setBooks(response.data.items);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Ошибка поиска книг по описанию:', error);
            }
        };

        fetchBooks(currentPage);
    }, [description, exactPhrase, currentPage]);

    return (
        <div className="container">
            <header className="header">
                <h1><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Rare Books Service</Link></h1>
            </header>
            <Box>
                <Typography variant="h4">Книги с описанием: {description}</Typography>
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

export default BookSearchByDescription;
