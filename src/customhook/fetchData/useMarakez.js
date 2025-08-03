// hooks/useMarakez.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../service/handleToken';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastNotif } from '../../utils/ToastNotif';


export function useMarakez() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['marakez'],
        queryFn: async () => {
            const res = await api.get('/sapi/dist/provinces/');
            return res.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });

    const create = useMutation({
        mutationFn: (newData) => api.post('/sapi/dist/provinces/', newData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['marakez'] })    
            toastNotif('مرکز با موفقیت ایجاد شد', 'success');
        },
        onError: (error) => {
            toastNotif('خطا در ایجاد مرکز', 'error');
  
        }
    });

    const deleted = useMutation({
        mutationFn: (id) => api.delete(`/sapi/dist/provinces/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['marakez'] })
            toastNotif('مرکز با موفقیت حذف شد ', 'success');
        },
        onError: (error) => {
            toastNotif('خطا در حذف مرکز', 'error');
        }
    });

    return { data, isLoading, create, deleted };
}