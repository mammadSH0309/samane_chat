import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, TextField,
  IconButton, Checkbox, FormControlLabel, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCreateNotification, useDeleteNotification } from '../../customhook/fetchData/useNotifications';
import { useUserList } from '../../customhook/fetchData/useUsers'; // لیست کاربران

function AddNotificationModal({ open, onClose, notifications = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    users: [],
    is_global: false,
  });

  const { mutate: createNotification, isLoading: isSending } = useCreateNotification();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { data: users = [] } = useUserList();

  const handleCheckbox = (e) => {
    setFormData(prev => ({ ...prev, is_global: e.target.checked, users: [] }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) return;

    const payload = {
      ...formData,
      users: formData.is_global ? [] : formData.users.map(u => u.id),
    };

    createNotification(payload, {
      onSuccess: () => {
        setFormData({ title: '', message: '', users: [], is_global: false });
      },
    });
    onClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این اعلان مطمئن هستید؟')) {
      deleteNotification(id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: 22, fontFamily: 'ray' }}>مدیریت اعلان‌ها</DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#fafafa', fontFamily: 'ray' }}>
        {/* فرم ایجاد اعلان */}
       

        {/* لیست اعلان‌ها */}
        {notifications.length === 0 ? (
          <Typography align="center" color="text.secondary">
            هنوز اعلانی ارسال نشده است.
          </Typography>
        ) : (
          notifications.map(({ id, title, message, is_global }) => (
            <Box
              key={id}
              sx={{
                mb: 3,
                p: 2,
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0 0 5px rgba(0,0,0,0.05)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight="bold" fontFamily="ray">{title}</Typography>
                <IconButton color="error" onClick={() => handleDelete(id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap', fontFamily: 'ray' }}>{message}</Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: 'inline-block',
                  backgroundColor: is_global ? '#e8f5e9' : '#fff3e0',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontFamily: 'ray'
                }}
              >
                {is_global ? 'اعلان سراسری' : 'اعلان اختصاصی'}
              </Typography>
            </Box>
          ))
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose} sx={{ fontFamily: 'ray' }}>
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNotificationModal;
