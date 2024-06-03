import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import { useEffect } from 'react';

const _404 = () => {
    useEffect(() => {
        document.title = '404';
    }, []);

    return (
        <Box
            component='main'
            sx={{
                alignItems: 'center',
                display: 'flex',
                flexGrow: 1,
                minHeight: '100vh'
            }}
        >
            <Container maxWidth='md'>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            mb: 3,
                            textAlign: 'center'
                        }}
                    >
                        <img
                            alt='Under development'
                            src='/images/errors/error-404.png'
                            style={{
                                display: 'inline-block',
                                maxWidth: '100%',
                                width: 400
                            }}
                        />
                    </Box>
                    <Typography align='center' sx={{ mb: 3 }} variant='h3'>
                        404: Không tìm thấy trang này
                    </Typography>
                    <Typography
                        align='center'
                        color='text.secondary'
                        variant='body1'
                    >
                        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm
                        kiếm. Có thể bạn đã nhập sai địa chỉ hoặc trang web đã
                        bị xóa.
                    </Typography>
                    <Button
                        component='a'
                        href='/'
                        startIcon={
                            <SvgIcon fontSize='small'>
                                <ArrowLeftIcon />
                            </SvgIcon>
                        }
                        sx={{ mt: 3 }}
                        variant='contained'
                    >
                        Quay lại trang chủ
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default _404;
