export default {
    populationWardExpression: [
        'interpolate',
        ['linear'],
        ['feature-state', 'value'],
        1, '#9a3404', 2, '#9a3404',
        3, '#9a3404', 4, '#9a3404',
        5, '#9a3404', 6, '#fe9b2a',
        7, '#9a3404', 8, '#d95f0e',
        9, '#ffffd6', 10, '#fed990',
        11, '#fe9b2a', 12, '#9a3404',
        13, '#9a3404', 14, '#9a3404',
        15, '#fed990', 16, '#fe9b2a',
        17, '#fed990', 18, '#fe9b2a',
        19, '#d95f0e',
    ],

    buildingColor: [
        'case',
        ['all',
            ['==', ['feature-state', 'vuln'], -1],
        ],
        '#000000',
        ['all',
            ['>=', ['feature-state', 'vuln'], 50],
            ['<=', ['feature-state', 'vuln'], 60],
        ],
        '#c1805a',
        ['all',
            ['>', ['feature-state', 'vuln'], 60],
        ],
        '#af4042',
        ['all',
            ['<', ['feature-state', 'vuln'], 50],
        ],
        '#afaf40',
        '#d5d3d3'],
};
