import {
    loginFailure,
    loginStart,
    loginSuccess
} from '@/redux/auth/auth.slice';
import { yupResolver } from '@hookform/resolvers/yup';
import CLoseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    Alert,
    Box,
    Button,
    FilledInput,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { loginAPI } from '../../api/auth.api';
import { setToken, setUserId } from '../../utils/auth';
import { useSnackbar } from '../../hooks/useSnackbar';

type IFormInput = {
    username: string;
    password: string;
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Đăng nhập';
    }, []);

    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = React.useState(false);

    const snackbar = useSnackbar();

    const action = (
        <>
            <IconButton
                size='small'
                aria-label='close'
                color='inherit'
                onClick={snackbar.handleClose}
            >
                <CLoseIcon fontSize='small' />
            </IconButton>
        </>
    );

    const schema = yup.object().shape({
        username: yup.string().max(255).required('Vui lòng nhập tên đăng nhập'),
        password: yup.string().max(255).required('Vui lòng nhập mật khẩu')
    });

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormInput>({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: yupResolver(schema)
    });

    const mutationAuthLogin = useMutation({
        mutationFn: loginAPI,
        onSuccess: (data) => {
            dispatch(loginSuccess(data));

            setToken(data.token);
            setUserId(data.id);

            navigate('/', { replace: true });
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 400) {
                snackbar.handleSetSnackbar(
                    'Tên đăng nhập hoặc mật khẩu không đúng !',
                    'error'
                );
            } else {
                snackbar.handleSetSnackbar(
                    'Đã có lỗi xảy ra, vui lòng thử lại sau !',
                    'error'
                );
            }

            snackbar.handleOpen();
            dispatch(loginFailure(error));
        }
    });

    const onSubmit = async (data: IFormInput) => {
        dispatch(loginStart());

        mutationAuthLogin.mutate(data);
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%'
                    }}
                >
                    <div>
                        <Typography variant='h4'>Đăng nhập</Typography>
                        <form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ mt: 3 }}>
                                <Stack spacing={3}>
                                    <Controller
                                        name='username'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                fullWidth
                                                label='Tên đăng nhập'
                                                {...field}
                                                error={!!errors.username}
                                                helperText={
                                                    errors.username?.message
                                                }
                                            />
                                        )}
                                    />

                                    <Controller
                                        name='password'
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl variant='filled'>
                                                <InputLabel
                                                    htmlFor='outlined-adornment-password'
                                                    error={!!errors.password}
                                                >
                                                    Mật khẩu
                                                </InputLabel>
                                                <FilledInput
                                                    id='outlined-adornment-password'
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    endAdornment={
                                                        <InputAdornment position='end'>
                                                            <IconButton
                                                                aria-label='toggle password visibility'
                                                                onClick={() => {
                                                                    setShowPassword(
                                                                        !showPassword
                                                                    );
                                                                }}
                                                                onMouseDown={(
                                                                    e: React.MouseEvent<HTMLButtonElement>
                                                                ) => {
                                                                    e.preventDefault();
                                                                }}
                                                                edge='end'
                                                            >
                                                                {showPassword ? (
                                                                    <VisibilityOff />
                                                                ) : (
                                                                    <Visibility />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    {...field}
                                                />
                                                {errors.password && (
                                                    <Typography
                                                        color='error'
                                                        variant='subtitle2'
                                                        sx={{
                                                            ml: '14px',
                                                            fontSize: '12px',
                                                            mt: '4px'
                                                        }}
                                                    >
                                                        {
                                                            errors.password
                                                                .message
                                                        }
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        )}
                                    />

                                    <Typography
                                        color='text.secondary'
                                        variant='body2'
                                    >
                                        <Link
                                            component='a'
                                            href='/auth/forgot-password'
                                            underline='hover'
                                            variant='subtitle2'
                                        >
                                            Quên mật khẩu ?
                                        </Link>
                                    </Typography>
                                </Stack>
                                <Box
                                    sx={{
                                        mt: 3,
                                        position: 'relative'
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        size='large'
                                        type='submit'
                                        variant='contained'
                                    >
                                        Đăng nhập
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </div>
                </Box>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    action={action}
                    onClose={snackbar.handleClose}
                >
                    <Alert
                        onClose={snackbar.handleClose}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default LoginPage;
