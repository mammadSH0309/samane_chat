import { Dialog, Grid, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import ChannelListSettings from './ChannelListSettings';
import DasteManager from './DasteManager';
import MarakezManager from './MarakezManager';
import SupportManager from './SupportManager';
import ProfileManager from './ProfileManager';

function DialogSetting({ open, setOpen }) {

  const [activeTab, setActiveTab] = useState('کانال');

  const tabs = ['پروفایل کاربری', 'مراکز', 'دسته', 'کانال', 'پشتیبانی'];



  return (
    <Dialog
      PaperProps={{
        sx: {
          width: {
            mobile: '95%',   // <= 640px
            tablet: '90%',   // <= 1024px
            laptop: '80%',   // <= 1280px
            desktop: '70%'   // > 1280px
          },
          maxWidth: '100%',
          mx: 'auto',
          my: 4,
          borderRadius: 2,
        },
      }}
      fullWidth maxWidth="md" open={open} onClose={() => setOpen(false)}>
      <Grid container direction="column" className="bg-white rounded-md overflow-hidden">

        {/* Header */}
        <Grid item className="relative border-b border-gray-200 bg-gray-100 py-3 flex justify-center items-center">
          <span className="text-cyan-700 font-YekanBakh_Bold text-[16px]">تنظیمات</span>
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            className="!absolute  top-2 left-2"
          >
            <CloseIcon color="error" fontSize="small" />
          </IconButton>
        </Grid>

        {/* Body */}
        <Grid container size={12} className="h-[410px] ">

          {/* Sidebar */}
          <Grid item size={{ mobile: 12, tablet: 12, laptop: 3, desktop: 2 }} className="border-l     border-gray-200 p-3 bg-white">
            <Grid display={{ mobile: 'flex', laptop: 'block' }} className=" gap-2 text-[13px] justify-center flex space-y-2    font-YekanBakh_Regular">
              {tabs.map((item) => (
                <div
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`cursor-pointer w-full justify-center items-center flex py-1 px-2 rounded-md ${activeTab === item
                    ? 'bg-gray-300 text-black font-bold'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  {item}
                </div>
              ))}
            </Grid>
          </Grid>

          {/* Content */}
          <Grid item
            container
            justifyContent={{ mobile: 'center', tablet: 'start' }}
            size={{ mobile: 12, laptop: 9, desktop: 10 }} className="p-4    ">

            {activeTab === 'کانال' && (
              <>
                <Grid className='w-full'>
                  <ChannelListSettings />
                </Grid>
              </>
            )}
            {activeTab === 'مراکز' && (
              <>
                <div className='w-full'>
                  <MarakezManager />
                </div>
              </>
            )}
            {activeTab === 'دسته' && (
              <>
                <div className='w-full'>
                  <DasteManager />
                </div>
              </>
            )}
            {activeTab === 'پشتیبانی' && (
              <>
                <div className='w-full'>
                  <SupportManager />
                </div>
              </>
            )}
            {activeTab === 'پروفایل کاربری' && (
              <>
                <div className='w-full'>
                  <ProfileManager />
                </div>
              </>
            )}

            {/* می‌تونی محتوای تب‌های دیگه رو هم همینجا اضافه کنی */}
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default DialogSetting;
