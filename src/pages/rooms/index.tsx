import { Box, Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const RoomPage = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!currentUser) {
            window.location.href = '/login';
        }
        if(currentUser?.role !== 'hotelier'){
            
            window.location.href = '/';
        }

    }, [currentUser]);

    return (
        <>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth='xl'>Room Page</Container>
            </Box>
        </>
    );
};

export default RoomPage;
