import { styled } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopNav from './top_nav';
import SideNav from './side_nav';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH
    }
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

export const Layout = () => {
    const location = useLocation();

    const pathname = location.pathname;

    const [openNav, setOpenNav] = React.useState(false);

    const { currentUser } = useSelector((state: RootState) => state.auth);

    const handlePathnameChange = useCallback(() => {
        if (openNav) {
            setOpenNav(false);
        }
    }, [openNav]);

    useEffect(() => {
        handlePathnameChange();
    }, [pathname]);

    return (
        <>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            <SideNav
                onClose={() => setOpenNav(false)}
                open={openNav}
                role={currentUser?.role!}
            />
            <LayoutRoot>
                <LayoutContainer>
                    <Outlet />
                </LayoutContainer>
            </LayoutRoot>
        </>
    );
};
