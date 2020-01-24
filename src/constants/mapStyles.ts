export default {
    province: {
        outline: {
            'line-color': '#004d40',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    district: {
        outline: {
            'line-color': '#004d40',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    municipality: {
        outline: {
            'line-color': '#72b6ac',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    ward: {
        outline: {
            'line-color': '#d0e8e4',
            'line-width': 1,
        },
        choroplethOutline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': '#000000',
            'fill-opacity': 0.1,
        },
    },
    provinceLabel: {
        paint: {
            'text-color': '#002121',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-allow-overlap': true,
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 12,
            'text-transform': 'uppercase',
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    districtLabel: {
        paint: {
            'text-color': '#00695c',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 11,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    municipalityLabel: {
        paint: {
            'text-color': '#00695c',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 10,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
    wardLabel: {
        paint: {
            'text-color': '#1c9688',
            'text-halo-color': 'rgba(255, 255, 255, 0.7)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Rubik Bold'],
            'text-field': ['get', 'title'],
            'text-size': 10,
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },

    alertPoint: {
        circle: {
            'circle-color': ['get', 'hazardColor'],
            'circle-radius': 8,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                1,
            ],
            'circle-opacity': 0.9,
        },
        animatedCircle: {
            'circle-color': ['get', 'hazardColor'],

            'circle-radius': 0,
            'circle-opacity': 0,

            'circle-radius-transition': { duration: 0 },
            'circle-opacity-transition': { duration: 0 },
            'circle-stroke-opacity': 0.2,
            'circle-stroke-color': ['get', 'hazardColor'],
            'circle-stroke-width': 1,
        },
    },
    alertConvex: {
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 2,
            'line-dasharray': [2, 2],
            'line-offset': -6,
        },
    },
    alertPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': 0.3,
        },
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 1,
            'line-dasharray': [2, 3],
        },
    },

    eventSymbol: {
        layout: {
            'text-field': '■',
            'text-allow-overlap': true,
            'text-size': 32,
        },
        paint: {
            'text-color': ['get', 'hazardColor'],
            'text-halo-color': '#000000',
            /*
            'text-halo-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
             */
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                1,
            ],
        },
    },
    eventConvex: {
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 1,
            'line-dasharray': [2, 2],
            'line-offset': -6,
        },
    },
    eventPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': 0.3,
        },
        outline: {
            'line-color': ['get', 'hazardColor'],
            'line-width': 1,
            'line-dasharray': [2, 3],
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
            'circle-opacity': 0.95,
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                3,
                1,
            ],
        },
        animatedFill: {
            'circle-color': ['get', 'hazardColor'],

            'circle-radius': 0,
            'circle-opacity': 0,

            'circle-radius-transition': { duration: 0 },
            'circle-opacity-transition': { duration: 0 },
            'circle-stroke-opacity': 0.2,
            'circle-stroke-color': ['get', 'hazardColor'],
            'circle-stroke-width': 1,
        },
    },
    // FIXME: remove incident polygon
    incidentPolygon: {
        fill: {
            'fill-color': ['get', 'hazardColor'],
            'fill-opacity': 0.9,
            'fill-outline-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                ['get', 'hazardColor'],
            ],
        },
    },

    resourceCluster: {
        circle: {
            'circle-color': '#ffeb3b',
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10,
                100,
                20,
                750,
                30,
            ],
        },
    },

    resourcePoint: {
        circle: {
            'circle-color': '#ffffff',
            'circle-radius': 10,
            'circle-opacity': 0.9,
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0,
            ],
        },
    },
    resourceSymbol: {
        layout: {
            'icon-image': ['get', 'iconName'],
            'icon-size': 1,
        },
        symbol: {
            // 'icon-color': 'red',
        },
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
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#7CB342',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#FDD835',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#e53935',
                '#000000',
            ],
            'text-opacity': [
                'case',
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], 0.3,
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], 1,
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], 1,
                0.2,
            ],
            'text-halo-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
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
                ['==', ['get', 'status'], 'BELOW WARNING LEVEL'], '#7CB342',
                ['==', ['get', 'status'], 'ABOVE WARNING LEVEL'], '#FDD835',
                ['==', ['get', 'status'], 'ABOVE DANGER LEVEL'], '#e53935',
                '#000000',
            ],
            'text-opacity': [
                'case',
                ['==', ['get', 'steady'], 'STEADY'], 0.3,
                ['==', ['get', 'steady'], 'RISING'], 1,
                ['==', ['get', 'steady'], 'FALLING'], 1,
                0.3,
            ],

            'text-halo-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
            ],
        },
    },

    firePoint: {
        layout: {
            'text-field': '◆',
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'text-color': '#e64a19',
            'text-opacity': ['get', 'opacity'],
            'text-halo-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
            ],
        },
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
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0,
            ],
        },
    },
    pollutionText: {
        layout: {
            'text-font': ['League Mono Regular'],
            'text-field': ['get', 'pm25'],
            'text-allow-overlap': false,
            'text-size': 10,
            // NOTE: should negate idk why
            'symbol-sort-key': ['-', ['get', 'pm25']],
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.5,
        },
    },

    earthquakePoint: {
        fill: {
            'circle-radius': [
                'case',
                ['>=', ['get', 'magnitude'], 8], 21,
                ['>=', ['get', 'magnitude'], 7], 18,
                ['>=', ['get', 'magnitude'], 6], 15,
                ['>=', ['get', 'magnitude'], 5], 11,
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
            'circle-stroke-color': '#000000',
            'circle-stroke-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0,
            ],
        },
    },
    earthquakeText: {
        layout: {
            'text-font': ['League Mono Regular'],
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
            // NOTE: should negate idk why
            'symbol-sort-key': ['-', ['get', 'magnitude']],
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.5,
        },
    },
    contactPoint: {
        circle: {
            'circle-color': '#1565c0',
            'circle-radius': 7,
            'circle-opacity': 1,
        },
        clusteredCircle: {
            'circle-color': '#1565c0',
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'point_count'],
                2,
                10,
                40,
                100,
            ],
            'circle-opacity': 1,
        },
        clusterLabelLayout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
        },
        clusterLabelPaint: {
            'text-color': '#ffffff',
        },
    },
};
