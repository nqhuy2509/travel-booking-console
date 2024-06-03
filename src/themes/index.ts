import { createTheme as createMuiTheme } from '@mui/material';
import { createPalette } from './create_palette';
import { createComponents } from './create_component';
import { createShadows } from './create-shadows';
import { createTypography } from './create_typography';

export const createTheme = () => {
    const palette = createPalette();
    const components = createComponents({ palette });
    const shadows = createShadows();
    const typography = createTypography();

    return createMuiTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1440
            }
        },
        components,
        shape: {
            borderRadius: 8
        },
        palette,
        shadows,
        typography
    });
};
