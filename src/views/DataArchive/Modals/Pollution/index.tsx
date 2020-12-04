import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import memoize from 'memoize-one';
import { groupList } from '#utils/common';

import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import DangerButton from '#rsca/Button/DangerButton';
import { MultiResponse } from '#store/atom/response/types';

import MiniMap from './MiniMap';
import Details from './Details';
import Filters from './Filters';
import Graph from './Graph';
import TableView from './TableView';

import { Geometry, ArchivePollution, FaramValues } from './types';
import {
    pollutionToGeojson,
    getSortedPollutionData,
    // getTodaysPollutionDetails,
    parseParameter,
    parsePeriod,
    getChartData,
} from './utils';
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
            // historical: 'true',
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

const initialFaramValue = {
    dataDateRange: {
        startDate: '',
        endDate: '',
    },
    parameter: {},
    period: {},
};
const PollutionModal = (props: Props) => {
    const [filterValues, setFilterValues] = useState<FaramValues>(initialFaramValue);
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
    // const todaysPollutionDetails = getTodaysPollutionDetails(sortedPollutionDetails);
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
    const pollutionDataWithParameter = parseParameter(stationData);
    const pollutionDataWithPeriod = parsePeriod(pollutionDataWithParameter);

    const hourWiseGroup = groupList(
        pollutionDataWithPeriod.filter(p => p.dateWithHour),
        pollution => pollution.dateWithHour,
    );
    const dailyWiseGroup = groupList(
        pollutionDataWithPeriod.filter(p => p.dateOnly),
        pollution => pollution.dateOnly,
    );
    const weekWiseGroup = groupList(
        pollutionDataWithPeriod.filter(p => p.dateWithWeek),
        pollution => pollution.dateWithWeek,
    );
    const monthWiseGroup = groupList(
        pollutionDataWithPeriod.filter(p => p.dateWithMonth),
        pollution => pollution.dateWithMonth,
    );
    let filterWiseChartData;
    const {
        period: { periodCode },
        parameter: { parameterCode },
    } = filterValues;
    if (periodCode === 'hourly') {
        filterWiseChartData = getChartData(hourWiseGroup, 'hourName');
    }
    if (periodCode === 'daily') {
        filterWiseChartData = getChartData(dailyWiseGroup, 'dateName');
    }
    if (periodCode === 'weekly') {
        filterWiseChartData = getChartData(weekWiseGroup, 'weekName');
    }
    if (periodCode === 'monthly') {
        filterWiseChartData = getChartData(monthWiseGroup, 'monthName');
    }

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
                            filterWiseChartData={filterWiseChartData}
                            parameterCode={parameterCode}
                        />
                    </div>
                    <div className={styles.modalTwelveMonth}>
                        <TableView
                            pollutionDataWithParameter={pollutionDataWithParameter}
                            filterValues={filterValues}
                        />
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
)(PollutionModal);
