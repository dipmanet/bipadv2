import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    getDate,
    listToGroupList,
} from '@togglecorp/fujs';

import Table from '#rscv/Table';
import Image from '#rscv/Image';
import FormattedDate from '#rscv/FormattedDate';
import TextOutput from '#components/TextOutput';
import Loading from '#components/Loading';
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
    title: string;
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
        onSuccess: ({ response }) => {
            console.warn('response', response);
        },
        onMount: true,
        onPropsChanged: ['title'],
    },
};

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
                    return `${dangerStatus ? 'danger' : ''}${warningStatus ? 'warning' : ''}`;
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
                        mode="yyyy-MM-dd hh:mm:aaa"
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
                    return averages.find(average => average.interval === 1).value || '';
                },
            },
        ];
    }

    private latestWaterLevelHeader: Header<WaterLevelAverage>[];

    private rainHeader: Header<RealTimeRainDetails>[];

    private getSortedRainData = memoize((rainDetails: RealTimeRainDetails[]) => {
        const sortedData = rainDetails.sort((a, b) => compareDate(b.createdOn, b.createdOn));
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
        const groupedRain = listToGroupList(rainWithoutMinutes, rain => rain.createdOn);
        const rainHours = Object.values(groupedRain)
            .map(rain => rain[0])
            .filter(v => v !== undefined);

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
        } = this.props;

        let rainDetails: RealTimeRainDetails[] = [];
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
            <>
                <Loading pending={pending} />
                {
                    latestRainDetail && (
                        <div>
                            <h3>
                                {latestRainDetail.title}
                            </h3>
                            {latestRainDetail.image && (
                                <Image
                                    src={latestRainDetail.image}
                                    alt="image"
                                />
                            )}
                            <TextOutput
                                label="Description"
                                value={latestRainDetail.description}
                            />
                            <TextOutput
                                label="Basin"
                                value={latestRainDetail.basin}
                            />
                            <TextOutput
                                label="Status"
                                value={latestRainDetail.status}
                            />
                            <TextOutput
                                label="Latitude"
                                value={latestRainDetail.point.coordinates[1]}
                            />
                            <TextOutput
                                label="Longitude"
                                value={latestRainDetail.point.coordinates[0]}
                            />
                            <TextOutput
                                label="Measured On"
                                value={(
                                    <FormattedDate
                                        value={latestRainDetail.createdOn}
                                        mode="yyyy-MM-dd hh:mm:aaa"
                                    />
                                )}
                            />
                            <div>
                                <h4>
                                    Latest Rainfall
                                </h4>
                                <Table
                                    data={latestRainDetail.averages}
                                    headers={this.latestWaterLevelHeader}
                                    keySelector={waterLevelKeySelector}
                                />
                            </div>
                            <div>
                                <h4>
                                    Accumulated Rainfall
                                </h4>
                                <Table
                                    data={hourlyRainDetails}
                                    headers={this.rainHeader}
                                    keySelector={rainKeySelector}
                                />
                            </div>
                        </div>
                    )}
            </>
        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(RainDetails),
);
