import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import { setFiltersActionDP } from '#actionCreators';
import { AppState } from '#store/types';
import { Region } from '#store/atom/page/types';

import {
    filtersSelectorDP,
} from '#selectors';


import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import ModalFooter from '#rscv/Modal/Footer';
import Button from '#rsca/Button';

import modalize from '#rscg/Modalize';

import HazardSelectionInput from '#components/HazardSelectionInput';
import RegionSelectInput from '#components/RegionSelectInput';
import PastDateRangeInput from '#components/PastDateRangeInput';

import styles from './styles.scss';

interface OwnProps {
    className?: string;
}

interface PropsFromAppState {
    filters: {
        faramValues: {
            region: Region;
        };
        faramErrors: {};
    };
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersActionDP;
}

type Props = OwnProps & PropsFromAppState & PropsFromDispatch;

interface State {
}

const ShowFilterButton = modalize(Button);


const mapStateToProps = (state: AppState) => ({
    filters: filtersSelectorDP(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersActionDP(params)),
});

const filterSchema = {
    fields: {
        dateRange: [],
        region: [],
        hazard: [],
    },
};

interface FaramValues {
    region: Region;
}

interface FaramErrors {
}

const FilterModal = ({
    closeModal,
    onFaramChange,
    faramValues,
    faramErrors,
}: {
    closeModal?: () => void;
    onFaramChange: (v: FaramValues, e: FaramErrors) => void;
    faramValues: FaramValues;
    faramErrors: FaramErrors;
}) => (
    <Modal>
        <ModalHeader
            title="Select filters"
        />
        <ModalBody>
            <Faram
                className={styles.filterForm}
                onChange={onFaramChange}
                schema={filterSchema}
                value={faramValues}
                error={faramErrors}
            >
                <PastDateRangeInput
                    label="Data range"
                    faramElementName="dateRange"
                    className={styles.pastDataSelectInput}
                    showHintAndError={false}
                />
                <HazardSelectionInput
                    faramElementName="hazard"
                />
            </Faram>
        </ModalBody>
        <ModalFooter>
            <Button onClick={closeModal}>
                Close
            </Button>
        </ModalFooter>
    </Modal>
);


class DashboardFilter extends React.PureComponent<Props, State> {
    private handleRegionChange = (newRegionValue: Region) => {
        const {
            filters: {
                faramValues,
                faramErrors,
            },
            setFilters,
        } = this.props;

        setFilters({
            faramValues: {
                ...faramValues,
                region: newRegionValue,
            },
            faramErrors,
            pristine: false,
        });
    }

    private handleFaramChange = (faramValues: FaramValues, faramErrors: FaramErrors) => {
        this.props.setFilters({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    public render() {
        const {
            className,
            filters: {
                faramValues,
                faramErrors,
            },
        } = this.props;

        return (
            <div className={_cs(styles.rightPane, className)}>
                <RegionSelectInput
                    className={styles.regionSelectInput}
                    value={faramValues.region}
                    onChange={this.handleRegionChange}
                />
                <ShowFilterButton
                    iconName="filter"
                    modal={(
                        <FilterModal
                            onFaramChange={this.handleFaramChange}
                            faramValues={faramValues}
                            faramErrors={faramErrors}
                        />
                    )}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilter);
