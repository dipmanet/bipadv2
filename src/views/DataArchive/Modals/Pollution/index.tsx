import React from 'react';

import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    compareNumber,
    getDifferenceInDays,
    getDate,
    listToGroupList,
    isDefined,
    mapToList,
} from '@togglecorp/fujs';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import { MultiResponse } from '#store/atom/response/types';

import * as PageType from '#store/atom/page/types';

import styles from './styles.scss';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

interface Params {}

interface OwnProps {
    handleModalClose: () => void;
    stationName: string;
    stationId: number;
}

interface ArchivePollution extends PageType.DataArchivePollution {
    createdOn: string;
}

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    detailRequest: {
        url: '/pollution/',
        method: methods.GET,
        query: ({ props: { stationId } }) => ({
            station: stationId,
            historical: 'true',
        }),
        onMount: true,
        onPropsChanged: ['stationId'],
    },
};

type Props = NewProps<OwnProps, Params>;

const emptyArray: any[] = [];

const getSortedPollutionData = memoize((pollutionDetails: ArchivePollution[]) => {
    const sortedData = [...pollutionDetails].sort((a, b) => compareDate(b.createdOn, a.createdOn));
    return sortedData;
});

const getTodaysPollutionDetails = memoize((pollutionDetails: ArchivePollution[]) => {
    const today = getDate(new Date().getTime());
    const todaysData = pollutionDetails.filter(
        pollutionDetail => getDate(pollutionDetail.createdOn) === today,
    );
    return todaysData;
});

const PollutionModal = (props: Props) => {
    const { stationName = 'Pollution Modal',
        requests: {
            detailRequest: {
                response,
                pending,
            },
        },
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
                    <div className={styles.modalMap}>Modal Map</div>
                    <div className={styles.modalDetails}>Modal Details</div>
                </div>
                <div className={styles.modalRow}>
                    <div className={styles.modalOneMonth}>Modal One Month Graph</div>
                    <div className={styles.modalTwelveMonth}>Modal Tweleve Month Graph</div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(PollutionModal),
);
