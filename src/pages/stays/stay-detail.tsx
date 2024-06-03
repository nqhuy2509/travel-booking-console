import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CLoseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    SvgIcon,
    TextField,
    Typography,
    styled
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getStayByIdAPI, putStayByIdAPI } from '../../api/stay.api';
import { useDialog } from '../../hooks/useDialog';
import { useSnackbar } from '../../hooks/useSnackbar';

type IEditFormInput = {
    name: string;
    description: string;
};

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});

const stayType = [
    {
        label: 'Khách sạn',
        value: 'hotel'
    },
    {
        label: 'Villa',
        value: 'villa'
    },
    {
        label: 'Nhà nghỉ',
        value: 'hostel'
    },
    {
        label: 'Resort',
        value: 'resort'
    },
    {
        label: 'Nhà trọ',
        value: 'motel'
    }
];

const stayStatus = [
    {
        label: 'Đang hoạt động',
        value: 'available'
    },
    {
        label: 'Đóng cửa',
        value: 'closed'
    },
    {
        label: 'Tạm ngưng',
        value: 'suspended'
    }
];

const ProductDetail = () => {
    const { id } = useParams();
    const snackbar = useSnackbar();
    const [selectType, setSelectType] = useState<string>('hotel');
    const [selectStatus, setSelectStatus] = useState<string>('available');
    const [newImage, setNewImage] = useState<File | null>(null);

    const dialog = useDialog();

    const getStayByIdQuery = useQuery(
        ['getQueryById', id],
        () => getStayByIdAPI(id!),
        {
            enabled: !!id,
            refetchOnWindowFocus: false,
            retry: false
        }
    );

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

    const stay = useMemo(() => {
        return getStayByIdQuery.data;
    }, [getStayByIdQuery.data]);

    const editProductForm = useForm<IEditFormInput>({
        defaultValues: {
            name: '',
            description: ''
        }
    });

    useEffect(() => {
        if (stay) {
            editProductForm.reset({
                name: stay.name,
                description: stay.description
            });
            setSelectType(stay.type);
            setSelectStatus(stay.status);
        }
    }, [stay, editProductForm]);

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (getStayByIdQuery.isError) {
            snackbar.handleSetSnackbar(
                'Lỗi khi lấy thông tin nơi lưu trú',
                'error'
            );
            snackbar.handleOpen();
        }
    }, [getStayByIdQuery.isError]);

    useEffect(() => {
        document.title = 'Chi tiết nơi lưu trú';
    }, []);

    const onEditChangeSubmit = (data: IEditFormInput) => {
        console.log(data);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('type', selectType);
        formData.append('status', selectStatus);
        formData.append('image', newImage as Blob);

        mutationUpdateStay.mutate({ id: id!, data: formData });
    };

    const mutationUpdateStay = useMutation({
        mutationFn: putStayByIdAPI,
        onSuccess: () => {
            snackbar.handleSetSnackbar(
                'Cập nhật nơi lưu trú thành công, quay lại sau 1s!',
                'success'
            );
            snackbar.handleOpen();

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        onError: () => {
            snackbar.handleSetSnackbar(
                'Cập nhật nơi lưu trú thất bại',
                'error'
            );
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
                    <Stack direction='row' spacing={3} alignItems='center'>
                        <IconButton
                            onClick={() => {
                                window.history.back();
                            }}
                        >
                            <SvgIcon>
                                <ArrowBackIcon />
                            </SvgIcon>
                        </IconButton>
                        <Typography variant='h5'>
                            Chi tiết nơi lưu trú
                        </Typography>
                    </Stack>
                    <form
                        onSubmit={editProductForm.handleSubmit(
                            onEditChangeSubmit
                        )}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8} lg={8}>
                                <Card
                                    sx={{
                                        p: 2
                                    }}
                                >
                                    <CardHeader
                                        title={stay?.name}
                                        subheader={stay?.id}
                                    />

                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Stack>
                                                    <Typography variant='h6'>
                                                        Mã nơi lưu trú
                                                    </Typography>
                                                    <Typography>
                                                        {stay?.id}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Controller
                                                    name='name'
                                                    control={
                                                        editProductForm.control
                                                    }
                                                    defaultValue={stay?.name}
                                                    render={({ field }) => (
                                                        <TextField
                                                            label='Tên nơi lưu trú'
                                                            required
                                                            fullWidth
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name='description'
                                                    control={
                                                        editProductForm.control
                                                    }
                                                    render={({ field }) => (
                                                        <TextField
                                                            label='Mô tả'
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InputLabel id='demo-select-small-label'>
                                                    Loại khách sạn
                                                </InputLabel>
                                                <Select
                                                    labelId='demo-select-small-label'
                                                    fullWidth
                                                    value={selectType}
                                                    onChange={(e) =>
                                                        setSelectType(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {stayType.map((type) => (
                                                        <MenuItem
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InputLabel id='demo-select-small-label'>
                                                    Trạng thái
                                                </InputLabel>
                                                <Select
                                                    labelId='demo-select-small-label'
                                                    fullWidth
                                                    value={selectStatus}
                                                    onChange={(e) =>
                                                        setSelectType(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {stayStatus.map((type) => (
                                                        <MenuItem
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant='h6'>
                                                    Địa chỉ
                                                </Typography>
                                                <Typography>
                                                    {stay?.location.address},{' '}
                                                    {stay?.location.district},{' '}
                                                    {stay?.location.province}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <Divider />
                                    <CardActions>
                                        <Stack
                                            justifyContent='center'
                                            direction='column'
                                            alignItems='center'
                                            width='100%'
                                        >
                                            <Button
                                                variant='contained'
                                                fullWidth
                                                type='submit'
                                            >
                                                Lưu lại
                                            </Button>
                                        </Stack>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardHeader title='Ảnh nơi lưu trú' />
                                    <CardContent>
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <img
                                                src={
                                                    preview ||
                                                    stay?.image ||
                                                    '/images/placeholder.png'
                                                }
                                                alt={stay?.name}
                                                width='100%'
                                                height='auto'
                                            />
                                        </Box>
                                    </CardContent>
                                    <Divider />
                                    <CardActions>
                                        <Stack
                                            justifyContent='center'
                                            direction='column'
                                            alignItems='center'
                                            width='100%'
                                        >
                                            <Button
                                                fullWidth
                                                variant='text'
                                                color='primary'
                                                component='label'
                                            >
                                                Thay đổi
                                                <VisuallyHiddenInput
                                                    key={preview}
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];

                                                        if (!file) return;
                                                        setNewImage(file);
                                                        if (preview)
                                                            URL.revokeObjectURL(
                                                                preview
                                                            );

                                                        setPreview(
                                                            URL.createObjectURL(
                                                                file
                                                            )
                                                        );
                                                    }}
                                                />
                                            </Button>
                                            {preview && (
                                                <Button
                                                    fullWidth
                                                    variant='text'
                                                    color='error'
                                                    onClick={() => {
                                                        URL.revokeObjectURL(
                                                            preview
                                                        );
                                                        setPreview(null);
                                                        setNewImage(null);
                                                    }}
                                                >
                                                    Xóa
                                                </Button>
                                            )}
                                        </Stack>
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
                        sx={{
                            width: '100%'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}

            <Dialog open={dialog.open} onClose={dialog.handleClose}>
                <DialogTitle>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <SvgIcon
                            fontSize='small'
                            sx={{
                                color: 'warning.main'
                            }}
                        >
                            <WarningIcon />
                        </SvgIcon>
                        <Typography variant='h6'>{dialog.title}</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialog.content}</DialogContentText>
                    <DialogActions>
                        <Button onClick={dialog.handleClose}>
                            {dialog.dialogCancel}
                        </Button>
                        <Button onClick={dialog.handleDialogAction}>
                            {dialog.dialogOk}
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={getStayByIdQuery.isLoading}
            >
                <CircularProgress />
            </Backdrop>
        </Box>
    );
};

export default ProductDetail;
