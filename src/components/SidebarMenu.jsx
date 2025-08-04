import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { useDaste } from '../customhook/fetchData/useDaste';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChannelList } from './ChannelList';
import { api } from '../service/handleToken';
import { Navigate } from 'react-router-dom';
import { toastNotif } from '../utils/ToastNotif';
import GroupIcon from '@mui/icons-material/Group';
import ViewListIcon from '@mui/icons-material/ViewList';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Buttons from './Buttons';
const faPlatform = (en) => {
    switch (en) {
        case "bale": return "بله";
        case "eitaa": return "ایتا";
        case "telegram": return "تلگرام";
        case "soroush": return "سروش";
        default: return en;
    }
};

const SidebarMenu = ({ image, date, hour, input, setOpen,
    mode = "create", // 'create' | 'edit'
    onSelectChange,  // callback فقط تو حالت edit
    defaultChecked = {},
    defaultCheckedCategories = {},

}) => {




    const [tab, setTab] = useState("channels");
    const [selectedPlatforms, setselectedPlatforms] = useState([]);
    const [checked, setChecked] = useState({ channel: {}, group: {} });
    const [checkedCategories, setCheckedCategories] = useState({ channel: {}, group: {} });
    const queryClient = useQueryClient();
    const { data: allChannels } = useQuery({
        queryKey: ["channelsAll"],
        queryFn: async () => (await api.get(`/sapi/dist/channels/`)).data,
    });

    const cleanedAllChannels = useMemo(() => {
        return (
            allChannels?.map((i) => ({
                ...i,
                platform: i.platform.trim().toLowerCase(),
            })) || []
        );
    }, [allChannels]);

    const filteredItems = useMemo(() => {
        return cleanedAllChannels.filter(
            (i) =>
                selectedPlatforms.includes(i.platform) &&
                i.type === (tab === "channels" ? "channel" : "group")
        );
    }, [cleanedAllChannels, selectedPlatforms, tab]);

    const handleCheck = useCallback((platform, id) => {
        const type = tab === "channels" ? "channel" : "group";
        setChecked((prev) => {
            const prevType = prev[type] || {};
            const prevList = prevType[platform] || [];
            const newList = prevList.includes(id)
                ? prevList.filter((i) => i !== id)
                : [...prevList, id];
            return {
                ...prev,
                [type]: {
                    ...prevType,
                    [platform]: newList,
                },
            };
        });
    }, [tab]);

    const handleCategoryCheck = useCallback(async (catId) => {
        const type = tab === "channels" ? "channel" : "group";

        const platformData = await Promise.all(
            selectedPlatforms.map(async (platform) => {
                const currentChecked = checkedCategories[type]?.[platform] || [];
                const isChecked = currentChecked.includes(catId);

                const res = await api.get(`/sapi/dist/channels/?category=${catId}&type=${type}`);
                const catItems = res.data.filter((ch) => ch.platform.trim().toLowerCase() === platform);

                return { platform, isChecked, catItems };
            })
        );

        setChecked((prev) => {
            const updated = { ...prev };

            platformData.forEach(({ platform, isChecked, catItems }) => {
                if (!updated[type]) updated[type] = {};
                if (!updated[type][platform]) updated[type][platform] = [];

                const prevItems = updated[type][platform];

                const newItems = isChecked
                    ? prevItems.filter((id) => !catItems.some((ch) => ch.id === id))
                    : [...new Set([...prevItems, ...catItems.map((ch) => ch.id)])];

                updated[type][platform] = newItems;
            });

            return updated;
        });

        setCheckedCategories((prev) => {
            const updated = { ...prev };

            platformData.forEach(({ platform, isChecked }) => {
                if (!updated[type]) updated[type] = {};
                const prevCats = updated[type][platform] || [];
                updated[type][platform] = isChecked
                    ? prevCats.filter((id) => id !== catId)
                    : [...prevCats, catId];
            });

            return updated;
        });
    }, [tab, selectedPlatforms, checkedCategories]);

    const togglePlatform = (platform) => {
        setselectedPlatforms([platform]);
    };

    const { data: categories } = useDaste();

    const selectedPlatform = selectedPlatforms[0];
    const selectedType = tab === 'channels' ? 'channel' : 'group';


    useEffect(() => {
        if (mode === "edit" && onSelectChange) {
            const selectedIds = Object.values(checked[selectedType] || {}).flat();
            const selectedCats = checkedCategories[selectedType]
                ? Object.values(checkedCategories[selectedType]).flat()
                : [];

            onSelectChange({
                platform: selectedPlatform,
                channelIds: selectedIds,
                categoryIds: selectedCats,
                type: selectedType,
            });
        }
    }, [checked, checkedCategories, selectedPlatform, selectedType, mode]);
    const postData = async (data) => {
        const selectedIds = Object.values(checked[selectedType] || {}).flat();
        if (!selectedIds.length) {
            throw new Error("❌ کانال‌ها الزامی هستند و نباید خالی باشند");
        }
        const formData = new FormData();
        formData.append("caption", data.caption || "");
        formData.append("date", data.date || "");
        formData.append("time", hour || "");

        selectedIds.forEach((ch) => formData.append("channels", ch));
        // اضافه کردن دسته‌ها
        const cats = checkedCategories[selectedType]
            ? Object.values(checkedCategories[selectedType]).flat()
            : [];
        cats.forEach((cat) => formData.append("category", cat));
        if (data.media) formData.append("media", data.media);
        const response = await api.post("/sapi/dist/send-posts/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            toastNotif(" ارسال با موفقیت انجام شد");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            setOpen(false)
        },

    });

    const handlePost = () => {
        const dataToSend = {
            caption: input,
            media: image,
            date: date,
            time: hour

        };
        mutation.mutate(dataToSend);
        // setOpen(false)
    };

    return (
        <>
            <Grid sx={{ fontFamily: "YekanBakh_Regular" }} className='p-2 pr-4' size={12}>
                <div className='w-full rounded-md'>
                    <div className='flex text-[13px] justify-start'>پیام رسان مورد نظر را انتخاب کنید</div>
                    <div className='flex gap-x-2 pr-1 p-1'>
                        {['eitaa', 'bale', 'telegram', 'soroush'].map((p) => (
                            <div
                                key={p}
                                onClick={() => togglePlatform(p)}
                                className={`cursor-pointer border rounded-sm p-[1px] border-gray-200 hover:bg-[#437c99] duration-200 text-[13px] w-20 px-1 text-center ${selectedPlatforms.includes(p) ? 'bg-[#437c99] text-white' : ''}`}
                            >
                                {faPlatform(p)}
                            </div>
                        ))}
                    </div>
                </div>
            </Grid>

            {selectedPlatform && (
                <div className="border border-gray-300 rounded-md text-right text-sm space-y-4">
                    <Grid container className='flex justify-between px-3 items-center bg-gray-300 h-9 rounded-sm'>
                        <Grid
                            onClick={() => setTab("channels")}
                            className={`flex ${tab === 'channels' ? 'border-b-2 border-b-cyan-800' : ""} font-YekanBakh_Bold justify-center items-center h-full w-1/2 cursor-pointer`}
                        >
                            <ViewListIcon /> کانال‌ها
                        </Grid>
                        <Grid
                            onClick={() => setTab("groups")}
                            className={`flex ${tab === 'groups' ? 'border-b-2 border-b-cyan-800' : ""} font-YekanBakh_Bold gap-x-1 justify-center items-center h-full w-1/2 cursor-pointer`}
                        >
                            <GroupIcon /> گروه‌ها
                        </Grid>
                    </Grid>

                    <div className="flex flex-wrap gap-2 px-4  ">
                        {categories?.map((cat) => {
                            const isChecked = (checkedCategories[selectedType]?.[selectedPlatform] || []).includes(cat.id);
                            return (
                                <label
                                    key={cat.id}
                                    className={`flex  items-center gap-2 px-3 py-1 border rounded-full text-[12px] cursor-pointer transition-all duration-150 ${isChecked
                                        ? 'bg-blue-100 text-blue-800 border-blue-400'
                                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                                        }`}
                                >
                                    <Checkbox
                                        size="small"
                                        sx={{ padding: '1px' }}
                                        checked={isChecked}
                                        onChange={() => handleCategoryCheck(cat.id)}
                                    />
                                    {cat.name}
                                </label>
                            );
                        })}
                    </div>

                    <div className=" h-42 overflow-scroll font-YekanBakh_Regular no-scrollbar ">
                        {filteredItems.length > 0 ? (
                            <ChannelList
                                items={filteredItems}
                                checked={checked[selectedType] || {}}
                                onCheck={(id) => handleCheck(selectedPlatform, id)}
                                platform={selectedPlatform}
                                selectedType={selectedType}
                            />
                        ) : (
                            <div className="text-center text-gray-500 text-sm ">
                                {tab === 'channels' ? 'کانالی برای این پلتفرم وجود ندارد.' : 'گروهی برای این پلتفرم وجود ندارد.'}
                            </div>
                        )}
                    </div>
                </div>

            )}
            {mode === 'create' && (
                <Grid size={12}>
                    <div className='flex pt-2 justify-center gap-x-2 '>
                        <div>
                            <Buttons text={"انصراف"} type={'1'} onClick={() => setOpen(false)}
                                className='bg-[white] text-[#437c99] border border-[#437c99] font-YekanBakh_Regular cursor-pointer text-[13px] items-center w-15 flex justify-center rounded-md p-1'>
                            </Buttons>
                        </div>
                        <div>
                            <Buttons text={"ثبت"} onClick={handlePost}
                                className='bg-[#437c99] cursor-pointer font-YekanBakh_Regular text-[13px] items-center w-15 flex justify-center rounded-md text-white p-1'>
                            </Buttons>
                        </div>
                    </div>
                </Grid>
            )}
        </>
    );
};

export default SidebarMenu;
