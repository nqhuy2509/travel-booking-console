import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import {
    Box,
    Divider,
    MenuItem,
    MenuList,
    Popover,
    Typography
} from '@mui/material';
import { removeToken } from '../../utils/auth';
import { logoutStart, logoutSuccess } from '../../redux/auth/auth.slice';
import { logoutAPI } from '../../api/auth.api';

type Props = {
    anchorEl: null | HTMLElement;
    onClose: () => void;
    open: boolean;
};

const AccountPopover = (props: Props) => {
    const { anchorEl, onClose, open } = props;

    const navigate = useNavigate();

    const { currentUser } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const handleSignOut = async () => {
        removeToken();
        dispatch(logoutSuccess());
        navigate('/auth/login', { replace: true });
        // try {
        //     const res = await logoutAPI(currentUser?.id!);

        //     if (res.status === 200) {
        //         removeToken();
        //         dispatch(logoutSuccess());
        //         navigate('/auth/login', { replace: true });
        //     }
        // } catch (error) {}
    };

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
            }}
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 200 } }}
        >
            <Box
                sx={{
                    py: 1.5,
                    px: 2
                }}
            >
                <Typography variant='overline'>Tài khoản</Typography>
                <Typography color='text.secondary' variant='body2'>
                    {currentUser?.username}
                </Typography>
            </Box>
            <Divider />

            <MenuList
                disablePadding
                dense
                sx={{
                    p: '8px',
                    '& >*': {
                        borderRadius: 1
                    }
                }}
            >
                <MenuItem onClick={handleSignOut}>Đăng xuất</MenuItem>
            </MenuList>
        </Popover>
    );
};

export default AccountPopover;
