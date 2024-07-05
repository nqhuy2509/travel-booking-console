import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useQuery } from 'react-query';
import { getAllRoom } from '../../api/room.api';

const RoomPage = () => {
    const { currentUser } = useSelector((state: RootState) => state.auth);

    const getRoomsQuery = useQuery(
        ['stays', currentUser?.stayId],
        () => getAllRoom(currentUser?.stayId!),
        {
            retry: 1,
            keepPreviousData: true
        }
    );

    console.log(getRoomsQuery.data);

    useEffect(() => {
        if (!currentUser) {
            window.location.href = '/login';
        }
        if (currentUser?.role !== 'hotelier') {
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
