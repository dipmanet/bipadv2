import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import memoize from 'memoize-one';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';

import MiniMap from './MiniMap';
import Details from './Details';
import Filters from './Filters';

import { Geometry } from '#views/DataArchive/types';
import { ArchiveRain, FaramValues } from './types';
import { rainToGeojson } from './utils';

import styles from './styles.scss';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import { AppState } from '#store/types';
import { mapStyleSelector } from '#selectors';

interface Params {}

interface OwnProps {
    handleModalClose: () => void;
    stationName: string;
    stationId: number;
    geometry: Geometry;
    mapStyle: string;
}

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    detailRequest: {
        url: ({ props: { stationId } }) => (`/rain-stations/${stationId}`),
        method: methods.GET,
        query: ({ props: { stationId } }) => ({
            id: stationId,
            expand: ['province', 'district', 'municipality', 'ward'],
        }),
        onMount: true,
        onPropsChanged: ['stationId'],
    },
};

type Props = NewProps<OwnProps, Params>;

const emptyObject: any = {};

const mapStateToProps = (state: AppState) => ({
    mapStyle: mapStyleSelector(state),
});

const getRainFeatureCollection = memoize(rainToGeojson);

const initialFaramValue = {
    dataDateRange: {
        startDate: '',
        endDate: '',
    },
    period: {},
    interval: {},
};

const RainModal = (props: Props) => {
    const [filterValues, setFilterValues] = useState<FaramValues>(initialFaramValue);
    const [stationData, setStationData] = useState<ArchiveRain[]>([]);
    const { stationName = 'Rain Modal',
        requests: {
            detailRequest: {
                response,
                pending,
            },
        },
        mapStyle,
        geometry,
        stationId,
        handleModalClose } = props;
    let rainDetails: ArchiveRain = emptyObject;
    if (!pending && response) {
        const results = response as ArchiveRain;
        rainDetails = results;
    }
    const { municipality } = rainDetails || emptyObject;
    const { id: geoarea } = municipality || emptyObject;

    // get map center
    const { coordinates } = geometry;

    const rainFeatureCollection = getRainFeatureCollection(
        [rainDetails || {}],
    );

    const handleFilterValues = (fv) => {
        setFilterValues(fv);
    };

    const handleStationData = (data: ArchiveRain[]) => {
        setStationData(data);
    };

    return (
        <Modal className={styles.rainModal}>
            <ModalHeader
                title={stationName}
                rightComponent={(
                    <DangerButton
                        transparent
                        iconName="close"
                        onClick={handleModalClose}
                    />
                )}
            />
            <ModalBody className={styles.body}>
                <div className={styles.modalRow}>
                    <div className={styles.modalMap}>
                        <MiniMap
                            mapStyle={mapStyle}
                            coordinates={coordinates}
                            geoarea={geoarea}
                            rainFeatureCollection={rainFeatureCollection}
                        />
                    </div>
                    <div className={styles.modalDetails}>
                        <Details
                            rainDetails={rainDetails}
                        />
                        <Filters
                            handleFilterValues={handleFilterValues}
                            stationId={stationId}
                            handleStationData={handleStationData}
                        />
                    </div>
                </div>
                <div className={styles.modalRow}>
                    <div className={styles.modalOneMonth}>
                        Graph
                    </div>
                    <div className={styles.modalTwelveMonth}>
                        TableView
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default compose(
    connect(mapStateToProps, {}),
    createConnectedRequestCoordinator<OwnProps>(),
    createRequestClient(requests),
)(RainModal);
