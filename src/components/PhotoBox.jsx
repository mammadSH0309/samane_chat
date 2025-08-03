import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { api } from "../service/handleToken";
import { motion } from "framer-motion";
import SendPostProgess from "./SendPostProgess";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { toastNotif } from "../utils/ToastNotif";
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from "react-player";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
function Photo({
  data,
  onDelete,
}) {
  const [openVideo, setOpenVideo] = useState(false);
  const [playerKey, setPlayerKey] = useState(0); // 👈 کلید برای ری‌ست

  const isVideo = /\.(mp4|webm|ogg)$/i.test(data?.media);
  // وقتی دیالوگ بسته شد → ReactPlayer ریست بشه
  useEffect(() => {
    if (!openVideo) {
      setTimeout(() => {
        setPlayerKey((prev) => prev + 1);
      }, 300); // یه تاخیر کوچیک تا مودال کامل بسته شه
    }
  }, [openVideo]);
  return (
    <>
      {/* ویدیو فول‌اسکرین */}
      <Dialog
        fullScreen
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        sx={{ zIndex: 1500 }}
      >
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
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
          <ReactPlayer
            key={playerKey}
            src={data.media}
            controls
            playing
            width="100%"
            height="100%"
          />
        </DialogContent>
      </Dialog>

      {/* خود کارت */}
      <Grid
        style={{
          height: "100%",
          border: "1px solid #eee",
          borderRadius: 7,
          padding: 12,
          paddingTop: 20,
          marginTop: 3,
          backgroundColor: "#FFF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* عکس یا ویدیو */}
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

          {/* اطلاعات پست */}
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
            <div className="flex-col  px-2 space-y-1 w-full items-center">
              <div className="border  flex items-center text-gray-300 group hover:bg-cyan-600 duration-250 flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1">
                <CalendarMonthIcon className="flex items-center" sx={{ fontSize: 18 }} />
                <div className="group-hover:text-white flex items-center  pt-[3px] font-YekanBakh_Regular">{data?.date}</div>
              </div>

              <div className="border flex items-center   text-gray-300 group hover:bg-cyan-600 duration-250 flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1">
                <ScheduleIcon sx={{ fontSize: 18 }} />
                <div className="group-hover:text-white flex items-center  pt-[3px] font-YekanBakh_Regular">{data?.time}</div>
              </div>

              <div className="border text-gray-300 group hover:bg-cyan-600 duration-250 flex gap-x-[2px] border-gray-300 rounded-sm h-6 pr-1">
                <EditIcon sx={{ fontSize: 18 }} className="group-hover:text-white" />
                <div className="group-hover:text-white  font-YekanBakh_Regular text-sm">ویرایش</div>
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

        {/* کپشن */}
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

        {/* دسته‌بندی */}
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
export default function PhotoBox() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/sapi/dist/send-posts/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toastNotif("پست با موفقیت حذف شد");// ✅ درستش اینه
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: () => toastNotif("پست با موفقیت حذف شد", 'error'),
  });
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/sapi/dist/send-posts/");
      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retryDelay: 10,
  });


  return (
    <>
      <Dialog
        sx={{ fontFamily: "YekanBakh_Regular" }}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle sx={{ fontFamily: "YekanBakh_Regular" }}>
          آیا از حذف این پست مطمئن هستید؟
        </DialogTitle>
        <DialogContent>
          <Button
            sx={{
              backgroundColor: "#437c99",
              color: "white",
              borderColor: "#437c99",
              mt: 1,
            }}
            variant="outlined"
            className="!text-sm !font-YekanBakh_Bold"
            fullWidth
            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "در حال حذف..." : "بله"}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            className="!text-sm !font-YekanBakh_Bold"
            sx={{
              backgroundColor: "white",
              color: "#437c99",
              borderColor: "#437c99",
              mt: 1,
            }}
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteMutation.isLoading}
          >
            انصراف
          </Button>
        </DialogContent>
      </Dialog>
      <Grid  
      size={12}
        sx={{ height: {tablet : 'calc(100vh - 114px)' , mobile : 'calc(100vh - 112px)' , desktop :  'calc(100vh - 62px)' } }}
        container
        direction="column"
        className=" h-screen overflow-hidden  " // ← اینجا تغییر مهم: h-screen
      >

        <Grid size={12} item className="shrink-0 px-3  flex justify-center pt-4">
          <input
            placeholder="جست و جو در پیام"
            className="border relative text-[13px]  h-13 pr-1  border-gray-300 rounded-md mb-2 flex justify-center w-full " type="text"
          />
        </Grid>


        <Grid
          container
          style={{

            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
          item className="flex-1 bg-gray-100  overflow-y-auto overflow-scroll bg-gYekanBakh_Regular-100  inset-shadow-sm no-scrollbar  rounded-md mx-3 p-4">
          {isLoading ? (
            <>لودینگ...</>
          ) : (
            <Grid
              size={12}
              className='      space-y-2 p '>
              {data?.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Photo
                    data={item}
                    onDelete={() => {
                      setDeleteId(item.id);
                      setDeleteDialogOpen(true);
                    }}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    setDeleteId={setDeleteId}
                  />
                </motion.div>
              ))}
            </Grid>



          )}
        </Grid>

        {/* پایین (ثابت) */}
        <Grid item className="shrink-0 ">
          <div className="h-full">
            <SendPostProgess />
          </div>
        </Grid>
      </Grid>


    </>
  );

}
