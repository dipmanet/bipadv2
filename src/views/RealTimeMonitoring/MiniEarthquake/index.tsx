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
    RealTimeEarthquake,
} from '#store/atom/page/types';

import styles from './styles.scss';
import Earthquake from '../Earthquake';

interface Props {
    className?: string;
    realTimeEarthquake: RealTimeEarthquake[];
    onHazardHover: Function;
}

const ModalButton = modalize(Button);
const earthquakeKeySelector = (station: RealTimeEarthquake) => station.id;

const defaultSort = {
    key: 'magnitude',
    order: 'dsc',
};

class MiniEarthquake extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);
        this.earthquakeHeader = [
            {
                key: 'address',
                label: 'Location',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.address, b.address),
            },
            {
                key: 'eventOn',
                label: 'Date',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.eventOn, b.eventOn),
                modifier: (row: RealTimeEarthquake) => {
                    const { eventOn } = row;

                    return (eventOn) ? (
                        <div>
                            {/* parsing date to appropiate format */}
                            {eventOn.substring(0, eventOn.indexOf('T'))}
                        </div>
                    ) : undefined;
                },
            },
            {
                key: 'time',
                label: 'Time',
                order: 3,
                sortable: false,
                modifier: (row: RealTimeEarthquake) => {
                    const { eventOn } = row;
                    if (eventOn) {
                        const date = new Date(eventOn);
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
                key: 'magnitude',
                label: 'Magnitude',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.magnitude, b.magnitude),
                modifier: (row: RealTimeEarthquake) => {
                    const { magnitude } = row;
                    return (magnitude)
                        ? (
                            <div>
                                {magnitude}
                                {' '}
ML
                            </div>
                        ) : undefined;
                },
            },
        ];
    }

    private earthquakeHeader: Header<RealTimeEarthquake>[];

    public render() {
        const {
            realTimeEarthquake,
            className,
            onHazardHover,
        } = this.props;

        return (
            <div className={_cs(className, styles.earthquake)}>
                <header className={styles.header}>
                    <div />
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        iconName="table"
                        title="Show all data"
                        modal={(
                            <Earthquake
                                realTimeEarthquake={realTimeEarthquake}
                            />
                        )}
                    />
                </header>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.earthquakeTable}
                        data={realTimeEarthquake}
                        headers={this.earthquakeHeader}
                        keySelector={earthquakeKeySelector}
                        onBodyHover={(id: number) => onHazardHover(id, 'real-time-earthquake-points')}
                        onBodyHoverOut={() => onHazardHover()}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

export default MiniEarthquake;
