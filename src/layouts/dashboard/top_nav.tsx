import DehazeIcon from '@mui/icons-material/Dehaze';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Theme,
    Tooltip,
    alpha,
    useMediaQuery
} from '@mui/material';
import { usePopover } from '../../hooks/usePopover';
import AccountPopover from './account_popover';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

type Props = {
    onNavOpen: () => void;
};

const TopNav = (props: Props) => {
    const { onNavOpen } = props;
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const accountPopover = usePopover();

    return (
        <>
            <Box
                component='header'
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: (theme) =>
                        alpha(theme.palette.background.default, 0.8),
                    position: 'sticky',
                    left: {
                        lg: `${SIDE_NAV_WIDTH}px`
                    },
                    top: 0,
                    width: {
                        lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                    },
                    zIndex: (theme) => theme.zIndex.appBar
                }}
            >
                <Stack
                    alignItems='center'
                    direction='row'
                    justifyContent='space-between'
                    spacing={2}
                    sx={{ minHeight: TOP_NAV_HEIGHT, px: 2 }}
                >
                    <Stack alignItems='center' direction='row' spacing={2}>
                        {!lgUp && (
                            <IconButton onClick={onNavOpen}>
                                <SvgIcon fontSize='small'>
                                    <DehazeIcon />
                                </SvgIcon>
                            </IconButton>
                        )}
                        <Tooltip title='Search'>
                            <IconButton>
                                <SvgIcon fontSize='small'>
                                    <SearchIcon />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Stack alignItems='center' direction='row' spacing={2}>
                        <Tooltip title='Contacts'>
                            <IconButton>
                                <SvgIcon fontSize='small'>
                                    <GroupIcon />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Notifications'>
                            <IconButton>
                                <Badge
                                    badgeContent={4}
                                    color='success'
                                    variant='dot'
                                >
                                    <SvgIcon fontSize='small'>
                                        <NotificationsIcon />
                                    </SvgIcon>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Avatar
                            onClick={accountPopover.handleOpen}
                            ref={accountPopover.anchorRef}
                            sx={{
                                cursor: 'pointer',
                                height: 40,
                                width: 40
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>
            <AccountPopover
                anchorEl={accountPopover.anchorRef.current}
                open={accountPopover.open}
                onClose={accountPopover.handleClose}
            ></AccountPopover>
        </>
    );
};

export default TopNav;
