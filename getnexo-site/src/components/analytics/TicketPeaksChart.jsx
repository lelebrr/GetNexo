import React from 'react';
import ReactApexChart from 'react-apexcharts';

const TicketPeaksChart = ({ data, title = "Picos de Tickets por Hora" }) => {
    // Prepare data for ApexCharts
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const ticketCounts = hours.map(hour => {
        const hourData = data.find(d => d.hour === hour);
        return hourData ? hourData.count : 0;
    });

    const options = {
        chart: {
            type: 'line',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            background: 'transparent'
        },
        colors: ['#007bff'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        grid: {
            borderColor: '#f1f1f1',
            row: {
                colors: ['#f8f9fa', 'transparent'],
                opacity: 0.5
            }
        },
        xaxis: {
            categories: hours.map(h => `${h}:00`),
            title: {
                text: 'Hora do Dia'
            },
            labels: {
                style: {
                    colors: '#6c757d'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Número de Tickets'
            },
            labels: {
                style: {
                    colors: '#6c757d'
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.25,
                gradientToColors: undefined,
                inverseColors: false,
                opacityFrom: 0.85,
                opacityTo: 0.85,
                stops: [50, 0, 100]
            }
        },
        tooltip: {
            theme: 'light',
            x: {
                show: true,
                format: 'HH:mm'
            },
            y: {
                formatter: function (value) {
                    return value + ' tickets';
                }
            }
        },
        markers: {
            size: 4,
            colors: ['#007bff'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 6
            }
        },
        title: {
            text: title,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        }
    };

    const series = [{
        name: 'Tickets',
        data: ticketCounts
    }];

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={350}
            />
        </div>
    );
};

export default TicketPeaksChart;