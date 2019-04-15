export default {
    province: {
        outline: {
            // 'line-color': '#a3b7e3',
            'line-color': 'red',
            'line-width': 2,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1.5,
            'line-opacity': 0.5,
        },
        fill: {
            'fill-color': '#0081f0',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0.1,
            ],
        },
    },
    district: {
        outline: {
            'line-color': 'blue',
            // 'line-color': '#a3b7e3',
            'line-width': 1.4,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
            'line-opacity': 0.5,
        },
        fill: {
            // NOTE: hover and selection enabled in district
            'fill-color': '#0081f0',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0,
            ],
        },
    },
    municipality: {
        outline: {
            'line-color': 'green',
            // 'line-color': '#a3b7e3',
            'line-width': 0.8,
        },
        fill: {
            'fill-color': '#0081f0',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0,
            ],
        },
    },
    ward: {
        outline: {
            'line-color': 'yellow',
            // 'line-color': '#a3b7e3',
            'line-width': 0.5,
        },
        fill: {
            'fill-color': '#0081f0',
            'fill-opacity': 0.1,
        },
    },
    alertPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.8,
            ],
        },
    },
    eventPolygon: {
        fill: {
            'fill-color': '#8dd3c7',
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.8,
            ],
        },
    },
    incidentPoint: {
        fill: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': [
                'case',
                ['==', ['get', 'severity'], 'Minor'], 5,
                ['==', ['get', 'severity'], 'Major'], 7,
                ['==', ['get', 'severity'], 'Severe'], 9,
                ['==', ['get', 'severity'], 'Catastrophic'], 11,
                5,
            ],
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
        animatedFill: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': 0,
            'circle-opacity': 1,
            'circle-radius-transition': { duration: 0 },
            'circle-opacity-transition': { duration: 0 },
        },
    },
    incidentPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
    },
    resourcePoint: {
        circle: {
            'circle-color': '#ffffff',
            'circle-radius': 10,
            'circle-opacity': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                0.5,
                0.9,
            ],
        },
        layout: {
            'icon-image': ['get', 'iconName'],
            'icon-size': 1,
        },
        symbol: {},
    },
    rainPoint: {
        layout: {
            'text-field': '■',
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'text-color': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#6FD1FD',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#7482CF',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#9C27B0',
                '#03A9F4',
            ],
        },
    },
    riverPoint: {
        layout: {
            'text-field': [
                'case',
                ['==', ['get', 'steady'], 'STEADY'], '●',
                ['==', ['get', 'steady'], 'RISING'], '▲',
                ['==', ['get', 'steady'], 'FALLING'], '▼',
                '\u25CF',
            ],
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'text-color': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#53FF9A',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#5770FE',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#C51162',
                '#00C853',
            ],
        },
    },
    firePoint: {
        layout: {
            'icon-image': 'fire-station-11',
        },
        paint: { 'icon-color': '#ffee58' },
    },
    pollutionPoint: {
        fill: {
            'circle-radius': 10,
            'circle-color': [
                'case',
                ['<=', ['get', 'pm25'], 12], '#009966',
                ['<=', ['get', 'pm25'], 35.4], '#ffde33',
                ['<=', ['get', 'pm25'], 55.4], '#ff9933',
                ['<=', ['get', 'pm25'], 150.4], '#cc0033',
                ['<=', ['get', 'pm25'], 250.4], '#660099',
                // ['<=', ['get', 'pm25'], 350.4], '#7e0023',
                ['<=', ['get', 'pm25'], 500.4], '#7e0023',
                '#7e0023',
            ],
        },
    },
    pollutionText: {
        layout: {
            'text-field': ['get', 'pm25'],
            'text-allow-overlap': false,
            'text-size': 12,
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 3,
        },
    },
    earthquakePoint: {
        fill: {
            'circle-radius': [
                'case',
                ['>=', ['get', 'magnitude'], 8], 12,
                ['>=', ['get', 'magnitude'], 7], 11,
                ['>=', ['get', 'magnitude'], 6], 10,
                ['>=', ['get', 'magnitude'], 5], 9,
                ['>=', ['get', 'magnitude'], 4], 8,
                7,
            ],
            'circle-color': [
                'case',
                ['>=', ['get', 'magnitude'], 8], '#a50f15',
                ['>=', ['get', 'magnitude'], 7], '#de2d26',
                ['>=', ['get', 'magnitude'], 6], '#fb6a4a',
                ['>=', ['get', 'magnitude'], 5], '#fc9272',
                ['>=', ['get', 'magnitude'], 4], '#fcbba1',
                '#fee5d9',
            ],
        },
    },
    earthquakeText: {
        layout: {
            'text-field': ['get', 'magnitude'],
            'text-allow-overlap': false,
            'text-size': [
                'case',
                ['>=', ['get', 'magnitude'], 8], 12,
                ['>=', ['get', 'magnitude'], 7], 11,
                ['>=', ['get', 'magnitude'], 6], 10,
                ['>=', ['get', 'magnitude'], 5], 9,
                ['>=', ['get', 'magnitude'], 4], 8,
                7,
            ],
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 3,
        },
    },
    provinceLabel: {
        paint: {
            'text-color': '#808080',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 1,
        },
        layout: {
            visibility: 'visible',
            'text-field': ['get', 'title'],
            'text-size': 16,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    districtLabel: {
        paint: {
            'text-color': '#808080',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 1,
        },
        layout: {
            visibility: 'visible',
            'text-field': ['get', 'title'],
            'text-size': 10,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    municipalityLabel: {
        paint: {
            'text-color': '#808080',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 1,
        },
        layout: {
            visibility: 'visible',
            'text-field': ['get', 'title'],
            'text-size': 8,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    wardLabel: {
        paint: {
            'text-color': '#808080',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
            'text-halo-blur': 1,
        },
        layout: {
            visibility: 'visible',
            'text-field': ['get', 'title'],
            'text-size': 8,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
};
