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
    title: string;
}
interface State {}

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
            console.warn('response', response);
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
                        mode="yyyy-MM-dd hh:mm:aaa"
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
            <>
                <Loading pending={pending} />
                {latestRiverDetail && (
                    <div className={styles.details}>
                        <h3>
                            {latestRiverDetail.title}
                        </h3>
                        {latestRiverDetail.image && (
                            <Image
                                src={latestRiverDetail.image}
                                alt="image"
                            />
                        )}
                        <TextOutput
                            label="Description"
                            value={latestRiverDetail.description}
                        />
                        <TextOutput
                            label="Basin"
                            value={latestRiverDetail.basin}
                        />
                        <TextOutput
                            label="Status"
                            value={latestRiverDetail.status}
                        />
                        <TextOutput
                            label="Latitude"
                            value={latestRiverDetail.point.coordinates[1]}
                        />
                        <TextOutput
                            label="Longitude"
                            value={latestRiverDetail.point.coordinates[0]}
                        />
                        <TextOutput
                            label="Flow"
                            value={latestRiverDetail.steady}
                        />
                        <TextOutput
                            label="Elevation"
                            value={latestRiverDetail.elevation}
                        />
                        <TextOutput
                            label="Water Level"
                            value={latestRiverDetail.waterLevel}
                        />
                        <TextOutput
                            label="Danger Level"
                            value={latestRiverDetail.dangerLevel}
                        />
                        <TextOutput
                            label="Warning Level"
                            value={latestRiverDetail.warningLevel}
                        />
                        <TextOutput
                            label="Measured On"
                            value={(
                                <FormattedDate
                                    value={latestRiverDetail.waterLevelOn}
                                    mode="yyyy-MM-dd hh:mm:aaa"
                                />
                            )}
                        />
                        <div>
                            <h4>
                                Hourly Water Level
                            </h4>
                            <Table
                                data={hourlyRiverDetails}
                                headers={this.riverHeader}
                                keySelector={riverKeySelector}
                            />
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(RiverDetails),
);
