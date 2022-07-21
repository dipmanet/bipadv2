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
import { timeFormat } from 'd3-time-format';

import { Translation } from 'react-i18next';
import Message from '#rscv/Message';
import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import Image from '#rsu/../v2/View/Image';
import FormattedDate from '#rscv/FormattedDate';
import TextOutput from '#components/TextOutput';
import LoadingAnimation from '#rscv/LoadingAnimation';
import MultiLineChart from '#rscz/MultiLineChart';
import Legend from '#rscz/Legend';

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

interface Params { }
interface OwnProps {
    handleModalClose: () => void;
    title: string;
    className?: string;
}
interface State { }

interface LegendItem {
    key: string;
    label: string;
    color: string;
    language: string;
}

const RainEmptyComponent = () => (
    <Message>
        Data is currently not available
    </Message>
);

const RainEmptyComponentNe = () => (
    <Message>
        डाटा हाल उपलब्ध छैन
    </Message>
);


const rainLegendData: LegendItem[] = language => ([
    { key: 'averages', label: language === 'en' ? 'Average Rainfall (mm)' : 'औसत वर्षा (मिमी)', color: '#7fc97f' },
]);

const labelSelector = (d: LegendItem) => d.label;
const keySelector = (d: LegendItem) => d.label;
const colorSelector = (d: LegendItem) => d.color;

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

        const { language } = this.props;

        this.latestWaterLevelHeader = [
            {
                key: 'interval',
                label: language === 'en' ? 'INTERVAL' : 'अन्तराल',
                order: 1,
            },
            {
                key: 'value',
                label: language === 'en' ? 'VALUE (mm)' : 'VALUE (मिमी)',
                order: 2,
                modifier: row => `${row.value || '-'}`,
            },
            {
                key: 'status',
                label: language === 'en' ? 'STATUS' : 'स्थिति',
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
                label: language === 'en' ? 'DATE' : 'मिति',
                order: 1,
                modifier: row => (
                    <FormattedDate
                        value={row.createdOn}
                        language={language}
                        mode="yyyy-MM-dd, hh:mm aaa"
                    />
                ),
            },
            {
                key: 'averages',
                label: language === 'en' ? 'AVERAGE RAINFALL (mm)' : 'औसत वर्षा (मिमी)',
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

    private getWeeklyRainDetails = memoize((rainDetails: RealTimeRainDetails[]) => {
        const today = new Date().getTime();
        const filtered = rainDetails.filter(
            rainDetail => (getDifferenceInDays(rainDetail.createdOn, today) < 8),
        );

        const groupedRain = listToGroupList(
            filtered,
            rain => new Date(rain.createdOn).setHours(0, 0, 0, 0),
        );

        interface Series {
            name: string;
            color: string;
            values: number[];
        }

        const data: Series = { name: 'Average Rainfall (mm)', color: '#7fc97f', values: [] };
        const dates: number[] = [];

        Object.entries(groupedRain).forEach(([key, values]) => {
            const value = values.reduce(
                (prev, curr) => (prev.createdOn > curr.createdOn ? prev : curr),
            );
            const latestAverageValue = value.averages.reduce(
                (prev, curr) => (prev.interval > curr.interval ? prev : curr),
            );
            data.values.push(latestAverageValue.value || 0);
            dates.push(+key);
        });
        const series = [
            data,
        ];
        return ({ series, dates });
    });

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

    private getHourlyChartData = memoize((rainDetails: RealTimeRainDetails[]) => {
        interface ChartData {
            createdOn: number[];
            averageRainfall: number[];
        }

        const initialChartData: ChartData = {
            averageRainfall: [],
            createdOn: [],
        };

        const data = rainDetails.reduce((acc, rain) => {
            const {
                averages,
                createdOn: co,
            } = rain;

            const hourlyAverage = averages.find(av => av.interval === 1);
            const rainfall = hourlyAverage && hourlyAverage.value ? hourlyAverage.value : 0;
            if (co) {
                const {
                    averageRainfall,
                    createdOn,
                } = acc;

                averageRainfall.push(rainfall);
                createdOn.push(co);
            }

            return acc;
        }, initialChartData);

        const { averageRainfall, createdOn } = data;
        const series = [
            {
                name: 'Average Rainfall (mm)',
                color: '#7fc97f',
                values: averageRainfall,
            },
        ];

        return ({ series, dates: createdOn });
    });

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
            language,
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
        const hourlyRainChartData = this.getHourlyChartData(hourlyRainDetails);
        const weeklyRainChartData = this.getWeeklyRainDetails(rainDetails);

        return (
            <Translation>
                {
                    t => (
                        <Modal
                            // closeOnEscape
                            // onClose={handleModalClose}
                            className={_cs(className, styles.rainDetailModal,
                                language === 'np' && styles.languageFont)}
                        >
                            <ModalHeader
                                title={title}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={handleModalClose}
                                        title={t('Close Modal')}
                                    />
                                )}
                            />
                            <ModalBody className={styles.body}>
                                {pending && <LoadingAnimation />}
                                {latestRainDetail && (
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
                                                    {t('Image not available')}
                                                </div>
                                            )}
                                            <div className={styles.details}>
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Description')}
                                                    value={latestRainDetail.description}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Basin')}
                                                    value={latestRainDetail.basin}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Status')}
                                                    value={latestRainDetail.status}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Latitude')}
                                                    value={latestRainDetail.point.coordinates[1]}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Longitude')}
                                                    value={latestRainDetail.point.coordinates[0]}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Measured On')}
                                                    value={(
                                                        <FormattedDate
                                                            value={latestRainDetail.createdOn}
                                                            language={language}
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
                                                        {t('Latest Rainfall')}
                                                    </h4>
                                                </header>
                                                <div className={styles.content}>
                                                    <Table
                                                        className={styles.table}
                                                        data={latestRainDetail.averages}
                                                        headers={this.latestWaterLevelHeader}
                                                        keySelector={waterLevelKeySelector}
                                                        emptyComponent={language === 'en'
                                                            ? RainEmptyComponent
                                                            : RainEmptyComponentNe}
                                                    />
                                                    <div className={styles.chartContainer}>
                                                        <header className={styles.header}>
                                                            <h4 className={styles.heading}>
                                                                {t('Average Weekly Rainfall')}
                                                            </h4>
                                                        </header>
                                                        <MultiLineChart
                                                            className={styles.rainChart}
                                                            data={weeklyRainChartData}
                                                        />
                                                        <Legend
                                                            className={styles.rainChartLegend}
                                                            colorSelector={colorSelector}
                                                            data={rainLegendData(language)}
                                                            keySelector={keySelector}
                                                            labelSelector={labelSelector}
                                                            itemClassName={styles.legendItem}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.accumulatedRainfall}>
                                                <header className={styles.header}>
                                                    <h4 className={styles.heading}>
                                                        {t('Accumulated Rainfall')}
                                                    </h4>
                                                </header>
                                                <div className={styles.content}>
                                                    <Table
                                                        className={styles.table}
                                                        data={hourlyRainDetails}
                                                        headers={this.rainHeader}
                                                        keySelector={rainKeySelector}
                                                    />
                                                    <div className={styles.chartContainer}>
                                                        <header className={styles.header}>
                                                            <h4 className={styles.heading}>
                                                                {t('Average Daily Rainfall')}
                                                            </h4>
                                                        </header>
                                                        <MultiLineChart
                                                            className={styles.rainChart}
                                                            data={hourlyRainChartData}
                                                            tickArguments={[8, timeFormat('%I %p')]}
                                                        />
                                                        <Legend
                                                            className={styles.rainChartLegend}
                                                            colorSelector={colorSelector}
                                                            data={rainLegendData(language)}
                                                            keySelector={keySelector}
                                                            labelSelector={labelSelector}
                                                            itemClassName={styles.legendItem}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                        </Modal>
                    )
                }
            </Translation>

        );
    }
}

export default createConnectedRequestCoordinator<OwnProps>()(
    createRequestClient(requests)(RainDetails),
);
