import React from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';


import CommonMap from '#components/CommonMap';
import DataArchiveContext from '#components/DataArchiveContext';
import TextOutput from '#components/TextOutput';
import {
    getMapPaddings,
    mapStyles,
} from '#constants';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import FormattedDate from '#rscv/FormattedDate';
import {
    earthquakeToGeojson,
    fireToGeojson,
    pollutionToGeojson,
    rainToGeojson,
    riverToGeojson,
} from '#utils/domain';
import styles from './styles.scss';


const DataArchiveToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

DataArchiveToolTip.propTypes = {
    renderer: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

class DataArchiveMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getEarthquakeFeatureCollection = memoize(earthquakeToGeojson);

    getPollutionFeatureCollection = memoize(pollutionToGeojson);

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

    magnitudeClassSelector = (magnitude) => {
        if (magnitude < 4) {
            return styles.minor;
        }
        if (magnitude < 5) {
            return styles.light;
        }
        if (magnitude < 6) {
            return styles.moderate;
        }
        if (magnitude < 7) {
            return styles.strong;
        }
        if (magnitude < 8) {
            return styles.major;
        }
        if (magnitude >= 8) {
            return styles.great;
        }
        return styles.good;
    }

    earthquakeTooltipRenderer = ({ address, description, eventOn, magnitude }) => (
        <div className={styles.tooltip}>
            <div className={styles.header}>
                <h3>{ address }</h3>
                <span className={this.magnitudeClassSelector(magnitude)}>
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
        </div>
    )

    handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    componentDidMount() {
        this.handleTooltipClose();
    }

    render() {
        const { chosenOption, data } = this.props;

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
        } = this.state;

        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            data,
        );
        const pollutionFeatureCollection = this.getPollutionFeatureCollection(
            data,
        );
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };
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

DataArchiveMap.contextType = DataArchiveContext;
export default DataArchiveMap;
