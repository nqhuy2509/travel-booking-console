import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearIcon from '@mui/icons-material/Clear';
import CLoseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import {
    Alert,
    Autocomplete,
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
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Snackbar,
    SvgIcon,
    TextField,
    Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import * as yup from 'yup';
import {
    getAllDistrictByProvinceAPI,
    getAllProvincesAPI,
    postNewStayAPI
} from '../../api/stay.api';
import { useDialog } from '../../hooks/useDialog';
import { useSnackbar } from '../../hooks/useSnackbar';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material';

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

type IFormInput = {
    id: string;
    name: string;
    description: string;
    address: string;
    province: string;
    district: string;
    image: FileList | null;
};

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

const AddStay = () => {
    const navigate = useNavigate();

    const [selectType, setSelectType] = useState<string>('hotel');
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
    const [selectProvinceId, setSelectProvinceId] = useState<string>('');

    const [selectProvince, setSelectProvince] = useState<string>('');
    const [selectDistrict, setSelectDistrict] = useState<string>('');

    const dialog = useDialog();
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

    const mutationPostNewStay = useMutation({
        mutationFn: postNewStayAPI,
        onSuccess: () => {
            snackbar.handleSetSnackbar(
                'Thêm nơi lưu trú thành công, quay lại sau 1s!',
                'success'
            );
            snackbar.handleOpen();

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        },
        onError: () => {
            snackbar.handleSetSnackbar('Thêm sản phẩm thất bại', 'error');
            snackbar.handleOpen();
        }
    });

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('Tên nơi lưu trú không được để trống')
            .min(3, 'Tên nơi lưu trú phải có ít nhất 4 ký tự')
            .max(50, 'Tên nơi lưu trú không được quá 50 ký tự'),
        description: yup
            .string()
            .max(200, 'Mô tả nơi lưu trú không được quá 200 ký tự'),
        address: yup
            .string()
            .required('Địa chỉ không được để trống')
            .min(4, 'Địa chỉ phải có ít nhất 4 ký tự')
            .max(50, 'Địa chỉ không được quá 50 ký tự')
    });

    const {
        control,
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<IFormInput>({
        defaultValues: {
            id: '',
            name: '',
            description: '',
            address: '',
            image: undefined
        },
        resolver: yupResolver(schema) as any
    });

    const onSubmit = async (data: IFormInput) => {
        if (selectDistrict === '') {
            snackbar.handleSetSnackbar('Vui lòng chọn quận/huyện', 'error');
            snackbar.handleOpen();
        }

        if (selectProvince === '') {
            snackbar.handleSetSnackbar('Vui lòng chọn tỉnh/thành phố', 'error');
            snackbar.handleOpen();
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('image', data.image?.[0] as Blob);
        formData.append('address', data.address);
        formData.append('province', selectProvince);
        formData.append('district', selectDistrict);
        formData.append('type', selectType);

        mutationPostNewStay.mutate(formData);
    };

    useEffect(() => {
        document.title = 'Thêm sản phẩm';
    }, []);

    const getAllProvincesQuery = useQuery(
        ['provinces'],
        () => getAllProvincesAPI(),
        {
            retry: 1,
            keepPreviousData: true
        }
    );

    const getAllDistrictQuery = useQuery(
        ['districts', selectProvinceId],
        () => getAllDistrictByProvinceAPI(selectProvinceId),
        {
            retry: 1,
            keepPreviousData: true,
            enabled: !!selectProvinceId
        }
    );

    const provinceOptions = getAllProvincesQuery.data?.map((province) => ({
        id: province.province_id,
        label: province.province_name,
        value: province.province_name
    }));

    const districtOptions = getAllDistrictQuery.data?.map((district) => ({
        id: district.district_id,
        label: district.district_name,
        value: district.district_name
    }));
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
                        <Typography variant='h4'>Thêm sản phẩm</Typography>
                    </Stack>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Card
                                    sx={{
                                        p: 2
                                    }}
                                >
                                    <CardHeader title='Thêm Khách sạn' />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={12}>
                                                <Controller
                                                    name='name'
                                                    control={control}
                                                    rules={{
                                                        required: true
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            fullWidth
                                                            label='Tên khách sạn'
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
                                                            rows={4}
                                                            label='Mô tả khách sạn'
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
                                            <Grid item xs={12}>
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
                                            <Grid item xs={12}>
                                                <Controller
                                                    name='address'
                                                    control={control}
                                                    rules={{
                                                        required: true
                                                    }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            fullWidth
                                                            label='Địa chỉ khách sạn'
                                                            error={
                                                                errors.address
                                                                    ?.message
                                                                    ? true
                                                                    : false
                                                            }
                                                            helperText={
                                                                errors.address
                                                                    ?.message
                                                            }
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    disablePortal
                                                    id='combo-box-province'
                                                    options={
                                                        provinceOptions || [
                                                            {
                                                                id: 0,
                                                                label: 'Chọn tỉnh thành',
                                                                value: ''
                                                            }
                                                        ]
                                                    }
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => {
                                                        return (
                                                            option.value ===
                                                            value.value
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Tỉnh/TP'
                                                            error={
                                                                !!errors.province
                                                            }
                                                            helperText={
                                                                errors.province
                                                                    ? 'Province is required'
                                                                    : ''
                                                            }
                                                        />
                                                    )}
                                                    onChange={(
                                                        event,
                                                        value
                                                    ) => {
                                                        if (value) {
                                                            setSelectProvinceId(
                                                                value?.id.toString()
                                                            );

                                                            setSelectProvince(
                                                                value?.value
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Autocomplete
                                                    fullWidth
                                                    disablePortal
                                                    id='combo-box-district'
                                                    options={
                                                        districtOptions || [
                                                            {
                                                                id: 0,
                                                                label: 'Chọn quận huyện',
                                                                value: ''
                                                            }
                                                        ]
                                                    }
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value
                                                    ) => {
                                                        return (
                                                            option.value ===
                                                            value.value
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label='Quận/Huyện/Thị xã'
                                                        />
                                                    )}
                                                    onChange={(
                                                        event,
                                                        value
                                                    ) => {
                                                        if (value) {
                                                            setSelectDistrict(
                                                                value?.value
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Stack spacing={3}>
                                                    <Button
                                                        component='label'
                                                        variant='contained'
                                                        startIcon={
                                                            <CloudUploadIcon />
                                                        }
                                                    >
                                                        Tải lên
                                                        <VisuallyHiddenInput
                                                            type='file'
                                                            accept='image/*'
                                                            {...register(
                                                                'image'
                                                            )}
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files?.[0];
                                                                if (!file) {
                                                                    return;
                                                                }
                                                                setPreview(
                                                                    URL.createObjectURL(
                                                                        file
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </Button>
                                                    {preview ? (
                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: 200,
                                                                overflow:
                                                                    'hidden',
                                                                position:
                                                                    'relative'
                                                            }}
                                                        >
                                                            {preview && (
                                                                <img
                                                                    src={
                                                                        preview as string
                                                                    }
                                                                    alt='preview'
                                                                    style={{
                                                                        width: '100%',
                                                                        objectFit:
                                                                            'cover'
                                                                    }}
                                                                />
                                                            )}
                                                            <IconButton
                                                                onClick={() =>
                                                                    setPreview(
                                                                        null
                                                                    )
                                                                }
                                                                color='error'
                                                                size='large'
                                                                sx={{
                                                                    position:
                                                                        'absolute',
                                                                    top: 0,
                                                                    right: 0,
                                                                    zIndex: 1
                                                                }}
                                                            >
                                                                <SvgIcon>
                                                                    <ClearIcon />
                                                                </SvgIcon>
                                                            </IconButton>
                                                        </Box>
                                                    ) : (
                                                        <Skeleton
                                                            variant='rectangular'
                                                            width='100%'
                                                            height={200}
                                                        />
                                                    )}
                                                    {errors.image?.message && (
                                                        <Typography
                                                            variant='body2'
                                                            color='error'
                                                        >
                                                            {
                                                                errors.image
                                                                    ?.message
                                                            }
                                                        </Typography>
                                                    )}
                                                </Stack>
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
                open={mutationPostNewStay.isLoading}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
        </Box>
    );
};

export default AddStay;
