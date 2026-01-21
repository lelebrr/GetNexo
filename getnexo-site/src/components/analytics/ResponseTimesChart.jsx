import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ResponseTimesChart = ({ data, title = "Tempo Médio de Resposta" }) => {
    const options = {
        chart: {
            type: 'bar',
            height: 300
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        colors: ['#28a745', '#dc3545'],
        xaxis: {
            title: {
                text: 'Tempo Médio (minutos)'
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value.toFixed(1) + ' min';
                }
            }
        },
        title: {
            text: title,
            align: 'left'
        }
    };

    const series = [{
        name: 'Tempo Médio',
        data: data.map(item => ({
            x: item.resolver,
            y: item.resolver === 'IA' ? item.avg_first_response : item.avg_resolution
        }))
    }];

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={300}
            />
        </div>
    );
};

export default ResponseTimesChart;