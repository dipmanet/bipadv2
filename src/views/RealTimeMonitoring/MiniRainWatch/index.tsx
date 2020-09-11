import React from 'react';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';

import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';
import Table from '#rscv/Table';
import SegmentInput from '#rsci/SegmentInput';

import { Header } from '#store/atom/table/types';
import {
    WaterLevelAverage,
    RealTimeRain,
} from '#store/atom/page/types';

import RainWatch from '../RainWatch';
import { TitleContext } from '#components/TitleContext';

import styles from './styles.scss';

interface Props {
    realTimeRain: RealTimeRain[];
    className?: string;
    onHazardHover: Function;
}
interface State {
    duration: number;
}
interface KeyValue {
    key: number;
    label: string;
}

const durationOptions: KeyValue[] = [
    {
        key: 1,
        label: '1 HR',
    },
    {
        key: 3,
        label: '3 HR',
    },
    {
        key: 6,
        label: '6 HR',
    },
    {
        key: 12,
        label: '12 HR',
    },
    {
        key: 24,
        label: '24 HR',
    },
];

const defaultSort = {
    key: 'status',
    order: 'asc',
};

const durationLabelSelector = (d: KeyValue) => d.label;
const durationKeySelector = (d: KeyValue) => d.key;

const compareIntervalValues = (
    a: WaterLevelAverage[] = [],
    b: WaterLevelAverage[] = [],
    interval: number,
) => {
    const aAverage = a.find(av => av.interval === interval);
    const aValue = aAverage && aAverage.value ? aAverage.value : 0;

    const bAverage = b.find(av => av.interval === interval);
    const bValue = bAverage && bAverage.value ? bAverage.value : 0;

    return compareNumber(aValue, bValue);
};

const ModalButton = modalize(Button);
const rainWatchKeySelector = (station: RealTimeRain) => station.id;

class MiniRainWatch extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            duration: 24,
        };
    }

    public static contextType = TitleContext;

    private getRainHeader = (duration: number) => ([
        {
            key: 'basin',
            label: 'Basin',
            order: 1,
            sortable: true,
            comparator: (a: RealTimeRain, b: RealTimeRain) => compareString(a.basin, b.basin),
            modifier: (row: RealTimeRain) => {
                const { basin } = row;

                return (basin) ? (
                    <div style={{ width: '60px' }}>
                        {basin}
                    </div>
                ) : undefined;
            },
        },
        {
            key: 'title',
            label: 'Station Name',
            order: 2,
            sortable: true,
            comparator: (a: RealTimeRain, b: RealTimeRain) => compareString(a.title, b.title),
        },
        {
            key: 'lastHour',
            label: 'Rainfall',
            order: 5,
            modifier: (row: RealTimeRain) => {
                const {
                    status,
                    averages = [],
                } = row;

                const className = _cs(
                    styles.rainfallValue,
                    status === 'BELOW WARNING LEVEL' && styles.below,
                    status === 'ABOVE WARNING LEVEL' && styles.above,
                    status === 'ABOVE DANGER LEVEL' && styles.danger,
                );

                const average = averages.find(av => av.interval === duration);
                return (average && average.value) ? (
                    <div className={className}>
                        {average.value}
                        mm
                    </div>
                ) : undefined;
            },
            sortable: true,
            comparator: (a: RealTimeRain, b: RealTimeRain) => (
                compareIntervalValues(a.averages, b.averages, duration)
            ),
        },
        {
            key: 'createdOn',
            label: 'Date',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareString(a.createdOn, b.createdOn),
            modifier: (row: RealTimeRain) => {
                const { createdOn } = row;

                return (createdOn) ? (
                    <div style={{ width: '60px' }}>
                        {/* parsing date to appropiate format */}
                        {createdOn.substring(0, createdOn.indexOf('T'))}
                    </div>
                ) : undefined;
            },
        },
        {
            key: 'time',
            label: 'Time',
            order: 4,
            sortable: false,
            modifier: (row: RealTimeRain) => {
                const { createdOn } = row;
                if (createdOn) {
                    const date = new Date(createdOn);
                    return (
                        <div>
                            {/* parsing date to time format */}
                            {date.toISOString().split('T')[1].split('.')[0]}
                        </div>
                    );
                } return undefined;
            },
        },
        {
            key: 'status',
            label: 'Status',
            order: 6,
            sortable: true,
            comparator: (a, b) => compareString(a.status, b.status),
        },
    ]);

    private handleDurationSelect = (duration: number) => {
        this.setState({
            duration,
        });
    }

    private getClassName = (row: RealTimeRain) => {
        const { status } = row;
        if (status === 'BELOW WARNING LEVEL') {
            return styles.below;
        }
        if (status === 'ABOVE WARNING LEVEL') {
            return styles.above;
        }
        if (status === 'ABOVE DANGER LEVEL') {
            return styles.danger;
        }
        return styles.none;
    }

    public render() {
        const {
            className,
            realTimeRain,
            onHazardHover,
        } = this.props;

        const { duration } = this.state;
        const rainHeader: Header<RealTimeRain>[] = this.getRainHeader(duration);
        const { setRealtime } = this.context;

        if (setRealtime) {
            setRealtime((prevProfile: number) => {
                const { duration: selectedHour } = this.state;
                if (prevProfile !== selectedHour) {
                    return selectedHour;
                }
                return prevProfile;
            });
        }

        return (
            <div className={_cs(className, styles.rainWatch)}>
                <header className={styles.header}>
                    <SegmentInput
                        label="Time range"
                        className={styles.durationInput}
                        options={durationOptions}
                        value={duration}
                        onChange={this.handleDurationSelect}
                        keySelector={durationKeySelector}
                        labelSelector={durationLabelSelector}
                        showLabel={false}
                        showHintAndError={false}
                    />
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        iconName="table"
                        title="Show all data"
                        modal={(
                            <RainWatch
                                realTimeRain={realTimeRain}
                            />
                        )}
                    />
                </header>
                <div className={styles.tableContainer}>
                    <Table
                        rowClassNameSelector={this.getClassName}
                        className={styles.rainWatchTable}
                        data={realTimeRain}
                        headers={rainHeader}
                        keySelector={rainWatchKeySelector}
                        onBodyHover={(id: number) => onHazardHover(id)}
                        onBodyHoverOut={() => onHazardHover()}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

export default MiniRainWatch;
