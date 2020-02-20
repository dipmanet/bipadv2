import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { connect } from 'react-redux';

import Button from '#rsca/Button';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import Table from '#rscv/Table';

import { districtsMapSelector } from '#selectors';

import styles from './styles.scss';

interface Props {
}

const headers = [
    {
        key: 'districtName',
        label: 'District',
    },
    {
        key: 'hdiScore',
        label: 'HDI',
    },
    {
        key: 'maxScore',
        label: 'Maximum fatalitites',
    },
    {
        key: 'medScore',
        label: 'Median fatalities',
    },
    {
        key: 'remoteScore',
        label: 'Remoteness',
    },
    {
        key: 'specificityScore',
        label: 'Specificity',
    },
    {
        key: 'pctScore',
        label: 'Frequency',
    },
    {
        key: 'rank',
        label: 'Rank',
    },
];

const mapStateToProps = state => ({
    districts: districtsMapSelector(state),
});

class DataTableModal extends React.PureComponent<Props> {
    private getRenderData = data => (
        data.map(d => ({
            id: d.id,
            districtName: (this.props.districts[d.district] || {}).title,
            ...d.data,
        }))
    )

    public render() {
        const {
            className,
            data,
            closeModal,
        } = this.props;

        const renderData = this.getRenderData(data);

        return (
            <Modal className={_cs(className, styles.dataTableModal)}>
                <ModalHeader
                    title="Durham earthquake risk data"
                    rightComponent={(
                        <Button
                            transparent
                            onClick={closeModal}
                            iconName="close"
                        />
                    )}
                />
                <ModalBody className={styles.modalBody}>
                    <Table
                        className={styles.table}
                        headers={headers}
                        data={renderData}
                        keySelector={d => d.id}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default connect(mapStateToProps)(DataTableModal);
