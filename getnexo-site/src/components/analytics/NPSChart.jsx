import React from 'react';
import ReactApexChart from 'react-apexcharts';

const NPSChart = ({ data, title = "NPS Semanal" }) => {
    const options = {
        chart: {
            type: 'line',
            height: 300,
            toolbar: {
                show: true
            }
        },
        colors: ['#007bff'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        xaxis: {
            categories: data.map(item => item.week)
        },
        yaxis: {
            title: {
                text: 'NPS Score'
            },
            min: 0,
            max: 10
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value.toFixed(1);
                }
            }
        },
        title: {
            text: title,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        }
    };

    const series = [{
        name: 'NPS',
        data: data.map(item => item.nps)
    }];

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={300}
            />
        </div>
    );
};

export default NPSChart;