import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, getUserSearchHistory } from '../api';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Paper } from '@mui/material';

const UserDetailsPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await getUserById(userId);
                setUser(userResponse.data);

                const historyResponse = await getUserSearchHistory(userId);
                setSearchHistory(historyResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <Container component={Paper} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                User Details
            </Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Role: {user.role}</Typography>
            <Typography variant="body1">Has Subscription: {user.hasSubscription ? 'Yes' : 'No'}</Typography>

            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Search History
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Query</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {searchHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(history => (
                        <TableRow key={history.id}>
                            <TableCell>{new Date(history.searchDate).toLocaleString()}</TableCell>
                            <TableCell>{history.query}</TableCell>
                            <TableCell>{history.searchType}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={searchHistory.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Container>
    );
};

export default UserDetailsPage;
