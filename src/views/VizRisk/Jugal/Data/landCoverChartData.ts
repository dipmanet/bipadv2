export default {
    chartData: [
        { name: 'Forest', value: 203.11, color: '#90d086', total: 595.94 },
        { name: 'Farmland', value: 50.76, color: '#d3e878', total: 595.94 },
        { name: 'Grassland', value: 9.48, color: '#c4f1ac', total: 595.94 },
        { name: 'Building', value: 0.47, color: '#d5d3d3', total: 595.94 },
        { name: 'Water', value: 0.39, color: '#2b4253', total: 595.94 },
        { name: 'Snow', value: 54.55, color: '#dcefef', total: 595.94 },
        { name: 'Shrubs', value: 170.6, color: '#c2d9a5', total: 595.94 },
        { name: 'Rocks/Stones', value: 52.06, color: '#e9e1d8', total: 595.94 },
        { name: 'Others', value: 54.52, color: '#d5d3d3', total: 595.94 },
    ].sort(({ value: a }, { value: b }) => b - a),

};
