import React from 'react'

function PaperCharts({ title, chart, backgroundColor, backgroundTitle, height }) {
  return (
    <div style={{ height: height ? height : null, backgroundColor: backgroundColor ? backgroundColor : "" }}
      className=' bg-white border border-1 border-cyan-600 rounded-md'>
      <div className='flex-col'>
        <div  className='f text-white h-12 flex items-center justify-center text-[15px] bg-cyan-700' >
          {title}
        </div>

        <div>
          {chart}
        </div>

      </div>
    </div>
  )
}

export default PaperCharts
