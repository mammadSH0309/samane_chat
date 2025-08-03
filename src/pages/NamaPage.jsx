import React, { useState } from "react";
import {
  Grid,
  useMediaQuery,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArticleIcon from "@mui/icons-material/Article";

import PhotoBox from "../components/PhotoBox";
import ChartsDashboard from "../components/ChartsDashboard";


function NamaPage() {
  const [mobileTab, setMobileTab] = useState("posts");
  const isLgDown = useMediaQuery("(max-width:1200px)");

  return (
    <>
      {isLgDown && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
          }}
          elevation={8}
        >
          <BottomNavigation sx={{ fontFamily: "Ray" }}
            showLabels
            value={mobileTab}
            onChange={(event, newValue) => setMobileTab(newValue)}
          >
            <BottomNavigationAction sx={{ fontFamily: "Ray" }} label={<span className="font-Ray">پست ها</span>} value="posts" icon={<ArticleIcon />} />
            <BottomNavigationAction sx={{ fontFamily: "Ray" }} label={<span className="font-Ray">چارت ها</span>} value="charts" icon={<BarChartIcon />} />
          </BottomNavigation>
        </Paper>
      )}

      <Grid container size={12} >
        {isLgDown ? (
          <>
            {mobileTab === "posts" && (
              <Grid
                className='overflow-scroll h-screen no-scrollbar'
                container item size={{ lg: 12, xs: 12 }} >
                <PhotoBox />
              </Grid>
            )}
            {mobileTab === "charts" && (
              <Grid
                className='overflow-scroll h-screen no-scrollbar'
                item size={{ lg: 12, sm: 12 }} sx={{ paddingBottom: "80px" }}>
                <ChartsDashboard />
              </Grid>
            )}
          </>
        ) : (
          <>
            {/* ✅ پست‌ها سمت راست */}

            <Grid

              item
              className=" no-scrollbar   h-screen overflow-scroll no-scrollbar  border-l-1 border-slate-200"
              size={{ lg: 3, sm: 12 }}
         
            >
              <PhotoBox />

            </Grid>



            {/* ✅ چارت‌ها سمت چپ */}
            <Grid
              item
              size={{ lg: 9, sm: 12 }}
              className="p-2 pt-2 px-6 w-screen h-screen overflow-scroll no-scrollbar"
              sx={{
                borderLeft: "1px solid #ccc",
                height: '100vh',
                overflowY: 'auto',
                paddingBottom: '80px',
              }}
            >
              <ChartsDashboard />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

export default NamaPage;
