import React from 'react';
import { connect } from 'react-redux';

import memoize from 'memoize-one';
import CommonMap from '#components/CommonMap';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import { MapChildContext } from '#re-map/context';

import RiverModal from '../../Modals/Riverwatch';
import {
    mapStyles,
    getMapPaddings,
} from '#constants';
import { riverFiltersSelector, riverStationsSelector } from '#selectors';
import { getDate, getTime } from '#views/DataArchive/utils';

import styles from './styles.scss';

const mapStateToProps = state => ({
    riverFilters: riverFiltersSelector(state),
    riverStation: riverStationsSelector(state),
});

const tileUrl = [
    `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
    '&version=1.1.0',
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

const RiverToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

const riverToGeojson = (riverList) => {
    const geojson = {
        type: 'FeatureCollection',
        features: riverList
            .filter(river => river.point)
            .map(river => ({
                id: river.id,
                type: 'Feature',
                geometry: {
                    ...river.point,
                },
                properties: {
                    ...river,
                    riverId: river.id,
                    title: river.title,
                    description: river.description,
                    basin: river.basin,
                    status: river.status,
                    steady: river.steady,
                },
            })),
    };
    return geojson;
};

const riverStationToGeojson = (riverStation) => {
    const geojson = {
        type: 'FeatureCollection',
        features: riverStation
            .filter(river => river.point)
            .map(river => ({
                id: river.id,
                type: 'Feature',
                geometry: {
                    ...river.point,
                },
                properties: {
                    ...river,
                    riverId: river.id,
                    title: river.title,
                    description: river.description,
                    basin: river.basin,
                    status: river.status,
                    steady: river.steady,
                },
            })),
    };
    return geojson;
};


const compare = (a, b) => {
    if (a.waterLevelOn < b.waterLevelOn) {
        return 1;
    }
    if (a.waterLevelOn > b.waterLevelOn) {
        return -1;
    }
    return 0;
};
class RiverMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
            showModal: false,
            rasterLayers: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.riverStation !== this.props.riverStation) {
            // eslint-disable-next-line prefer-const
            let basinCoordinates = [];
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ rasterLayers: [] });
            if (this.props.riverFilters.basin != null) {
                // eslint-disable-next-line max-len
                const mydata = this.props.riverStation.filter(item => item.basin === this.props.riverFilters.basin.title);
                if (mydata.length > 0) {
                    if (this.props.riverFilters.basin.title === 'Mahakali') {
                        basinCoordinates = [80.415089, 29.130931];
                    } else {
                        basinCoordinates = mydata[0].point.coordinates;
                    }
                    const tile = [
                        `${process.env.REACT_APP_GEO_SERVER_URL}/geoserver/Bipad/wms?`,
                        '&service=WMS',
                        '&version=1.1.1',
                        '&request=GetMap',
                        '&layers=Bipad:watershed-area',
                        '&tiled=true',
                        '&width=256',
                        '&height=256',
                        '&srs=EPSG:3857',
                        '&bbox={bbox-epsg-3857}',
                        '&transparent=true',
                        '&format=image/png',
                        // eslint-disable-next-line max-len
                        `&CQL_FILTER=INTERSECTS(the_geom,%20POINT%20(${basinCoordinates[0]}%20${basinCoordinates[1]}))`,
                    ].join('');

                    const ourAarray = [{ key: `basin-${this.props.riverFilters.basin.title}`, layername: `layer-basin-${this.props.riverFilters.basin.title}`, tiles: tile }];
                    // eslint-disable-next-line max-len
                    if ((Object.keys(this.props.riverFilters.basin).length === 0)) {
                        // eslint-disable-next-line react/no-did-update-set-state
                        this.setState({ rasterLayers: [] });
                    } else {
                    // eslint-disable-next-line react/no-did-update-set-state
                        this.setState({ rasterLayers: [ourAarray[0]] });
                    }
                }
            }
        }
    }

    getRiverFeatureCollection = memoize(riverToGeojson);

    getRiverStationFeatureCollection = memoize(riverStationToGeojson);

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

    handleRiverClick = (feature, lngLat) => {
        const {
            properties: {
                title,
                description,
                basin,
                status,
                waterLevelOn: measuredOn,
                waterLevel,
                station: stationId,
            },
            geometry,
        } = feature;
        this.setState({
            tooltipRenderer: this.riverTooltipRenderer,
            tooltipParams: {
                title,
                description,
                basin,
                status,
                measuredOn,
                waterLevel,
                stationId,
                geometry,
            },
            coordinates: lngLat,
        });
        return true;
    }

    riverTooltipRenderer = ({ title, basin, measuredOn, waterLevel }) => (
        <div className={styles.mainWrapper}>
            <div className={styles.tooltip}>
                <div className={styles.header}>
                    <h3>{`${title} at ${basin || 'N/A'}`}</h3>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>BASIN:</div>
                    <div className={styles.value}>{basin || 'N/A'}</div>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>STATION NAME:</div>
                    <div className={styles.value}>{title || 'N/A'}</div>
                </div>

                <div className={styles.description}>
                    <div className={styles.key}>MEASURED ON:</div>
                    <div className={styles.value}>{`${getDate(measuredOn)} ${getTime(measuredOn)}`}</div>
                </div>
                <div className={styles.description}>
                    <div className={styles.key}>WATER LEVEL:</div>
                    <div className={styles.value}>{waterLevel ? `${waterLevel.toFixed(2)} m` : 'N/A'}</div>
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
            riverFilters,
            rightPaneExpanded,
            leftPaneExpanded } = this.props;
        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
            rasterLayers,
        } = this.state;

        // sorting to get latest value on map
        if (data) {
            data.sort(compare);
        }

        const riverFeatureCollection = this.getRiverFeatureCollection(
            data,
        );

        const riverStationFeatureCollection = this.getRiverStationFeatureCollection(
            this.props.riverStation,
        );

        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
        const { station: { point, municipality } } = riverFilters;
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };
        const { showModal } = this.state;

        const { title: stationName, stationId, geometry } = tooltipParams || {};
        const region = { adminLevel: 3, geoarea: municipality || undefined };
        return (
            <div className={styles.dataArchiveRiverMap}>
                <CommonMap
                    sourceKey="dataArchiveRiver"
                    boundsPadding={boundsPadding}
                    region={municipality ? region : undefined}
                />
                {coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <RiverToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                {(rasterLayers.length === 0)
                    && (
                        <MapSource
                            key="basin-key"
                            sourceKey="basin-key"
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
                                        'raster-opacity': 0.9,
                                    },
                                }}
                            />
                        </MapSource>
                    )
                }
                { rasterLayers.map(layer => (
                    <MapSource
                        key={`key${layer.key}`}
                        sourceKey={`source${layer.key}`}
                        sourceOptions={{
                            type: 'raster',
                            tiles: [layer.tiles],
                            tileSize: 256,
                        }}
                    >

                        <MapLayer
                            layerKey={`${layer.layername}`}
                            layerOptions={{
                                type: 'raster',
                                paint: {
                                    'raster-opacity': 0.9,
                                },
                            }}
                        />
                    </MapSource>
                ))
                }
                <MapSource
                    sourceKey="real-time-river-points"
                    // geoJson={riverFeatureCollection}
                    geoJson={riverStationFeatureCollection}
                    sourceOptions={{ type: 'geojson' }}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-river-custom"
                            onClick={this.handleRiverClick}
                            layerOptions={{
                                type: 'symbol',
                                layout: mapStyles.riverPoint.layout,
                                // paint: mapStyles.riverPoint.paint,
                                paint: mapStyles.riverPoint.text,
                            }}
                        />
                    </React.Fragment>
                </MapSource>
                {showModal
                && (
                    <RiverModal
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

RiverMap.contextType = MapChildContext;
export default connect(mapStateToProps, [])(RiverMap);
