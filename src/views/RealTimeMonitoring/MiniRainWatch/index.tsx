import React from 'react';
import { connect } from 'react-redux';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';

import { compose, Dispatch } from 'redux';
import { Translation } from 'react-i18next';
import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';
import Table from '#rscv/Table';
import SegmentInput from '#rsci/SegmentInput';

import { Header } from '#store/atom/table/types';
import {
    WaterLevelAverage,
    RealTimeRain,
} from '#store/atom/page/types';

import { languageSelector, realTimeDurationSelector } from '#selectors';

import { TitleContext } from '#components/TitleContext';
import { AppState } from '#store/types';

import { convertDateAccToLanguage } from '#utils/common';


import {
    setRealTimeDurationAction,
} from '#actionCreators';
import styles from './styles.scss';
import RainWatch from '../RainWatch';

interface Props {
    realTimeRain: RealTimeRain[];
    className?: string;
    onHazardHover: Function;
    language: { language: 'en' | 'np' };
}
interface State {
    duration: number;
}
interface KeyValue {
    key: number;
    label: string;
}
interface PropsFromDispatch {
    setRealTimeDuration: typeof setRealTimeDurationAction;
}

interface PropsFromState {
    duration: PageType.Duration;
}

const mapStateToProps = (state: AppState): PropsFromState => ({
    language: languageSelector(state),
    duration: realTimeDurationSelector(state),
});

const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    setRealTimeDuration: params => dispatch(setRealTimeDurationAction(params)),

});

const durationOptions = language => (
    [
        {
            key: 1,
            label: language === 'en' ? '1 HR' : '१ घण्टा',

        },
        {
            key: 3,
            label: language === 'en' ? '3 HR' : '३ घण्टा',

        },
        {
            key: 6,
            label: language === 'en' ? '6 HR' : '६ घण्टा',

        },
        {
            key: 12,
            label: language === 'en' ? '12 HR' : '१२ घण्टा',

        },
        {
            key: 24,
            label: language === 'en' ? '24 HR' : '२४ घण्टा',

        },
    ]
);


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
    // public constructor(props: Props) {
    //     super(props);

    //     // this.state = {
    //     //     duration: 24,
    //     // };
    // }

    public static contextType = TitleContext;

    private getRainHeader = (duration: number, language: string) => ([
        {
            key: 'basin',
            label: language === 'en' ? 'Basin' : 'बेसिन',
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
            label: language === 'en' ? 'Station Name' : 'स्टेशनको नाम',
            order: 2,
            sortable: true,
            comparator: (a: RealTimeRain, b: RealTimeRain) => compareString(a.title, b.title),
        },
        {
            key: 'lastHour',
            label: language === 'en' ? 'Rainfall' : 'वर्षा',
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
                        {language === 'en' ? 'mm' : 'मिमि'}
                    </div>
                ) : undefined;
            },
            sortable: true,
            comparator: (a: RealTimeRain, b: RealTimeRain) => (
                compareIntervalValues(a.averages, b.averages, duration)
            ),
        },
        {
            key: 'modifiedOn',
            label: language === 'en' ? 'Date' : 'मिति',
            order: 3,
            sortable: true,
            comparator: (a, b) => compareString(a.modifiedOn, b.modifiedOn),
            modifier: (row: RealTimeRain) => {
                const { modifiedOn } = row;

                return (modifiedOn) ? (
                    <div style={{ width: '60px' }}>
                        {/* parsing date to appropiate format */}
                        {convertDateAccToLanguage(modifiedOn.substring(0, modifiedOn.indexOf('T')), language)}
                    </div>
                ) : undefined;
            },
        },
        {
            key: 'time',
            label: language === 'en' ? 'Time' : 'समय',
            order: 4,
            sortable: false,
            modifier: (row: RealTimeRain) => {
                const { modifiedOn } = row;
                if (modifiedOn) {
                    // const date = new Date(modifiedOn);
                    return (
                        <div>
                            {/* parsing date to time format */}
                            {/* {date.toISOString().split('T')[1].split('.')[0]} */}
                            {modifiedOn.split('T')[1].split('.')[0]}
                        </div>
                    );
                } return undefined;
            },
        },
        {
            key: 'status',
            label: language === 'en' ? 'Status' : 'स्थिति',
            order: 6,
            sortable: true,
            comparator: (a, b) => compareString(a.status, b.status),
            modifier: (row: RealTimeRain) => {
                const { status } = row;
                if (status) {
                    return (
                        <div>
                            <Translation>
                                {
                                    t => t(status)
                                }
                            </Translation>
                        </div>
                    );
                } return undefined;
            },
        },
    ]);

    private handleDurationSelect = (duration: number) => {
        // this.setState({
        //     duration,
        // });
        this.props.setRealTimeDuration({ duration });
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
            setRealTimeDuration,
            duration,
            language: { language },

        } = this.props;

        // const { duration } = this.props;
        const rainHeader: Header<RealTimeRain>[] = this.getRainHeader(duration, language);
        const { setRealtime } = this.context;

        if (setRealtime) {
            setRealtime((prevProfile: number) => {
                setRealTimeDuration({ duration });
                // const { duration: selectedHour } = this.state;
                if (prevProfile !== duration) {
                    return duration;
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
                        options={durationOptions(language)}
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
                        onBodyHover={(id: number) => onHazardHover(id, 'real-time-rain-points')}
                        onBodyHoverOut={() => onHazardHover()}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

// export default MiniRainWatch;

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(MiniRainWatch);
