export default {
    chartData: [
        { name: 'Forest', value: 193.25, color: '#90d086', total: 436.09 },
        { name: 'Farmland', value: 37.82, color: '#d3e878', total: 436.09 },
        { name: 'Grassland', value: 4.25, color: '#c4f1ac', total: 436.09 },
        { name: 'Building', value: 0.57, color: '#d5d3d3', total: 436.09 },
        { name: 'Water', value: 0.44, color: '#2b4253', total: 436.09 },
        { name: 'Snow', value: 41.72, color: '#dcefef', total: 436.09 },
        { name: 'Shrub', value: 102.83, color: '#c2d9a5', total: 436.09 },
        { name: 'Rock-Stone', value: 37.85, color: '#e9e1d8', total: 436.09 },
        { name: 'Others', value: 17.36, color: '#d5d3d3', total: 436.09 },
    ].sort(({ value: a }, { value: b }) => b - a),

};
