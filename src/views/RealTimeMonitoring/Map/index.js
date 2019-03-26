import React from 'react';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';

import TextOutput from '#components/TextOutput';
import CommonMap from '#components/CommonMap';

import { mapStyles } from '#constants';
import {
    earthquakeToGeojson,
    riverToGeojson,
    rainToGeojson,
} from '#utils/domain';

import styles from './styles.scss';

export default class RealTimeMap extends React.PureComponent {
    getEarthquakeFeatureCollection = memoize(earthquakeToGeojson)

    getRiverFeatureCollection = memoize(riverToGeojson)

    getRainFeatureCollection = memoize(rainToGeojson);

    tooltipRendererParams = (id, { title, description, basin, status }) => ({
        title,
        description,
        basin,
        status,
    })

    tooltipRenderer = ({ title, description, basin, status }) => (
        <div>
            <h3>
                {title}
            </h3>
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Basin"
                value={basin}
            />
            <TextOutput
                label="Status"
                value={status}
            />
        </div>
    )

    earthquakeTooltipRendererParams = (id, { address, description, eventOn, magnitude }) => ({
        address,
        description,
        eventOn,
        magnitude,
    })

    earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }) => (
        <div>
            <TextOutput
                label="Address"
                value={address}
            />
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Event On"
                value={eventOn}
            />
            <TextOutput
                label="Magnitude"
                value={magnitude}
            />
        </div>
    )

    render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
        } = this.props;

        const rainFeatureCollection = this.getRainFeatureCollection(realTimeRainList);
        const riverFeatureCollection = this.getRiverFeatureCollection(realTimeRiverList);
        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            realTimeEarthquakeList,
        );

        return (
            <React.Fragment>
                <CommonMap />
                <MapSource
                    sourceKey="real-time-rain-points"
                    geoJson={rainFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-rain-points-fill"
                        type="circle"
                        property="rainId"
                        paint={mapStyles.rainPoint.fill}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-river-points-fill"
                        type="circle"
                        property="riverId"
                        paint={mapStyles.riverPoint.fill}
                        enableHover
                        tooltipRenderer={this.tooltipRenderer}
                        tooltipRendererParams={this.tooltipRendererParams}
                    />
                </MapSource>
                <MapSource
                    sourceKey="real-time-eartquake-points"
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    <MapLayer
                        layerKey="real-time-earthquake-points-fill"
                        type="circle"
                        property="earthquakeId"
                        paint={mapStyles.earthquakePoint.fill}
                        enableHover
                        tooltipRenderer={this.earthquakeTooltipRenderer}
                        tooltipRendererParams={this.earthquakeTooltipRendererParams}
                    />
                </MapSource>
            </React.Fragment>
        );
    }
}
