import React, { useState, useRef, useEffect } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Dialog, DialogContent, Grid } from "@mui/material";
import Buttons from "./Buttons";
import { usePost } from "../customhook/fetchData/usePost";
import SidebarMenu from "./SidebarMenu";
import DateObject from "react-date-object";

export default function EditPostDialog({ open, onClose, post }) {
  const [caption, setCaption] = useState(post?.caption || "");
  const [date, setDate] = useState(post?.date || null);
  const [time, setTime] = useState(post?.time || null);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const fileInputRef = useRef(null);

  const { update } = usePost();

  useEffect(() => {
    if (post) {
      setCaption(post.caption || "");

      // ✅ تبدیل تاریخ رشته‌ای به DateObject
      if (post.date) {
        const [year, month, day] = post.date.split("-");
        const newDate = new DateObject({ calendar: persian, year: +year, month: +month, day: +day });
        setDate(newDate);
      } else {
        setDate(null);
      }

      if (post.time) {
        const [hours, minutes, seconds] = post.time.split(":");
        const newTime = new DateObject({ hour: +hours, minute: +minutes, second: +seconds });
        setTime(newTime);
      } else {
        setTime(null);
      }

      setSelectedChannels(post.channels || []);
      setMediaFile(null);
    }
  }, [post]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setMediaFile(e.target.files[0]);
    }
  };
  const handleChannelsChange = (data) => {
    if (Array.isArray(data)) {
      setSelectedChannels(data);
    } else {
      setSelectedChannels(data.channelIds || []);
    }
  };

  const handleSubmit = () => {
    const formattedDate = typeof date === "string" ? date : date?.format("YYYY-MM-DD");
    const formattedTime = typeof time === "string" ? time : time?.format("HH:mm:ss");

    update.mutate({
      id: post.id,
      data: {
        caption,
        date: formattedDate,
        time: formattedTime,
        mediaFile,
        channels: selectedChannels,
      },
    });

    onClose();
  };


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
      open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Grid item className="relative border-b border-gray-200 bg-gray-100 py-3 flex justify-center items-center">
        <span className="text-cyan-700 font-YekanBakh_Bold text-[16px]">ویرایش پست</span>
      </Grid>

      <DialogContent dividers>
        {/* کپشن */}
        <div className="mb-4">
          <label className="block mb-1 flex justify-center font-YekanBakh_Regular text-gray-600">کپشن</label>
          <textarea
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-gray-400 rounded px-2 py-1 resize-none"
            placeholder="متن کپشن را وارد کنید"
            style={{ fontFamily: "YekanBakh_Regular", fontSize: 13 }}
          />
        </div>

        {/* تاریخ و ساعت */}
        <div className="mb-4 flex-col space-y-5 gap-4">
          <div className="flex-1 border font-YekanBakh_Regular justify-center border-gray-300 rounded p-3">
            <label className="block mb-1 font-YekanBakh_Regular text-gray-600 text-center">تاریخ ارسال</label>
            <div className="flex justify-center">
              <DatePicker
                format="YYYY-MM-DD"
                locale={persian_fa}
                value={date}
                onChange={(d) => setDate(d?.format("YYYY-MM-DD"))}
                style={{ fontFamily: "YekanBakh_Regular", fontSize: 13 }}
              />
            </div>
          </div>

          <div className="flex-1 border font-YekanBakh_Regular border-gray-300 rounded p-3">
            <label className=" block mb-1 font-YekanBakh_Regular text-gray-600 text-center">ساعت ارسال</label>
            <div className="flex justify-center">
              <DatePicker
                format="hh:mm:ss"
                calendar={persian}
                disableDayPicker
                value={time}
                locale={persian_fa}
                onChange={(e) => setTime(e)}
                plugins={[<TimePicker />]}
              />
            </div>
          </div>
        </div>

        {/* آپلود فایل */}
        <div className="flex-1 border border-gray-300 rounded p-3 justify-center flex">
          <div>
            <label className="block mb-1 font-YekanBakh_Regular text-gray-600">آپلود عکس یا ویدیو</label>
            <div className="flex justify-center font-YekanBakh_Regular items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#437c99] flex justify-center text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                type="button"
                style={{ fontFamily: "YekanBakh_Regular", fontSize: 13 }}
              >
                انتخاب فایل
              </button>
              {mediaFile && <span className="text-sm text-gray-700">{mediaFile.name}</span>}
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* SidebarMenu */}
        <div className="mt-6">
          <SidebarMenu
            mode="edit"


            setOpen={() => { }}
            defaultChecked={{
              channel: {
                telegram: post.channels || []
              }
            }}
            onChangeSelection={handleChannelsChange}
          />
        </div>
      </DialogContent>

      <Grid className="flex gap-x-4 py-4 justify-center">
        <Buttons text={"لغو"} type={1} onClick={onClose} />
        <Buttons text={"ذخیره"} onClick={handleSubmit} />
      </Grid>
    </Dialog>
  );
}
