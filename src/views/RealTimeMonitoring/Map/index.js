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
    fireToGeojson,
} from '#utils/domain';

import styles from './styles.scss';

export default class RealTimeMap extends React.PureComponent {
    getEarthquakeFeatureCollection = memoize(earthquakeToGeojson)

    getRiverFeatureCollection = memoize(riverToGeojson)

    getRainFeatureCollection = memoize(rainToGeojson);

    getFireFeatureCollection = memoize(fireToGeojson);

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

    fireTooltipRendererParams = (id, { brightness, confidence, eventOn, landCover }) => ({
        brightness,
        confidence,
        eventOn,
        landCover,
    })

    fireTooltipRenderer = ({ brightness, confidence, eventOn, landCover }) => (
        <div>
            <TextOutput
                label="Brightness"
                value={brightness}
            />
            <TextOutput
                label="Confidence"
                value={confidence}
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
                label="LandCover"
                value={landCover}
            />1
        </div>
    )

    render() {
        const {
            realTimeRainList,
            realTimeRiverList,
            realTimeEarthquakeList,
            realTimeFireList,
            selectedRealTime,
            showRain,
            showRiver,
            showEarthquake,
            showFire,
        } = this.props;

        const rainFeatureCollection = this.getRainFeatureCollection(realTimeRainList);
        const riverFeatureCollection = this.getRiverFeatureCollection(realTimeRiverList);
        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            realTimeEarthquakeList,
        );

        const fireFeatureCollection = this.getFireFeatureCollection(realTimeFireList);

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
                <MapSource
                    sourceKey="real-time-fire-points"
                    geoJson={fireFeatureCollection}
                    supportHover
                >
                    { showFire &&
                        <MapLayer
                            layerKey="real-time-fire-points-fill"
                            type="symbol"
                            property="fireId"
                            layout={mapStyles.firePoint.layout}
                            paint={mapStyles.firePoint.paint}
                            enableHover
                            tooltipRenderer={this.fireTooltipRenderer}
                            tooltipRendererParams={this.fireTooltipRendererParams}
                        />
                    }
                </MapSource>
            </React.Fragment>
        );
    }
}
