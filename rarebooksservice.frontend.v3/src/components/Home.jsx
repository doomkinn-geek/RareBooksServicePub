//src/components/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchBooksByTitle, getCategories, getBookById } from '../api';
import { Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { UserContext } from '../context/UserContext';

const Home = () => {
    const { user, setUser } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bookId, setBookId] = useState('');
    const [categories, setCategories] = useState([]);
    const [exactPhraseTitle, setExactPhraseTitle] = useState(false);
    const [exactPhraseDescription, setExactPhraseDescription] = useState(false);
    const [apiStatus, setApiStatus] = useState('Checking API connection...'); // Добавлено для отображения статуса API
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
                //setApiStatus('Connected to API'); // Устанавливаем статус подключения
                setApiStatus(''); 
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
                setApiStatus('Failed to connect to API'); // Устанавливаем статус при ошибке
            }
        };

        fetchCategories();
    }, []);

    const handleTitleSearch = async () => {
        if (title.trim()) {
            try {
                navigate(`/searchByTitle/${title}?exactPhrase=${exactPhraseTitle}`);
            } catch (error) {
                console.error('Ошибка при поиске по названию:', error);
            }
        }
    };

    const handleDescriptionSearch = async () => {
        if (description.trim()) {
            try {
                navigate(`/searchByDescription/${description}?exactPhrase=${exactPhraseDescription}`);
            } catch (error) {
                console.error('Ошибка при поиске по описанию:', error);
            }
        }
    };

    const handlePriceRangeSearch = () => {
        if (minPrice.trim() && maxPrice.trim()) {
            navigate(`/searchByPriceRange/${minPrice}/${maxPrice}`);
        }
    };

    const handleIdSearch = () => {
        if (bookId.trim()) {
            navigate(`/books/${bookId}`);
        }
    };

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="container">
            <Typography variant="h6" color={apiStatus.includes('Failed') ? 'error' : 'primary'}>
                {apiStatus}
            </Typography>
            {user ? (
                <>
                    {!user.hasSubscription && (
                        <div className="subscription-warning">
                            <Typography color="error">У вас нет подписки. <Link to="/subscription">Подписаться сейчас</Link></Typography>
                        </div>
                    )}
                    {user.role === 'Admin' && (
                        <div className="admin-link">
                            <Typography><Link to="/admin">Перейти в панель администратора</Link></Typography>
                        </div>
                    )}
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Поиск по названию книги"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={exactPhraseTitle} onChange={(e) => setExactPhraseTitle(e.target.checked)} />}
                            label="Искать точную фразу"
                        />
                        <button onClick={handleTitleSearch}>Поиск</button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Поиск по описанию"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={exactPhraseDescription} onChange={(e) => setExactPhraseDescription(e.target.checked)} />}
                            label="Искать точную фразу"
                        />
                        <button onClick={handleDescriptionSearch}>Поиск</button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Минимальная цена"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Максимальная цена"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <button onClick={handlePriceRangeSearch}>Поиск</button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Введите ID книги"
                            value={bookId}
                            onChange={(e) => setBookId(e.target.value)}
                        />
                        <button onClick={handleIdSearch}>Поиск по ID</button>
                    </div>
                    <div className="categories">
                        <h2>Категории</h2>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/searchByCategory/${category.id}`}>{category.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="auth-links">
                        <Button variant="contained" color="secondary" onClick={handleLogout}>Выйти</Button>
                    </div>
                    <div>
                        <div>Добро пожаловать, {user.userName}!</div>
                    </div>
                </>
            ) : (
                <>
                    <div className="auth-links">
                        <Button variant="contained" color="primary" component={Link} to="/login">Войти</Button>
                        <Button variant="contained" color="secondary" component={Link} to="/register">Регистрация</Button>
                    </div>
                    <div>
                        <div>Пожалуйста, войдите в систему.</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
