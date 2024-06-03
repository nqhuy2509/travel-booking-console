import { AlertColor } from '@mui/material';
import { useState } from 'react';

export function useSnackbar() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleSetSnackbar = (message: string, severity: AlertColor) => {
        setMessage(message);
        setSeverity(severity);
    };

    return {
        open,
        handleOpen,
        handleClose,
        message,
        severity,
        handleSetSnackbar
    };
}
