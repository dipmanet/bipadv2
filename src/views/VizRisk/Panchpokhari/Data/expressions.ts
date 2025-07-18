export default {
    populationWardExpression: [
        'interpolate',
        ['linear'],
        ['feature-state', 'value'],
        1, 'rgb(255,139,0)', 2, 'rgb(255,111,0)',
        3, 'rgb(255,111,0)', 4, 'rgb(255,111,0)',
        5, 'rgb(255,139,0)', 6, 'rgb(255, 78, 0)',
        7, 'rgb(255, 78, 0)', 8, 'rgb(255,139,0)',
        99, 'rgb(255,235,199)',
    ],

    buildingColor: [
        'case',
        ['all',
            ['==', ['get', 'vuln'], -1],
        ],
        '#e3e3e3',
        ['all',
            ['>=', ['get', 'vuln'], 50],
            ['<=', ['get', 'vuln'], 60],
        ],
        '#c1805a',
        ['all',
            ['>', ['get', 'vuln'], 60],
        ],
        '#af4042',
        ['all',
            ['<', ['get', 'vuln'], 50],
        ],
        '#afaf40',
        '#e3e3e3'],
};
