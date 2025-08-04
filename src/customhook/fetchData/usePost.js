// hooks/usePost.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../service/handleToken';
import { toastNotif } from '../../utils/ToastNotif';

export function usePost() {
  const queryClient = useQueryClient();

  // 📦 گرفتن لیست پست‌ها
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await api.get('/sapi/dist/send-posts/');
      return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retryDelay: 10,
  });

  // ✏️ ویرایش پست
  const update = useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      formData.append('caption', data.caption);
      formData.append('date', data.date);
      formData.append('time', data.time);
      if (data.mediaFile) formData.append('media', data.mediaFile);
      (data.channels || []).forEach((id) => formData.append('channels', id));

      const res = await api.put(`/sapi/dist/send-posts/${id}/`, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toastNotif('پست با موفقیت ویرایش شد', 'success');
    },
    onError: () => toastNotif('خطا در ویرایش پست', 'error'),
  });

  // 🗑 حذف پست
  const deleted = useMutation({
    mutationFn: (id) => api.delete(`/sapi/dist/send-posts/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toastNotif('پست با موفقیت حذف شد', 'success');
    },
    onError: () => {
      toastNotif('خطا در حذف پست', 'error');
    },
  });

  // ➕ (اختیاری) ایجاد پست جدید
  const create = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append('caption', data.caption);
      formData.append('date', data.date);
      formData.append('time', data.time);
      if (data.mediaFile) {
        formData.append('media', data.mediaFile);
      }

      const res = await api.post(`/sapi/dist/send-posts/`, formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toastNotif('پست با موفقیت ثبت شد', 'success');
    },
    onError: () => {
      toastNotif('خطا در ثبت پست', 'error');
    },
  });

  return { data, isLoading, update, deleted, create };
}
