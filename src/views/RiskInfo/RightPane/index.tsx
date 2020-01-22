import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';


import { setFiltersActionDP } from '#actionCreators';
import { AppState } from '#store/types';
import { Region } from '#store/atom/page/types';
import { filtersSelectorDP } from '#selectors';

import RegionSelectInput from '#components/RegionSelectInput';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';

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

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelectorDP(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersActionDP(params)),
});

interface FaramValues {
    region: Region;
}

interface FaramErrors {
}

class RiskInfoRightPane extends React.PureComponent<Props, State> {
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

    public render() {
        const {
            className,
            filters: {
                faramValues,
            },
        } = this.props;

        return (
            <div className={_cs(styles.rightPane, className)}>
                <StepwiseRegionSelectInput
                    className={styles.stepwiseRegionSelectInput}
                    value={faramValues.region}
                    onChange={this.handleRegionChange}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RiskInfoRightPane);
