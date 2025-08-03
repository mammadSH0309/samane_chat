
import { Outlet } from 'react-router-dom'
import { CssBaseline, Grid } from '@mui/material'

import TopBar from './components/layout/TopBar'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from './components/layout/Footer';
import { ToastContainer } from 'react-toastify';

function App() {




  return (
    <>
      <ToastContainer
        position="top-center"
        style={{
          fontFamily: 'YekanBakh_regular',
          fontSize: '13px',
          direction: 'rtl',
        }}
      />
  
      <Grid container direction="column" sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* TopBar height fixed to 60px */}
        <Grid

          item sx={{ height: '60px', flexShrink: 0 }}>
          <div className='shadow-md'>
            <TopBar />
          </div>
        </Grid>

        {/* باقی صفحه با scroll داخلی */}
        <Grid size={12} item sx={{ flex: 1, overflow: 'hidden', fontFamily: "YekanBakh_Regular" }}>
          <Outlet />
        </Grid>
      </Grid>

    </>
  )
}

export default App
