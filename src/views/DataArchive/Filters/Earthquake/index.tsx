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

interface State {
    activeView: TabKey | undefined;
    faramValues: DAEarthquakeFiltersElement;
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
    magnitude: 'pulse',
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

class EarthquakeFilters extends React.PureComponent<Props, State> {
    public state = {
        activeView: undefined,
        faramValues: {
            dataDateRange: {
                rangeInDays: 7,
                startDate: undefined,
                endDate: undefined,
            },
            magnitude: [],
            region: {},
        },
    };

    public componentDidMount() {
        const { eqFilters: faramValues } = this.props;
        this.setState({ faramValues });
    }

    private views = {
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
        // isFiltered: getIsFiltered(key, this.props.filters),
        isFiltered: getIsFiltered(key, this.state.faramValues),
    })

    private handleResetFiltersButtonClick = () => {
        this.setState({ activeView: undefined,
            faramValues: {
                dataDateRange: {
                    rangeInDays: 183,
                    startDate: undefined,
                    endDate: undefined,
                },
                magnitude: [],
                region: {},
            } });

        const { setDataArchiveEarthquakeFilter } = this.props;
        const { faramValues } = this.state;
        if (faramValues) {
            setDataArchiveEarthquakeFilter({ dataArchiveEarthquakeFilters: faramValues });
        }
    }

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleFaramChange = (faramValues: DAEarthquakeFiltersElement) => {
        // const { setFilters } = this.props;
        // setFilters({ filters: faramValues });
        this.setState({ faramValues });
    }

    private handleSubmitClick = () => {
        const { setDataArchiveEarthquakeFilter } = this.props;
        const { faramValues } = this.state;
        if (faramValues) {
            setDataArchiveEarthquakeFilter({ dataArchiveEarthquakeFilters: faramValues });
        }
    }

    private getTabs = memoize(
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
    )

    public render() {
        const {
            className,
            extraContent,
            hideDataRangeFilter,
            hideMagnitudeFilter,
            hideLocationFilter,
        } = this.props;

        const { faramValues: fv } = this.state;

        const tabs = this.getTabs(
            extraContent,
            hideLocationFilter,
            hideMagnitudeFilter,
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
                        disabled={!validActiveView}
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
                        schema={eqFilterSchema}
                        onChange={this.handleFaramChange}
                        // value={faramValues}
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
                                    onClick={this.handleCloseCurrentFilterButtonClick}
                                />
                            </header>
                        )}
                        <MultiViewContainer
                            views={this.views}
                            active={validActiveView}
                        />
                    </Faram>
                    {validActiveView && (
                        <div
                            onClick={this.handleSubmitClick}
                            className={styles.submitButton}
                            role="presentation"
                        >
                        Submit
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EarthquakeFilters);
