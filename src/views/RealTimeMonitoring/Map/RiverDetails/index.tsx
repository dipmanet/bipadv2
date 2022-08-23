/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    compareDate,
    getDate,
    listToGroupList,
    mapToList,
    isDefined,
} from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import Message from '#rscv/Message';
import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';
import Image from '#rscv/Image';
import FormattedDate from '#rscv/FormattedDate';
import TextOutput from '#components/TextOutput';
import LoadingAnimation from '#rscv/LoadingAnimation';
import Legend from '#rscz/Legend';
import MultiLineChart from '#rscz/MultiLineChart';

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

import Graph from '#views/DataArchive/Modals/Riverwatch/Graph';
import { groupList } from '#utils/common';
import {
    parsePeriod, getChartData,
    arraySorter, isEqualObject,
    parseInterval,
} from '#views/DataArchive/Modals/Riverwatch/utils';
import TableView from '#views/DataArchive/Modals/Riverwatch/TableView';
import styles from './styles.scss';
import PeriodSelector from '#views/DataArchive/Modals/Riverwatch/Filters/PeriodSelector';


interface Params { }
interface OwnProps {
    handleModalClose: () => void;
    title: string;
}
interface State {
}
interface LegendItem {
    key: string;
    label: string;
    color: string;
    language: string;
}

const RiverEmptyComponentNe = () => (
    <Message>
        डाटा हाल उपलब्ध छैन
    </Message>
);

const riverLegendData: LegendItem[] = language => ([
    { key: 'waterLevel', label: language === 'en' ? 'Water Level' : 'पानीको तह', color: '#4daf4a' },
    { key: 'warningLevel', label: language === 'en' ? 'Warning Level' : 'चेतावनी स्तर', color: '#377eb8' },
    { key: 'dangerLevel', label: language === 'en' ? 'Danger Level' : 'खतरा स्तर', color: '#e41a1c' },
]);

type Props = NewProps<OwnProps, Params>;


const requests: { [key: string]: ClientAttributes<OwnProps, Params> } = {
    detailRequest: {
        url: '/river/',
        method: methods.GET,
        // query: ({ props: { title } }) => ({
        //     historical: 'true',
        //     format: 'json',
        //     title,
        // }),
        query: ({ params, props: { title } }) => {
            if (!params || !params.dataDateRange) {
                return undefined;
            }
            const { startDate, endDate } = params.dataDateRange;
            return {
                title,
                historical: 'true',
                format: 'json',
                // eslint-disable-next-line @typescript-eslint/camelcase
                water_level_on__gt: `${startDate}T00:00:00+05:45`,
                // eslint-disable-next-line @typescript-eslint/camelcase
                water_level_on__lt: `${endDate}T23:59:59+05:45`,
                fields: [
                    'id',
                    'created_on',
                    'title',
                    'basin',
                    'point',
                    'image',
                    'water_level',
                    'danger_level',
                    'warning_level',
                    'water_level_on',
                    'status',
                    'steady',
                    'description',
                    'station',
                ],
                limit: -1,
            };
        },
        onMount: false,
        onPropsChanged: ['title'],
    },
};

class RiverDetails extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            filterValues: {
                dataDateRange: {
                    startDate: new Date(new Date().setDate(new Date()
                        .getDate() - 3)).toJSON().slice(0, 10).replace(/-/g, '-'),
                    endDate: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
                },
                period: { periodCode: 'minute' },
            },
            riverDetails: [],
            filterwiseChartData: [],
            isInitial: true,
        };
        const { language } = this.props;

        this.riverHeader = [
            {
                key: 'waterLevelOn',
                label: language === 'en' ? 'Date' : 'मिति',
                order: 1,
                modifier: row => (
                    <FormattedDate
                        value={row.waterLevelOn}
                        language={language}
                        mode="yyyy-MM-dd hh:mm aaa"
                    />
                ),
            },
            {
                key: 'waterLevel',
                label: language === 'en' ? 'Water Level' : 'पानीको तह',
                order: 2,
            },
            {
                key: 'warningLevel',
                label: language === 'en' ? 'Warning Level' : 'चेतावनी स्तर',
                order: 3,
            },
            {
                key: 'dangerLevel',
                label: language === 'en' ? 'Danger Level' : 'खतरा स्तर',
                order: 4,
            },
        ];
    }

    public componentDidMount() {
        const { requests: {
            detailRequest,
        } } = this.props;
        const { filterValues } = this.state;
        const { dataDateRange } = filterValues;
        detailRequest.do({ dataDateRange });
    }

    public componentDidUpdate(prevProps, prevState) {
        const initialFaramValue = {
            dataDateRange: {
                startDate: '',
                endDate: '',
            },
            period: {},
        };

        if (prevState.filterValues !== this.state.filterValues
            || prevState.riverDetails !== this.state.riverDetails) {
            const { riverDetails } = this.state;
            // const rainDataWithParameter = parseInterval(riverDetails);
            const riverDataWithPeriod = parsePeriod(riverDetails);

            const minuteWiseGroup = groupList(
                riverDataWithPeriod.filter(r => r.dateWithMinute),
                river => river.dateWithMinute,
            );
            const hourWiseGroup = groupList(
                riverDataWithPeriod.filter(r => r.dateWithHour),
                river => river.dateWithHour,
            );
            const dailyWiseGroup = groupList(
                riverDataWithPeriod.filter(r => r.dateOnly),
                river => river.dateOnly,
            );

            let filterWiseChartData;

            const {
                period: { periodCode },
            } = this.state.filterValues;


            if (periodCode === 'minute') {
                filterWiseChartData = getChartData(minuteWiseGroup, 'minuteName');
            }
            if (periodCode === 'hourly') {
                filterWiseChartData = getChartData(hourWiseGroup, 'hourName');
            }
            if (periodCode === 'daily') {
                filterWiseChartData = getChartData(dailyWiseGroup, 'dateName');
            }

            if (filterWiseChartData) {
                filterWiseChartData.sort(arraySorter);
                this.setState({ filterWiseChartData: filterWiseChartData.sort(arraySorter) });
            }
            // eslint-disable-next-line react/destructuring-assignment,, react/no-access-state-in-setstate
            const isInitialCheck = isEqualObject(initialFaramValue, this.state.filterValues);
            this.setState({ isInitial: isInitialCheck });
        }
    }

    private riverHeader: Header<RealTimeRiverDetails>[];

    private getSortedRiverData = memoize((riverDetails: RealTimeRiverDetails[]) => {
        const sortedData = [...riverDetails].sort((a, b) => compareDate(b.createdOn, a.createdOn));
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

        const groupedRiver = listToGroupList(
            riverWithoutMinutes,
            river => river.waterLevelOn,
        );
        const riverHours = mapToList(
            groupedRiver,
            value => value[0],
        ).filter(isDefined);

        return riverHours;
    })

    private handlePeriodChange = (periodName: string) => {
        this.setState(prevState => ({
            ...prevState,
            filterValues: {
                dataDateRange: {
                    startDate: new Date(new Date().setDate(new Date()
                        .getDate() - 3)).toJSON().slice(0, 10).replace(/-/g, '-'),
                    endDate: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
                },
                period: { periodCode: periodName ? periodName.periodCode : 'minute' },
            },
        }));
    };

    private getHourlyChartData = memoize((riverDetails: RealTimeRiverDetails[]) => {
        interface ChartData {
            waterLevelOn: number[];
            waterLevel: number[];
            warningLevel: number[];
            dangerLevel: number[];
        }
        const initialChartData: ChartData = {
            waterLevelOn: [],
            waterLevel: [],
            warningLevel: [],
            dangerLevel: [],
        };
        const data = riverDetails.reduce((acc, river) => {
            const {
                waterLevelOn: wo,
                waterLevel: wl = 0,
                warningLevel: warl = 0,
                dangerLevel: dl = 0,
            } = river;

            const {
                waterLevelOn,
                waterLevel,
                warningLevel,
                dangerLevel,
            } = acc;

            if (waterLevelOn) {
                waterLevelOn.push(wo);
                waterLevel.push(wl);
                warningLevel.push(warl);
                dangerLevel.push(dl);
            }
            return acc;
        }, initialChartData);
        const { waterLevelOn, ...others } = data;
        const series = Object.entries(others).map(([key, value]) => {
            const legendItem = riverLegendData().find(rl => rl.key === key);
            const color = legendItem ? legendItem.color : '#4daf4a';

            return ({
                name: key,
                values: value,
                color,
            });
        });
        const dates = waterLevelOn;

        return ({ series, dates });
    })

    public render() {
        // const initialFaramValue = {
        //     dataDateRange: {
        //         startDate: '',
        //         endDate: '',
        //     },
        //     period: {},
        // };
        const {
            requests: {
                detailRequest: {
                    response,
                    pending,
                },
            },
            title = '',
            handleModalClose,
            language,
        } = this.props;

        const { filterValues,
            filterWiseChartData,
            intervalCode,
            isInitial } = this.state;

        let riverDetails: RealTimeRiverDetails[] = [];
        if (!pending && response) {
            const {
                results,
            } = response as MultiResponse<RealTimeRiverDetails>;
            riverDetails = results;
            this.setState({ riverDetails });
        }

        const {
            period: { periodCode },
        } = this.state.filterValues;

        const sortedRiverDetails = this.getSortedRiverData(riverDetails);
        const latestRiverDetail = sortedRiverDetails[0];
        const todaysRiverDetail = this.getTodaysRiverDetail(sortedRiverDetails);
        const hourlyRiverDetails = this.getHourlyRiverData(todaysRiverDetail);
        const hourlyRiverChartData = this.getHourlyChartData(hourlyRiverDetails);
        console.log('filterWiseChartData', filterWiseChartData);

        return (
            <Translation>
                {
                    t => (
                        <Modal
                            // closeOnEscape
                            // onClose={handleModalClose}
                            className={_cs(styles.riverDetailModal, language === 'np' && styles.languageFont)}
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
                                {pending && <LoadingAnimation />}
                                {latestRiverDetail && (
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
                                                    {t('Image not available')}
                                                </div>
                                            )}
                                            <div className={styles.details}>
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Description')}
                                                    value={latestRiverDetail.description}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Basin')}
                                                    value={latestRiverDetail.basin}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Status')}
                                                    value={latestRiverDetail.status}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Latitude')}
                                                    value={latestRiverDetail.point.coordinates[1]}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Longitude')}
                                                    value={latestRiverDetail.point.coordinates[0]}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Flow')}
                                                    value={latestRiverDetail.steady}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Elevation')}
                                                    value={latestRiverDetail.elevation}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Water Level')}
                                                    value={latestRiverDetail.waterLevel}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Danger Level')}
                                                    value={latestRiverDetail.dangerLevel}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Warning Level')}
                                                    value={latestRiverDetail.warningLevel}
                                                />
                                                <TextOutput
                                                    className={styles.detail}
                                                    labelClassName={styles.label}
                                                    valueClassName={styles.value}
                                                    label={t('Measured On')}
                                                    value={(
                                                        <FormattedDate
                                                            value={latestRiverDetail.waterLevelOn}
                                                            mode="yyyy-MM-dd, hh:mm:aaa"
                                                            language={language}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.bottom}>
                                            <div className={styles.hourlyWaterLevel}>
                                                <header className={styles.header}>
                                                    <h4 className={styles.heading}>
                                                        {t('Hourly Water Level')}
                                                    </h4>
                                                </header>
                                                <Table
                                                    className={styles.content}
                                                    data={hourlyRiverDetails}
                                                    headers={this.riverHeader}
                                                    keySelector={riverKeySelector}
                                                    emptyComponent={language === 'en'
                                                        ? RiverEmptyComponent
                                                        : RiverEmptyComponentNe}
                                                />
                                            </div>
                                            <div className={styles.waterLevelChartContainer}>
                                                <MultiLineChart
                                                    className={styles.riverChart}
                                                    data={hourlyRiverChartData}
                                                />
                                                <Legend
                                                    className={styles.riverChartLegend}
                                                    colorSelector={colorSelector}
                                                    data={riverLegendData(language)}
                                                    keySelector={keySelector}
                                                    labelSelector={labelSelector}
                                                    itemClassName={styles.legendItem}
                                                />
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
    createRequestClient(requests)(RiverDetails),
);
