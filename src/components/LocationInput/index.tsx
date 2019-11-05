import React from 'react';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';

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

import DraggablePoint from './DraggablePoint';
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


class LocationInput extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            geoJson: {
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
            },
            region: undefined,
        };
    }

    private handlePointMove = (geoJson, region) => {
        this.setState({
            geoJson,
            region,
        });
    }

    private getFormData = (geoJson) => {
        const feature = geoJson.features[0];
        const { coordinates } = feature.geometry;

        const lng = coordinates[0];
        const lat = coordinates[1];

        return {
            lng,
            lat,
        };
    }

    public render() {
        const { mapStyle } = this.props;
        const {
            geoJson,
            region,
        } = this.state;

        const {
            lng,
            lat,
        } = this.getFormData(geoJson);

        return (
            <div className={styles.locationInput}>
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
                    <MapContainer className={styles.mapContainer} />
                    <AreaMap />
                    <DraggablePoint
                        geoJson={geoJson}
                        onPointMove={this.handlePointMove}
                    />
                    <div className={styles.coordinateInput}>
                        <TextInput
                            type="number"
                            label="Longitude"
                            value={lng}
                        />
                        <TextInput
                            type="number"
                            label="Latitude"
                            value={lat}
                        />
                    </div>
                    <RegionSelectInput
                        label="Region"
                        value={region}
                    />
                </Map>
            </div>
        );
    }
}

export default connect(mapStateToProps)(LocationInput);
