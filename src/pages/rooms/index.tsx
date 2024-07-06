import {
    Box,
    Button,
    Card,
    Container,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Paper,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useQuery } from 'react-query';
import { getAllRoom } from '../../api/room.api';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Details';
import { formatCurrency } from '@/utils/utils.ts';
import { useNavigate } from 'react-router-dom';

const RoomPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: RootState) => state.auth);

    const getRoomsQuery = useQuery(
        ['stays', currentUser?.stayId],
        () => getAllRoom(currentUser!.stayId),
        {
            retry: 1,
            keepPreviousData: true
        }
    );

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
                <Container maxWidth='xl'>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant='h4'>
                                Danh sách phòng
                            </Typography>
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
                                    navigate('/rooms/add');
                                }}
                            >
                                Thêm mới
                            </Button>
                        </div>
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
                                            <TableCell>Mã Phòng</TableCell>
                                            <TableCell>Tên Phòng</TableCell>
                                            <TableCell>Số giường</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            <TableCell>Còn trống</TableCell>
                                            <TableCell>Giá</TableCell>

                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getRoomsQuery.data?.data.map(
                                            (room) => (
                                                <TableRow>
                                                    <TableCell>
                                                        {room.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant='subtitle2'
                                                            sx={{
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {room.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {room.beds}
                                                    </TableCell>
                                                    <TableCell>
                                                        {room.amount}
                                                    </TableCell>
                                                    <TableCell>
                                                        {room.available}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatCurrency(
                                                            room.price || 0
                                                        )}
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
                                                                    onClick={() => {}}
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
                                                                    onClick={() => {}}
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
                                    <TableFooter></TableFooter>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default RoomPage;
