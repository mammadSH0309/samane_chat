import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../service/handleToken';
import { toastNotif } from '../../utils/ToastNotif';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/sapi/sup/user-notifications/');
      return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retryDelay: 10,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNotif) => api.post('/sapi/sup/notifications/', newNotif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toastNotif('اعلان با موفقیت ثبت شد', 'success');
    },
    onError: (error) => {
      toastNotif('خطا در ارسال اعلان', 'error');
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/sapi/sup/notifications/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toastNotif('اعلان با موفقیت حذف شد', 'success');
    },
    onError: (error) => {
      toastNotif('خطا در حذف اعلان', 'error');
    },
  });
}
