import React, { useEffect, useRef, useState } from 'react'
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from '@mui/icons-material/AttachFile';

import {

    Dialog,

    Grid,

} from '@mui/material'
import InputIcon from 'react-multi-date-picker/components/input_icon';
import SidebarMenu from './SidebarMenu';
import DateObject from 'react-date-object';
import Buttons from './Buttons';


function SendPostProgess() {

    const [open, setOpen] = useState(false);

    const [step, setStep] = useState(0)
    const [input, setInput] = useState("");
    const fileInputRef = useRef(null);
    const [date, setDate] = useState(null);
    const [hour, setHour] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        if (!open) {
            setStep(0)
        }
    }, [step, open])
    return (
        <>
            <Dialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
                <div
                    sx={{ fontFamily: 'f' }}
                    className="bg-gray-100 font-YekanBakh_Bold  text-cyan-600 text-center flex justify-center items-center h-12">
                    اضافه کردن پست جدید
                </div>
                {step == 0 ?
                    (
                        <>
                            <div className='overflow-scroll flex-col h-102 no-scrollbar'>

                                <div className=' justify-center w-full  '>
                                    <div className='  justify-center items-center'>
                                        <div className=' flex-col  space-y-10  justify-center  items-center mx-8'>

                                            <div className='w-full mt-10'>
                                                <div className='border border-gray-300 flex justify-center   mt-2 p-3 rounded-md'>
                                                    <div className='flex-col space-y-4'>
                                                        <div
                                                            className='font-YekanBakh_Bold flex justify-center pt-2 text-[13px]'
                                                        >تاریخ ارسال را مشخص کنید
                                                        </div>
                                                        <div>
                                                            <DatePicker
                                                                format="YYYY-MM-DD"
                                                                calendar={persian}
                                                                value={date}
                                                                onChange={(date) => {
                                                                    setDate(date);
                                                                    const formattedDate = new DateObject({
                                                                        date: date?.toDate?.(), // اگه date یه آبجکت از DateObject بود
                                                                        calendar: persian,
                                                                    }).format("YYYY-MM-DD");
                                                                    setDate(formattedDate)
                                                                }}
                                                                portal={false}
                                                                locale={persian_fa}
                                                                render={<InputIcon />}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-full mt-2'>
                                                <div className='border border-gray-300 flex justify-center   mt-2 p-3 rounded-md'>
                                                    <div className='flex-col space-y-4'>
                                                        <div
                                                            className='font-YekanBakh_Bold flex justify-center pt-2 text-[13px]'
                                                        >ساعت ارسال را مشخص کنید
                                                        </div>
                                                        <div>
                                                            <DatePicker
                                                                format="hh:mm:ss"
                                                                calendar={persian}
                                                                disableDayPicker
                                                                value={hour}
                                                                locale={persian_fa}
                                                             
                                                                onChange={(e) => {
                                                                    setHour(e);

                                                                }}
                                                                plugins={[
                                                                    <TimePicker />
                                                                ]}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex gap-x-4 mt-3 justify-center'>
                                                <div>
                                                    <Buttons
                                                    type={'1'}
                                                    text={'بازگشت'}
                                                        onClick={() => {
                                                            setOpen(false)
                                                        }}
                                                        className='  cursor-pointer text-[13px] p-1 w-15 bg-white border font-YekanBakh_Bold text-[#437c99] border-[#437c99]  rounded-md '>
                                                        
                                                    </Buttons>
                                                </div>
                                                <Buttons 
                                                text={'ادامه'}
                                                    onClick={() => {

                                                        if (date == null || hour == null) {
                                                            console.log("فیلد ها باید پر شود")
                                                        } else {
                                                            setStep(prev => prev + 1)
                                                        }


                                                    }}
                                                    className='bg-[#437c99] cursor-pointer text-[13px] items-center w-15 flex justify-center rounded-md text-white  p-1'>
                                                    
                                                </Buttons>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </>
                    ) :
                    (
                        <>
                            <Grid className='h-110 overflow-scroll no-scrollbar' size={12}>

                                <Grid className='' container>
                                    <Grid className='p-2' size={12}>
                                        <SidebarMenu setOpen={setOpen} image={selectedImage} date={date} hour={hour} input={input} />
                                    </Grid>

                                </Grid>


                            </Grid>
                        </>
                    )
                }
            </Dialog>

            <Grid gap={1} className='flex justify-center' container size={12}>
                <Grid className=' flex justify-center' size={1}>
                    <div className='flex-col gap-2  flex text-[12px]  '>
                        <div className=' flex justify-center '>
                            <SendIcon
                                onClick={() => input.trim() && setOpen(true)}
                                sx={{ backgroundColor: "#437c99", fontSize: 30, color: "white", borderRadius: 1, padding: 1, marginTop: 1 }}
                            />
                        </div>
                        <div className='flex justify-center  '>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) setSelectedImage(file);
                                }}
                            />
                            <AttachFileIcon onClick={() => fileInputRef.current?.click()} className='border border-[#294c5d]'
                                sx={{ backgroundColor: '#ecf2f5', color: '#294c5d', border: true, fontSize: 30, borderRadius: 1, padding: 1, marginBottom: 1 }}
                            />
                        </div>

                    </div>
                </Grid>
                <Grid className='h-full ' size={10}>
                    <textarea
                        style={{ fontFamily: 'YekanBakh_regular' }}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        variant="outlined"
                        placeholder="پیام خود را بنویسید"
                        fullWidth
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // جلوگیری از رفتن به خط جدید
                                if (input.trim()) setOpen(true); // فقط اگر چیزی تایپ شده بود
                            }
                        }}
                        multiline
                        className='border border-[#294c5d] pt-1 pr-1 text-[12px] w-full mt-2 h-17 rounded-md'
                    />
                </Grid>
            </Grid>

        </>
    )
}

export default SendPostProgess
