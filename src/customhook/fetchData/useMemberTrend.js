import { useQuery } from '@tanstack/react-query';
import { api } from '../../service/handleToken';
import { useParams, useSearchParams } from 'react-router-dom';

export const useMemberTrend = (channelId) => {

    const { search } = useParams()
    const [filter, setFilter] = useSearchParams({})
    return useQuery({
        queryKey: ['memberTrend', channelId, search, filter.toString(),],
        queryFn: async () => {
            const response = await api.get(`/sapi/rep/member-trend/?${channelId ? `channel_id=${channelId}` : ''}`
                , { params: Object.fromEntries(filter) });
            return response.data;
        },
        // فقط وقتی channelId وجود دارد اجرا شود
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};
