import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { createTheme } from './themes/index.ts';

import { QueryClient, QueryClientProvider } from 'react-query';
import { routes } from './router/index.tsx';

function App() {
    const theme = createTheme();

    const queryClient = new QueryClient();

    const AppRouter = () => useRoutes(routes);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <Router>
                        <AppRouter />
                    </Router>
                </CssBaseline>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
