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
import Table from '#rscv/Table';
import ModalFooter from '#rscv/Modal/Footer';
import DownloadButton from '#components/DownloadButton';
import DangerButton from '#rsca/Button/DangerButton';

import { Header } from '#store/atom/table/types';
import { RealTimeRiver as RealTimeRiverOld } from '#store/atom/page/types';

import {
    convertNormalTableToCsv,
} from '#utils/table';

import styles from './styles.scss';

import { languageSelector } from '#selectors';

const mapStateToProps = state => ({
    language: languageSelector(state),
});

interface Props {
    realTimeRiver: RealTimeRiver[];
    closeModal?: () => void;
}

interface RealTimeRiver extends RealTimeRiverOld {
    stationSeriesId?: number;
}

const riverWatchKeySelector = (river: RealTimeRiver) => river.id;

const defaultSort = {
    key: 'status',
    order: 'asc',
};

class RiverWatch extends React.PureComponent<Props> {
    public constructor(props: Props) {
        super(props);
        const { language: { language } } = this.props;

        // TODO: add OandM by to riverWatch
        this.riverWatchHeader = [
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
                key: 'stationSeriesId',
                label: language === 'en' ? 'Station Id' : 'स्टेशन आईडी',
                order: 3,
                sortable: true,
                comparator: (a, b) => compareNumber(a.stationSeriesId, b.stationSeriesId),
            },
            {
                key: 'district',
                label: language === 'en' ? 'District' : 'जिल्‍ला',
                order: 4,
                sortable: true,
                comparator: (a, b) => compareString(a.district, b.district),
            },
            {
                key: 'waterLevel',
                label: language === 'en' ? 'Water Level (m)' : 'पानीको स्तर (मि)',
                order: 5,
                sortable: true,
                comparator: (a, b) => compareNumber(
                    a.waterLevel ? a.waterLevel : 0, b.waterLevel ? b.waterLevel : 0,
                ),
            },
            {
                key: 'warningLevel',
                label: language === 'en' ? 'Warning Level' : 'चेतावनी स्तर',
                order: 6,
                sortable: true,
                comparator: (a, b) => compareNumber(a.warningLevel, b.warningLevel),
            },
            {
                key: 'dangerLevel',
                label: language === 'en' ? 'Danger Level' : 'खतरा स्तर',
                order: 7,
                sortable: true,
                comparator: (a, b) => compareNumber(a.dangerLevel, b.dangerLevel),
            },
            {
                key: 'steady',
                label: language === 'en' ? 'Steady' : 'स्थिर',
                order: 8,
                sortable: true,
                comparator: (a, b) => compareString(a.steady, b.steady),
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
        return styles.below;
    }

    private riverWatchHeader: Header<RealTimeRiver>[];

    public render() {
        const {
            realTimeRiver,
            closeModal,
            language: { language },
        } = this.props;

        const formattedTableData = convertNormalTableToCsv(realTimeRiver, this.riverWatchHeader);
        return (
            <Translation>
                {
                    t => (
                        <Modal
                            // closeOnEscape
                            // onClose={closeModal}
                            className={_cs(styles.riverWatchModal, language === 'np' && styles.languageFont)}
                        >
                            <ModalHeader
                                title={t('River Watch')}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={closeModal}
                                        title="Close Modal"
                                    />
                                )}
                            />
                            <ModalBody className={styles.body}>
                                <Table
                                    rowClassNameSelector={this.getClassName}
                                    className={styles.riverWatchTable}
                                    data={realTimeRiver}
                                    headers={this.riverWatchHeader}
                                    keySelector={riverWatchKeySelector}
                                    defaultSort={defaultSort}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <DangerButton onClick={closeModal}>
                                    {t('Close')}
                                </DangerButton>
                                <DownloadButton
                                    value={formattedTableData}
                                    name="River Watch.csv"
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

export default connect(mapStateToProps)(RiverWatch);
