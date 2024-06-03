import BarChartIcon from '@mui/icons-material/BarChart';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { SvgIcon } from '@mui/material';

type NavItemType = {
    title: string;
    path: string;
    icon: React.ReactNode;
    disabled?: boolean;
    external?: boolean;
};

export const items: NavItemType[] = [
    {
        title: 'Tổng quan',
        path: '/',
        icon: (
            <SvgIcon fontSize='small'>
                <BarChartIcon />
            </SvgIcon>
        )
    },
    {
        title: 'Nơi lưu trú',
        path: '/stays',
        icon: (
            <SvgIcon fontSize='small'>
                <MapsHomeWorkIcon />
            </SvgIcon>
        )
    },
    {
        title: 'Đơn hàng',
        path: '/orders',
        icon: (
            <SvgIcon fontSize='small'>
                <ShoppingBagIcon />
            </SvgIcon>
        )
    },
    {
        title: 'Cài đặt',
        path: '/settings',
        icon: (
            <SvgIcon fontSize='small'>
                <SettingsIcon />
            </SvgIcon>
        )
    }
];
