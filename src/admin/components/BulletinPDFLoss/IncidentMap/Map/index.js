/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { isDefined, unique } from '@togglecorp/fujs';
import mapboxgl from 'mapbox-gl';

import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapState from '#re-map/MapSource/MapState';
import MapTooltip from '#re-map/MapTooltip';
import { getParams } from '#components/Cloak';

// import SVGMapIcon from '#components/SVGMapIcon';
import CommonMap from '#components/CommonMap';
import ProvinceMap from '#components/ProvinceMap';
import {
    hazardTypesSelector,
    provincesMapSelector,
    districtsMapSelector,
    municipalitiesMapSelector,
    wardsMapSelector,
    userSelector,
    mapStyleSelector,
} from '#selectors';

import {
    setIncidentActionIP,
    patchIncidentActionIP,
    removeIncidentActionIP,
} from '#actionCreators';

import { mapStyles } from '#constants';
import IncidentInfo from '#components/IncidentInfo';
import {
    createRequestClient,
    methods,
} from '#request';
import {
    getYesterday,
    framize,
    getImage,
} from '#utils/common';

import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
} from '#utils/domain';


import styles from './styles.scss';

const propTypes = {
    incidentList: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    hazards: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    recentDay: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
    onIncidentHover: PropTypes.func,
    mapHoverAttributes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    wardsMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    provincesMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    districtsMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    municipalitiesMap: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    setIncident: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    removeIncident: PropTypes.func.isRequired,
    patchIncident: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
    requests: PropTypes.object.isRequired,
    sourceKey: PropTypes.string,
    isProviceOnlyMap: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
    user: PropTypes.object,
};

const defaultProps = {
    sourceKey: 'incidents',
    isProviceOnlyMap: false,
    user: undefined,
    onIncidentHover: undefined,
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    provincesMap: provincesMapSelector(state),
    districtsMap: districtsMapSelector(state),
    municipalitiesMap: municipalitiesMapSelector(state),
    wardsMap: wardsMapSelector(state),
    user: userSelector(state),
    mapStyle: mapStyleSelector(state),

});

const visibleLayout = {
    visibility: 'visible',
};
const noneLayout = {
    visibility: 'none',
};

const mapDispatchToProps = dispatch => ({
    patchIncident: params => dispatch(patchIncidentActionIP(params)),
    setIncident: params => dispatch(setIncidentActionIP(params)),
    removeIncident: params => dispatch(removeIncidentActionIP(params)),
});

const requestOptions = {
    incidentDeleteRequest: {
        url: ({ params: { incidentId } }) => `/incident/${incidentId}/`,
        method: methods.DELETE,
        onSuccess: ({
            props: { removeIncident },
            params: {
                incidentId,
                onIncidentRemove,
            },
        }) => {
            removeIncident({ incidentId });
            onIncidentRemove();
        },
    },
};

const mapCSS = {
    position: 'relative',
    width: '100%',
    left: '0',
    top: 0,
    height: '100mm',
};


const IncidentMap = (props) => {
    const {
        incidentList,
        hazards,
        requests: {
            incidentDeleteRequest: {
                pending: incidentDeletePending,
            },
        },
    } = props;

    console.log('fasf');
    const mapContainerRef = useRef(null);
    // const mapRef = useRef<mapboxgl.Map | null>(null);

    const getPointFeatureCollection = memoize(incidentPointToGeojson);
    const pointFeatureCollection = getPointFeatureCollection(incidentList, hazards);
    useEffect(() => {
        const { current: mapContainer } = mapContainerRef;

        const Map = new mapboxgl.Map({
            container: mapContainer,
            style: process.env.REACT_APP_MAP_STYLE_LIGHT,
            zoom: 5.0,
            center: [84.2676, 28.5465],
            minZoom: 2,
            maxZoom: 22,
            preserveDrawingBuffer: true,
        });
        // mapRef.current = Map;

        Map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');


        Map.on('style.load', () => {
            Map.addSource('nepal', {
                type: 'vector',
                url: 'mapbox://yilab.25pvy15o',
            });
            Map.addLayer({
                id: 'province-line',
                source: 'nepal',
                'source-layer': 'provincegeo',
                type: 'line',
                layout: {
                    visibility: 'visible',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
				  },
            });
            Map.addLayer({
                id: 'province-name',
                source: 'nepal',
                'source-layer': 'provincegeo',
                type: 'symbol',
                layout: {
                    visibility: 'visible',
				  'text-field': ['get', 'title_en'],
				  'text-anchor': 'center',
				  'text-size': 12,
                },
                paint: {
				  'text-color': 'black',
                },
			  });

            Map.addLayer({
                id: 'district-line',
                source: 'nepal',
                'source-layer': 'districtgeo',
                type: 'line',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
				  },
            });
            Map.addLayer({
                id: 'district-name',
                source: 'nepal',
                'source-layer': 'districtgeo',
                type: 'symbol',
                layout: {
                    visibility: 'none',
				  'text-field': ['get', 'title_en'],
				  'text-anchor': 'center',
				  'text-size': 11,
                },
                paint: {
				  'text-color': 'black',
                },
			  });
            Map.addLayer({
                id: 'municipality-line',
                source: 'nepal',
                'source-layer': 'municipalitygeo',
                type: 'line',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 0.8,
				  },
            });
            Map.addLayer({
                id: 'municipality-name',
                source: 'nepal',
                'source-layer': 'municipalitygeo',
                type: 'symbol',
                layout: {
                    visibility: 'none',
				  'text-field': ['get', 'title_en'],
				  'text-anchor': 'center',
				  'text-size': 11,

                },
                paint: {
				  'text-color': 'black',
                },
			  });
            Map.addLayer({
                id: 'ward-line',
                source: 'nepal',
                'source-layer': 'wardgeo',
                type: 'line',
                layout: {
                    visibility: 'none',
                },
                paint: {
                    'line-color': '#000000',
                    'line-width': 1,
				  },
            });
            Map.addLayer({
                id: 'ward-name',
                source: 'nepal',
                'source-layer': 'wardgeo',
                type: 'symbol',
                layout: {
                    visibility: 'none',
				  'text-field': ['get', 'title'],
				  'text-anchor': 'center',
                },
                paint: {
				  'text-color': 'black',
                },
			  });
            Map.addSource('incidents-bulletin', {
                type: 'geojson',
                data: pointFeatureCollection,
            });
            Map.addLayer(
                {
                    id: 'incidents-bulletin-layer',
                    type: 'circle',
                    source: 'incidents-bulletin',
                    paint: {
                        'circle-color': ['get', 'hazardColor'],
                        'circle-stroke-width': 1.2,
                        'circle-stroke-color': '#000000',
                        'circle-radius': 8,
                    },
                },
            );
        });

        console.log('pointFeatureCollection', pointFeatureCollection);
    }, [pointFeatureCollection]);


    return (
        <div style={mapCSS} ref={mapContainerRef} />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(
    createRequestClient(requestOptions)(IncidentMap),
);
