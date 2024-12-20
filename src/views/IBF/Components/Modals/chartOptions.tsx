const chartOptions = {
    chart: {
        type: 'boxplot',
    },

    title: {
        text: 'Discharge Hydrograph',
    },

    legend: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },

    xAxis: {
        categories: [],
        title: {
            text: 'Lead time',
        },
    },

    yAxis: {
        title: {
            text: 'Discharge (m3/s)',
        },
        plotLines: [
            {
                color: '#FF0000',
                width: 1,
                value: 0,
                label: {
                    text: '20 year threshold',
                    align: 'center',
                    style: {
                        color: 'gray',
                    },
                },
            },
            {
                color: '#FFFF00',
                width: 1,
                value: 0,
                label: {
                    text: '5 year threshold',
                    align: 'center',
                    style: {
                        color: 'gray',
                    },
                },
            },
            {
                color: '#00FF00',
                width: 1,
                value: 0,
                label: {
                    text: '2 year threshold',
                    align: 'center',
                    style: {
                        color: 'gray',
                    },
                },
            }],
    },
    // plotOptions: {
    //     boxplot: {
    //         boxDashStyle: 'Dash',
    //         fillColor: '#F0F0E0',
    //         lineWidth: 2,
    //         medianColor: '#0C5DA5',
    //         medianDashStyle: 'ShortDot',
    //         medianWidth: 3,
    //         stemColor: '#A63400',
    //         stemDashStyle: 'dot',
    //         stemWidth: 1,
    //         whiskerColor: '#3D9200',
    //         whiskerLength: '20%',
    //         whiskerWidth: 3,
    //     },
    // },

    series: [{
        name: 'Observations',
        data: [],
        tooltip: {
            headerFormat: '<em>Leadtime {point.key}</em><br/>',
        },

    }],
};
export default chartOptions;
