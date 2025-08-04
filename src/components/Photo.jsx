// src/components/Photo.jsx

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactPlayer from "react-player";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export default function Photo({ data, onDelete, onEdit }) {
  const [openVideo, setOpenVideo] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  const isVideo = /\.(mp4|webm|ogg)$/i.test(data?.media);

  useEffect(() => {
    if (!openVideo) {
      setTimeout(() => {
        setPlayerKey((prev) => prev + 1);
      }, 300);
    }
  }, [openVideo]);

  return (
    <>
      <Dialog fullScreen open={openVideo} onClose={() => setOpenVideo(false)} sx={{ zIndex: 1500 }}>
        <DialogContent
          sx={{
            backgroundColor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpenVideo(false)}
            sx={{ position: "absolute", top: 10, left: 10, zIndex: 10, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          <ReactPlayer key={playerKey} src={data.media} controls playing width="100%" height="100%" />
        </DialogContent>
      </Dialog>

      <Grid size={12}
     
        style={{
          border: "1px solid #eee",
          borderRadius: 7,
          padding: 12,
          backgroundColor: "#FFF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex justify-between" style={{ marginBottom: 5 }}>
          <div
            style={{
              width: 180,
              height: 110,
              background: "white",
              borderRadius: 8,
              marginRight: 8,
              overflow: "hidden",
              cursor: isVideo ? "pointer" : "default",
            }}
            onClick={() => isVideo && setOpenVideo(true)}
          >
            {isVideo ? (
              <ReactPlayer
                key={playerKey}
                src={data.media}
                light={true}
                width="100%"
                height="100%"
                playIcon={
                  <PlayCircleIcon
                    style={{
                      color: "white",
                      fontSize: 40,
                      background: "rgba(0,0,0,0.6)",
                      padding: 10,
                      borderRadius: "50%",
                    }}
                  />
                }
              />
            ) : (
              <img
                src={data.media}
                alt="مدیا"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            )}
          </div>

          <span
            className="overflow-scroll flex justify-start w-full no-scrollbar"
            style={{
              height: 108,
              color: "#888",
              fontSize: 13,
              fontFamily: "YekanBakh_Regular",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowY: "auto",
            }}
          >
            <div className="flex-col px-2 space-y-1 w-full items-center">
              <div className="border flex items-center text-gray-300 group hover:bg-cyan-600 duration-250 flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1">
                <CalendarMonthIcon className="flex items-center" sx={{ fontSize: 18 }} />
                <div className="group-hover:text-white flex items-center pt-[3px] font-YekanBakh_Regular">{data?.date}</div>
              </div>

              <div className="border flex items-center text-gray-300 group hover:bg-cyan-600 duration-250 flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1">
                <ScheduleIcon sx={{ fontSize: 18 }} />
                <div className="group-hover:text-white flex items-center pt-[3px] font-YekanBakh_Regular">{data?.time}</div>
              </div>

              <div
                onClick={() => onEdit(data)}
                className="border text-gray-300 group hover:bg-cyan-600 duration-250 flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1 cursor-pointer"
              >
                <EditIcon sx={{ fontSize: 18 }} className="group-hover:text-white" />
                <div className="group-hover:text-white font-YekanBakh_Regular text-sm">ویرایش</div>
              </div>

              <div
                onClick={() => onDelete(data?.id)}
                className="border text-gray-300 group hover:bg-cyan-600 cursor-pointer flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1"
              >
                <HighlightOffIcon sx={{ fontSize: 18 }} className="group-hover:text-white" />
                <div className="group-hover:text-white font-YekanBakh_Regular">حذف</div>
              </div>
            </div>
          </span>
        </div>

        <div
          className="flex justify-start mr-2 px-2 text-[13px] h-20 overflow-scroll no-scrollbar text-gray-600"
          style={{
            width: "100%",
            fontFamily: "YekanBakh_Regular",
            wordBreak: "break-word",
          }}
        >
          {data?.caption}
        </div>

        <div className="flex flex-wrap gap-2 mb-1 mt-1">
          {data?.channel_categories?.map((cat, index) => (
            <div
              key={index}
              className="font-Ray text-[14px] bg-gray-200"
              style={{
                padding: "3px 4px",
                borderRadius: 5,
                fontSize: 12,
                color: "#555",
                whiteSpace: "nowrap",
              }}
            >
              {cat?.name || cat}
            </div>
          ))}
        </div>
      </Grid>
    </>
  );
}
