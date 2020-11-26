import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import { MultiResponse } from '#store/atom/response/types';

import MiniMap from './MiniMap';
import Details from './Details';
import Filters from './Filters';
import Graph from './Graph';
import { Geometry, ArchivePollution } from './types';
import { pollutionToGeojson, getSortedPollutionData, getTodaysPollutionDetails, parseParameter } from './utils';
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
        url: '/pollution/',
        method: methods.GET,
        query: ({ props: { stationId } }) => ({
            station: stationId,
            historical: 'true',
            expand: ['province', 'district', 'municipality', 'ward'],
        }),
        onMount: true,
        onPropsChanged: ['stationId'],
    },
};

type Props = NewProps<OwnProps, Params>;

const emptyArray: any[] = [];
const emptyObject: any = {};

const mapStateToProps = (state: AppState) => ({
    mapStyle: mapStyleSelector(state),
});

const getPollutionFeatureCollection = memoize(pollutionToGeojson);

const PollutionModal = (props: Props) => {
    const [filterValues, setFilterValues] = useState({});
    const [stationData, setStationData] = useState<ArchivePollution[]>([]);
    const { stationName = 'Pollution Modal',
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
    let pollutionDetails: ArchivePollution[] = emptyArray;
    if (!pending && response) {
        const {
            results,
        } = response as MultiResponse<ArchivePollution>;
        pollutionDetails = results;
    }

    const sortedPollutionDetails = getSortedPollutionData(pollutionDetails);
    const todaysPollutionDetails = getTodaysPollutionDetails(sortedPollutionDetails);
    const latestPollutionDetail = sortedPollutionDetails[0];
    const { municipality } = latestPollutionDetail || emptyObject;
    const { id: geoarea } = municipality || emptyObject;
    // get map center
    const { coordinates } = geometry;

    const pollutionFeatureCollection = getPollutionFeatureCollection(
        [latestPollutionDetail || {}],
    );

    const handleFilterValues = (fv) => {
        setFilterValues(fv);
    };

    const handleStationData = (data: ArchivePollution[]) => {
        setStationData(data);
    };
    const pollutionDataWithParameter = parseParameter([...stationData]);
    return (
        <Modal className={styles.pollutionModal}>
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
                            pollutionFeatureCollection={pollutionFeatureCollection}
                        />
                    </div>
                    <div className={styles.modalDetails}>
                        <Details
                            latestPollutionDetail={latestPollutionDetail}
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
                        <Graph
                            stationData={stationData}
                        />
                    </div>
                    <div className={styles.modalTwelveMonth}>Modal Tweleve Month Graph</div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default compose(
    connect(mapStateToProps, {}),
    createConnectedRequestCoordinator<OwnProps>(),
    createRequestClient(requests),
)(PollutionModal);
