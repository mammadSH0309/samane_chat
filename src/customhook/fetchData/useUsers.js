import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../service/handleToken'; // فرض بر اینه که axios یا fetch در اینجا هست

// گرفتن لیست کاربران
export function useUserList() {

  
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
        const res = await api.get('/sapi/dist/current-user/');
        return res.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retryDelay: 10,
  })


  return { data, isLoading};

}