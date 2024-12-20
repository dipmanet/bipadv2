import React from 'react';
import { connect } from 'react-redux';
import bbox from '@turf/bbox';
import buffer from '@turf/buffer';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';


import SVGMapIcon from '#components/SVGMapIcon';
import ZoomMap from '#components/ZoomMap';
import {
    getMapPaddings,
    mapStyles,
} from '#constants';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import buildingIcon from '#resources/icons/Building.svg';
import educationIcon from '#resources/icons/Education.svg';
import governanceIcon from '#resources/icons/Government-office.svg';
import groupIcon from '#resources/icons/group1.svg';
import healthFacilityIcon from '#resources/icons/health-facility1.svg';
import hinduTemplateIcon from '#resources/icons/Hindu-temple.svg';
import mapIcon from '#resources/icons/Map.svg';
import warehouseIcon from '#resources/icons/newCapResEvacuationcenter.svg';
import satelliteIcon from '#resources/icons/Satellite-dish.svg';
import openSpaceIcon from '#resources/icons/Soap.svg';
import financeIcon from '#resources/icons/University.svg';
import { hazardTypesSelector, languageSelector } from '#selectors';
import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
    resourceToGeojson,
} from '#utils/domain';
import styles from './styles.scss';
import ResourceItem from '../ResourceItem';

const resourceImages = [
    { name: 'Communication', icon: satelliteIcon },
    { name: 'cultural', icon: hinduTemplateIcon },
    { name: 'education', icon: educationIcon },
    { name: 'finance', icon: financeIcon },
    { name: 'governance', icon: governanceIcon },
    { name: 'health', icon: healthFacilityIcon },
    { name: 'industry', icon: buildingIcon },
    { name: 'openSpace', icon: openSpaceIcon },
    { name: 'tourism', icon: mapIcon },
    { name: 'volunteer', icon: groupIcon },
    { name: 'warehouse', icon: warehouseIcon },
];

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    language: languageSelector(state),
});

const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    incident: PropTypes.object,
    resourceList: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    className: '',
    incident: {},
    resourceList: [],
};

class ResponseMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            resourceLngLat: undefined,
        };
    }

    static propTypes = propTypes;

    static defaultProps = defaultProps;

    getIncidentList = memoize(incident => [incident]);

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

    getResourceFeatureCollection = memoize(resourceToGeojson);

    getConvex = memoize((incidentShape, resourceList) => {
        const v = {
            ...resourceList,
            features: [
                ...resourceList.features,
                {
                    // id: 99999999999,
                    type: 'Feature',
                    properties: {},
                    geometry: incidentShape,
                },
            ],
        };
        // NOTE: at least have 10km space around the incident point
        const bufferedV = buffer(v, 10, { units: 'kilometers' });
        return bbox(bufferedV);
    })

    handleResourceClick = (feature, lngLat) => {
        const { id } = feature;
        const resource = this.props.resourceList.find(x => x.id === id);
        if (!resource) {
            return;
        }

        this.setState({
            resourceLngLat: lngLat,
            resource,
        });
    }

    handleTooltipClose = () => {
        this.setState({
            resourceLngLat: undefined,
            resource: undefined,
        });
    }

    render() {
        const {
            incident,
            resourceList,
            hazards,
            language: { language },
        } = this.props;

        const {
            point,
            polygon,
        } = incident;

        const incidentList = this.getIncidentList(incident);

        const resourceGeoJson = this.getResourceFeatureCollection(resourceList);

        const mybox = this.getConvex(point || polygon, resourceGeoJson);

        const {
            resourceLngLat,
            resource,
        } = this.state;

        const tooltipOptions = {
            closeOnClick: true,
            closeButton: true,
            offset: 8,
            maxWidth: '300px',
            className: styles.resourceDetail,
        };

        return (
            <React.Fragment>
                <ZoomMap
                    bounds={mybox}
                // boundsPadding={boundsPadding}
                />
                {resourceImages.map(image => (
                    <SVGMapIcon
                        src={image.icon}
                        name={image.name}
                        fillColor="#222222"
                    />
                ))}
                <MapSource
                    sourceKey="resource"
                    sourceOptions={{
                        type: 'geojson',
                    }}
                    // images={resourceImages}
                    geoJson={resourceGeoJson}
                >
                    <MapLayer
                        layerKey="resource-point"
                        onClick={this.handleResourceClick}
                        layerOptions={{
                            type: 'circle',
                            paint: mapStyles.resourcePoint.circle,
                        }}
                    />
                    <MapLayer
                        layerKey="resource-symbol"
                        layerOptions={{
                            type: 'symbol',
                            layout: mapStyles.resourceSymbol.layout,
                            paint: mapStyles.resourceSymbol.symbol,
                        }}
                    />
                    {resourceLngLat && resource && (
                        <MapTooltip
                            coordinates={resourceLngLat}
                            tooltipOptions={tooltipOptions}
                            onHide={this.handleTooltipClose}
                        >
                            <ResourceItem
                                {...resource}
                                showDetails
                                language={language}
                            />
                        </MapTooltip>
                    )}
                </MapSource>

                {point && (
                    <MapSource
                        sourceKey="points"
                        geoJson={this.getPointFeatureCollection(incidentList, hazards)}
                        sourceOptions={{ type: 'geojson' }}
                    >
                        <MapLayer
                            layerKey="points"
                            layerOptions={{
                                type: 'circle',
                                property: 'incident',
                                paint: mapStyles.incidentPoint.fill,
                            }}
                        />
                    </MapSource>
                )}
                {polygon && (
                    <MapSource
                        sourceKey="polygon"
                        sourceOptions={{ type: 'geojson' }}
                        geoJson={this.getPolygonFeatureCollection(incidentList, hazards)}
                    >
                        <MapLayer
                            layerKey="polygon"
                            layerOptions={{
                                type: 'fill',
                                property: 'incident',
                                paint: mapStyles.incidentPolygon.fill,
                            }}
                        />
                    </MapSource>
                )}
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(ResponseMap);
