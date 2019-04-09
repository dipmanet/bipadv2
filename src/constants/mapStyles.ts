export default {
    province: {
        outline: {
            'line-color': '#a3b7e3',
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
            'line-color': '#a3b7e3',
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
            'line-color': '#a3b7e3',
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
            'line-color': '#a3b7e3',
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
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#03A9F4',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#3F51B5',
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
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#00C853',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#304FFE',
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
            'circle-radius': 6,
            'circle-color': '#804000',
        },
    },
    earthquakePoint: {
        fill: {
            'circle-radius': 6,
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
