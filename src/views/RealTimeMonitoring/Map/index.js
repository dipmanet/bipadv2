import React from 'react';
import memoize from 'memoize-one';

import MapLayer from '#rscz/Map/MapLayer';
import MapSource from '#rscz/Map/MapSource';
import FormattedDate from '#rscv/FormattedDate';

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
            <h3>
                {address}
            </h3>
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Event On"
                value={
                    <FormattedDate
                        date={eventOn}
                        mode="dd-MM-yyyy hh:mm"
                    />
                }
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
            selectedRealTime,
            showRain,
            showRiver,
            showEarthquake,
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
                    { showRain &&
                        <MapLayer
                            layerKey="real-time-rain-symbol"
                            type="symbol"
                            layout={mapStyles.rainPoint.layout}
                            paint={mapStyles.rainPoint.paint}
                            enableHover
                            tooltipRenderer={this.tooltipRenderer}
                            tooltipRendererParams={this.tooltipRendererParams}
                        />
                    }
                </MapSource>
                <MapSource
                    sourceKey="real-time-river-points"
                    geoJson={riverFeatureCollection}
                    supportHover
                >
                    { showRiver &&
                        <MapLayer
                            layerKey="real-time-river-symbol"
                            type="symbol"
                            layout={mapStyles.riverPoint.layout}
                            paint={mapStyles.riverPoint.paint}
                            enableHover
                            tooltipRenderer={this.tooltipRenderer}
                            tooltipRendererParams={this.tooltipRendererParams}
                        />
                    }
                </MapSource>
                <MapSource
                    sourceKey="real-time-eartquake-points"
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    { showEarthquake &&
                        <MapLayer
                            layerKey="real-time-earthquake-points-fill"
                            type="circle"
                            property="earthquakeId"
                            paint={mapStyles.earthquakePoint.fill}
                            enableHover
                            tooltipRenderer={this.earthquakeTooltipRenderer}
                            tooltipRendererParams={this.earthquakeTooltipRendererParams}
                        />
                    }
                </MapSource>
            </React.Fragment>
        );
    }
}
