import React, { useEffect, useState } from 'react';
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
import MagnitudeSelector from './Magnitude';

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

const initialFaramValues = {
    dataDateRange: {
        rangeInDays: 7,
        startDate: undefined,
        endDate: undefined,
    },
    hazard: [],
    region: {},
};

const getTabs = memoize(
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
);

const EarthquakeFilters = (props: Props) => {
    const {
        className,
        extraContent,
        extraContentContainerClassName,
        hideDataRangeFilter,
        hideHazardFilter,
        hideLocationFilter,
    } = props;

    const [activeView, setActiveView] = useState<TabKey | undefined>(undefined);
    const [faramValues, setFaramValues] = useState<FiltersElement>(initialFaramValues);

    useEffect(() => {
        const { filters: fv } = props;
        setFaramValues(fv);
    }, [props]);

    const handleTabClick = (av: TabKey) => {
        setActiveView(av);
    };

    const getFilterTabRendererParams = (key: TabKey, title: string) => ({
        name: iconNames[key],
        title,
        className: styles.icon,
        isFiltered: getIsFiltered(key, faramValues),
    });

    const handleResetFiltersButtonClick = () => {
        setActiveView(undefined);
        setFaramValues(initialFaramValues);

        const { setFilters } = props;
        if (faramValues) {
            setFilters({ filters: faramValues });
        }
    };

    const handleCloseCurrentFilterButtonClick = () => {
        setActiveView(undefined);
    };

    const handleFaramChange = (fv: FiltersElement) => {
        console.log('FV: ', fv);
        setFaramValues(fv);
    };

    const handleSubmitClick = () => {
        const { setFilters } = props;
        if (faramValues) {
            setFilters({ filters: faramValues });
        }
    };

    const views = {
        location: {
            component: () => (
                <StepwiseRegionSelectInput
                    className={_cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                    faramElementName="region"
                    wardsHidden
                    // autoFocus
                />
            ),
        },
        hazard: {
            component: () => (
                <HazardSelectionInput
                    className={styles.activeView}
                    faramElementName="hazard"
                    // autoFocus
                />
            ),
        },
        dataRange: {
            component: () => (
                <div className={styles.activeView}>
                    <MagnitudeSelector
                        faramElementName="dataDateRange"
                        // autoFocus
                    />
                </div>
            ),
        },
        others: {
            component: () => (
                extraContent ? (
                    <div className={_cs(
                        styles.activeView,
                        extraContentContainerClassName,
                    )}
                    >
                        { extraContent }
                    </div>
                ) : null
            ),
        },
    };


    const fv = faramValues;

    const tabs = getTabs(
        extraContent,
        hideLocationFilter,
        hideHazardFilter,
        hideDataRangeFilter,
    );


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
                    onClick={handleResetFiltersButtonClick}
                    iconName="refresh"
                    transparent
                    disabled={!validActiveView}
                />

            </header>
            <div className={styles.content}>
                <ScrollTabs
                    tabs={tabs}
                    active={validActiveView}
                    onClick={handleTabClick}
                    renderer={FilterIcon}
                    rendererParams={getFilterTabRendererParams}
                    className={styles.tabs}
                />
                <Faram
                    schema={filterSchema}
                    onChange={handleFaramChange}
                    value={fv}
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
                                onClick={handleCloseCurrentFilterButtonClick}
                            />
                        </header>
                    )}
                    <MultiViewContainer
                        views={views}
                        active={validActiveView}
                    />
                </Faram>
                {validActiveView && (
                    <div
                        onClick={handleSubmitClick}
                        className={styles.submitButton}
                        role="presentation"
                    >
                    Submit
                    </div>
                )}
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EarthquakeFilters);
