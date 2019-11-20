import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';

import { AppState } from '#store/types';
import {
    District,
    Province,
    Municipality,
} from '#store/atom/page/types';

import {
    districtsSelector,
    municipalitiesSelector,
    provincesSelector,
    mapStyleSelector,
    wardsSelector,
} from '#selectors';

import Point from './Point';
import AreaMap from './Map';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
    pointColor: string;
}

interface PropsFromAppState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
    mapStyle: string;
}

interface State {
}

type Props = OwnProps & PropsFromAppState;

const mapStateToProps = (state: AppState): PropsFromAppState => ({
    wards: wardsSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
    mapStyle: mapStyleSelector(state),
});

const emptyObject = {};

class LocationInput extends React.PureComponent<Props, State> {
    private getGeoJson = (geoJsonFromState, pointColor) => {
        if (geoJsonFromState) {
            return geoJsonFromState;
        }

        const geoJson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [84.1240, 28.3949],
                },
                properties: {
                    hazardColor: pointColor,
                },
            }],
        };

        return geoJson;
    }

    private handlePointMove = (geoJson, region) => {
        const {
            onChange,
            wards,
            districts,
        } = this.props;

        let wardList;

        if (region.adminLevel === 1) {
            wardList = wards.filter(d => d.province === region.geoarea);
        } else if (region.adminLevel === 2) {
            wardList = wards.filter(d => d.district === region.geoarea);
        } else if (region.adminLevel === 3) {
            wardList = wards.filter(d => d.municipality === region.geoarea);
        } else {
            wardList = [region.ward];
        }

        if (onChange) {
            onChange({
                geoJson,
                region,
                wards: wardList.map(d => d.id),
            });
        }
    }

    public render() {
        const {
            className,
            mapStyle,
            districts,
            municipalities,
            provinces,
            pointColor,
            value = emptyObject,
        } = this.props;

        const {
            geoJson,
            region,
        } = value;

        return (
            <div className={_cs(className, styles.locationInput)}>
                <Map
                    mapStyle={mapStyle}
                    fitBoundsDuration={200}
                    minZoom={5}
                    logoPosition="top-left"

                    showScaleControl
                    scaleControlPosition="bottom-right"

                    showNavControl
                    navControlPosition="bottom-right"
                >
                    <AreaMap />
                    <Point
                        className={styles.point}
                        geoJson={geoJson}
                        onPointMove={this.handlePointMove}
                        region={region}
                        provinces={provinces}
                        districts={districts}
                        municipalities={municipalities}
                        pointColor={pointColor}
                    />
                    <MapContainer className={styles.mapContainer} />
                </Map>
            </div>
        );
    }
}

export default connect(mapStateToProps)(FaramInputElement(LocationInput));
