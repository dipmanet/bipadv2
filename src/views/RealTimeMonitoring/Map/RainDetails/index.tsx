import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    getDate,
    listToGroupList,
    isDefined,
    mapToList,
} from '@togglecorp/fujs';

import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import Image from '#rsu/../v2/View/Image';
import FormattedDate from '#rscv/FormattedDate';
import TextOutput from '#components/TextOutput';
import LoadingAnimation from '#rscv/LoadingAnimation';

import {
    RealTimeRainDetails,
    WaterLevelAverage,
} from '#store/atom/page/types';
import { Header } from '#store/atom/table/types';
import { MultiResponse } from '#store/atom/response/types';
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
    className?: string;
}
interface State {}

type Props = NewProps<OwnProps, Params>;

const waterLevelKeySelector = (waterLevel: WaterLevelAverage) => waterLevel.interval;
const rainKeySelector = (rain: RealTimeRainDetails) => rain.id;

const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    detailRequest: {
        url: '/rain/',
        method: methods.GET,
        query: ({ props: { title } }) => ({
            historical: 'true',
            format: 'json',
            title,
        }),
        onMount: true,
        onPropsChanged: ['title'],
    },
};

const emptyArray: any[] = [];

class RainDetails extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.latestWaterLevelHeader = [
            {
                key: 'interval',
                label: 'Interval',
                order: 1,
            },
            {
                key: 'value',
                label: 'Value (mm)',
                order: 2,
                modifier: row => `${row.value || '-'}`,
            },
            {
                key: 'status',
                label: 'Status',
                order: 3,
                modifier: (row) => {
                    const {
                        danger: dangerStatus,
                        warning: warningStatus,
                    } = row.status;

                    if (dangerStatus && warningStatus) {
                        return 'danger, warning';
                    }
                    if (dangerStatus) {
                        return 'danger';
                    }
                    if (warningStatus) {
                        return 'warning';
                    }
                    return null;
                },
            },
        ];

        this.rainHeader = [
            {
                key: 'createdOn',
                label: 'Date',
                order: 1,
                modifier: row => (
                    <FormattedDate
                        value={row.createdOn}
                        mode="yyyy-MM-dd, hh:mm aaa"
                    />
                ),
            },
            {
                key: 'averages',
                label: 'Average Rainfall (mm)',
                order: 2,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 1);
                    return average ? average.value : undefined;
                },
            },
        ];
    }

    private latestWaterLevelHeader: Header<WaterLevelAverage>[];

    private rainHeader: Header<RealTimeRainDetails>[];

    private getSortedRainData = memoize((rainDetails: RealTimeRainDetails[]) => {
        const sortedData = [...rainDetails].sort((a, b) => compareDate(b.createdOn, a.createdOn));
        return sortedData;
    })

    private getTodaysRainDetails = memoize((rainDetails: RealTimeRainDetails[]) => {
        const today = getDate(new Date().getTime());
        const todaysData = rainDetails.filter(
            rainDetail => getDate(rainDetail.createdOn) === today,
        );
        return todaysData;
    })

    private getHourlyRainData = memoize((rainDetails: RealTimeRainDetails[]) => {
        const rainWithoutMinutes = rainDetails.map((rain) => {
            const {
                createdOn,
            } = rain;
            const dateWithoutMinutes = new Date(createdOn).setMinutes(0, 0, 0);
            return {
                ...rain,
                createdOn: dateWithoutMinutes,
            };
        });

        const groupedRain = listToGroupList(
            rainWithoutMinutes,
            rain => rain.createdOn,
        );
        const rainHours = mapToList(
            groupedRain,
            value => value[0],
        ).filter(isDefined);

        return rainHours;
    })

    public render() {
        const {
            requests: {
                detailRequest: {
                    response,
                    pending,
                },
            },
            title,
            handleModalClose,
            className,
        } = this.props;

        let rainDetails: RealTimeRainDetails[] = emptyArray;
        if (!pending && response) {
            const {
                results,
            } = response as MultiResponse<RealTimeRainDetails>;
            rainDetails = results;
        }

        const sortedRainDetails = this.getSortedRainData(rainDetails);
        const todaysRainDetails = this.getTodaysRainDetails(sortedRainDetails);
        const latestRainDetail = sortedRainDetails[0];
        const hourlyRainDetails = this.getHourlyRainData(todaysRainDetails);

        return (
            <Modal
                closeOnEscape
                onClose={handleModalClose}
                className={_cs(className, styles.rainDetailModal)}
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
                    { latestRainDetail && (
                        <div className={styles.rainDetails}>
                            <div className={styles.top}>
                                {latestRainDetail.image ? (
                                    <Image
                                        className={styles.image}
                                        src={latestRainDetail.image}
                                        alt="rain-image"
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
                                        value={latestRainDetail.description}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Basin"
                                        value={latestRainDetail.basin}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Status"
                                        value={latestRainDetail.status}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Latitude"
                                        value={latestRainDetail.point.coordinates[1]}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Longitude"
                                        value={latestRainDetail.point.coordinates[0]}
                                    />
                                    <TextOutput
                                        className={styles.detail}
                                        labelClassName={styles.label}
                                        valueClassName={styles.value}
                                        label="Measured On"
                                        value={(
                                            <FormattedDate
                                                value={latestRainDetail.createdOn}
                                                mode="yyyy-MM-dd, hh:mm:aaa"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className={styles.bottom}>
                                <div className={styles.latestRainfall}>
                                    <header className={styles.header}>
                                        <h4 className={styles.heading}>
                                            Latest Rainfall
                                        </h4>
                                    </header>
                                    <Table
                                        className={styles.content}
                                        data={latestRainDetail.averages}
                                        headers={this.latestWaterLevelHeader}
                                        keySelector={waterLevelKeySelector}
                                    />
                                </div>
                                <div className={styles.accumulatedRainfall}>
                                    <header className={styles.header}>
                                        <h4 className={styles.heading}>
                                            Accumulated Rainfall
                                        </h4>
                                    </header>
                                    <Table
                                        className={styles.content}
                                        data={hourlyRainDetails}
                                        headers={this.rainHeader}
                                        keySelector={rainKeySelector}
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
    createRequestClient(requests)(RainDetails),
);
