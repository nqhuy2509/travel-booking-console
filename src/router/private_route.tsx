import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';
import { getUserId, getToken } from '../utils/auth';

export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    STAFF = 'staff'
}

export default function PrivateRoute({ role }: { role?: Role }) {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const userId = getUserId();
    const authToken = getToken();

    const authorized = role ? currentUser?.role === role : true || true;

    return currentUser && userId && authToken && authorized ? (
        <Outlet />
    ) : (
        <Navigate to='/auth/login' />
    );
}
