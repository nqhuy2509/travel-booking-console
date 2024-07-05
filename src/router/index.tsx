import { RouteObject } from 'react-router-dom';
import { Layout as AuthLayout } from '../layouts/auth/layout.tsx';
import { Layout as MainLayout } from '../layouts/dashboard/layout.tsx';
import StaysPage from '../pages/stays/index.tsx';
import ProductDetail from '../pages/stays/stay-detail.tsx';
import PrivateRoute from './private_route.tsx';
import LoginPage from '../pages/auth/login.tsx';
import AddStay from '../pages/stays/add-stay.tsx';
import RoomPage from '../pages/rooms/index.tsx';

export const routes: RouteObject[] = [
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            }
        ]
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <PrivateRoute />
            },
            {
                path: 'stays',
                element: <PrivateRoute />,
                children: [
                    {
                        path: 'add',
                        element: <AddStay />
                    },
                    {
                        path: '',
                        element: <StaysPage />
                    },

                    {
                        path: ':id',
                        element: <ProductDetail />
                    }
                ]
            },
            {
                path: 'rooms',
                element: <PrivateRoute />,
                children: [
                    {
                        path: '',
                        element: <RoomPage />
                    }
                ]
            }
        ]
    }
];
