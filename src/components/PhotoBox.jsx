import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import { motion } from "framer-motion";
import SendPostProgess from "./SendPostProgess";

import EditPostDialog from "./EditPostDialog";

import Photo from "./Photo";
import { usePost } from "../customhook/fetchData/usePost";

export default function PhotoBox() {
  const { data, isLoading , deleted } = usePost();
  const [editOpen, setEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

 


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
            onClick={()=>{
              deleted.mutate(deleteId)
              setDeleteDialogOpen(false)
            }}
            disabled={deleted.isLoading}
          >
            {deleted.isLoading ? "در حال حذف..." : "بله"}
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
            disabled={deleted.isLoading}
          >
            انصراف
          </Button>
        </DialogContent>
      </Dialog>

      <Grid
      size={12}
        container
        direction="column"
        className="h-screen overflow-hidden"
        sx={{ height: { tablet: 'calc(100vh - 114px)', mobile: 'calc(100vh - 112px)', desktop: 'calc(100vh - 62px)' } }}
      >
        <Grid item className="shrink-0 px-3 flex justify-center pt-4">
          <input
            placeholder="جست و جو در پیام"
            className="border relative text-[13px] h-13 pr-1 border-gray-300 rounded-md mb-2 flex justify-center w-full"
            type="text"
          />
        </Grid>

        <Grid
          container
          item
          className="flex-1 bg-gray-100 overflow-y-auto overflow-scroll no-scrollbar rounded-md mx-3 p-4"
          style={{ boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' }}
        >
          {isLoading ? (
            <>لودینگ...</>
          ) : (
            <Grid item size={12} className="space-y-2">
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
                    onEdit={(post) => {
                      setEditingPost(post);
                      setEditOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid item className="shrink-0">
          <SendPostProgess />
        </Grid>
      </Grid>

      {editOpen && (
        <EditPostDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          post={editingPost}
          onSave={() => {
            setEditOpen(false);
            setEditingPost(null);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          }}
        />
      )}
    </>
  );
}
