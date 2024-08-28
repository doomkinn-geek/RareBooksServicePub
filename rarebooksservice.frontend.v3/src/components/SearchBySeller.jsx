// src/components/SearchBySeller.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchBooksBySeller } from '../api';
import BookList from './BookList.jsx';
import { Typography, Box, AppBar, Toolbar, Container } from '@mui/material';

const SearchBySeller = () => {
    const { sellerName } = useParams();
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchBooks = async (page = 1) => {
            try {
                const response = await searchBooksBySeller(sellerName, page);
                setBooks(response.data.items);
                setTotalPages(response.data.totalPages);
                setCurrentPage(page);
            } catch (error) {
                console.error('Ошибка поиска книг по продавцу:', error);
            }
        };

        fetchBooks(currentPage);
    }, [sellerName, currentPage]);

    return (
        <div className="container">
            <header className="header">
                <h1><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Rare Books Service</Link></h1>
            </header>
            <Box>
                <Typography variant="h4">Книга продавца: {sellerName}</Typography>
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

export default SearchBySeller;
