import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

// AlertMessage component displays a temporary notification using Material-UI Snackbar and Alert.
const AlertMessage = ({ severity, message, onClose }) => {

    useEffect(() => {
        if (message) {
            // Automatically close the alert after 5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity={severity} onClose={onClose}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertMessage;
