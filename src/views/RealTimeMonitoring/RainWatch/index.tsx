import React from 'react';
import {
    compareString,
    compareNumber,
    _cs,
} from '@togglecorp/fujs';

import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import Table from '#rscv/Table';
import DownloadButton from '#components/DownloadButton';
import DangerButton from '#rsca/Button/DangerButton';

import { Header } from '#store/atom/table/types';
import {
    WaterLevelAverage,
    RealTimeRain,
} from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';
import { languageSelector } from '#selectors';

interface Props {
    realTimeRain: RealTimeRain[];
    closeModal?: () => void;
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const rainWatchKeySelector = (rain: RealTimeRain) => rain.id;

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

const defaultSort = {
    key: 'status',
    order: 'asc',
};

class RainWatch extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);
        const { language: { language } } = this.props;
        this.rainWatchHeader = [
            {
                key: 'basin',
                label: language === 'en' ? 'Basin' : 'बेसिन',
                order: 1,
                sortable: true,
                comparator: (a, b) => compareString(a.basin, b.basin),
            },
            {
                key: 'title',
                label: language === 'en' ? 'Title' : 'शीर्षक',
                order: 2,
                sortable: true,
                comparator: (a, b) => compareString(a.title, b.title),
            },
            {
                key: 'description',
                label: language === 'en' ? 'Description' : 'विवरण',
                order: 3,
            },
            {
                key: 'lastHour',
                label: language === 'en' ? 'Accumulated rainfall within last 1 hours' : 'पछिल्‍लो १ घण्टा भित्र सञ्चित वर्षा',
                order: 4,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 1);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 1),
            },
            {
                key: 'lastThreeHours',
                label: language === 'en' ? 'Accumulated rainfall within last 3 hours' : 'पछिल्‍लो ३ घण्टामा सञ्चित वर्षा',
                order: 5,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 3);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 3),
            },
            {
                key: 'lastSixHours',
                label: language === 'en' ? 'Accumulated rainfall within last 6 hours' : 'पछिल्‍लो ६ घण्टामा सञ्चित वर्षा',
                order: 6,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 6);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 6),
            },
            {
                key: 'lastTwelveHours',
                label: language === 'en' ? 'Accumulated rainfall within last 12 hours' : 'पछिल्‍लो १२ घण्टामा सञ्चित वर्षा',
                order: 7,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 12);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 12),
            },
            {
                key: 'lastTwentyFourHours',
                label: language === 'en' ? 'Accumulated rainfall within last 24 hours' : 'पछिल्‍लो २४ घण्टामा सञ्चित वर्षा',
                order: 8,
                modifier: (row) => {
                    const {
                        averages = [],
                    } = row;
                    const average = averages.find(av => av.interval === 24);
                    return average ? average.value : undefined;
                },
                sortable: true,
                comparator: (a, b) => compareIntervalValues(a.averages, b.averages, 24),
            },
            {
                key: 'status',
                label: language === 'en' ? 'Status' : 'स्थिति',
                order: 9,
                sortable: true,
                comparator: (a, b) => compareString(a.status, b.status),
                modifier: (row) => {
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
        ];
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
        return styles.below;
    }

    private rainWatchHeader: Header<RealTimeRain>[];

    public render() {
        const {
            realTimeRain,
            closeModal,
            language: { language },
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(realTimeRain, this.rainWatchHeader);
        return (
            <Translation>
                {
                    t => (
                        <Modal
                            // closeOnEscape
                            // onClose={closeModal}
                            className={_cs(styles.rainWatchModal, language === 'np' && styles.languageFont)}
                        >

                            <ModalHeader
                                title={t('Rainfall Watch')}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={closeModal}
                                        title="Close Modal"
                                    />
                                )}
                            />
                            <div className={styles.warning}>
                                {
                                    t('Note : Warning level for rainfall (mm): 60 mm in 1 hr, 80 mm in 3 hr, 100 mm in 6 hr, 120 mm in 12 hr, 140 mm in 24 hr. This indicates potential threat for landslides in steep slope and high flow in local areas.')
                                }
                            </div>
                            <hr />
                            <ModalBody className={styles.body}>
                                <Table
                                    rowClassNameSelector={this.getClassName}
                                    className={styles.rainWatchTable}
                                    data={realTimeRain}
                                    headers={this.rainWatchHeader}
                                    keySelector={rainWatchKeySelector}
                                    defaultSort={defaultSort}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <DangerButton onClick={closeModal}>
                                    {t('Close')}
                                </DangerButton>
                                <DownloadButton
                                    value={formattedTableData}
                                    name="Rainfall Watch.csv"
                                >
                                    {t('Download')}
                                </DownloadButton>
                            </ModalFooter>
                        </Modal>
                    )
                }
            </Translation>

        );
    }
}

export default connect(mapStateToProps)(RainWatch);
