import { Grid } from '@mui/material'
import React from 'react'
import PeopleIcon from '@mui/icons-material/People';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PostAddIcon from '@mui/icons-material/PostAdd';
import useNumPersian from '../customhook/useNumPersian';
function CardStats({ data, data1 }) {
    return (
        <Grid

            sx={{ fontFamily: "YekanBakh_Bold" ,border : {mobile : 'none' , tablet : '1px solid #437c99'} , borderColor : '#437c99' }}
            spacing={1}
            
            className='font-YekanBakh_Bold h-full p-2 rounded-full'
            container
            columns={15}
            size={15}
        >

            <Grid item size={{ tablet: 3, laptop: 3, mobile: 15 }} style={{ fontFamily: "YekanBakh_regular" }}
                className='flex justify-start items-center gap-x-2   h-full'>
                <div className=' right-1 top-[3px] rounded-full text-white  bg-cyan-600 size-13 '>
                    <div className='flex  justify-center items-center h-full'>
                        <FormatListBulletedIcon sx={{ fontSize: 35 }} />
                    </div>
                </div>
                <div className="flex flex-1   gap-x-2  justify-between px-2  ">
                    <div className=" font-YekanBakh_Bold text-cyan-600 "> کانال</div>
                    <div className="flex items-center font-YekanBakh_Bold  text-cyan-600 justify-center">{useNumPersian(data?.total_channels)}</div>
                </div>
            </Grid>
            <Grid item size={{ tablet: 3, laptop: 3, mobile: 15 }} style={{ fontFamily: "YekanBakh_regular" }}
                className='flex justify-start items-center gap-x-2   h-full'>
                <div className=' right-1 top-[3px] rounded-full text-white  bg-cyan-600 size-13 '>
                    <div className='flex  justify-center items-center h-full'>
                        <PostAddIcon sx={{ fontSize: 35 }} />
                    </div>
                </div>
                <div className="flex flex-1   gap-x-2  justify-between px-2  ">
                    <div className=" font-YekanBakh_Bold text-cyan-600 ">پست</div>
                    <div className="flex items-center font-YekanBakh_Bold  text-cyan-600 justify-center">{useNumPersian(data?.total_posts)}</div>
                </div>
            </Grid>
            <Grid item size={{ tablet: 3, laptop: 3, mobile: 15 }} style={{ fontFamily: "YekanBakh_regular" }}
                className='flex justify-start items-center gap-x-2   h-full'>
                <div className=' right-1 top-[3px] rounded-full text-white  bg-cyan-600 size-13 '>
                    <div className='flex  justify-center items-center h-full'>
                        <CreateIcon sx={{ fontSize: 35 }} />
                    </div>
                </div>
                <div className="flex flex-1   gap-x-2  justify-between px-2  ">
                    <div className=" font-YekanBakh_Bold text-cyan-600 ">نویسنده</div>
                    <div className="flex items-center font-YekanBakh_Bold  text-cyan-600 justify-center">{useNumPersian(data?.total_authors)}</div>
                </div>
            </Grid>
            <Grid item size={{ tablet: 3, laptop: 3, mobile: 15 }} style={{ fontFamily: "YekanBakh_regular" }}
                className='flex justify-start items-center gap-x-2   h-full'>
                <div className=' right-1 top-[3px] rounded-full text-white  bg-cyan-600 size-13 '>
                    <div className='flex  justify-center items-center h-full'>
                        <RemoveRedEyeIcon sx={{ fontSize: 35 }} />
                    </div>
                </div>
                <div className="flex flex-1   gap-x-2  justify-between px-2  ">
                    <div className=" font-YekanBakh_Bold text-cyan-600 ">بازدید</div>
                    <div className="flex items-center font-YekanBakh_Bold  text-cyan-600 justify-center">{useNumPersian(data?.total_views)}</div>
                </div>
            </Grid>
            <Grid item size={{ tablet: 3, laptop: 3, mobile: 15 }} style={{ fontFamily: "YekanBakh_regular" }}
                className='flex justify-start items-center gap-x-2   h-full'>
                <div className=' right-1 top-[3px] rounded-full text-white  bg-cyan-600 size-13 '>
                    <div className='flex  justify-center items-center h-full'>
                        <PeopleIcon sx={{ fontSize: 35 }} />
                    </div>
                </div>
                <div className="flex flex-1   gap-x-2  justify-between px-2  ">
                    <div className=" font-YekanBakh_Bold text-cyan-600 ">عضو</div>
                    <div className="flex items-center font-YekanBakh_Bold  text-cyan-600 justify-center">{useNumPersian(data1)}</div>
                </div>
            </Grid>

        </Grid>
    )
}

export default CardStats
