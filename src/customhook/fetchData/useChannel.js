// hooks/useChannel.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../service/handleToken';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastNotif } from '../../utils/ToastNotif';

export function useChannel() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['channelsList'],
        queryFn: async () => {
            const res = await api.get('/sapi/dist/channels/');
            return res.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });

    const create = useMutation({
        mutationFn: (newData) => api.post('/sapi/dist/channels/', newData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['channelsList'] })
            toastNotif('کانال با موفقیت ثبت شد', 'success')
        },
        onError: (error) => {
            toastNotif('خطا در ثبت کانال', 'error')
        }
    });

    const deleted = useMutation({
        mutationFn: (id) => api.delete(`/sapi/dist/channels/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['channelsList'] })
            toastNotif('کانال با موفقیت حذف شد', 'success')
        },
        onError: (error) => {
            toastNotif('خطا در حذف کانال', 'error')
        }
    });

    return { data, isLoading, create, deleted };
}