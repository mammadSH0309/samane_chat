import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
function NotifDialog({ title, type }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>

            <Dialog

                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <div className='w-110 h-60 rounded-lg'>

                    <div className='flex justify-center  h-full items-center '>
                        <div className='flex-col'>
                            <div className='flex justify-center'>
                                {type == 'error' ? <HighlightOffIcon sx={{ fontSize: 100, color: 'red' }} /> 
                                : 
                                <HighlightOffIcon sx={{ fontSize: 100, color: 'green' }}/> }
                            </div>
                            <div
                            
                                style={{ color: type == 'error' ? 'red' : 'green' }}
                                className='flex text-[20px] justify-center pt-3'>
                                {title ? title : "یک چیزی بنویسید"}
                            </div>

                        </div>

                    </div>

                </div>
                <div className=' flex justify-center '>
                    <button onClick={handleClose} className='border cursor-pointer border-cyan-800 text-cyan-800 text-[13px]  px-3 rounded-sm'>
                        بستن
                    </button>
                </div>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default NotifDialog
