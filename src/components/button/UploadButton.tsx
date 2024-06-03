import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, styled } from '@mui/material';

type Props = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register?: any;
};

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});

const UploadButton = (props: Props) => {
    return (
        <>
            <Button
                component='label'
                variant='contained'
                startIcon={<CloudUploadIcon />}
            >
                Tải lên
                <VisuallyHiddenInput type='file' onChange={props.onChange} />
            </Button>
        </>
    );
};

export default UploadButton;
