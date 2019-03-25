import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import {
    hazardTypesSelector,
    wardsMapSelector,
} from '#selectors';
import { mapSources, mapStyles } from '#constants';
import Tooltip from '#components/Tooltip';

import {
    incidentPointToGeojson,
    incidentPolygonToGeojson,
} from '#utils/domain';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = state => ({
    hazards: hazardTypesSelector(state),
    wardsMap: wardsMapSelector(state),
});

class IncidentMap extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getPointFeatureCollection = memoize(incidentPointToGeojson)

    getPolygonFeatureCollection = memoize(incidentPolygonToGeojson);

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
                        paint={mapStyles.district.fill}
                        sourceLayer={mapSources.nepal.layers.district}
                    />
                    <MapLayer
                        layerKey="districts-outline"
                        type="line"
                        paint={mapStyles.district.outline}
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
                        paint={mapStyles.incidentPoint.fill}
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
                        paint={mapStyles.incidentPolygon.fill}
                        enableHover
                        tooltipRenderer={Tooltip}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(IncidentMap);
