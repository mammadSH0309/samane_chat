// components/ManagementModals/MarakezModal.jsx
import React, { useState } from 'react'
import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 300,
  fontFamily : "ray",
  borderRadius: '14px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function MarakezModal({ open, onClose, data, loading, create, remove }) {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    create.mutate({ name: newName });
    setNewName('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box  className="no-scrollbar" sx={style}>
        {loading ? (
          'در حال بارگذاری...'
        ) : (
          <>
            {data?.map((item) => (
              <div  key={item.id} className="flex justify-between items-center">
                <div className="font-Ray">{item.name}</div>
                <IconButton onClick={() => remove.mutate(item.id)}>
                  <RemoveIcon />
                </IconButton>
              </div>
            ))}
       
          </>
        )}
      </Box>
    </Modal>
  );
}

export default MarakezModal;
