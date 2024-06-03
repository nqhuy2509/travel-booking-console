import { common } from '@mui/material/colors';
import { alpha } from '@mui/material';
import {
    error,
    indigo,
    info,
    neutral,
    success,
    warning
} from '@/themes/colors';
import { PaletteOptions } from '@mui/material/styles';

export const createPalette = (): PaletteOptions => {
    return {
        action: {
            active: neutral[500],
            disabled: alpha(neutral[900], 0.38),
            disabledBackground: alpha(neutral[900], 0.12),
            focus: alpha(neutral[900], 0.16),
            hover: alpha(neutral[900], 0.04),
            selected: alpha(neutral[900], 0.12)
        },
        background: {
            default: common.white,
            paper: common.white
        },
        divider: '#F2F4F7',
        error,
        info,
        mode: 'light',
        primary: indigo,
        success,
        neutral,
        text: {
            primary: neutral[900],
            secondary: neutral[500],
            disabled: alpha(neutral[900], 0.38)
        },
        warning
    };
};
