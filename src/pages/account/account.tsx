import { Box, Container, Stack } from '@mui/material';

const AccountPage = () => {
    return (
        <Box
            component='main'
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container maxWidth='xl'>
                <Stack spacing={3}></Stack>
            </Container>
        </Box>
    );
};

export default AccountPage;
