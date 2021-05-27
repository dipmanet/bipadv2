export default {
    chartData: [
        { name: 'Agricultural land', value: 94.07 },
        { name: 'Forest', value: 5.99 },
        { name: 'Water bodies', value: 5.18 },
        { name: 'Other', value: 21.5 },
        { name: 'Buildings', value: 0.959 },
    ].sort(({ value: a }, { value: b }) => b - a),

};
