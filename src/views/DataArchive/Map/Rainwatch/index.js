import React from 'react';
import { connect } from 'react-redux';

import memoize from 'memoize-one';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import { MapChildContext } from '#re-map/context';

import RainModal from '../../Modals/Rainwatch';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { rainFiltersSelector } from '#selectors';
import styles from './styles.scss';

import { httpGet } from '#utils/common';

const mapStateToProps = state => ({
    rainFilters: rainFiltersSelector(state),
});

const GIS_URL = [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/ows?`,
    'service=WFS',
    '&version=1.0.0',
    '&request=GetFeature',
    '&typeName=Bipad:watershed-area',
    '&outputFormat=application/json',
].join('');

const tileUrl = [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
    '&version=1.1.1',
    '&service=WMS',
    '&request=GetMap',
    '&layers=Bipad:watershed-area',
    '&tiled=true',
    '&width=256',
    '&height=256',
    '&srs=EPSG:3857',
    '&bbox={bbox-epsg-3857}',
    '&transparent=true',
    '&format=image/png',
].join('');

const RainToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

const rainToGeojson = (rainList) => {
    const geojson = {
        type: 'FeatureCollection',
        features: rainList
            .filter(rain => rain.point)
            .map(rain => ({
                id: rain.id,
                type: 'Feature',
                geometry: {
                    ...rain.point,
                },
                properties: {
                    ...rain,
                    rainId: rain.id,
                    title: rain.title,
                    description: rain.description,
                    basin: rain.basin,
                    status: rain.status,
                },
            })),
    };
    return geojson;
};

const compare = (a, b) => {
    if (a.measuredOn < b.measuredOn) {
        return 1;
    }
    if (a.measuredOn > b.measuredOn) {
        return -1;
    }
    return 0;
};

class RainMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false,
            gis: undefined,
        };
    }

    componentDidMount() {
        let result = '';
        try {
            result = JSON.parse(httpGet(GIS_URL));
            this.setState({ gis: result });
        } catch (error) {
            this.setState({ gis: undefined });
        }
    }

    getRainFeatureCollection = memoize(rainToGeojson);

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

    handleModalClose = () => {
        this.setState({ tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false });
    }

    handleRainClick = (feature, lngLat) => {
        const {
            properties: {
                title,
                description,
                basin,
                status,
                station: stationId,
            },
            geometry,
        } = feature;
        this.setState({
            tooltipRenderer: this.rainTooltipRenderer,
            tooltipParams: {
                title,
                description,
                basin,
                status,
                stationId,
                geometry,
            },
            coordinates: lngLat,
        });
        return true;
    }

    rainTooltipRenderer = ({ title, basin }) => (
        <div className={styles.mainWrapper}>
            <div className={styles.tooltip}>
                <div className={styles.header}>
                    <h3>{`Heavy Rainfall at ${title || 'N/A'}`}</h3>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>BASIN:</div>
                    <div className={styles.value}>{basin || 'N/A'}</div>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>STATION NAME:</div>
                    <div className={styles.value}>{title || 'N/A'}</div>
                </div>
            </div>
            <div className={styles.line} />
            <div
                className={styles.getDetails}
            >
                <span
                    onClick={() => this.setState({ showModal: true })}
                    role="presentation"
                >
                    Get Details
                </span>
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

    render() {
        const { data,
            rainFilters,
            rightPaneExpanded,
            leftPaneExpanded } = this.props;
        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
            gis,
        } = this.state;

        // sorting to get latest value on map
        if (data) {
            data.sort(compare);
        }

        const rainFeatureCollection = this.getRainFeatureCollection(
            data,
        );
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
        const { station: { point, municipality } } = rainFilters;
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };

        const { showModal } = this.state;

        const { title: stationName, stationId, geometry } = tooltipParams || {};
        const region = { adminLevel: 3, geoarea: municipality || undefined };
        return (
            <div className={styles.dataArchiveRainMap}>
                <CommonMap
                    sourceKey="dataArchiveRain"
                    boundsPadding={boundsPadding}
                    region={municipality ? region : undefined}
                />
                {coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <RainToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}

                <MapSource
                    key={'basin-layer'}
                    sourceKey={'basin-key'}
                    sourceOptions={{
                        type: 'raster',
                        tiles: [tileUrl],
                        tileSize: 256,
                    }}
                >
                    <MapLayer
                        layerKey="raster-layer"
                        layerOptions={{
                            type: 'raster',
                            paint: {
                                'raster-opacity': 0.5,
                            },
                        }}
                    />
                </MapSource>

                <MapSource
                    sourceKey="real-time-rain-points"
                    geoJson={rainFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-rain-circle"
                            onClick={this.handleRainClick}
                            layerOptions={{
                                type: 'circle',
                                // paint: mapStyles.rainPoint.paint,
                                paint: mapStyles.rainPoint.circle,
                            }}
                        />
                    </React.Fragment>
                </MapSource>
                {showModal
                && (
                    <RainModal
                        handleModalClose={this.handleModalClose}
                        stationName={stationName}
                        stationId={stationId}
                        geometry={geometry}
                    />
                )
                }
            </div>
        );
    }
}

RainMap.contextType = MapChildContext;
export default connect(mapStateToProps, [])(RainMap);
