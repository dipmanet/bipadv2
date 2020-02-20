import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs, isDefined } from '@togglecorp/fujs';
import Faram from '@togglecorp/faram';
import memoize from 'memoize-one';

import Button from '#rsca/Button';
import ScrollTabs from '#rscv/ScrollTabs';
import MultiViewContainer from '#rscv/MultiViewContainer';
import Icon from '#rscg/Icon';

import { setFiltersAction } from '#actionCreators';
import { filtersSelector } from '#selectors';
import { AppState } from '#store/types';
import { FiltersElement } from '#types';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import HazardSelectionInput from '#components/HazardSelectionInput';
import PastDateRangeInput from '#components/PastDateRangeInput';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
    extraContent?: React.ReactNode;
    extraContentContainerClassName?: string;
    hideLocationFilter?: boolean;
    hideDataRangeFilter?: boolean;
    hideHazardFilter?: boolean;
}

interface PropsFromAppState {
    filters: FiltersElement;
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersAction;
}

interface State {
    activeView: TabKey | undefined;
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    filters: filtersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setFilters: params => dispatch(setFiltersAction(params)),
});

type TabKey = 'location' | 'hazard' | 'dataRange' | 'others';

const iconNames: {
    [key in TabKey]: string;
} = {
    location: 'distance',
    hazard: 'warning',
    dataRange: 'dataRange',
    others: 'filter',
};

const FilterIcon = ({
    isActive,
    className,
    isFiltered,
    ...otherProps
}: {
    isFiltered: boolean;
    isActive?: boolean;
    className?: string;
}) => (
    <Icon
        className={_cs(
            className,
            isActive && styles.active,
            isFiltered && styles.filtered,
            styles.filterIcon,
        )}
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

const getIsFiltered = (key: TabKey | undefined, filters: FiltersElement) => {
    if (!key || key === 'others') {
        return false;
    }

    const tabKeyToFilterMap: {
        [key in Exclude<TabKey, 'others'>]: keyof FiltersElement;
    } = {
        hazard: 'hazard',
        location: 'region',
        dataRange: 'dataDateRange',
    };

    const filter = filters[tabKeyToFilterMap[key]];

    if (Array.isArray(filter)) {
        return filter.length !== 0;
    }

    const filterKeys = Object.keys(filter);
    return filterKeys.length !== 0 && filterKeys.every(k => !!filter[k]);
};

class Filters extends React.PureComponent<Props, State> {
    public state = {
        activeView: undefined,
    };

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
                this.props.extraContent ? (
                    <div className={_cs(
                        styles.activeView,
                        this.props.extraContentContainerClassName,
                    )}
                    >
                        { this.props.extraContent }
                    </div>
                ) : null
            ),
        },
    }

    private handleTabClick = (activeView: TabKey) => {
        this.setState({ activeView });
    }

    private getFilterTabRendererParams = (key: TabKey, title: string) => ({
        name: iconNames[key],
        title,
        className: styles.icon,
        isFiltered: getIsFiltered(key, this.props.filters),
    })

    private handleResetFiltersButtonClick = () => {
    }

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleFaramChange = (faramValues: FiltersElement) => {
        const { setFilters } = this.props;
        setFilters({ filters: faramValues });
    }

    private getTabs = memoize(
        (
            extraContent: React.ReactNode,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
        ): {
            [key in TabKey]?: string;
        } => {
            const tabs = {
                location: 'Location',
                hazard: 'Hazard',
                dataRange: 'Data range',
                others: 'Others',
            };

            if (!extraContent) {
                delete tabs.others;
            }

            if (hideLocationFilter) {
                delete tabs.location;
            }

            if (hideHazardFilter) {
                delete tabs.hazard;
            }

            if (hideDataRangeFilter) {
                delete tabs.dataRange;
            }

            return tabs;
        },
    )

    public render() {
        const {
            className,
            filters: faramValues,
            extraContent,
            hideDataRangeFilter,
            hideHazardFilter,
            hideLocationFilter,
        } = this.props;

        const tabs = this.getTabs(
            extraContent,
            hideLocationFilter,
            hideHazardFilter,
            hideDataRangeFilter,
        );

        const { activeView } = this.state;

        const validActiveView = isDefined(activeView) && tabs[activeView]
            ? activeView
            : undefined;

        return (
            <div className={_cs(styles.filters, className)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Filters
                    </h3>
                    <Button
                        className={styles.resetFiltersButton}
                        title="Reset filters"
                        onClick={this.handleResetFiltersButtonClick}
                        iconName="refresh"
                        transparent
                        disabled
                    />
                </header>
                <div className={styles.content}>
                    <ScrollTabs
                        tabs={tabs}
                        active={validActiveView}
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
                        {validActiveView && (
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    { tabs[validActiveView] }
                                </h3>
                                <Button
                                    className={styles.closeButton}
                                    transparent
                                    iconName="chevronUp"
                                    onClick={this.handleCloseCurrentFilterButtonClick}
                                />
                            </header>
                        )}
                        <MultiViewContainer
                            views={this.views}
                            active={validActiveView}
                        />
                    </Faram>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
