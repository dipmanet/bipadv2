import React from 'react';
import Faram from '@togglecorp/faram';

import { connect } from 'react-redux';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import DangerButton from '#rsca/Button/DangerButton';
import SelectInput from '#rsci/SelectInput';
import DateInput from '#rsci/DateInput';

import HazardSelectionInput from '#components/HazardSelectionInput';
import PastDateRangeInput from '#components/PastDateRangeInput';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';

import { Region } from '#store/atom/page/types';
import { lossMetrics } from '#utils/domain';
import { languageSelector } from '#selectors';

import styles from './styles.scss';

interface FaramValues {
    region: Region;
}

interface FaramErrors {
}

const mapStateToProps = state => ({
    language: languageSelector(state),
});

const filterSchema = {
    fields: {
        dateRange: [],
        region: [],
        hazard: [],
    },
};

const FilterModal = ({
    closeModal,
    onFaramChange,
    faramValues,
    faramErrors,
    showMetricSelect,
    showDateRange,
    language: { language },
}: {
    closeModal?: () => void;
    onFaramChange: (v: FaramValues, e: FaramErrors) => void;
    faramValues: FaramValues;
    faramErrors: FaramErrors;
    showMetricSelect?: boolean;
    showDateRange?: boolean;
}) => (
    <Modal>
        <ModalHeader
            title="Select filters"
            rightComponent={(
                <DangerButton
                    transparent
                    iconName="close"
                    onClick={closeModal}
                    title="Close Modal"
                />
            )}
        />
        <ModalBody>
            <Faram
                error={faramErrors}
                onChange={onFaramChange}
                schema={filterSchema}
                value={faramValues}
            >
                <StepwiseRegionSelectInput
                    faramElementName="region"
                    wardsHidden
                // autoFocus
                />
                {showMetricSelect && (
                    <SelectInput
                        label="Metric"
                        faramElementName="metric"
                        options={lossMetrics}
                        hideClearButton
                    // disabled={disabledMetricSelect}
                    />
                )}
                {showDateRange && (
                    <div className={styles.dateRangeInput}>
                        <DateInput
                            className={styles.startDateInput}
                            label="Start Date"
                            faramElementName="start"
                            language={language}
                        />
                        <DateInput
                            className={styles.endDateInput}
                            label="End Date"
                            faramElementName="end"
                            language={language}

                        />
                    </div>
                )}
                <PastDateRangeInput
                    label="Data range"
                    faramElementName="dateRange"
                    showHintAndError={false}
                />
                <HazardSelectionInput
                    faramElementName="hazard"
                />
            </Faram>
        </ModalBody>
        <ModalFooter>
            <DangerButton onClick={closeModal}>
                Close
            </DangerButton>
        </ModalFooter>
    </Modal>
);

export default connect(mapStateToProps)(FilterModal);
