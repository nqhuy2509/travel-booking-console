import AddIcon from '@mui/icons-material/Add';
import CLoseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Details';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import WarningIcon from '@mui/icons-material/Warning';
import {
    Alert,
    Backdrop,
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Paper,
    Snackbar,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
    styled
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import {
    deleteStayByIdAPI,
    downloadFileProductsAPI,
    getAllProvincesAPI,
    getAllStaysAPI,
    uploadFileProductsAPI
} from '../../api/stay.api';
import { useDialog } from '../../hooks/useDialog';
import { useSnackbar } from '../../hooks/useSnackbar';
import { stayStatusMapping, stayTypeMapping } from '../../utils/mapping';

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

const StaysPage = () => {
    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const navigate = useNavigate();

    const dialog = useDialog();

    const snackbar = useSnackbar();

    const getStaysQuery = useQuery(
        ['stays', page, rowsPerPage],
        () => getAllStaysAPI(page + 1, rowsPerPage),
        {
            retry: 1,
            keepPreviousData: true
        }
    );

    const mutationDeleteStay = useMutation({
        mutationFn: deleteStayByIdAPI,
        onSuccess: () => {
            snackbar.handleSetSnackbar('Xóa nơi lưu trú thành công', 'success');
            snackbar.handleOpen();
        },
        onError: () => {
            snackbar.handleSetSnackbar('Xóa nơi lưu trú thất bại', 'error');
            snackbar.handleOpen();
        }
    });

    const mutationUploadFile = useMutation({
        mutationFn: uploadFileProductsAPI,
        onSuccess: () => {
            snackbar.handleSetSnackbar(
                'Tải file nhập sản phẩm thành công',
                'success'
            );
            snackbar.handleOpen();
            dialog.handleClose();
            getStaysQuery.refetch();
        },
        onError: () => {
            snackbar.handleSetSnackbar(
                'Tải file nhập sản phẩm thất bại',
                'error'
            );
            snackbar.handleOpen();
            dialog.handleClose();
        }
    });

    const handleDeleteProduct = (id: string) => {
        dialog.handleSetDialog({
            content: 'Bạn có chắc chắn muốn xóa nơi lưu trú này không?',
            title: 'Xóa nơi lưu trú',
            dialogCancel: 'Hủy',
            dialogOk: 'Xóa',
            action: async () => {
                await mutationDeleteStay.mutateAsync(id);
                dialog.handleClose();
                getStaysQuery.refetch();
            }
        });
        dialog.handleOpen();
    };

    const handleUploadFileProducts = (file: File) => {
        const fileName = file.name;

        dialog.handleSetDialog({
            content: `Bạn có chắc chắn muốn tải lên file ${fileName} không?`,
            title: 'Tải file nhập sản phẩm',
            dialogCancel: 'Hủy',
            dialogOk: 'Tải lên',
            action: () => {
                const formData = new FormData();
                formData.append('file', file);
                mutationUploadFile.mutateAsync(formData);
            }
        });

        dialog.handleOpen();
    };

    const handleDownloadFileProducts = async () => {
        dialog.handleSetDialog({
            content: 'Bạn có chắc chắn muốn tải xuống file không?',
            title: 'Tải file danh sách nhập sản phẩm',
            dialogCancel: 'Hủy',
            dialogOk: 'Tải xuống',
            action: async () => {
                const response = await downloadFileProductsAPI();
                const data = response.data;

                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');

                link.href = url;

                link.download = 'products.xlsx';

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

                dialog.handleClose();
            }
        });

        dialog.handleOpen();
    };

    useEffect(() => {
        document.title = 'Nơi lưu trú';
    }, []);

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

    return (
        <>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth='xl'>
                    <Stack spacing={3}>
                        <Stack
                            direction='row'
                            justifyContent='space-between'
                            flexWrap='wrap-reverse'
                        >
                            <Stack spacing={1}>
                                <Typography variant='h4'>
                                    Danh sách nơi lưu trú
                                </Typography>
                                <Stack
                                    alignItems='center'
                                    direction='row'
                                    spacing={1}
                                >
                                    <Button
                                        component='label'
                                        variant='contained'
                                        color='inherit'
                                        startIcon={
                                            <SvgIcon fontSize='small'>
                                                <UploadIcon />
                                            </SvgIcon>
                                        }
                                    >
                                        Tải lên
                                        <VisuallyHiddenInput
                                            id='upload-file'
                                            type='file'
                                            accept='.xlsx, .xls, .csv'
                                            onChange={(event) => {
                                                const files =
                                                    event.target.files;

                                                if (files && files.length) {
                                                    handleUploadFileProducts(
                                                        files[0]
                                                    );
                                                }
                                            }}
                                        />
                                    </Button>

                                    <Button
                                        color='inherit'
                                        startIcon={
                                            <SvgIcon fontSize='small'>
                                                <DownloadIcon />
                                            </SvgIcon>
                                        }
                                        onClick={handleDownloadFileProducts}
                                    >
                                        Tải xuống
                                    </Button>
                                </Stack>
                            </Stack>
                            <div>
                                <Button
                                    startIcon={
                                        <SvgIcon fontSize='small'>
                                            <AddIcon />
                                        </SvgIcon>
                                    }
                                    variant='contained'
                                    onClick={() => {
                                        navigate('/stays/add');
                                    }}
                                >
                                    Thêm mới
                                </Button>
                            </div>
                        </Stack>
                        <Card sx={{ p: 2 }}>
                            <Stack direction='row' spacing={2}>
                                <OutlinedInput
                                    defaultValue=''
                                    fullWidth
                                    placeholder='Tìm kiếm'
                                    startAdornment={
                                        <InputAdornment position='start'>
                                            <SvgIcon fontSize='small'>
                                                <SearchIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    }
                                    sx={{
                                        maxWidth: 500
                                    }}
                                />

                                <Button>Tìm</Button>
                            </Stack>
                        </Card>
                        <Card>
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{
                                        minWidth: 750
                                    }}
                                    aria-label='product table'
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã khách sạn</TableCell>
                                            <TableCell>Tên Khách sạn</TableCell>
                                            <TableCell>Loại</TableCell>
                                            <TableCell>Địa chỉ</TableCell>
                                            <TableCell>Tình trạng</TableCell>
                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getStaysQuery.data &&
                                            getStaysQuery.data.data.map(
                                                (stay) => (
                                                    <TableRow key={stay.id}>
                                                        <TableCell>
                                                            {stay.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Stack
                                                                direction='row'
                                                                spacing={2}
                                                                alignItems='center'
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        width: 50,
                                                                        height: 50,
                                                                        borderRadius: 1
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            stay.image ||
                                                                            '/images/placeholder.png'
                                                                        }
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit:
                                                                                'cover'
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography
                                                                    variant='subtitle2'
                                                                    sx={{
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    {stay.name}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                stayTypeMapping[
                                                                    stay.type
                                                                ]
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {`${stay.location.address}, ${stay.location.district}, ${stay.location.province}`}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                stayStatusMapping[
                                                                    stay.status
                                                                ]
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <Stack
                                                                direction='row'
                                                                spacing={2}
                                                            >
                                                                <Tooltip
                                                                    title='Chi tiết'
                                                                    placement='top'
                                                                >
                                                                    <IconButton
                                                                        color='primary'
                                                                        onClick={() => {
                                                                            navigate(
                                                                                `/stays/${stay.id}`
                                                                            );
                                                                        }}
                                                                    >
                                                                        <SvgIcon fontSize='small'>
                                                                            <DetailsIcon />
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip
                                                                    title='Xóa'
                                                                    placement='top'
                                                                >
                                                                    <IconButton
                                                                        color='error'
                                                                        onClick={() => {
                                                                            handleDeleteProduct(
                                                                                stay.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <SvgIcon fontSize='small'>
                                                                            <DeleteIcon />
                                                                        </SvgIcon>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                colSpan={6}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={(_, newPage) => {
                                                    console.log(newPage);

                                                    setPage(newPage);
                                                }}
                                                onRowsPerPageChange={(
                                                    event
                                                ) => {
                                                    setRowsPerPage(
                                                        parseInt(
                                                            event.target.value,
                                                            10
                                                        )
                                                    );
                                                    setPage(0);
                                                }}
                                                count={
                                                    getStaysQuery.data?.meta
                                                        ?.itemCount || 0
                                                }
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Card>
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
                    open={
                        getStaysQuery.isLoading || mutationDeleteStay.isLoading
                    }
                >
                    <CircularProgress color='inherit' />
                </Backdrop>
            </Box>
        </>
    );
};

export default StaysPage;
