import React from 'react';
import memoize from 'memoize-one';
import produce from 'immer';

import { _cs } from '@togglecorp/fujs';

import MapContext from '#rscz/Map/context';
import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import TextInput from '#rsci/TextInput';
import RegionSelectInput from '#components/RegionSelectInput';

import { mapStyles } from '#constants';

import styles from './styles.scss';

const emptyObject = {};

const defaultGeoJson = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [84.1240, 28.3949],
        },
        properties: {
            hazardColor: '#f00000',
        },
    }],
};

type GeoJson = typeof defaultGeoJson;

interface Region {
    geoarea: number;
    adminLevel: number;
    ward?: number;
}

interface Props {
    pointColor: string;
    geoJson: GeoJson;
    onPointMove: (geoJson: GeoJson, region: Region) => {};
    pointShape?: 'rect' | 'circle';
}

interface State {
}

export default class DraggablePoint extends React.PureComponent<Props, State> {
    public static defaultProps = {
        pointShape: 'circle',
    }

    private handleMove = (e: {}) => {
        const {
            geoJson,
            onPointMove,
        } = this.props;

        const {
            lngLat: {
                lng,
                lat,
            },
        } = e;

        const newGeoJson = produce(geoJson, (deferedState) => {
            if (deferedState.features[0].geometry) {
                // eslint-disable-next-line no-param-reassign
                deferedState.features[0].geometry.coordinates = [lng, lat];
            } else {
                // eslint-disable-next-line no-param-reassign
                deferedState.features[0].geometry = {
                    type: 'Point',
                    coordinates: [lng, lat],
                };
            }
        });

        this.context.map.getSource('alert-point').setData(newGeoJson);
    }

    private handleEnd = (e: any) => {
        this.context.map.off('mousemove', this.handleMove);
        this.context.map.off('touchmove', this.handleMove);

        const {
            geoJson,
            onPointMove,
        } = this.props;

        const {
            lngLat: {
                lng,
                lat,
            },
        } = e;

        const newGeoJson = produce(geoJson, (deferedState) => {
            if (deferedState.features[0].geometry) {
                // eslint-disable-next-line no-param-reassign
                deferedState.features[0].geometry.coordinates = [lng, lat];
            } else {
                // eslint-disable-next-line no-param-reassign
                deferedState.features[0].geometry = {
                    type: 'Point',
                    coordinates: [lng, lat],
                };
            }
        });

        // this.context.map.getSource('alert-point').setData(newGeoJson);

        if (onPointMove) {
            const features = this.context.map.queryRenderedFeatures(
                e.point,
                { layers: ['ward-fill'] },
            );

            let region;

            if (features.length > 0) {
                const feature = features[0];
                const wardId = feature.id;
                const municipalityId = feature.properties.municipality;

                region = {
                    geoarea: municipalityId,
                    adminLevel: 3,
                    ward: wardId,
                };
            }

            onPointMove(newGeoJson, region);
        }
    }

    private handleMouseClick = (e: any) => {
        const {
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;

        const {
            lngLat: {
                lng,
                lat,
            },
        } = e;

        const newGeoJson = produce(geoJson, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
        });

        // console.warn(e);

        if (onPointMove) {
            const features = this.context.map.queryRenderedFeatures(
                e.point,
                { layers: ['ward-fill'] },
            );

            let region;

            if (features.length > 0) {
                const feature = features[0];
                const wardId = feature.id;
                const municipalityId = feature.properties.municipality;

                region = {
                    geoarea: municipalityId,
                    adminLevel: 3,
                    ward: wardId,
                };
            }

            onPointMove(newGeoJson, region);
        }
    }

    private setMapEvents = memoize((map, pointShape) => {
        if (map) {
            map.on('click', this.handleMouseClick);
            map.on('mousedown', pointShape === 'rect' ? 'rect-symbol' : 'alert-point-fill', (e: {
                preventDefault: () => void;
            }) => {
                e.preventDefault();

                map.on('mousemove', this.handleMove);
                map.once('mouseup', this.handleEnd);
            });

            map.on('touchstart', 'alert-point-fill', () => {
                map.on('touchmove', this.handleMove);
                map.once('touchend', this.handleEnd);
            });
        }
    });

    public componentDidUpdate() {
        const {
            pointShape,
        } = this.props;
        this.setMapEvents(this.context.map, pointShape);
    }

    private getFormData = (geoJson) => {
        if (!geoJson) {
            return {
                lng: undefined,
                lat: undefined,
            };
        }

        const feature = geoJson.features[0];
        const { coordinates } = feature.geometry;

        const lng = coordinates[0];
        const lat = coordinates[1];

        return {
            lng,
            lat,
        };
    }

    private handleRegionSelectInputChange = (newRegion) => {
        const {
            municipalities,
            districts,
            provinces,
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;

        const regionMap = {
            1: provinces,
            2: districts,
            3: municipalities,
        };

        const regions = regionMap[newRegion.adminLevel];
        if (regions) {
            const selectedRegion = regions.find(d => d.id === newRegion.geoarea);
            const point = this.context.map.project(selectedRegion.centroid.coordinates);

            const newGeoJson = produce(geoJson, (deferedState) => {
                // eslint-disable-next-line no-param-reassign
                deferedState.features[0].geometry.coordinates = selectedRegion.centroid.coordinates;
            });

            onPointMove(newGeoJson, newRegion);
        }
    }

    private handleLatInputChange = (lat) => {
        const {
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;
        const { lng } = this.getFormData(geoJson);

        const newGeoJson = produce(geoJson, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
        });

        const point = this.context.map.project([lng, lat]);

        if (onPointMove) {
            const features = this.context.map.queryRenderedFeatures(
                point,
                { layers: ['ward-fill'] },
            );

            let region;

            if (features.length > 0) {
                const feature = features[0];
                const wardId = feature.id;
                const municipalityId = feature.properties.municipality;

                region = {
                    geoarea: municipalityId,
                    adminLevel: 3,
                    ward: wardId,
                };
            }

            onPointMove(newGeoJson, region);
        }
    }

    private handleLngInputChange = (lng) => {
        const {
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;
        const { lat } = this.getFormData(geoJson);

        const newGeoJson = produce(geoJson, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
        });

        const point = this.context.map.project([lng, lat]);

        if (onPointMove) {
            const features = this.context.map.queryRenderedFeatures(
                point,
                { layers: ['ward-fill'] },
            );

            let region;

            if (features.length > 0) {
                const feature = features[0];
                const wardId = feature.id;
                const municipalityId = feature.properties.municipality;

                region = {
                    geoarea: municipalityId,
                    adminLevel: 3,
                    ward: wardId,
                };
            }

            onPointMove(newGeoJson, region);
        }
    }

    public render() {
        const {
            geoJson,
            region,
            className,
            pointShape,
            hint,
            error,
        } = this.props;

        const {
            lng,
            lat,
        } = this.getFormData(geoJson);

        return (
            <div className={_cs(className, styles.point)}>
                { geoJson && (
                    <MapSource
                        sourceKey="alert-point"
                        geoJson={geoJson}
                    >
                        { pointShape === 'rect' ? (
                            <MapLayer
                                layerKey="rect-symbol"
                                type="symbol"
                                layout={mapStyles.eventSymbol.layout}
                                paint={mapStyles.eventSymbol.paint}
                            />
                        ) : (
                            <MapLayer
                                type="circle"
                                layerKey="alert-point-fill"
                                paint={mapStyles.alertPoint.circle}
                            />
                        )}
                    </MapSource>
                )}
                <RegionSelectInput
                    className={styles.regionInput}
                    label="Region"
                    value={region}
                    onChange={this.handleRegionSelectInputChange}
                    maxOptions={50}
                    hideClearButton
                    error={error}
                    hint={hint}
                    showHintAndError
                />
                <div className={styles.coordinateInput}>
                    <TextInput
                        readOnly
                        className={styles.latInput}
                        type="number"
                        label="Latitude"
                        value={lat}
                        onChange={this.handleLatInputChange}
                    />
                    <TextInput
                        className={styles.lngInput}
                        readOnly
                        type="number"
                        label="Longitude"
                        value={lng}
                        onChange={this.handleLngInputChange}
                    />
                </div>
            </div>
        );
    }
}

DraggablePoint.contextType = MapContext;
