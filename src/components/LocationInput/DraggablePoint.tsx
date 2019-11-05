import React from 'react';
import memoize from 'memoize-one';
import produce from 'immer';

import MapContext from '#rscz/Map/context';
import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { mapStyles } from '#constants';

const emptyObject = {};

interface Props {
    geoJson: {};
}

interface State {
}

export default class DraggablePoint extends React.PureComponent<Props, State> {
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
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
        });

        this.context.map.getSource('alert-point').setData(newGeoJson);
    }

    private handleEnd = (e) => {
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
            // eslint-disable-next-line no-param-reassign
            deferedState.features[0].geometry.coordinates = [lng, lat];
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

    private setMapEvents = memoize((map) => {
        if (map) {
            map.on('mousedown', 'alert-point-fill', (e: {
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

    public render() {
        const { geoJson } = this.props;

        this.setMapEvents(this.context.map);

        return (
            <MapSource
                sourceKey="alert-point"
                geoJson={geoJson}
            >
                <MapLayer
                    type="circle"
                    layerKey="alert-point-fill"
                    paint={mapStyles.alertPoint.circle}
                />
            </MapSource>
        );
    }
}

DraggablePoint.contextType = MapContext;
