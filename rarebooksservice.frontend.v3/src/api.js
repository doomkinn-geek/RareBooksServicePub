//src/api.js:
import axios from 'axios';
import Cookies from 'js-cookie';

//export const API_URL = 'https://localhost:7042/api';
export const API_URL = 'http://localhost/api';

const getAuthHeaders = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const searchBooksByTitle = (title, exactPhrase = false, page = 1, pageSize = 10) =>
    axios.get(`${API_URL}/books/searchByTitle`, {
        params: { title, exactPhrase, page, pageSize },
        headers: getAuthHeaders(),
    });

export const searchBooksByDescription = (description, exactPhrase = false, page = 1, pageSize = 10) =>
    axios.get(`${API_URL}/books/searchByDescription`, {
        params: { description, exactPhrase, page, pageSize },
        headers: getAuthHeaders(),
    });


export const searchBooksByCategory = (categoryId, page = 1, pageSize = 10) =>
    axios.get(`${API_URL}/books/searchByCategory`, {
        params: { categoryId, page, pageSize },
        headers: getAuthHeaders(),
    });

export const searchBooksByPriceRange = (minPrice, maxPrice, page = 1, pageSize = 10) =>
    axios.get(`${API_URL}/books/searchByPriceRange`, {
        params: { minPrice, maxPrice, page, pageSize },
        headers: getAuthHeaders(),
    });

export const searchBooksBySeller = (sellerName, page = 1, pageSize = 10) =>
    axios.get(`${API_URL}/books/searchBySeller`, {
        params: { sellerName, page, pageSize },
        headers: getAuthHeaders(),
    });

export const getBookById = (id) =>
    axios.get(`${API_URL}/books/${id}`, {
        headers: getAuthHeaders(),
    });

export const getBookImages = (id) =>
    axios.get(`${API_URL}/books/${id}/images`, {
        headers: getAuthHeaders(),
    });

export const getBookThumbnail = (id, thumbnailName) =>
    axios.get(`${API_URL}/books/${id}/thumbnails/${thumbnailName}`, {
        headers: getAuthHeaders(),
        responseType: 'blob',
    });

export const getBookImageFile = (id, imageName) =>
    axios.get(`${API_URL}/books/${id}/images/${imageName}`, {
        headers: getAuthHeaders(),
        responseType: 'blob',
    });

export const getCategories = () =>
    axios.get(`${API_URL}/categories`, {
        headers: getAuthHeaders(),
    });

export const registerUser = (userData) =>
    axios.post(`${API_URL}/auth/register`, userData);

export const loginUser = (userData) =>
    axios.post(`${API_URL}/auth/login`, userData);

export const createPayment = () =>
    axios.post(`${API_URL}/subscription/create-payment`, {
        headers: getAuthHeaders(),
    });

export const getUsers = () =>
    axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
    });

export const getUserById = (userId) =>
    axios.get(`${API_URL}/admin/user/${userId}`, {
        headers: getAuthHeaders(),
    });

export const getUserSearchHistory = (userId) =>
    axios.get(`${API_URL}/admin/user/${userId}/searchHistory`, {
        headers: getAuthHeaders(),
    });


/*export const updateUserSubscription = (userId, hasSubscription) =>
    axios.post(
        `${API_URL}/admin/user/${userId}/subscription`,
        { hasSubscription }, // тело запроса, ожидаемое сервером
        { headers: getAuthHeaders() } // заголовки, включая авторизацию
    );


export const updateUserRole = (userId, role) =>
    axios.post(
        `${API_URL}/admin/user/${userId}/role`,
        { role }, // тело запроса, ожидаемое сервером
        { headers: getAuthHeaders() } // заголовки, включая авторизацию
    );*/

export const updateUserSubscription = async (userId, hasSubscription) => {
    console.log({ hasSubscription });
    try {
        const response = await axios.post(`${API_URL}/admin/user/${userId}/subscription`, { hasSubscription }, { headers: getAuthHeaders() });
        console.log('Subscription updated successfully', response);
    } catch (error) {
        console.error('Error updating subscription', error);
    }
}

export const updateUserRole = async (userId, role) => {
    console.log({ role });
    try {
        const response = await axios.post(`${API_URL}/admin/user/${userId}/role`, { role }, { headers: getAuthHeaders() });
        console.log('Role assigned successfully', response);
    } catch (error) {
        console.error('Error assigning role', error);
    }
}


