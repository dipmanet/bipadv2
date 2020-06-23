import React from 'react';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import { Header } from '#store/atom/table/types';


import Table from '#rscv/Table';

import {
    RealTimePollution,
} from '#store/atom/page/types';

import Pollution from '../Pollution';

import styles from './styles.scss';

// original interface does not have all the properties so extended
interface RealTimePollutionExtended extends RealTimePollution {
    title?: string;
    createdOn?: string;
    aqiColor?: string;
}

interface Props {
    className?: string;
    realTimePollution: RealTimePollutionExtended[];
}

const ModalButton = modalize(Button);
const pollutionKeySelector = (station: RealTimePollutionExtended) => station.id;

const defaultSort = {
    key: 'aqi',
    order: 'dsc',
};

class MiniPollution extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);
        this.pollutionHeader = [
            {
                key: 'title',
                label: 'Location',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
                modifier: (row: RealTimePollutionExtended) => {
                    const { title } = row;

                    return (title) ? (
                        <div>{title}</div>) : undefined;
                },
            },
            {
                key: 'createdOn',
                label: 'Date',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.createdOn, b.createdOn),
                modifier: (row: RealTimePollutionExtended) => {
                    const { createdOn } = row;

                    return (createdOn) ? (
                        <div>
                            {/* parsing date to appropiate format */}
                            {createdOn.substring(0, createdOn.indexOf('T'))}
                        </div>
                    ) : undefined;
                },
            },
            {
                key: 'time',
                label: 'Time',
                order: 3,
                sortable: false,
                modifier: (row: RealTimePollutionExtended) => {
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
                key: 'aqi',
                label: 'AQI',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.aqi, b.aqi),
                modifier: (row: RealTimePollutionExtended) => {
                    const { aqi } = row;

                    return (aqi) ? (
                        <div>{`${aqi.toFixed(2)} µg/m³`}</div>
                    ) : undefined;
                },
            },
            {
                key: 'aqiColor',
                label: 'Indicator',
                order: 5,
                sortable: false,
                modifier: (row: RealTimePollutionExtended) => {
                    const { aqi } = row;

                    return (aqi) ? (
                        <div style={{ backgroundColor: `${this.renderAqiIndicator(aqi)}`, width: '10px', height: '10px', borderRadius: '50%' }} />
                    ) : undefined;
                },
            },
        ];
    }

    private pollutionHeader: Header<RealTimePollutionExtended>[];

    private renderAqiIndicator = (aqi: number): string => {
        if (aqi <= 12) {
            return '#009966';
        }
        if (aqi <= 35.4) {
            return '#ffde33';
        }
        if (aqi <= 55.4) {
            return '#ff9933';
        }
        if (aqi <= 150.4) {
            return '#cc0033';
        }
        if (aqi <= 350.4) {
            return '#660099';
        }
        if (aqi >= 500.4) {
            return '#7e0023';
        }
        return '#009966';
    }

    public render() {
        const {
            realTimePollution,
            className,
        } = this.props;

        return (
            <div className={_cs(className, styles.pollution)}>
                <header className={styles.header}>
                    <div />
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        iconName="table"
                        title="Show all data"
                        modal={(
                            <Pollution
                                realTimePollution={realTimePollution}
                            />
                        )}
                    />
                </header>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.pollutionTable}
                        data={realTimePollution}
                        headers={this.pollutionHeader}
                        keySelector={pollutionKeySelector}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

export default MiniPollution;
