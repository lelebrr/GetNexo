import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChannelDistributionChart = ({ data, title = "Distribuição por Canal" }) => {
    // Prepare data for ApexCharts
    const channelNames = {
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        email: 'Email',
        chat: 'Chat',
        phone: 'Telefone',
        other: 'Outros'
    };

    const series = data.map(item => item.count);
    const labels = data.map(item => channelNames[item.channel] || item.channel);

    const colors = ['#25D366', '#1877F2', '#EA4335', '#007bff', '#28a745', '#6c757d'];

    const options = {
        chart: {
            type: 'pie',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    download: true
                }
            }
        },
        colors: colors,
        labels: labels,
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px'
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                return opts.w.globals.series[opts.seriesIndex] + ' (' + val.toFixed(1) + '%)';
            },
            style: {
                fontSize: '12px',
                colors: ['#fff']
            },
            dropShadow: {
                enabled: false
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value + ' tickets';
                }
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                            }
                        }
                    }
                }
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
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={350}
            />
        </div>
    );
};

export default ChannelDistributionChart;