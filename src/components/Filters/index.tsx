import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';

import Button from '#rsca/Button';
import ScrollTabs from '#rscv/ScrollTabs';
import SelectInput from '#rsci/SelectInput';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Icon from '#rscg/Icon';

import { setFiltersAction } from '#actionCreators';
import { filtersSelector } from '#selectors';
import { AppState } from '#store/types';
import { lossMetrics } from '#utils/domain';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import HazardSelectionInput from '#components/HazardSelectionInput';
import PastDateRangeInput from '#components/PastDateRangeInput';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
}

interface PropsFromAppState {
    filters: {};
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersAction;
}

interface State {
    activeView: string | undefined;
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
});

const iconNames = {
    location: 'map',
    hazard: 'warning',
    dataRange: 'calendar',
    others: 'filter',
};

const FilterIcon = ({
    isActive,
    className,
    ...otherProps
}) => (
    <Icon
        className={_cs(className, isActive && styles.active, styles.filterIcon)}
        {...otherProps}
    />
);

const filterSchema = {
    fields: {
        dataDateRange: [],
        hazard: [],
        region: [],
    },
};

class Filters extends React.PureComponent<Props> {
    public state = {
        activeView: undefined,
    }

    private tabs = {
        location: 'Location',
        hazard: 'Hazard',
        dataRange: 'Data range',
        others: 'Others',
    }

    private views = {
        location: {
            component: () => (
                <StepwiseRegionSelectInput
                    className={_cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                    faramElementName="region"
                />
            ),
        },
        hazard: {
            component: () => (
                <HazardSelectionInput
                    className={styles.activeView}
                    faramElementName="hazard"
                />
            ),
        },
        dataRange: {
            component: () => (
                <div className={styles.activeView}>
                    <PastDateRangeInput
                        faramElementName="dataDateRange"
                    />
                </div>
            ),
        },
        others: {
            component: () => (
                <div className={styles.activeView}>
                    <SelectInput
                        label="Metric"
                        faramElementName="metric"
                        options={lossMetrics}
                        hideClearButton
                        // disabled={disabledMetricSelect}
                    />
                </div>
            ),
        },
    }

    private handleTabClick = (activeView: string) => {
        this.setState({ activeView });
    }

    private getFilterTabRendererParams = (key: string, title: string) => ({
        name: iconNames[key],
        title,
        className: styles.icon,
    })

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleFaramChange = (faramValues) => {
        const { setFilters } = this.props;
        setFilters({ filters: faramValues });
    }

    public render() {
        const {
            className,
            filters: faramValues,
        } = this.props;

        const { activeView } = this.state;

        return (
            <div className={_cs(styles.filters, className)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Filters
                    </h3>
                </header>
                <div className={styles.content}>
                    <ScrollTabs
                        tabs={this.tabs}
                        active={activeView}
                        onClick={this.handleTabClick}
                        renderer={FilterIcon}
                        rendererParams={this.getFilterTabRendererParams}
                        className={styles.tabs}
                    />
                    <Faram
                        schema={filterSchema}
                        onChange={this.handleFaramChange}
                        value={faramValues}
                        className={styles.filterViewContainer}
                    >
                        { activeView && (
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    { this.tabs[activeView] }
                                </h3>
                                <Button
                                    className={styles.closeButton}
                                    transparent
                                    iconName="close"
                                    onClick={this.handleCloseCurrentFilterButtonClick}
                                />
                            </header>
                        )}
                        <MultiViewContainer
                            views={this.views}
                            active={activeView}
                        />
                    </Faram>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
