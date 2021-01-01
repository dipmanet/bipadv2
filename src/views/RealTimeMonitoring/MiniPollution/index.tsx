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
    name?: string;
    createdOn?: string;
    aqiColor?: string;
    modifiedOn?: string;
}

interface Props {
    className?: string;
    realTimePollution: RealTimePollutionExtended[];
    onHazardHover: Function;
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
                key: 'name',
                label: 'Location',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.name, b.name),
                modifier: (row: RealTimePollutionExtended) => {
                    const { name } = row;

                    return (name) ? (
                        <div>{name}</div>) : undefined;
                },
            },
            {
                key: 'modifiedOn',
                label: 'Date',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.modifiedOn, b.modifiedOn),
                modifier: (row: RealTimePollutionExtended) => {
                    const { modifiedOn } = row;

                    return (modifiedOn) ? (
                        <div>
                            {/* parsing date to appropiate format */}
                            {modifiedOn.substring(0, modifiedOn.indexOf('T'))}
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
                    const { modifiedOn } = row;
                    if (modifiedOn) {
                        const date = new Date(modifiedOn);
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
                        // <div>{`${aqi.toFixed(2)} µg/m³`}</div>
                        <div>{aqi.toFixed(2)}</div>
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
                        <div style={{ backgroundColor: `${this.renderAqiIndicator(aqi)}`,
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            border: '1px solid black',
                            margin: 'auto' }}
                        />
                    ) : undefined;
                },
            },
        ];
    }

    private pollutionHeader: Header<RealTimePollutionExtended>[];

    private renderAqiIndicator = (aqi: number): string => {
        if (aqi <= 50) {
            return '#00fa2f';
        }
        if (aqi <= 100) {
            return '#f7ff00';
        }
        if (aqi <= 150) {
            return '#ff7300';
        }
        if (aqi <= 200) {
            return '#ff0000';
        }
        if (aqi <= 300) {
            return '#9e0095';
        }
        if (aqi > 300) {
            return '#8a0014';
        }
        return '#00fa2f';
    }

    public render() {
        const {
            realTimePollution,
            className,
            onHazardHover,
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
                        onBodyHover={(id: number) => onHazardHover(id)}
                        onBodyHoverOut={() => onHazardHover()}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

export default MiniPollution;
