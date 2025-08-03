import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'



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
function LineCharts({ url, type, key,
    data,
    height, margin, param, marginRight,
    marginLeft, marginTop, marginBot, color,
    parametrAmar, setParametrAmar, legend,
    backgroundButton, width, margintTop, backgroundColor, colorY, gridLineColor,
    gridLineYColor, colorX,
    gridLineXColor
}) {





    const options = {
        plotOptions: {
            series: {
                line : {
                    lineWidth : 2,
                },
                color: color ? color : "#90C67C",
                point: {
                    events: {


                    }
                },

            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        navigation: {
            buttonOptions: {
                theme: {


                    r: 5,
                    fill: backgroundButton ? backgroundButton : null,

                }
            }
        },
        exporting: {

            buttons: {
                contextButton: {
                    menuItems: [
                        "viewFullscreen", "printChart", "downloadPDF", "downloadPNG", "downloadSVG", "downloadCSV"
                    ]
                }
            }
        },
        lang: {
            viewFullscreen: "نمایش در کل صفحه",
            printChart: "پرینت نمودار",
            downloadPNG: "PNG دانلود",
            downloadSVG: "SVG دانلود",
            downloadPDF: "PDF دانلود ",
            downloadCSV: "CSV دانلود",
            noData: 'دیتایی وجود ندارد '
        },
        chart: {
            numberFormatter: function () {
                const ret = Highcharts.numberFormat.apply(0, arguments);
                return converters.ar(ret);
            },
            boost: {
                enabled: true
            },
            type: type ? type : 'spline',
            height: height ? height : '',
            width: width ? width : '',
            marginBot: marginBot,
            marginLeft: marginLeft,
            marginTop: margintTop ? margintTop : 30,
            marginRight: marginRight ? marginRight : 50,
            backgroundColor: backgroundColor,
            fontFamily: 'Ray_Bold',

            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, ''],
                    [1, '']
                ]
            },
            styleMode: true,
            style: {
                borderBottomLeftRadius: '25px',
                borderBottomRightRadius: '25px',
                fontFamily: 'Ray_Bold',

            }
        },
        title: {
            text: '',
            align: ''
        },
        exporting: {
            enabled: true,
            menuItemDefinitions: {
                // Custom definition
                viewFullscreen: {
                    text: 'fullscreen',
                },
            },
            buttons: {

                contextButton: {
                    menuItems: [
                        'viewFullscreen',
                        {
                            text: 'DownloadXLSX',
                            onclick() {
                                Highcharts.downloadXLSX();
                            },
                        },
                        {
                            text: 'DownloadCSV',
                            onclick() {
                                Highcharts.getCSV();
                            },
                        },
                    ],
                },
            },
        },
        subtitle: {
            text: '',
            align: ''
        },
        credits: {
            // Remove highcharts.com credits link from chart footer.
            enabled: false,
        },
        yAxis: {
            labels: {
                align: 'right',
                format: '{value}',
                formatter: function () {
                    var value = this.value
                    if (value >= 1000000) {
                        return (value / 1000000).toFixed(1) + 'M';
                    } else if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'K';
                    } else {
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                },
                style: {
                    color: colorY,
                    fontFamily: '',
                    direction: 'ltr'
                }
            },

            title: {
                text: ''
            }
        },

        xAxis: {
            categories: data ? data[0].categories : null,


            style: {
                color: '#'
            },

            labels: {
                emabled: true,
                style: {
                    color: colorX,
                    fontFamily: ''
                }
            },

        },
        legend: {
            enabled: legend ? true : false
        },
        tooltip: {
            formatter: function () {
                return this.y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ':تعداد ';
            }
        },
        exporting: {
            enabled: true
        },
        series: data ? data : [{
            color: color ? color : "#90C67C",
            name: 'Installation & Developers',
            data: [
                43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610, 168960, 171558
            ]
        }, {
            name: 'Manufacturing',
            data: [
                24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050, 33099, 33473
            ]
        }, {
            name: 'Sales & Distribution',
            data: [
                11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663, 28978, 30618
            ]
        }, {
            name: 'Operations & Maintenance',
            data: [
                null, null, null, null, null, null, null,
                null, 11164, 11218, 10077, 12530, 16585
            ]
        }, {
            name: 'Other',
            data: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073, 11471, 11648
            ]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: '100%'
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

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

export default LineCharts
