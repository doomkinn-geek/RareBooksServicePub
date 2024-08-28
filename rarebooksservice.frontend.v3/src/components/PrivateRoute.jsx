// components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = () => {
    const { user } = React.useContext(UserContext);

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
