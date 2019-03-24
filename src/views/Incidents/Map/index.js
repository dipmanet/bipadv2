import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import {
    hazardTypesSelector,
    wardsMapSelector,
} from '#selectors';
import { mapSources } from '#constants';
import Tooltip from '#components/Tooltip';

import {
    calculateSeverity,
    getHazardColor,
} from '#utils/domain';


import {
    districtsFill,
    districtsOutline,
    incidentPointPaint,
    incidentPolygonPaint,
} from './mapStyles';

const propTypes = {
};

const defaultProps = {
};

// severityScaleFactor is to show severity as radius of circle in map, which is logarithmic
// and for small values, all severities look same for which we need to scale
const severityScaleFactor = 20000;

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    wardsMap: wardsMapSelector(state),
});

class IncidentMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getPointFeatureCollection = memoize((incidentList, hazards) => ({
        type: 'FeatureCollection',
        features: incidentList
            .filter(incident => incident.point)
            .map(incident => ({
                type: 'Feature',
                id: incident.id,
                geometry: {
                    ...incident.point,
                },
                properties: {
                    incidentId: incident.id,
                    severity: calculateSeverity(incident.loss, severityScaleFactor),
                    hazardColor: getHazardColor(hazards, incident.hazard),
                },
            })),
    }))

    getPolygonFeatureCollection = memoize((incidentList, hazards) => ({
        type: 'FeatureCollection',
        features: incidentList
            .filter(incident => incident.polygon)
            .map(incident => ({
                id: incident.id,
                type: 'Feature',
                geometry: {
                    ...incident.polygon,
                },
                properties: {
                    incidentId: incident.id,
                    severity: calculateSeverity(incident.loss, severityScaleFactor),
                    hazardColor: getHazardColor(hazards, incident.hazard),
                },
            })),
    }));

    tooltipRendererParams = (id) => {
        const {
            wardsMap,
            incidentList,
        } = this.props;

        const incident = incidentList.find(i => i.id === id);

        return {
            incident,
            wardsMap,
        };
    }

    render() {
        const {
            incidentList,
            hazards,
        } = this.props;

        const pointFeatureCollection = this.getPointFeatureCollection(incidentList, hazards);
        const polygonFeatureCollection = this.getPolygonFeatureCollection(incidentList, hazards);

        return (
            <React.Fragment>
                <MapSource
                    sourceKey="districts"
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="districts-fill"
                        type="fill"
                        paint={districtsFill}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        paint={districtsOutline}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-points"
                    geoJson={pointFeatureCollection}
                >
                    <MapLayer
                        layerKey="incident-points-fill"
                        type="circle"
                        paint={incidentPointPaint}
                        enableHover
                        tooltipRenderer={Tooltip}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="incident-polygons"
                    geoJson={polygonFeatureCollection}
                >
                    <MapLayer
                        layerKey="incident-polygon-fill"
                        type="fill"
                        paint={incidentPolygonPaint}
                        enableHover
                        tooltipRenderer={Tooltip}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default compose(connect(mapStateToProps))(IncidentMap);
