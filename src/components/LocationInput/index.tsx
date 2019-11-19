import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';

import TextInput from '#rsci/TextInput';

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
} from '#selectors';

import CommonMap from '#components/CommonMap';
import RegionSelectInput from '#components/RegionSelectInput';

import Point from './Point';
import AreaMap from './Map';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
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
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    provinces: provincesSelector(state),
    mapStyle: mapStyleSelector(state),
});

const emptyObject = {};

class LocationInput extends React.PureComponent<Props, State> {
    private handlePointMove = (geoJson, region) => {
        const { onChange } = this.props;

        if (onChange) {
            onChange({
                geoJson,
                region,
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
                    <Point
                        className={styles.point}
                        geoJson={geoJson}
                        onPointMove={this.handlePointMove}
                        region={region}
                        provinces={provinces}
                        districts={districts}
                        municipalities={municipalities}
                    />
                    <MapContainer className={styles.mapContainer} />
                    <AreaMap />
                </Map>
            </div>
        );
    }
}

export default connect(mapStateToProps)(FaramInputElement(LocationInput));
