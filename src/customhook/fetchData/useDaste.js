import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../service/handleToken';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastNotif } from '../../utils/ToastNotif';






export function useDaste() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['daste'],
        queryFn: async () => {
            const res = await api.get('/sapi/dist/category/');
            return res.data;
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retryDelay: 10,
    });

    const create = useMutation({
        mutationFn: (newData) => api.post('/sapi/dist/category/', newData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daste'] })
            toastNotif('دسته با موفقیت ایجاد شد', 'success');
        },
        onError: (error) => {
            toast.error(error.response.data.detail, {

                style: { fontFamily: "YekanBakh_Regular" }
            });
            toastNotif('خطا در ایجاد دسته', 'error');
       
        }
    });

    const deleted = useMutation({
        mutationFn: (id) => api.delete(`/sapi/dist/category/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daste'] })
            toastNotif('دسته با موفقیت حذف شد', 'success');
        },
        onError: (error) => {
            toast.error(error.response.data.detail, {

                style: { fontFamily: "Ray" }
            });
            toastNotif('خطا در حذف دسته', 'error');
        }
    });

    return { data, isLoading, create, deleted };
}
