import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();

    const handleRegister = async () => {
        try {
            setError(''); // Очистить ошибки перед отправкой
            await axios.post(`${API_URL}/auth/register`, { email, password });
            history.push('/login');
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            setError(error.response?.data || 'Ошибка при регистрации');
        }
    };

    return (
        <div className="container">
            <h2>Регистрация</h2>
            {error && <div className="error">{error}</div>}
            <div className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Регистрация</button>
            </div>
        </div>
    );
};

export default Register;

