import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import styles from './styles.module.scss';

interface Props {
    open: boolean;
    title?: string;
    description?: string;
    handleClose: () => void;
    renderer?: () => void;
}

const BasicModal = (props: Props): JSX.Element => {
    const {
        open,
        title,
        description,
        handleClose,
        renderer,
        children,
    } = props;

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Box className={styles.box}>
                    {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {description}
                    </Typography> */}
                    {children}
                    {renderer || ''}
                    <button
                        onClick={handleClose}
                        type="button"
                        className={styles.nextBtn}
                    >
                        Ok
                    </button>
                </Box>
            </Modal>
        </div>
    );
};

export default BasicModal;
