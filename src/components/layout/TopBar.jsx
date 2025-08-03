import {
  Box,
  Skeleton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';
import { api } from '../../service/handleToken';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from '../../components/modals/NotificationModal';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


// کاستوم هوک‌های تیکت

import AddNotificationModal from '../../components/modals/AddNotificationModal';
import { useNotifications } from '../../customhook/fetchData/useNotifications';
import DialogSetting from '../../components/DialogSetting';
import { useQuery } from '@tanstack/react-query';

function TopBar() {

  // مودال ارسال تیکت جدید
  const [notificationModal, setNotificationModal] = useState(false);
  const [addNotificationModal, setAddNotificationModal] = useState(false)
  const [open, setOpen] = useState(false)



  const { data: notifications = [], isLoading: loadingNotifications } = useNotifications();



  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/sapi/dist/current-user/');
      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const handleMenuOpen = () => {
    setOpen(true)
  }

  
  useEffect(() => {
  if (data && data[0]) {
    localStorage.setItem('userInfo', JSON.stringify({
      firstName: data[0].first_name,
      lastName: data[0].last_name,
      isSuperAdmin: data[0].is_superadmin,
    }));
  }
}, [data]);


  const handleLogout = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }
  };

  return (
    <div className=''>

      <Box size={{ lg: 12, xs: 12 }} sx={{ fontFamily: 'Ray' }}>
        <ToastContainer />
        {/* اعلان‌ها */}
        <NotificationModal
          open={notificationModal}
          onClose={() => setNotificationModal(false)}
          notifications={notifications}
        />
        <AddNotificationModal
          open={addNotificationModal}
          onClose={() => setAddNotificationModal(false)}
        />
        <DialogSetting open={open} setOpen={setOpen} />
        {/* Header */}
        <header className="bg-white  px-5 text-black flex items-center justify-between">
          <div className="flex items-center font-YekanBakh_Regular gap-x-2">
            <img src={logo} width={90} className="pr-2" alt="logo" />
            <div>
              {isLoading ? (
                <Skeleton width={100} />
              ) : data ? (
                `${data[0]?.first_name} ${data[0]?.last_name}`
              ) : null}
            </div>
          </div>
          <div>

          </div>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center '>
              <button onClick={handleMenuOpen} className='border font-YekanBakh_Regular text-[13px]  border-[2px] text-[#00838F]   gap-x-1 items-center border-cyan-600 px-1 rounded-sm'>

                <SettingsIcon sx={{ fontSize: 17, color: '#00838F' }} />
              </button>
            </div>
            <div className='flex items-center cursor-pointer '>
              <button onClick={() => setNotificationModal(true)} className='border font-YekanBakh_Regular text-[13px]  border-[2px] text-[#00838F]   gap-x-1 items-center border-cyan-600 px-1 rounded-sm'>

                <NotificationsIcon sx={{ fontSize: 17, color: '#00838F' }} />
              </button>
            </div>
            <div className='flex  '>
              <button onClick={handleLogout} className='border font-YekanBakh_Regular text-[13px]  border-[2px] text-[#00838F]   gap-x-1 items-center border-cyan-600 px-1 rounded-sm'>

                <LogoutIcon className='flex justify-center '
                  sx={{ fontSize: 17, color: '#00838F' }} />
              </button>
            </div>


          </div>
        </header>
      </Box>
    </div>
  );
}

export default TopBar;
