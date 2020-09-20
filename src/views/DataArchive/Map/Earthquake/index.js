import React from 'react';
import memoize from 'memoize-one';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import Tooltip from './Tooltip';

import {
    mapStyles,
    getMapPaddings,
} from '#constants';

import {
    earthquakeToGeojson,
} from '#utils/domain';

import styles from './styles.scss';

const EarthquakeToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

class EarthquakeMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getEarthquakeFeatureCollection = memoize(earthquakeToGeojson);

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        }

        if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        }

        if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }

        return mapPaddings.noPaneExpanded;
    });

    handleEarthquakeClick = (feature, lngLat) => {
        const {
            properties: {
                address,
                description,
                eventOn,
                magnitude,
            },
        } = feature;

        this.setState({
            tooltipRenderer: Tooltip,
            tooltipParams: {
                address,
                description,
                eventOn,
                magnitude,
            },
            coordinates: lngLat,
        });

        return true;
    }

    handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    render() {
        const { data,
            rightPaneExpanded,
            leftPaneExpanded } = this.props;

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
        } = this.state;

        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            data,
        );
        console.log('earthquakeFeatureCollection: ', earthquakeFeatureCollection);

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);


        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };
        return (
            <div className={styles.dataArchiveEarthquakeMap}>
                <CommonMap
                    sourceKey="dataArchiveEarthquake"
                    boundsPadding={boundsPadding}
                />
                { coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <EarthquakeToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                <MapSource
                    sourceKey="real-time-earthquake-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-earthquake-points-fill"
                            onClick={this.handleEarthquakeClick}
                            layerOptions={{
                                type: 'circle',
                                property: 'earthquakeId',
                                paint: mapStyles.earthquakePoint.fill,
                            }}
                        />
                        <MapLayer
                            layerKey="real-time-earthquake-text"
                            layerOptions={{
                                type: 'symbol',
                                property: 'earthquakeId',
                                layout: mapStyles.earthquakeText.layout,
                                paint: mapStyles.earthquakeText.paint,
                            }}
                        />
                        <MapLayer
                            layerKey="real-time-earthquake-symbol"
                            layerOptions={{
                                type: 'symbol',
                                layout: {
                                    'icon-image': 'earthquake',
                                    'icon-size': 0.2,
                                },
                            }}
                        />
                    </React.Fragment>
                </MapSource>
            </div>
        );
    }
}

export default EarthquakeMap;
