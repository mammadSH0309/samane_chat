import React, { useState } from 'react';
import {
  Dialog, DialogContent, Typography, Box, IconButton,
  FormControlLabel, Checkbox,
  Autocomplete,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddIcon from '@mui/icons-material/Add';
import { useCreateNotification, useDeleteNotification } from '../../customhook/fetchData/useNotifications';
import { useUserList } from '../../customhook/fetchData/useUsers';
import { toastNotif } from '../../utils/ToastNotif';
import Buttons from '../../components/Buttons';

function NotificationModal({ open, onClose, notifications = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    users: [],
    is_global: false,
  });

  const [openPage, setOpenPage] = useState(false);

  const { mutate: createNotification, isLoading: isSending } = useCreateNotification();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { data: users = [] } = useUserList();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e) => {
    setFormData(prev => ({
      ...prev,
      is_global: e.target.checked,
      users: [],
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message) {
      toastNotif("عنوان و پیام نمی‌تواند خالی باشد", "error");
      return;
    }

    const payload = {
      ...formData,
      users: formData.is_global ? [] : formData.users.map(u => u.id),
    };

    createNotification(payload, {
      onSuccess: () => {
        setFormData({ title: '', message: '', users: [], is_global: false });
        setOpenPage(false);

      },
      onError: () => {
        toastNotif("ارسال اعلان با خطا مواجه شد", "error");
      }
    });
  };

  const handleDelete = (id) => {
    deleteNotification(id);

  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: '#f9fafb',
          maxHeight: '80vh',
          fontFamily: "Ray",
          overflowY: 'auto',
        },
      }}
    >
      <div className='flex justify-center bg-gray-200 shadow-sm h-full p-3 font-Ray font-bold text-[24px] relative text-cyan-800'>
        اعلان‌ها
        <div className='absolute left-1 cursor-pointer'>
          <HighlightOffIcon onClick={onClose} sx={{ color: "red", fontSize: 30 }} />
        </div>
      </div>

      <DialogContent>
        {openPage ? (
          <div className="rounded-md p-6 overflow-scroll font-YekanBakh_Regular no-scrollbar max-w-xl mx-auto">
            <div className="flex flex-col w-full gap-4 mb-6 text-[13px]">
              <div>
                <label className="block mb-1 text-gray-600">عنوان پیام</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded px-2 py-1"
                  type="text"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">متن پیام</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded px-2 py-1 resize-none"
                />
              </div>
              <div>
                <FormControlLabel

                  control={
                    <Checkbox
                      sx={{ fontFamily: "YekanBakh_Regular" }}
                      checked={formData.is_global}
                      onChange={handleCheckbox}
                    />
                  }
                  componentsProps={{
                    typography: {
                      sx: { fontFamily: 'YekanBakh_Regular' }
                    }
                  }}
                  label="ارسال به همه کاربران (سراسری)"
                  sx={{ mb: 2, fontFamily: "YekanBakh_Regular" }}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600">دریافت کنندگان</label>
                <select

                  disabled={formData.is_global}
                  value={formData.users.map(user => user.id)}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => {
                      const user = users.find(u => u.id === +option.value); // یا parseInt
                      return user;
                    });
                    setFormData(prev => ({ ...prev, users: selectedOptions }));
                  }}
                  className="w-full border border-gray-400 rounded px-2 py-1"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>


              </div>

            </div>

            <div className="flex justify-center gap-4">
              <Buttons onClick={() => setOpenPage(false)} text="لغو" type={1} />
              <Buttons onClick={handleSubmit} text="ثبت اعلان جدید" type={2} />
            </div>
          </div>
        ) : (
          <>
           <div  className=' mr-5 m-2 '>
             <Buttons
             
              type={2}
              text={<>
                <AddIcon />
                ارسال اعلان
              </>}
              onClick={() => setOpenPage(true)}

            />
           </div>




            {notifications.length === 0 ? (
              <Typography align="center" color="text.secondary" sx={{ fontFamily: "Ray", mt: 4 }}>
                اعلانی ثبت نشده است.
              </Typography>
            ) : (
              notifications.map(({ id, title, message, is_global }) => (
                <Box className='mx-4 border border-gray-300'
                  key={id}
                  sx={{
                    fontFamily: "Ray",
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 6px 15px rgba(0,0,0,0.07)',
                    backgroundColor: '#fff',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.01)' },
                  }}
                >
                  <Box sx={{ fontFamily: "Ray", display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NotificationsActiveIcon sx={{ color: '#1976d2' }} />
                      <Typography variant="h6" fontWeight="bold" color="#34495e">
                        {title}
                      </Typography>
                    </Box>

                    <IconButton color="error" onClick={() => handleDelete(id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Typography sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{message}</Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: is_global ? '#e8f5e9' : '#fff3e0',
                      color: is_global ? '#2e7d32' : '#ef6c00',
                      fontWeight: 'bold',
                    }}
                  >
                    {is_global ? 'اعلان سراسری' : 'اعلان اختصاصی'}
                  </Typography>
                </Box>
              ))
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NotificationModal;
