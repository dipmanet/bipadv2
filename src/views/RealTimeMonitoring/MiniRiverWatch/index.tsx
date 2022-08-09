import React from 'react';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';

import { connect } from 'react-redux';
import Button from '#rsca/Button';
import modalize from '#rscg/Modalize';
import Table from '#rscv/Table';

import { Header } from '#store/atom/table/types';
import {
    RealTimeRiver as RealTimeRiverOld,
} from '#store/atom/page/types';

import RiverWatch from '../RiverWatch';
import styles from './styles.scss';
import { languageSelector } from '#selectors';
import { convertDateAccToLanguage } from '#utils/common';

interface Props {
    className?: string;
    realTimeRiver: RealTimeRiver[];
    onHazardHover: Function;
}

const ModalButton = modalize(Button);
const riverWatchKeySelector = (station: RealTimeRiver) => station.id;

const defaultSort = {
    key: 'status',
    order: 'asc',
};
const mapStateToProps = state => ({
    language: languageSelector(state),
});
interface RealTimeRiver extends RealTimeRiverOld {
    waterLevelOn: string;
}

class MiniRiverWatch extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.riverWatchHeader = language => ([
            {
                key: 'basin',
                label: language === 'en' ? 'Basin' : 'बेसिन',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.basin, b.basin),
            },
            {
                key: 'title',
                label: language === 'en' ? 'Station Name' : 'स्टेशनको नाम',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'waterLevel',
                label: language === 'en' ? 'Water level' : 'पानीको तह',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareNumber(
                    a.waterLevel ? a.waterLevel : 0, b.waterLevel ? b.waterLevel : 0,
                ),
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
                            {waterLevel.toFixed(3)}
                            {language === 'en' ? 'm' : 'मि'}
                        </div>
                    ) : undefined;
                },
            },
            {
                key: 'waterLevelOn',
                label: language === 'en' ? 'Date' : 'मिति',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareString(a.waterLevelOn, b.waterLevelOn),
                modifier: (row: RealTimeRiver) => {
                    const { waterLevelOn } = row;
                    return (waterLevelOn) ? (
                        <div style={{ width: '60px' }}>
                            {/* parsing date to appropiate format */}
                            {convertDateAccToLanguage(waterLevelOn.substring(0, waterLevelOn.indexOf('T')), language)}
                        </div>
                    ) : undefined;
                },
            },
            {
                key: 'time',
                label: language === 'en' ? 'Time' : 'समय',
                order: 4,
                sortable: false,
                modifier: (row: RealTimeRiver) => {
                    const { waterLevelOn } = row;
                    if (waterLevelOn) {
                        return (
                            <div>
                                {/* parsing date to time format */}
                                {waterLevelOn.split('T')[1].split('+')[0]}
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
            },
        ]);
    }

    private riverWatchHeader: Header<RealTimeRiver>[];

    private getClassName = (row: RealTimeRiver) => {
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
            realTimeRiver,
            className,
            onHazardHover,
            language: { language },
        } = this.props;

        const riverWatchHeader = this.riverWatchHeader(language);
        return (
            <div className={_cs(className, styles.riverWatch)}>
                <header className={styles.header}>
                    <div />
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        iconName="table"
                        title="Show all data"
                        modal={(
                            <RiverWatch
                                realTimeRiver={realTimeRiver}
                            />
                        )}
                    />
                </header>
                <div className={styles.tableContainer}>
                    <Table
                        rowClassNameSelector={this.getClassName}
                        className={styles.riverWatchTable}
                        data={realTimeRiver}
                        headers={riverWatchHeader}
                        keySelector={riverWatchKeySelector}
                        onBodyHover={(id: number) => onHazardHover(id)}
                        onBodyHoverOut={() => onHazardHover()}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(MiniRiverWatch);
