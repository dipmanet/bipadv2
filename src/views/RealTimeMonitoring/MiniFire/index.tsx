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
    RealTimeFire,
} from '#store/atom/page/types';

import Fire from '../Fire';

import styles from './styles.scss';

import { languageSelector } from '#selectors';
import { convertDateAccToLanguage } from '#utils/common';

const mapStateToProps = (state: AppState) => ({
    language: languageSelector(state),
});

interface Props {
    className?: string;
    realTimeFire: RealTimeFire[];
    onHazardHover: Function;
    language: { language: 'en' | 'np' };
}

const ModalButton = modalize(Button);
const fireKeySelector = (station: RealTimeFire) => station.id;

const defaultSort = {
    key: 'eventOn',
    order: 'dsc',
};

class Minifire extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);

        this.fireHeader = language => ([

            {
                key: 'eventOn',
                label: language === 'en' ? 'Date' : 'मिति',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.eventOn, b.eventOn),
                modifier: (row: RealTimeFire) => {
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
                order: 2,
                sortable: false,
                modifier: (row: RealTimeFire) => {
                    const { eventOn } = row;
                    if (eventOn) {
                        return (
                            <div>
                                {/* parsing date to time format */}
                                {eventOn.split('T')[1].split('.')[0].split('+')[0]}
                            </div>
                        );
                    } return undefined;
                },
            },
            {
                key: 'landCover',
                label: language === 'en' ? 'Land Cover' : 'भूउपयोग',
                order: 3,
                sortable: false,
            },
            {
                key: 'brightness',
                label: language === 'en' ? 'Brightness' : 'चमक',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareNumber(a.brightness, b.brightness),
            },
        ]);
    }

    private fireHeader: Header<RealTimeFire>[];

    public render() {
        const {
            realTimeFire,
            className,
            onHazardHover,
            language: { language },
        } = this.props;

        const fireHeader = this.fireHeader(language);
        return (
            <div className={_cs(className, styles.fire)}>
                <header className={styles.header}>
                    <div />
                    <ModalButton
                        className={styles.showDetailsButton}
                        transparent
                        iconName="table"
                        title="Show all data"
                        modal={(
                            <Fire
                                realTimeFire={realTimeFire}
                                language={language}
                            />
                        )}
                    />
                </header>
                <div className={styles.tableContainer}>
                    <Table
                        className={styles.fireTable}
                        data={realTimeFire}
                        headers={fireHeader}
                        keySelector={fireKeySelector}
                        onBodyHover={(id: number) => onHazardHover(id, 'real-time-fire-points')}
                        onBodyHoverOut={() => onHazardHover()}
                        defaultSort={defaultSort}
                    />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Minifire);
