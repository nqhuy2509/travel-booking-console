import { Box, Grid, Typography } from '@mui/material';
import { Logo } from '@/components/logo';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <Box
            component='main'
            sx={{
                display: 'flex',
                flex: '1 1 auto',
                width: '100%',
                height: '100vh'
            }}
        >
            <Grid container sx={{ flex: '1 1 auto' }}>
                <Grid
                    item
                    xs={12}
                    lg={6}
                    sx={{
                        backgroundColor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                    }}
                >
                    <Box
                        component='header'
                        sx={{
                            left: 0,
                            p: 3,
                            position: 'fixed',
                            top: 0,
                            width: '100%'
                        }}
                    >
                        <Box
                            component='a'
                            href='/'
                            sx={{
                                display: 'inline-flex',
                                height: 32,
                                width: 32
                            }}
                        >
                            <Logo />
                        </Box>
                    </Box>
                    <Outlet />
                </Grid>
                <Grid
                    item
                    xs={12}
                    lg={6}
                    sx={{
                        alignItems: 'center',
                        background:
                            'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        '& img': {
                            maxWidth: '100%'
                        }
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Typography
                            align='center'
                            color='inherit'
                            sx={{
                                fontSize: '24px',
                                lineHeight: '32px',
                                mb: 1
                            }}
                            variant='h1'
                        >
                            Chào bạn tới{' '}
                            <Box
                                component='a'
                                sx={{ color: '#15B79E' }}
                                target='_blank'
                            >
                                Booking Travel Admin Console
                            </Box>
                        </Typography>
                        <Typography
                            align='center'
                            sx={{ mb: 3 }}
                            variant='subtitle1'
                        >
                            Trang quản lí Booking Travel Admin Console
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
