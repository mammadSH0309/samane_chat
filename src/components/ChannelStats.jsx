import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { api } from '../service/handleToken';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Box, Checkbox, Grid, MenuItem, Modal, Select } from '@mui/material';
import LineCharts from './charts/LineCharts';
import { useMemberTrend } from '../customhook/fetchData/useMemberTrend';
import { useParams, useSearchParams } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ViewListIcon from '@mui/icons-material/ViewList';
import DatePickerMemo from './DatePickerMemo';
import { useDebounce } from 'use-debounce';
import CancelIcon from '@mui/icons-material/Cancel';
import Buttons from './Buttons';

function ChannelStats() {
    const { search } = useParams()
    const [open, setOpen] = useState(false);
    const [selectedChannelId, setSelectedChannelId] = useState(null);

    const [filter, setFilter] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedListChannel, setSelectedListChannel] = useState([])
    const [searchParams, setSearchParams] = useSearchParams({});
    const [searchInput, setSearchInput] = useState('');
    const [platform, setPlatform] = useState([]);
    const [province, setProvince] = useState([]);
    const [channel, setChannel] = useState([]);
    const [date, setDate] = useState({ start: null, end: null });

    // Debounced versions
    const [debouncedSearchInput] = useDebounce(searchInput, 500);
    const [debouncedPlatform] = useDebounce(platform, 500);
    const [debouncedProvince] = useDebounce(province, 500);
    const [debouncedChannel] = useDebounce(channel, 500);
    const [debouncedDate] = useDebounce(date, 500);
    const { data: codePlatData, isLoading: codePlatLoad } = useQuery({
        queryKey: ['platformCode'],
        queryFn: async () => {
            const res = await api.get('/sapi/rep/platform-stats/');
            return res.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });

    useEffect(() => {
        const newParams = {};
        if (debouncedSearchInput) newParams.search = debouncedSearchInput;
        if (debouncedPlatform.length > 0) newParams.platform = debouncedPlatform.join(',');
        if (debouncedProvince.length > 0) newParams.province = debouncedProvince.join(',');
        if (debouncedChannel.length > 0) newParams.channel = debouncedChannel.join(',');
        if (debouncedDate.start) newParams.start_date = debouncedDate.start.format("YYYY-MM-DD");
        if (debouncedDate.end) newParams.end_date = debouncedDate.end.format("YYYY-MM-DD");

        setSearchParams(newParams);
    }, [
        debouncedSearchInput,
        debouncedPlatform,
        debouncedProvince,
        debouncedChannel,
        debouncedDate.start,
        debouncedDate.end,
    ]);



    const handleClearFilters = () => {
        setSearchInput('');
        setPlatform([]);  // ← قبلاً `''` بود
        setProvince([]);  // ← قبلاً `''` بود
        setChannel([]);
        setSelectedListChannel([])
        setDate({ start: null, end: null });
        setSearchParams({});
    };
    const handleStartDateChange = React.useCallback(
        (value) => setDate((prev) => ({ ...prev, start: value })),
        []
    );

    const handleEndDateChange = React.useCallback(
        (value) => setDate((prev) => ({ ...prev, end: value })),
        []
    );

    const handleIconClick = (channelId) => {
        setSelectedChannelId(channelId);
        setOpen(true);
    };


    const [openChannels, setOpenChannels] = useState(false)
    const { data, isLoading, error, isFetching, } = useQuery({
        queryKey: ['channelStats', filter.toString(), search],
        queryFn: async () => {
            const response = await api.get('/sapi/rep/channel-stats/', { params: Object.fromEntries(filter) });
            return response.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });
    const { data: dataProvinces, isLoading: loadingProvinces } = useQuery({
        queryKey: ['dashboard-provinces', filter.toString(), search],
        queryFn: async () => {
            const response = await api.get('/sapi/rep/dashboard-provinces/', { params: Object.fromEntries(filter) });
            return response.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });
    const handleClick = () => {
        filter.set('channel', selectedListChannel)
        setFilter(filter, { replace: true });
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim());
        }, 500); // 500ms دی‌بونس

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);
    const filteredData = data?.filter(channel =>
        channel.channel_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    const handleListChannel = (channelId) => {
        setSelectedListChannel(prev => {
            if (prev.includes(channelId)) {
                return prev.filter(id => id !== channelId); // حذف اگر وجود داشت
            } else {

                return [...prev, channelId]; // افزودن
            }
        },
        );
    };

    const { data: memberTrendData, isLoading: memberTrendLoading } = useMemberTrend(selectedChannelId);
   

    if (error) return <div className="text-red-500 text-center w-full">خطا در دریافت اطلاعات کانال‌ها</div>;

    return (
        <>
            <Grid
                container
                size={12}
                gap={{ laptop: 2, mobile: 0 }}
                sx={{ paddingX: { mobile: 0, tablet: 22, laptop: 0 }, paddingtop: { tablet: 3 } }}


                className='flex justify-center w-full gap-x-2   '>
                <Grid size={{ mobile: 12, tablet: 6, laptop: 'auto' }} className='flex justify-center pt-1 '>
                    <div className='flex-col'>
                        <div className="text-[14px] font-YekanBakh_Regular text-right mb-1">پلتفرم</div>
                        <Select
                            sx={{ borderRadius: '4px', height: '32px' }}
                            className='!h-[26px] flex items-center cursor-pointer relative justify-center rounded-sm  border-gray-200 w-[204px]  font-YekanBakh_Regular bg-white text-cyan-600'
                            multiple
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            renderValue={(selected) =>
                                selected
                                    .map((id) => {
                                        const p = codePlatData?.find((p) => p.platform_id === id);
                                        return p?.platform_name || id;
                                    })
                                    .join(', ')
                            }
                        >
                            {codePlatLoad ? (
                                <MenuItem disabled>در حال بارگذاری پلتفرم‌ها...</MenuItem>
                            ) : (
                                codePlatData?.map((plat) => (
                                    <MenuItem sx={{ fontFamily: 'YekanBakh_regular', fontSize: 14 }} key={plat.platform_id} value={plat.platform_id}>
                                        {plat.platform_name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </div>

                </Grid>
                <Grid size={{ mobile: 12, tablet: 6, laptop: 'auto' }} className=' flex justify-center  pt-1'>
                    <div className='flex-col'>
                        <div className="text-[14px] font-YekanBakh_Regular text-right mb-1">مرکز</div>
                        <Select
                            multiple
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            renderValue={(selected) => selected.map(id => {
                                const p = dataProvinces?.find(m => m.id === id);
                                return p?.name || id;
                            }).join(', ')}
                            sx={{ borderRadius: '4px' }}
                            className='!h-[26px] flex items-center cursor-pointer  relative justify-center rounded-sm  border-gray-200 w-[204px]  font-YekanBakh_Regular bg-white text-cyan-600 '
                        >
                            {loadingProvinces ? (
                                <MenuItem disabled>در حال بارگذاری مراکز...</MenuItem>
                            ) : (
                                dataProvinces?.map((markaz) => (
                                    <MenuItem
                                        sx={{ fontFamily: 'YekanBakh_regular', fontSize: 14 }}
                                        key={markaz.id}
                                        value={markaz.id}
                                    >
                                        {markaz.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </div>

                </Grid>
                <Grid size={{ mobile: 12, tablet: 6, laptop: 'auto' }} className="flex justify-center">
                    <div>
                        <DatePickerMemo label="تاریخ شروع" value={date.start} onChange={handleStartDateChange} />
                    </div>

                </Grid>
                <Grid size={{ mobile: 12, tablet: 6, laptop: 'auto' }} className="flex justify-center">

                    <DatePickerMemo label="تاریخ پایان" value={date.end} onChange={handleEndDateChange} />
                </Grid>
                <Grid size={{ mobile: 12, tablet: 6, laptop: 'auto' }}
                    justifyContent={{ tablet: 'center' }}
                    sx={{ paddingTop: { tablet: 2 } }}
                    className='flex items-center justify-center pt-[27px] font-YekanBakh_Regular'>
                    <button onClick={handleClearFilters} className='text-[10px] flex items-center hover:shadow-md duration-250  text-white bg-cyan-600 p-1 rounded-sm'>
                        <div className='flex cursor-pointer   gap-x-[1px]'>
                            <div>
                                <CancelIcon sx={{ fontSize: '10px' }} />

                            </div>
                            <div>حذف فیلترها</div>
                        </div>
                    </button>
                </Grid>
            </Grid>
            {
                isLoading || isFetching ? (<>
                    <div className="text-black text-center w-full">در حال بارگذاری کانال‌ها...</div>
                </>) : (
                    <>
                        <Grid container >
                            <Grid onClick={() => {
                                setOpenChannels(prev => !openChannels)
                            }}
                                className=' h-8 flex items-center  cursor-pointer relative justify-center  rounded-sm border border-cyan-600  w-full mx-5 mt-2'>

                                <div className='text-cyan-600 flex items-center'>
                                    <div>
                                        <ViewListIcon fontSize='20' />


                                    </div>
                                    <div>
                                        کانال‌ها
                                    </div>
                                </div>
                                <div className='absolute left-2 '>
                                    {openChannels !== true ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                                </div>

                            </Grid>
                            {openChannels == true ? (
                                <>
                                    <Grid className=' items-center w-full p-3 justify-center  rounded-lg border border-cyan-600 m-5 '>
                                        <Modal
                                            open={open}
                                            onClose={() => {
                                                setOpen(false);
                                                setSelectedChannelId(null);
                                            }}
                                        >
                                            <Box className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-4 max-w-xl w-full'>
                                                {memberTrendLoading && <div>در حال بارگذاری اطلاعات...</div>}
                                                {memberTrendData && <LineCharts data={memberTrendData?.chart} />}
                                            </Box>
                                        </Modal>
                                        <Grid>
                                            <div className='relative flex justify-center h-8'>
                                                <input
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            filter.set('channel', selectedListChannel)
                                                            setFilter(filter, { replace: true });
                                                        }
                                                    }}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder='جست و جو در نام کانال‌ها' className='w-full text-[12px]  py-1 pr-1 rounded-[4px] border-slate-300 border-[1px] border ' type="
                                                 " />
                                                 <div onClick={handleClick} className='absolute h-1 left-0'>
                                                    <Buttons type={1} text={"انتخاب کانال "}/>
                                                 </div>
                                            </div>
                                        </Grid>
                                        <Grid className='p-2 mt-2 rounded-lg    inset-shadow-sm  overflow-scroll no-scrollbar  bg-gray-100 p ' container size={12}>
                                            {filteredData?.map((data, index) => (

                                                <>
                                                    <Grid size={{ mobile: 12, tablet:6 }}>
                                                        <div className='flex hover:shadow-lg duration-250 shadow-md rounded-lg items-center text-[14px]  gap-x-1 bg-white m-1 h-23  '>
                                                            <div className='flex items-center gap-x-1 pr-1'>
                                                                <div>
                                                                    <Checkbox

                                                                        checked={selectedListChannel.includes(data.channel_id)} // 👈 بررسی وجود در لیست
                                                                        onChange={() => handleListChannel(data.channel_id)}
                                                                        sx={{
                                                                            color: 'black',
                                                                            '&.Mui-checked': {
                                                                                color: 'black'
                                                                            },
                                                                        }}
                                                                        size='small' fontSize='12px' />
                                                                </div>
                                                                <div>
                                                                    <img className=' w-28 h-20 rounded-md' src={data.channel_picture} alt="" />
                                                                </div>
                                                            </div>
                                                            <div style={{ fontFamily: "YekanBakh_regular" }} className='flex-col space-y-[6px] w-full px-2 '>
                                                                <div className='flex justify-between  font-bold'>
                                                                    <div className='w-full h-5 overflow-hidden'> {data.channel_name}</div>
                                                                    <div onClick={() => handleIconClick(data?.channel_id)}
                                                                        className='flex hover:bg-cyan-600 duration-250  cursor-pointer group text-[12px] group:text-white rounded-[3px] border  border-cyan-600 px-[6px] h-5  items-center gap-x-0.5'>
                                                                        <div>
                                                                            <BarChartIcon fontSize='10px' className='text-cyan-600 group-hover:text-white' />
                                                                        </div>
                                                                        <div className='text-cyan-600  group-hover:text-white '>
                                                                            وضعیت
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                <div className='flex bg-gray-100 p-[1px] px-1 justify-between'>
                                                                    <div>تعداد پست ها:</div>
                                                                    <div>    {data.total_posts}</div>
                                                                </div>
                                                                <div className='flex bg-gray-100 p-[1px] px-1 justify-between'>
                                                                    <div>تعداد بازدیدها:</div>
                                                                    <div> {data.total_views}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid>
                                                </>
                                            ))}
                                        </Grid>

                                    </Grid>
                                </>
                            ) : ('')}
                        </Grid>

                    </>
                )
            }
        </>
    );
}

export default ChannelStats;
