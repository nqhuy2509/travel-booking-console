import { useCallback, useState } from 'react';

type SetDialogParams = {
    title: string;
    content: string;
    action?: Function;
    dialogOk?: string;
    dialogCancel?: string;
};

export function useDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [dialogOk, setDialogOk] = useState<string>('OK');
    const [dialogCancel, setDialogCancel] = useState<string>('Hủy');
    const [action, setAction] = useState<Function>(() => () => {});

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleSetDialog = useCallback(
        ({
            title,
            content,
            action,
            dialogOk,
            dialogCancel
        }: SetDialogParams) => {
            setTitle(title);
            setContent(content);
            setDialogOk(dialogOk || 'OK');
            setDialogCancel(dialogCancel || 'Hủy');
            setAction(() => action);
        },
        []
    );

    const handleDialogAction = useCallback(() => {
        action();
    }, [action, handleClose]);

    return {
        open,
        handleOpen,
        handleClose,
        title,
        content,
        handleSetDialog,
        handleDialogAction,
        dialogOk,
        dialogCancel
    };
}
