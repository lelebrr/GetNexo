import React from 'react';
import ReactApexChart from 'react-apexcharts';

const AIResolutionChart = ({ data, title = "Taxa de Resolução IA vs Humano" }) => {
    // Prepare data for ApexCharts
    const categories = data.map(item => item.resolver);
    const resolutionRates = data.map(item => parseFloat(item.resolution_rate.toFixed(2)));

    const options = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    download: true
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        colors: ['#28a745', '#dc3545'], // Green for AI, Red for Human (if needed)
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '%';
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        grid: {
            borderColor: '#f1f1f1',
            row: {
                colors: ['#f8f9fa', 'transparent'],
                opacity: 0.5
            }
        },
        xaxis: {
            categories: categories,
            title: {
                text: 'Tipo de Resolução'
            },
            labels: {
                style: {
                    colors: '#6c757d'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Taxa de Resolução (%)'
            },
            labels: {
                style: {
                    colors: '#6c757d'
                },
                formatter: function (value) {
                    return value + '%';
                }
            },
            min: 0,
            max: 100
        },
        fill: {
            opacity: 0.8
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + '% de resolução';
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
        annotations: {
            yaxis: [{
                y: 80,
                borderColor: '#28a745',
                label: {
                    borderColor: '#28a745',
                    style: {
                        color: '#fff',
                        background: '#28a745'
                    },
                    text: 'Meta: 80%'
                }
            }]
        }
    };

    const series = [{
        name: 'Taxa de Resolução',
        data: resolutionRates
    }];

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default AIResolutionChart;