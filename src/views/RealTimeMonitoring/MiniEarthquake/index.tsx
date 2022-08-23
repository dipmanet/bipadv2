import React from 'react';
import { connect } from 'react-redux';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';
import modalize from '#rscg/Modalize';
import Button from '#rsca/Button';
import { Header } from '#store/atom/table/types';
import { AppState } from '#store/types';


import Table from '#rscv/Table';

import {
    RealTimeEarthquake,
} from '#store/atom/page/types';

import styles from './styles.scss';
import Earthquake from '../Earthquake';

import { languageSelector } from '#selectors';
import { convertDateAccToLanguage } from '#utils/common';

const mapStateToProps = (state: AppState) => ({
    language: languageSelector(state),
});

interface Props {
    className?: string;
    realTimeEarthquake: RealTimeEarthquake[];
    onHazardHover: Function;
    language: { language: 'en' | 'np' };
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

        this.earthquakeHeader = language => ([
            {
                key: 'address',
                label: language === 'en' ? 'Location' : 'स्‍थान',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.address, b.address),
            },
            {
                key: 'eventOn',
                label: language === 'en' ? 'Date' : 'मिति',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.eventOn, b.eventOn),
                modifier: (row: RealTimeEarthquake) => {
                    const { eventOn } = row;

                    return (eventOn) ? (
                        <div>
                            {/* parsing date to appropiate format */}
                            {convertDateAccToLanguage(eventOn.substring(0, eventOn.indexOf('T')), language)}
                        </div>
                    ) : undefined;
                },
            },
            {
                key: 'time',
                label: language === 'en' ? 'Time' : 'समय',
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
                label: language === 'en' ? 'Magnitude' : 'परिमाण',
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
        ]);
    }

    private earthquakeHeader: Header<RealTimeEarthquake>[];

    public render() {
        const {
            realTimeEarthquake,
            className,
            onHazardHover,
            language: { language },
        } = this.props;

        const earthquakeHeader = this.earthquakeHeader(language);

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
                                language={language}
                            />
                        )}
                    />
                </header>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.earthquakeTable}
                        data={realTimeEarthquake}
                        headers={earthquakeHeader}
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

export default connect(mapStateToProps)(MiniEarthquake);
