import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../service/handleToken';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastNotif } from '../../utils/ToastNotif';

export function useSupportTickets() {
  return useQuery({
    queryKey: ['supportTickets'],
    queryFn: async () => {
      const res = await api.get('/sapi/sup/tickets/');
      return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retryDelay: 10,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTicket) => api.post('/sapi/sup/tickets/', newTicket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      toastNotif('تیکت با موفقیت ثبت شد', 'success');
    },
    onError: (error) => {
      toastNotif('خطا در ایجاد تیکت', 'error');

    },
  });
}


export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId) => api.delete(`/sapi/sup/tickets/${ticketId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      toastNotif('تیکت با موفقیت حذف شد', 'success');
    },
    onError: (error) => {
      toastNotif('خطا در حذف تیکت', 'error');
    },
  });
}

export function useAdminRespondToTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, response }) =>
      api.post(`/sapi/sup/admin-tickets/${ticketId}/add_admin_response/`, {
        response,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      toastNotif('پاسخ با موفقیت ثبت شد ');
    
    },
    onError: (error) => {
      toastNotif('خطا در ارسال پاسخ' , "error");
    },
  });
}