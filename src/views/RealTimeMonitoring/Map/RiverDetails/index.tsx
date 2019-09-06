import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    getDate,
    listToGroupList,
} from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import Image from '#rscv/Image';
import FormattedDate from '#rscv/FormattedDate';
import TextOutput from '#components/TextOutput';
import LoadingAnimation from '#rscv/LoadingAnimation';

import { RealTimeRiverDetails } from '#store/atom/page/types';
import { MultiResponse } from '#store/atom/response/types';
import { Header } from '#store/atom/table/types';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import styles from './styles.scss';

interface Params {}
interface OwnProps {
    handleModalClose: () => void;
    title: string;
}
interface State {
}

type Props = NewProps<OwnProps, Params>;

const riverKeySelector = (riverDetail: RealTimeRiverDetails) => riverDetail.id;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    detailRequest: {
        url: '/river/',
        method: methods.GET,
        query: ({ props: { title } }) => ({
            historical: 'true',
            format: 'json',
            title,
        }),
        onSuccess: ({ response }) => {
            // console.warn('response', response);
        },
        onMount: true,
        onPropsChanged: ['title'],
    },
};

class RiverDetails extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.riverHeader = [
            {
                key: 'waterLevelOn',
                label: 'Date',
                order: 1,
                modifier: row => (
                    <FormattedDate
                        value={row.waterLevelOn}
                        mode="yyyy-MM-dd hh:mm aaa"
                    />
                ),
            },
            {
                key: 'waterLevel',
                label: 'Water Level',
                order: 2,
            },
            {
                key: 'warningLevel',
                label: 'Warning Level',
                order: 3,
            },
            {
                key: 'dangerLevel',
                label: 'Danger Level',
                order: 4,
            },
        ];
    }

    private riverHeader: Header<RealTimeRiverDetails>[];

    private getSortedRiverData = memoize((riverDetails: RealTimeRiverDetails[]) => {
        const sortedData = riverDetails.sort((a, b) => compareDate(b.createdOn, a.createdOn));
        return sortedData;
    })

    private getTodaysRiverDetail = memoize((riverDetails: RealTimeRiverDetails[]) => {
        const today = getDate(new Date().getTime());
        const todaysData = riverDetails.filter(
            riverDetail => getDate(riverDetail.waterLevelOn) === today,
        );
        return todaysData;
    })

    private getHourlyRiverData = memoize((riverDetails: RealTimeRiverDetails[]) => {
        const riverWithoutMinutes = riverDetails.map((river) => {
            const {
                waterLevelOn,
            } = river;
            const dateWithoutMinutes = new Date(waterLevelOn).setMinutes(0, 0, 0);
            return {
                ...river,
                waterLevelOn: dateWithoutMinutes,
            };
        });

        const groupedRiver = listToGroupList(riverWithoutMinutes, river => river.waterLevelOn);
        const riverHours = Object.values(groupedRiver)
            .map(river => river[0])
            .filter(v => v !== undefined);

        return riverHours;
    })

    public render() {
        const {
            requests: {
                detailRequest: {
                    response,
                    pending,
                },
            },
            title = '',
            handleModalClose,
        } = this.props;

        let riverDetails: RealTimeRiverDetails[] = [];
        if (!pending && response) {
            const {
                results,
            } = response as MultiResponse<RealTimeRiverDetails>;
            riverDetails = results;
        }

        const sortedRiverDetails = this.getSortedRiverData(riverDetails);
        const latestRiverDetail = sortedRiverDetails[0];
        const todaysRiverDetail = this.getTodaysRiverDetail(sortedRiverDetails);
        const hourlyRiverDetails = this.getHourlyRiverData(todaysRiverDetail);

        return (
            <Modal
                closeOnEscape
                onClose={handleModalClose}
                className={styles.riverDetailModal}
            >
                <ModalHeader
                    title={title}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={handleModalClose}
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    { pending && <LoadingAnimation /> }
                    { latestRiverDetail && (
                        <div className={styles.riverDetails}>
                            <div className={styles.top}>
                                {latestRiverDetail.image ? (
                                    <Image
                                        className={styles.image}
                                        src={latestRiverDetail.image}
                                        alt="image"
                                        zoomable
                                    />
                                ) : (
                                    <div className={styles.noImage}>
                                        Image not available
                                    </div>
                                )}
                                <div className={styles.details}>
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Description"
                                        value={latestRiverDetail.description}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Basin"
                                        value={latestRiverDetail.basin}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Status"
                                        value={latestRiverDetail.status}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Latitude"
                                        value={latestRiverDetail.point.coordinates[1]}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Longitude"
                                        value={latestRiverDetail.point.coordinates[0]}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Flow"
                                        value={latestRiverDetail.steady}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Elevation"
                                        value={latestRiverDetail.elevation}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Water Level"
                                        value={latestRiverDetail.waterLevel}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Danger Level"
                                        value={latestRiverDetail.dangerLevel}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Warning Level"
                                        value={latestRiverDetail.warningLevel}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Measured On"
                                        value={(
                                            <FormattedDate
                                                value={latestRiverDetail.waterLevelOn}
                                                mode="yyyy-MM-dd, hh:mm:aaa"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className={styles.bottom}>
                                <div className={styles.hourlyWaterLevel}>
                                    <header className={styles.header}>
                                        <h4 className={styles.heading}>
                                            Hourly Water Level
                                        </h4>
                                    </header>
                                    <Table
                                        className={styles.content}
                                        data={hourlyRiverDetails}
                                        headers={this.riverHeader}
                                        keySelector={riverKeySelector}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </ModalBody>
            </Modal>
        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(RiverDetails),
);
