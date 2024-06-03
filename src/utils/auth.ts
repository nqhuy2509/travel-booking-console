const accessToken = 'access_token';
const refreshToken = 'refresh_token';
const userId = 'user_id';

export const getToken = () => {
    return localStorage.getItem(accessToken);
};

export const getUserId = () => {
    return localStorage.getItem(userId);
};

export const setUserId = (id: string) => {
    localStorage.setItem(userId, id.toString());
};

export const setToken = (access_token: string) => {
    localStorage.setItem(accessToken, access_token);
};

export const removeToken = () => {
    localStorage.removeItem(accessToken);
    localStorage.removeItem(refreshToken);
    localStorage.removeItem(userId);
};
