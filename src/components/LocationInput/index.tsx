import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import { AppState } from '#store/types';
import {
    District,
    Province,
    Municipality,
    Ward,
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
    pointColor?: string;
    faramElementName?: string;
    onChange: (response: object) => void;
}

interface PropsFromAppState {
    districts: District[];
    provinces: Province[];
    municipalities: Municipality[];
    wards: Ward[];
    mapStyle: string;
}

interface State {
}

interface Region {
    geoarea: number;
    adminLevel: number;
    ward: number;
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
    private handlePointMove = (geoJson: object, region: Region) => {
        const {
            onChange,
            wards,
        } = this.props;

        let wardList: { id: number }[] = [];
        if (region.adminLevel === 1) {
            wardList = wards.filter(d => d.province === region.geoarea);
        } else if (region.adminLevel === 2) {
            wardList = wards.filter(d => d.district === region.geoarea);
        } else if (region.adminLevel === 3) {
            wardList = wards.filter(d => d.municipality === region.geoarea);
        } else {
            wardList = [{ id: region.ward }];
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
            point,
            pointColor,
            pointShape,
            value = emptyObject,
            hint,
            error,
        } = this.props;

        const {
            geoJson,
            region,
        } = value;

        return (
            <div className={_cs(className, styles.locationInput)}>
                <Map
                    mapStyle={mapStyle}

                    mapOptions={{
                        logoPosition: 'top-left',
                        minZoom: 5,
                    }}

                    scaleControlShown
                    scaleControlPosition="bottom-right"

                    navControlShown
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
                        pointShape={pointShape}
                        hint={hint}
                        error={error}
                    />
                    <MapContainer className={styles.mapContainer} />
                </Map>
            </div>
        );
    }
}

export default connect(mapStateToProps)(FaramInputElement(LocationInput));
