import {
    Box,
    Divider,
    Drawer,
    Stack,
    SvgIcon,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Scrollbar } from '@/components/scrollbar';
import { Logo } from '@/components/logo';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { items } from './nav_items';
import SideNavItem from './side_nav_item';

type Props = {
    open: boolean;
    onClose: () => void;
    role: string;
};

const SideNav = (props: Props) => {
    const { open, onClose, role } = props;

    const location = useLocation();
    const pathname = location.pathname;

    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const content = (
        <Scrollbar
            sx={{
                height: '100%',
                '& .simplebar-content': {
                    height: '100%'
                },
                '& .simplebar-scrollbar::before': {
                    background: 'neutral.400'
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box
                        component={Link}
                        to='/'
                        sx={{ display: 'inline-flex', height: 32, width: 32 }}
                    >
                        <Logo />
                    </Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            borderRadius: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                            p: '12px'
                        }}
                    >
                        <div>
                            <Typography color='inherit' variant='subtitle1'>
                                Agency Management
                            </Typography>
                            <Typography color='neutral.400' variant='body2'>
                                {role}
                            </Typography>
                        </div>
                        <SvgIcon fontSize='small' sx={{ color: 'neutral.500' }}>
                            <UnfoldMoreIcon />
                        </SvgIcon>
                    </Box>
                </Box>
            </Box>
            <Divider sx={{ borderColor: 'neutral.700' }} />
            <Box component='nav' sx={{ flexGrow: 1, px: 2, py: 3 }}>
                <Stack
                    component='ul'
                    spacing={0.5}
                    sx={{ listStyle: 'none', p: 0, m: 0 }}
                >
                    {items.map((item) => {
                        const active = item.path === pathname;

                        return (
                            <SideNavItem
                                active={active}
                                disabled={item.disabled || false}
                                external={item.external || false}
                                icon={item.icon}
                                key={item.title}
                                path={item.path}
                                title={item.title}
                            />
                        );
                    })}
                </Stack>
            </Box>
            <Divider sx={{ borderColor: 'neutral.700' }} />
        </Scrollbar>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor='left'
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.800',
                        color: 'common.white',
                        width: 280
                    }
                }}
                variant='permanent'
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor='left'
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.800',
                    color: 'common.white',
                    width: 280
                }
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant='temporary'
        >
            {content}
        </Drawer>
    );
};

export default SideNav;
