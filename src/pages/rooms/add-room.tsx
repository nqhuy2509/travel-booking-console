import {
    Alert,
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    Snackbar,
    SvgIcon,
    TextField,
    Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { addNewRoom } from '../../api/room.api';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CLoseIcon from '@mui/icons-material/Close';

type IFormRoom = {
    id?: string;
    name: string;
    beds: number;
    description: string;
    amount: number;
    available?: number;
    price: number;
};

const schema = yup.object().shape({
    name: yup
        .string()
        .required('Tên nơi lưu trú không được để trống')
        .min(3, 'Tên nơi lưu trú phải có ít nhất 4 ký tự')
        .max(50, 'Tên nơi lưu trú không được quá 50 ký tự'),
    description: yup.string(),
    beds: yup
        .number()
        .required('Số giường không được để trống')
        .min(1, 'Số giường phải lớn hơn 0'),
    amount: yup
        .number()
        .required('Số lượng phòng không được để trống')
        .min(1, 'Số lượng phòng phải lớn hơn 0')
        .max(10, 'Số lượng phòng không được quá 10'),
    price: yup
        .number()
        .required('Giá phòng không được để trống')
        .min(1, 'Giá phòng phải lớn hơn 0')
});

const AddRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const titlePage = id ? 'Sửa phòng' : 'Thêm phòng';

    const { currentUser } = useSelector((state: RootState) => state.auth);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<IFormRoom>({
        defaultValues: {
            id: undefined,
            name: '',
            beds: 1,
            description: '',
            amount: 1,
            available: 0,
            price: 0
        },
        resolver: yupResolver(schema) as any
    });
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

    const onSubmit = async (data: IFormRoom) => {
        console.log(data);

        if (!currentUser?.stayId) {
            snackbar.handleSetSnackbar(
                'Lỗi: Không tìm thấy stayId của người dùng hiện tại.',
                'error'
            );
            return;
        }

        const formRequest = {
            name: data.name,
            beds: data.beds,
            description: data.description,
            amount: data.amount,
            price: data.price,
            stayId: currentUser.stayId
        };

        mutationPostNewRoom.mutate(formRequest);
    };

    const mutationPostNewRoom = useMutation({
        mutationFn: addNewRoom,
        onSuccess: () => {
            snackbar.handleSetSnackbar(
                'Thêm nơi phòng thành công, quay lại sau 1s!',
                'success'
            );
            snackbar.handleOpen();

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        },
        onError: () => {
            snackbar.handleSetSnackbar('Thêm phòng thất bại', 'error');
            snackbar.handleOpen();
        }
    });

    return (
        <Box
            component='main'
            sx={{
                flexGrow: 1,
                py: 8
            }}
        >
            <Container maxWidth='xl'>
                <Stack spacing={3}>
                    <Stack direction='row' spacing={3}>
                        <IconButton
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            <SvgIcon>
                                <ArrowBackIcon />
                            </SvgIcon>
                        </IconButton>
                        <Typography variant='h4'>{titlePage}</Typography>
                    </Stack>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card
                                    sx={{
                                        p: 2
                                    }}
                                >
                                    <CardHeader title='Thêm phòng' />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name='name'
                                                    control={control}
                                                    rules={{
                                                        required: true
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            fullWidth
                                                            label='Tên phòng'
                                                            error={
                                                                errors.name
                                                                    ?.message
                                                                    ? true
                                                                    : false
                                                            }
                                                            helperText={
                                                                errors.name
                                                                    ?.message
                                                            }
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name='description'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={6}
                                                            label='Mô tả phòng'
                                                            error={
                                                                errors
                                                                    .description
                                                                    ?.message
                                                                    ? true
                                                                    : false
                                                            }
                                                            helperText={
                                                                errors
                                                                    .description
                                                                    ?.message
                                                            }
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name='beds'
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                        min: 1,
                                                        max: 10
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            fullWidth
                                                            label='Số giường'
                                                            type='number'
                                                            error={
                                                                errors.beds
                                                                    ?.message
                                                                    ? true
                                                                    : false
                                                            }
                                                            helperText={
                                                                errors.beds
                                                                    ?.message
                                                            }
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={3}>
                                                    <Controller
                                                        name='amount'
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                            min: 1,
                                                            max: 10
                                                        }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                fullWidth
                                                                label='Số lượng phòng'
                                                                type='number'
                                                                error={
                                                                    errors
                                                                        .amount
                                                                        ?.message
                                                                        ? true
                                                                        : false
                                                                }
                                                                helperText={
                                                                    errors
                                                                        .amount
                                                                        ?.message
                                                                }
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                    <span>
                                                        <Typography variant='body2'>
                                                            Phòng còn trống:{' '}
                                                        </Typography>
                                                        <Typography variant='subtitle1'>
                                                            {}
                                                        </Typography>
                                                    </span>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name='price'
                                                    control={control}
                                                    rules={{
                                                        required: true
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            fullWidth
                                                            label='Giá phòng'
                                                            type='number'
                                                            error={
                                                                errors.price
                                                                    ?.message
                                                                    ? true
                                                                    : false
                                                            }
                                                            helperText={
                                                                errors.price
                                                                    ?.message
                                                            }
                                                            {...field}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <Typography>
                                                                        VNĐ
                                                                    </Typography>
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Grid container spacing={3}>
                                            <Grid item md={2} xs={12}>
                                                <Button
                                                    variant='contained'
                                                    fullWidth
                                                    type='submit'
                                                >
                                                    Thêm
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} xs={12}>
                                                <Button
                                                    variant='outlined'
                                                    fullWidth
                                                    type='reset'
                                                >
                                                    Làm mới
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </form>
                </Stack>
            </Container>
            {snackbar.message && (
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={snackbar.handleClose}
                    action={action}
                >
                    <Alert
                        onClose={snackbar.handleClose}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={mutationPostNewRoom.isLoading}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </Box>
    );
};

export default AddRoom;
