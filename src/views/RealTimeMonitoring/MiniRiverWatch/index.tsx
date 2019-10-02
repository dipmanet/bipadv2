import React from 'react';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';

import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';
import Table from '#rscv/Table';

import { Header } from '#store/atom/table/types';
import {
    RealTimeRiver,
} from '#store/atom/page/types';

import RiverWatch from '../RiverWatch';
import styles from './styles.scss';

interface Props {
    realTimeRiver: RealTimeRiver[];
}

const ModalButton = modalize(Button);
const riverWatchKeySelector = (station: RealTimeRiver) => station.id;

class MiniRiverWatch extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.riverWatchHeader = [
            {
                key: 'title',
                label: 'Station Name',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'waterLevel',
                label: 'Water level',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareNumber(a.waterLevel, b.waterLevel),
                modifier: (row: RealTimeRiver) => {
                    const {
                        status,
                        waterLevel,
                    } = row;

                    const className = _cs(
                        styles.waterLevel,
                        status === 'BELOW WARNING LEVEL' && styles.below,
                        status === 'ABOVE WARNING LEVEL' && styles.above,
                        status === 'ABOVE DANGER LEVEL' && styles.danger,
                    );

                    return (waterLevel) ? (
                        <div className={className}>
                            {waterLevel}
                            m
                        </div>
                    ) : undefined;
                },
            },
        ];
    }

    private riverWatchHeader: Header<RealTimeRiver>[];

    public render() {
        const {
            realTimeRiver,
        } = this.props;

        return (
            <div className={styles.riverWatch}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        River Watch
                    </h4>
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        modal={(
                            <RiverWatch
                                realTimeRiver={realTimeRiver}
                            />
                        )}
                    >
                        Show all
                    </ModalButton>
                </header>
                <Table
                    className={styles.riverWatchTable}
                    data={realTimeRiver}
                    headers={this.riverWatchHeader}
                    keySelector={riverWatchKeySelector}
                />
            </div>
        );
    }
}

export default MiniRiverWatch;
