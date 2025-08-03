import React, { useState } from 'react';
import { Button, FormControl, IconButton, MenuItem, Select } from '@mui/material';
import { useChannel } from '../customhook/fetchData/useChannel';
import { useMarakez } from '../customhook/fetchData/useMarakez';
import { useDaste } from '../customhook/fetchData/useDaste';
import Buttons from './Buttons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../service/handleToken';


import RemoveIcon from '@mui/icons-material/Remove';
function ChannelListSettings() {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [platform, setPlatform] = useState('');
    const [markazId, setMarkazId] = useState('');
    const [dasteId, setDasteId] = useState('');
    const [type, setType] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { data, isLoading: loading, deleted: remove, create: createChannel } = useChannel();
    const { data: marakezData } = useMarakez();
    const { data: dasteData } = useDaste();

    const { data: usersData } = useQuery({
        queryKey: ['usersAddChannel'],
        queryFn: async () => {
            const res = await api.get('/sapi/dist/users/');
            return res.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });
    const handleSubmit = () => {
        const data = {
            name,

            platform,
            channel_id: id,
            province: markazId,
            daste_id: dasteId,
            type,
            users: selectedUsers, // اضافه کردن لیست کاربران انتخاب‌شده
        };

        createChannel.mutate(data);
        setOpen(false)
    };


    return (
        <div className="w-full font-YekanBakh_Regular">
            {!open && (
                <div className="mb-4">
                    <Button
                        variant="outlined"
                        className="!text-sm !font-YekanBakh_Bold"
                        onClick={() => setOpen(true)}
                    >
                        + ثبت کانال جدید
                    </Button>

                    {loading ? (
                        <div className="mt-4 text-center">در حال بارگذاری...</div>
                    ) : (
                        <div className="mt-4 overflow-y-auto no-scrollbar max-h-[320px] space-y-4">
                            {data?.length === 0 ? (
                                <div className="text-center text-gray-500">کانالی ثبت نشده است</div>
                            ) : (
                                data.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-gray-300 rounded-md p-3 "
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="font-bold text-[15px]">{item.name}</div>
                                            <IconButton size="small" onClick={() => remove.mutate(item.id)}>
                                                <RemoveIcon />
                                            </IconButton>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2">آیدی: {item.id}</div>
                                        <div className="text-sm text-gray-600">پلتفرم: {item.platform}</div>
                                        <div className="text-sm text-gray-600">مرکز: {item.markaz_name ?? 'نامشخص'}</div>
                                        <div className="text-sm text-gray-600">دسته: {item.daste_name ?? 'نامشخص'}</div>
                                        <div className="text-sm text-gray-600">نوع: {item.type ?? 'نامشخص'}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {open && (
                <div className=" rounded-md p-6 overflow-scroll no-scrollbar max-w-xl mx-auto ">


                    <div className="grid grid-cols-2 gap-4 mb-6 text-[13px]">
                        <div>
                            <label className="block mb-1 text-gray-600">نام کانال</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                                type="text"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-600">آیدی کانال</label>
                            <input
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                                type="text"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-600">انتخاب پلتفرم</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                            >
                                <option value="">انتخاب کنید</option>
                                <option value="telegram">تلگرام</option>
                                <option value="bale">بله</option>
                                <option value="eitaa">ایتا</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-600">انتخاب مرکز</label>
                            <select
                                value={markazId}
                                onChange={(e) => setMarkazId(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                            >
                                <option value="">انتخاب کنید</option>
                                {marakezData?.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-600">دسته</label>
                            <select
                                value={dasteId}
                                onChange={(e) => setDasteId(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                            >
                                <option value="">انتخاب کنید</option>
                                {dasteData?.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-gray-600">نوع</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full border border-gray-400 rounded px-2 py-1"
                            >
                                <option value="">انتخاب کنید</option>
                                <option value="channel">کانال</option>
                                <option value="group">گروه</option>
                            </select>
                        </div>
                        <div >
                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <div className='' id="user-select-label">کاربران</div>
                                <Select
                                    labelId="user-select-label"
                                    multiple
                                    value={selectedUsers}
                                    onChange={(e) => setSelectedUsers(e.target.value)}
                                    renderValue={(selected) =>
                                        selected.length === 0
                                            ? "انتخاب کنید"
                                            : usersData
                                                ?.filter((u) => selected.includes(u.id))
                                                .map((u) => u.username)
                                                .join("، ")
                                    }
                                    sx={{
                                        fontSize: 14,
                                        borderRadius: "6px",
                                        fontFamily: "YekanBakh_Regular",
                                        '& .MuiSelect-select': {
                                            py: 1,

                                            px: 2,
                                        },
                                    }}
                                >
                                    {usersData?.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>



                            {/* نمایش Chips (اختیاری) */}

                        </div>

                    </div>

                    <div className="flex justify-center gap-4">


                        <Buttons onClick={handleSubmit} text={"ثبت کانال جدید"} type={2} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChannelListSettings;
