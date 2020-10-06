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

import { setDataArchiveEarthquakeFilterAction } from '#actionCreators';
import { eqFiltersSelector } from '#selectors';
import { AppState } from '#store/types';
import { DAEarthquakeFiltersElement } from '#types';
import StepwiseRegionSelectInput from '#components/StepwiseRegionSelectInput';
import PastDateRangeInput from '#components/PastDateRangeInput';
import MagnitudeSelector from './Magnitude';

import styles from './styles.scss';

interface ComponentProps {
    className?: string;
    extraContent?: React.ReactNode;
    extraContentContainerClassName?: string;
    hideLocationFilter?: boolean;
    hideDataRangeFilter?: boolean;
    hideMagnitudeFilter?: boolean;
}

interface PropsFromAppState {
    eqFilters: DAEarthquakeFiltersElement;
}

interface PropsFromDispatch {
    setDataArchiveEarthquakeFilter: typeof setDataArchiveEarthquakeFilterAction;
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    eqFilters: eqFiltersSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setDataArchiveEarthquakeFilter: params => dispatch(
        setDataArchiveEarthquakeFilterAction(params),
    ),
});

type TabKey = 'location' | 'dataRange' | 'others' | 'magnitude';

const iconNames: {
    [key in TabKey]: string;
} = {
    location: 'distance',
    dataRange: 'dataRange',
    magnitude: 'filter',
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

const eqFilterSchema = {
    fields: {
        dataDateRange: [],
        magnitude: [],
        region: [],
    },
};

const getIsFiltered = (key: TabKey | undefined, filters: DAEarthquakeFiltersElement) => {
    if (!key || key === 'others') {
        return false;
    }
    const tabKeyToFilterMap: {
        [key in Exclude<TabKey, 'others'>]: keyof DAEarthquakeFiltersElement;
    } = {
        magnitude: 'magnitude',
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

const initialEqFaramValues = {
    dataDateRange: {
        rangeInDays: 183,
        startDate: undefined,
        endDate: undefined,
    },
    magnitude: [],
    region: {},
};

const getTabs = memoize(
    (
        extraContent: React.ReactNode,
        hideLocationFilter,
        hideMagnitudeFilter,
        hideDataRangeFilter,
    ): {
        [key in TabKey]?: string;
    } => {
        const tabs = {
            location: 'Location',
            dataRange: 'Data range',
            magnitude: 'Magnitude',
            others: 'Others',
        };

        if (!extraContent) {
            delete tabs.others;
        }

        if (hideLocationFilter) {
            delete tabs.location;
        }

        if (hideMagnitudeFilter) {
            delete tabs.magnitude;
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
        hideMagnitudeFilter,
        hideLocationFilter,
    } = props;
    const [activeView, setActiveView] = useState<TabKey | undefined>(undefined);
    const [faramValues, setFaramValues] = useState<DAEarthquakeFiltersElement>(
        initialEqFaramValues,
    );

    useEffect(() => {
        const { eqFilters: fv } = props;
        setFaramValues(fv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        setFaramValues(initialEqFaramValues);

        const { setDataArchiveEarthquakeFilter } = props;
        if (faramValues) {
            setDataArchiveEarthquakeFilter({ dataArchiveEarthquakeFilters: faramValues });
        }
    };

    const handleCloseCurrentFilterButtonClick = () => {
        setActiveView(undefined);
    };

    const handleFaramChange = (fv: DAEarthquakeFiltersElement) => {
        setFaramValues(fv);
    };

    const handleSubmitClick = () => {
        const { setDataArchiveEarthquakeFilter } = props;
        if (faramValues) {
            setDataArchiveEarthquakeFilter({ dataArchiveEarthquakeFilters: faramValues });
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
        dataRange: {
            component: () => (
                <div className={styles.activeView}>
                    <PastDateRangeInput
                        faramElementName="dataDateRange"
                        // autoFocus
                    />
                </div>
            ),
        },
        magnitude: {
            component: () => (
                <MagnitudeSelector
                    className={styles.activeView}
                    faramElementName="magnitude"
                    // autoFocus
                />
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
        hideMagnitudeFilter,
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
                    schema={eqFilterSchema}
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
