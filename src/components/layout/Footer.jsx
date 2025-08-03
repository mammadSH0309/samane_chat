import { Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material'
import React, { useState } from 'react'
import DatePicker, { Calendar } from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { useNavigate } from 'react-router-dom';

function Footer() {


  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [input, setInput] = useState('')
  const navigate= useNavigate()

  return (

    <Grid container className='items-center bg-[#FAFBFC]  justify-center h-40' spacing={2}>
      <Dialog fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            minHeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        }} open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          className='bg-slate-300 w-full flex justify-center '
        >زمانبندی</DialogTitle>
        <DialogContent className='mt-4'>
          <Calendar
            value={date}
            onChange={setDate}
            format="YYYY/MM/DD HH:mm"
            plugins={[<TimePicker position="bottom" />]}
            // این باعث میشه اینپوت نشون داده نشه
            calendarPosition="bottom-center"
          />
          <Button

            onClick={() => {
              if(date !== null) {
                navigate('details')
                setOpen(false)
              }
            }}

            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}

          >
            ادامه
          </Button>
        </DialogContent>
      </Dialog>
      <Grid item xs={2} lg={12} >
        <button onClick={() => {
          if (input.trim() !== "") setOpen(true);
        }} className='hover:shadow-xl  w-20  duration-250  transition-all text-[13px] rounded-md p-2 bg-gray-500'>
          ارسال
        </button>
      </Grid>
      <Grid item xs={8} lg={12} size={10}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          type="text"
          placeholder='پیام خود را بنویسید'
          className='p-2 m-1 w-full bg-gray-400 rounded-md border border-white h-30'
        />
      </Grid>
      <Grid item xs={2}>
        <button className=' hover:shadow-xl  w-20  duration-250  transition-all  rounded-md p-2  text-[13px]  bg-gray-500'>
          اضافه کردن
        </button>
      </Grid>
    </Grid>



  )
}

export default Footer
