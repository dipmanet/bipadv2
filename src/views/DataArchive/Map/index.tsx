import React from 'react';
import PropTypes from 'prop-types';

import memoize from 'memoize-one';

import TextOutput from '#components/TextOutput';
import FormattedDate from '#rscv/FormattedDate';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';

import {
    mapStyles,
    getMapPaddings,
} from '#constants';

import {
    earthquakeToGeojson,
    riverToGeojson,
    rainToGeojson,
    fireToGeojson,
    pollutionToGeojson,
} from '#utils/domain';
import * as PageType from '#store/atom/page/types';


import styles from './styles.scss';

type Options = 'Rain' | 'River' | 'Earthquake' | 'Pollution' | 'Fire' | undefined;

interface Props {
    earthquakeList: PageType.RealTimeEarthquake[];
    pollutionList: PageType.RealTimePollution[];
    chosenOption: Options;
}

const DataArchiveToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

DataArchiveToolTip.propTypes = {
    renderer: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

class DataArchiveMap extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.state = {};
    }

    private getEarthquakeFeatureCollection = memoize(earthquakeToGeojson);

    private getPollutionFeatureCollection = memoize(pollutionToGeojson);

    private handleEarthquakeClick = (feature, lngLat) => {
        const {
            properties: {
                address,
                description,
                eventOn,
                magnitude,
            },
        } = feature;

        this.setState({
            tooltipRenderer: this.earthquakeTooltipRenderer,
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

    private earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }:
    {address: string; description: string; eventOn: string; magnitude: number}) => (
        <div className={styles.tooltip}>
            <div className={styles.header}>
                <h3>{ address }</h3>
                <span>
                    { magnitude }
                    {' '}
                    ML
                </span>
            </div>

            <div className={styles.description}>
                <div className={styles.key}>Description:</div>
                <div className={styles.value}>{ description }</div>
            </div>

            <div className={styles.eventOn}>
                <div className={styles.key}>Event On:</div>
                <div className={styles.value}>
                    <FormattedDate
                        value={eventOn}
                        mode="yyyy-MM-dd hh:mm"
                    />
                </div>
            </div>
            {/* <h3>
                {address}
            </h3>
            <TextOutput
                label="Description"
                value={description}
            />
            <TextOutput
                label="Event On"
                value={(
                    <FormattedDate
                        value={eventOn}
                        mode="yyyy-MM-dd hh:mm"
                    />
                )}
            />
            <TextOutput
                label="Magnitude"
                value={magnitude}
                isNumericValue
                precision={1}
            /> */}
        </div>
    )

    private handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    private render() {
        const { earthquakeList, pollutionList, chosenOption } = this.props;

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
        } = this.state;

        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            earthquakeList,
        );
        const pollutionFeatureCollection = this.getPollutionFeatureCollection(
            pollutionList,
        );
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };
        console.log('Map Option: ', chosenOption);
        return (
            <div className={styles.dataArchiveMap}>
                <CommonMap
                    sourceKey="realtime"
                    boundsPadding={24}
                />
                { coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <DataArchiveToolTip
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
                    { chosenOption === 'Earthquake' && (
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
                    )}
                </MapSource>
                {/* Pollution Map */}
                <MapSource
                    sourceKey="real-time-pollution-points"
                    geoJson={pollutionFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    { chosenOption === 'Pollution' && (
                        <React.Fragment>
                            <MapLayer
                                layerKey="real-time-pollution-points-fill"
                                // onClick={this.handlePollutionClick}
                                layerOptions={{
                                    type: 'circle',
                                    property: 'pollutionId',
                                    paint: mapStyles.pollutionPoint.fill,
                                }}
                            />
                            <MapLayer
                                layerKey="real-time-pollution-text"
                                layerOptions={{
                                    type: 'symbol',
                                    property: 'pollutionId',
                                    layout: mapStyles.pollutionText.layout,
                                    paint: mapStyles.pollutionText.paint,
                                }}
                            />
                        </React.Fragment>
                    )}
                </MapSource>
            </div>
        );
    }
}

export default DataArchiveMap;
