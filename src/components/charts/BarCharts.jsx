import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


// import HC_exporting from 'highcharts/modules/exporting'

const converters = {
  // Latin to Farsi
  fa: function (number) {
      return number.toString().replace(/\d/g, function (d) {
          return String.fromCharCode(d.charCodeAt(0) + 1728);
      });
  },
  // Latin to Arabic
  ar: function (number) {
      return number.toString().replace(/\d/g, function (d) {
          return String.fromCharCode(d.charCodeAt(0) + 1584);
      });
  }
};

function BarCharts({
  key,
  data,
  height,
  color,
  marginRight,
  param,
  marginTop,
  backgroundButton,
  marginBot,
  marginLeft,
  datatest,
  url , 
  type ,
  bgcolor ,
  width , legend
}) 
{




    

   

   

  const options = 
{
    navigation: {
        buttonOptions: {
            theme: {
                r: 5,
                  fill: backgroundButton ? backgroundButton : null ,
            }
        }
    },
    boost: {
        useGPUTranslations: true,
        usePreAllocated: true
      },
    exporting: {
       
        buttons: {
            contextButton: {
                menuItems: [
                    "viewFullscreen", "printChart","downloadPDF", "downloadPNG", "downloadSVG" , "downloadCSV"
                ]
            }
        }
    },
    lang :{
        viewFullscreen : "نمایش در کل صفحه",
        printChart : "پرینت نمودار",
        downloadPNG : "PNG دانلود",
        downloadSVG : "SVG دانلود",
            downloadPDF : "PDF دانلود ",
            downloadCSV : "CSV دانلود",
            noData: 'دیتایی وجود ندارد '
    },
    chart: {
        numberFormatter: function () {
            const ret = Highcharts.numberFormat.apply(0, arguments);
            return converters.ar(ret);
        },      
        type: type ? type : 'column',
        height : height ? height : '',
        width : width ? width : '', 
        styleMode : true, 
        marginTop : marginTop ? marginTop : 50, 
        marginRight : marginRight ? marginRight :50,
        marginBot :  marginBot ? marginBot : 1,
        marginLeft : marginLeft ? marginLeft : null ,
         backgroundColor : bgcolor ? bgcolor : null,
        style : {
            borderBottomLeftRadius : '25px',
            borderBottomRightRadius : '25px',
            fontFamily : 'Ray_Bold',
           
        }
    },
    credits: {
        // Remove highcharts.com credits link from chart footer.
        enabled: false,
      },
    title: {
        text: '',
        align: ''
    },
    legend : {
        enabled : legend ? legend : false
    },

    xAxis: {
        categories:  data ? data[0]?.categories :null ,
       
       
    },
    yAxis: {
     
        text : {
        
            fontSize : '10px'
        },
        labels : {
            
            style : {
                fontSize : 15, 
                fontFamily : ''
            }
        },
        enabled : true , 
        min: 0,
       
    },
    tooltip: {
    
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
     
            series: {
                       color: color ? color : "#90C67C",
                point : {
                    events : {
                    
                       
                    }
                },
                lineWidth:10
            }
     
    },
    series:data ? data :  [{
        name: 'Year 1990',
        data: [632, 727, 3202, 721]
    }, {
        name: 'Year 2000',
        data: [814, 841, 3714, 726]
    }, {
        name: 'Year 2021',
        data: [1393, 1031, 4695, 745]
    }]
}

  return (
    <>
  <HighchartsReact
	highcharts={Highcharts}
	options={options}
  />
    </> 
  )
}

export default BarCharts
