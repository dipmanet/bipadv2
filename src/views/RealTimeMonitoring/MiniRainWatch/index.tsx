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
import styles from './styles.scss';

interface Props {
    realTimeRain: RealTimeRain[];
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

const durationLabelSelector = (d: KeyValue) => d.label;
const durationKeySelector = (d: KeyValue) => d.key;

const compareIntervalValues = (
    a: WaterLevelAverage[] = [],
    b: WaterLevelAverage[] = [],
    interval: number,
) => {
    const aAverage = a.find(av => av.interval === interval);
    const aValue = aAverage ? aAverage.value : 0;

    const bAverage = b.find(av => av.interval === interval);
    const bValue = bAverage ? bAverage.value : 0;

    return compareNumber(aValue, bValue);
};

const ModalButton = modalize(Button);
const rainWatchKeySelector = (station: RealTimeRain) => station.id;

class MiniRainWatch extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            duration: 1,
        };
    }

    private getRainHeader = (duration: number) => ([
        {
            key: 'title',
            label: 'Station Name',
            order: 1,
            sortable: true,
            comparator: (a: RealTimeRain, b: RealTimeRain) => compareString(a.title, b.title),
        },
        {
            key: 'lastHour',
            label: 'Rainfall',
            order: 2,
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
    ]);

    private handleDurationSelect = (duration: number) => {
        this.setState({
            duration,
        });
    }

    public render() {
        const {
            realTimeRain,
        } = this.props;

        const { duration } = this.state;
        const rainHeader: Header<RealTimeRain>[] = this.getRainHeader(duration);

        return (
            <div className={styles.rainWatch}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Rain Watch
                    </h4>
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        modal={(
                            <RainWatch
                                realTimeRain={realTimeRain}
                            />
                        )}
                    >
                        Show all
                    </ModalButton>
                </header>
                <SegmentInput
                    className={styles.input}
                    options={durationOptions}
                    value={duration}
                    onChange={this.handleDurationSelect}
                    keySelector={durationKeySelector}
                    labelSelector={durationLabelSelector}
                />
                <Table
                    className={styles.rainWatchTable}
                    data={realTimeRain}
                    headers={rainHeader}
                    keySelector={rainWatchKeySelector}
                />
            </div>
        );
    }
}

export default MiniRainWatch;
