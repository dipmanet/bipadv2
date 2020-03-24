import React from 'react';

import ListView from '#rscv/List/ListView';
import Button from '#rsca/Button';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';

import {
    ResourceTypeKeys,
} from '#types';
import {
    Resource,
} from '#store/atom/page/types';

import styles from './styles.scss';

interface Props {
    data: Resource[];
    closeModal: boolean;
    resourceType: ResourceTypeKeys | undefined;

}
interface State {}

type SummaryKey = 'resourceType' | 'branchCount' | 'atmCount' | 'blbCount' | 'hospitalCount' | 'healthPostCount' | 'clinicCount' |'pharmacyCount' | 'dentistCount';

interface SummaryData {
    key: SummaryKey;
    title: string;
    value: number;
}

const summaryData: SummaryData[] = [
    { key: 'resourceType', title: 'Resources', value: 0 },
    { key: 'branchCount', title: 'Branches', value: 0 },
    { key: 'atmCount', title: 'ATMs', value: 0 },
    { key: 'blbCount', title: 'Branch Less Banks', value: 0 },
    { key: 'hospitalCount', title: 'Hospitals', value: 0 },
    { key: 'healthPostCount', title: 'Health Posts', value: 0 },
    { key: 'clinicCount', title: 'Clinics', value: 0 },
    { key: 'pharmacyCount', title: 'Pharmacies', value: 0 },
    { key: 'dentistCount', title: 'Dentists', value: 0 },
];

const keySelector = (d: SummaryData) => d.key;

const SummaryItem = (d: SummaryData) => (
    <div className={styles.item}>
        <div className={styles.value}>{d.value}</div>
        <div className={styles.title}>{d.title}</div>
    </div>
);

class Summary extends React.PureComponent<Props, State> {
    private getSummary = (data: Resource[], resourceType: ResourceTypeKeys) => {
        const summary: {
            [key: string]: number;
        } = {
            resourceType: data.length,
            branchCount: 0,
            atmCount: 0,
            blbCount: 0,
            hospitalCount: 0,
            healthPostCount: 0,
            clinicCount: 0,
            pharmacyCount: 0,
            dentistCount: 0,
        };

        if (resourceType === 'finance') {
            data.forEach((resource) => {
                const { channel, accessPointCount } = resource;
                if (channel === 'BLB') {
                    summary.blbCount += accessPointCount;
                } else if (channel === 'ATM') {
                    summary.atmCount += accessPointCount;
                } else if (channel === 'BRANCH') {
                    summary.branchCount += accessPointCount;
                }
            });
        }
        if (resourceType === 'health') {
            data.forEach((resource) => {
                const { type } = resource;
                if (type === 'Hospital') {
                    summary.hospitalCount += 1;
                } else if (type === 'Health Post') {
                    summary.healthPostCount += 1;
                } else if (type === 'Clinic') {
                    summary.clinicCount += 1;
                } else if (type === 'Pharmacy') {
                    summary.pharmacyCount += 1;
                } else if (type === 'Dentist') {
                    summary.dentistCount += 1;
                }
            });
        }

        return summaryData.map((d) => {
            if (d.key === 'resourceType') {
                return ({ ...d, title: `${resourceType} resources`, value: summary[d.key] });
            }

            return ({ ...d, value: summary[d.key] });
        }).filter(d => d.value !== 0);
    }

    private rendererParams = (_: string, data: SummaryData) => data;

    public render() {
        const {
            data,
            resourceType,
            closeModal,
        } = this.props;

        let summary: SummaryData[] = [];
        if (resourceType) {
            summary = this.getSummary(data, resourceType);
        }

        return (
            <Modal>
                <ModalHeader
                    title="Capacity & Resources Summary"
                    rightComponent={(
                        <Button
                            transparent
                            iconName="close"
                            onClick={closeModal}
                        />
                    )}
                />
                <ModalBody>
                    <ListView
                        data={summary}
                        renderer={SummaryItem}
                        rendererParams={this.rendererParams}
                        keySelector={keySelector}
                        emptyComponent={null}
                    />
                </ModalBody>
            </Modal>
        );
    }
}

export default Summary;
