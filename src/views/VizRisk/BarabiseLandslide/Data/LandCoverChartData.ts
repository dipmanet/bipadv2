export default {
    chartData: [
        { name: 'Meadow', value: 13.887, total: 134.653, color: '#c4f1ac' },
        { name: 'Farmland', value: 23.645, total: 134.653, color: '#bbf56b' },
        { name: 'Buildings', value: 8.617, total: 134.653, color: '#a39f9f' },
        // { name: 'Construction', value: 0.014, total: 134.653, color: '#a39f9f' },
        { name: 'Wood', value: 63.131, total: 134.653, color: '#99ca91' },
        { name: 'Water', value: 0.112, total: 134.653, color: '#0670bc' },
        { name: 'Stone', value: 0.007, total: 134.653, color: '#e9e1d8' },
        { name: 'Shingle', value: 0.251, total: 134.653, color: 'rgb(236,227,218)' },
        { name: 'Scrub', value: 18.624, total: 134.653, color: 'rgb(195,218,167)' },
        // { name: 'Scree', value: 0.522, total: 134.653, color: '' },
        // { name: 'Sand', value: 0.024, total: 134.653, color: '' },
        { name: 'Fell', value: 0.184, total: 134.653, color: '' },
        { name: 'Other', value: 24.795, total: 134.653, color: '#d5d3d3' },
    ].sort(({ value: a }, { value: b }) => b - a),
};
