//src/components/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { getUsers, updateUserSubscription, updateUserRole, getUserById } from '../api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const history = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdateUserSubscription = async (userId, hasSubscription) => {
        try {
            await updateUserSubscription(userId, hasSubscription);
            setUsers(users.map(user => user.id === userId ? { ...user, hasSubscription } : user));
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };

    const handleUpdateUserRole = async (userId, role) => {
        try {
            await updateUserRole(userId, role);
            setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            const response = await getUserById(userId);
            history(`/user/${userId}`);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };    

    return (
        <div>
            <h2>Admin Panel</h2>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Subscription</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.hasSubscription ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleUpdateUserSubscription(user.id, !user.hasSubscription)}>
                                    {user.hasSubscription ? 'Revoke Subscription' : 'Grant Subscription'}
                                </button>
                                <button onClick={() => handleUpdateUserRole(user.id, user.role === 'Admin' ? 'User' : 'Admin')}>
                                    {user.role === 'Admin' ? 'Demote to User' : 'Promote to Admin'}
                                </button>
                                <button onClick={() => handleViewDetails(user.id)}>View Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
