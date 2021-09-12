import React from 'react';
import memoize from 'memoize-one';
import produce from 'immer';

import { _cs } from '@togglecorp/fujs';

import { MapChildContext as MapContext } from '#re-map/context';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import { getLayerName } from '#re-map/utils';

import TextInput from '#rsci/TextInput';

import RegionSelectInput from '#components/RegionSelectInput';
import { Province, District, Municipality } from '#store/atom/page/types';

import { mapStyles } from '#constants';

import styles from './styles.scss';

const defaultGeoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
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

// type GeoJson = typeof defaultGeoJson;

interface Region {
    geoarea: number;
    adminLevel: number;
    ward?: number;
}

interface Field {
    id: number;
    title: string;
}

interface Props {
    pointColor: string;
    geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    onPointMove: (
        geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
        region: Region | undefined,
    ) => void;
    pointShape?: 'rect' | 'circle';

    provinces: Province[];
    districts: District[];
    municipalities: Municipality[];

    className?: string;
    region?: Region;

    hint?: string;
    error?: string;
}

interface State {
}

export default class DraggablePoint extends React.PureComponent<Props, State> {
    public static defaultProps = {
        pointShape: 'circle',
    }

    public componentDidUpdate() {
        const { pointShape } = this.props;
        this.setMapEvents(this.context.map, pointShape);
    }

    private setMapEvents = memoize((map: unknown, pointShape: 'rect' | 'circle') => {
        if (!map) {
            return;
        }

        const shapeName = getLayerName(
            'alert-point',
            pointShape === 'rect' ? 'rect-symbol' : 'alert-point-fill',
        );

        map.on('click', this.handleMouseClick);

        map.on(
            'mousedown',
            shapeName,
            (e: { preventDefault: () => void }) => {
                e.preventDefault();
                map.on('mousemove', this.handleMove);
                map.once('mouseup', this.handleEnd);
            },
        );

        map.on(
            'touchstart',
            shapeName,
            () => {
                map.on('touchmove', this.handleMove);
                map.once('touchend', this.handleEnd);
            },
        );
    });

    private getFormData = (geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry> | undefined) => {
        if (!geoJson) {
            return { lng: undefined, lat: undefined };
        }

        const feature = geoJson.features[0];
        if (feature.geometry.type !== 'Point') {
            return { lng: undefined, lat: undefined };
        }

        const { coordinates } = feature.geometry;

        const lng = coordinates[0];
        const lat = coordinates[1];

        return {
            lng,
            lat,
        };
    }

    private handleRegionSelectInputChange = (
        newRegion: { adminLevel: number; geoarea: number },
    ) => {
        const {
            municipalities,
            districts,
            provinces,
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;

        if (!onPointMove) {
            return;
        }

        const regionMap: {
            [key: number]: (Province | District | Municipality)[];
        } = {
            1: provinces,
            2: districts,
            3: municipalities,
        };

        const regions = newRegion.adminLevel
            ? regionMap[newRegion.adminLevel]
            : undefined;

        if (!regions) {
            return;
        }

        const selectedRegion = regions.find(
            d => d.id === newRegion.geoarea,
        );
        // const point = this.context.map.project(selectedRegion.centroid.coordinates);

        if (!selectedRegion) {
            return;
        }

        const newGeoJson = produce(geoJson, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = selectedRegion.centroid.coordinates;
        });

        onPointMove(newGeoJson, newRegion);
    }


    private handleLatInputChange = (lat: number) => {
        const {
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;

        if (!onPointMove) {
            return;
        }

        const { lng } = this.getFormData(geoJson);

        const newGeoJson = produce(geoJson, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
        });

        const point = this.context.map.project([lng, lat]);

        const features = this.context.map.queryRenderedFeatures(
            point,
            { layers: [getLayerName('location-input-country', 'ward-fill')] },
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


    private handleLngInputChange = (lng: number) => {
        const {
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;

        if (!onPointMove) {
            return;
        }

        const { lat } = this.getFormData(geoJson);

        const newGeoJson = produce(geoJson, (deferedState) => {
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
        });

        const point = this.context.map.project([lng, lat]);
        const features = this.context.map.queryRenderedFeatures(
            point,
            { layers: [getLayerName('location-input-country', 'ward-fill')] },
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


    private handleMove = (e: unknown) => {
        const { geoJson } = this.props;

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

    private handleEnd = (e: unknown) => {
        this.context.map.off('mousemove', this.handleMove);
        this.context.map.off('touchmove', this.handleMove);

        const {
            geoJson,
            onPointMove,
        } = this.props;

        if (!onPointMove) {
            return;
        }

        const {
            point,
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

        const features = this.context.map.queryRenderedFeatures(
            point,
            { layers: [getLayerName('location-input-country', 'ward-fill')] },
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

    private handleMouseClick = (e: unknown) => {
        const {
            geoJson = defaultGeoJson,
            onPointMove,
        } = this.props;

        if (!onPointMove) {
            return;
        }

        const {
            point,
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
                point,
                { layers: [getLayerName('location-input-country', 'ward-fill')] },
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
                        sourceOptions={{
                            type: 'geojson',
                        }}
                        geoJson={geoJson}
                    >
                        { pointShape === 'rect' ? (
                            <MapLayer
                                layerKey="rect-symbol"
                                layerOptions={{
                                    type: 'symbol',
                                    paint: mapStyles.eventSymbol.paint,
                                    layout: mapStyles.eventSymbol.layout,
                                }}
                            />
                        ) : (
                            <MapLayer
                                layerKey="alert-point-fill"
                                layerOptions={{
                                    type: 'circle',
                                    paint: mapStyles.alertPoint.circle,
                                }}
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
                        className={styles.latInput}
                        type="number"
                        label="Latitude"
                        value={lat}
                        onChange={this.handleLatInputChange}
                    />
                    <TextInput
                        className={styles.lngInput}
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
