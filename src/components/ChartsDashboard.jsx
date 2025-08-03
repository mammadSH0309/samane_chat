import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { api } from '../service/handleToken';
import CardStats from './CardStats';
import { Grid } from '@mui/material';
import PieChart from './charts/PieChart';
import PaperCharts from './charts/PaperCharts';
import LineCharts from './charts/LineCharts';
import BarCharts from './charts/BarCharts';
import ChannelStats from './ChannelStats';
import { useSearchParams } from 'react-router-dom';
import AbrEbarat from './charts/AbrEbarat';
import { useMemberTrend } from '../customhook/fetchData/useMemberTrend';
import NotifDialog from './NotifDialog';
function ChartsDashboard() {

  const [searchParams, setSearchParams] = useSearchParams({});
  const { data: memberTrendData, isLoading: memberTrendLoading } = useMemberTrend();
  const { data, isLoading, error } = useQuery({
    queryKey: [searchParams.toString(), 'channelDashboard'],
    queryFn: async () => {
      const response = await api.get('/sapi/rep/dashboard/', { params: Object.fromEntries(searchParams) });
      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retryDelay: 10,
  });



  return (
    <>
      <div>
        <NotifDialog />
      </div>
        <ChannelStats />
      <Grid size={12} container className='p-4     ' >
          <CardStats data1={memberTrendData ? memberTrendData?.total_members : null} data={data ? data : null} />
        <Grid container size={12}>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"روند انتشار روزانه"}
              chart={
                <>
                  <LineCharts data={data?.daily_trend} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"روند بازدید روزانه"}
              chart={
                <>
                  <LineCharts data={data?.daily_view_trend} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4' size={12}>
            <PaperCharts
              title={"کانال های برتر(انتشار)"}
              chart={
                <>
                  <BarCharts data={data?.top_channels_by_post} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"کانال های برتر(بازدید)"}
              chart={
                <>
                  <BarCharts data={data?.top_channels_by_view} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"هشتگ برتر"}
              chart={
                <>
                  <AbrEbarat data={data?.top_hashtags_by_post} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"کلمات برتر"}
              chart={
                <>
                  <AbrEbarat data={data?.top_words_by_post} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"روند عضوگیری"}
              chart={
                <>
                  <LineCharts data={memberTrendData?.chart} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"فراوانی پلتفرم(بر اساس بازدید)"}
              chart={
                <>
                  <PieChart data={data?.platform_total_views} height={350} />
                </>
              }
            />
          </Grid>
          <Grid className='pt-4 ' size={12}>
            <PaperCharts
              title={"فراوانی پلتفرم(بر اساس انتشار)"}
              chart={
                <>
                  <PieChart data={data?.platform_post_counts} height={350} />
                </>
              }
            />
          </Grid>
        </Grid>

      </Grid>
    </>
  )
}

export default ChartsDashboard
