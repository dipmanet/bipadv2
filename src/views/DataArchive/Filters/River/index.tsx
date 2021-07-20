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

import { setDataArchiveRiverFilterAction } from '#actionCreators';
import { riverFiltersSelector, riverStationsSelector } from '#selectors';
import { AppState } from '#store/types';
import { DARiverFiltersElement, RiverStation } from '#types';
import PastDateRangeInput from '#components/PastDateRangeInput';
import StationSelector from './Station';
import { getDateDiff, isValidDate } from '#views/DataArchive/utils';
import styles from './styles.scss';

interface ComponentProps {
    className?: string;
    extraContent?: React.ReactNode;
    extraContentContainerClassName?: string;
    hideLocationFilter?: boolean;
    hideDataRangeFilter?: boolean;
}

interface State {
    activeView: TabKey | undefined;
    faramValues: DARiverFiltersElement;
    error: string;
}
interface PropsFromAppState {
    riverFilters: DARiverFiltersElement;
    riverStations: RiverStation[];
}

interface PropsFromDispatch {
    setDataArchiveRiverFilter: typeof setDataArchiveRiverFilterAction;
}

type Props = ComponentProps & PropsFromAppState & PropsFromDispatch;

const mapStateToProps = (state: AppState) => ({
    riverFilters: riverFiltersSelector(state),
    riverStations: riverStationsSelector(state),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch): PropsFromDispatch => ({
    setDataArchiveRiverFilter: params => dispatch(
        setDataArchiveRiverFilterAction(params),
    ),
});

type TabKey = 'station' | 'dataRange' | 'others';

const iconNames: {
    [key in TabKey]: string;
} = {
    station: 'gps',
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

const riverFilterSchema = {
    fields: {
        dataDateRange: [],
        station: [],
    },
};

const getIsFiltered = (key: TabKey | undefined, filters: DARiverFiltersElement) => {
    if (!key || key === 'others') {
        return false;
    }
    const tabKeyToFilterMap: {
        [key in Exclude<TabKey, 'others'>]: keyof DARiverFiltersElement;
    } = {
        station: 'station',
        dataRange: 'dataDateRange',
    };

    const filter = filters[tabKeyToFilterMap[key]];
    if (Array.isArray(filter)) {
        return filter.length !== 0;
    }

    const filterKeys = Object.keys(filter);
    return filterKeys.length !== 0 && filterKeys.every(k => !!filter[k]);
};

class RiverFilters extends React.PureComponent<Props, State> {
    public state = {
        activeView: undefined,
        faramValues: {
            dataDateRange: {
                rangeInDays: 7,
                startDate: undefined,
                endDate: undefined,
            },
            station: {},
        },
        error: '',
    };

    public componentDidMount() {
        const { riverFilters: faramValues } = this.props;
        this.setState({ faramValues });
    }

    private views = {
        station: {
            component: () => (
                <StationSelector
                    className={_cs(styles.activeView, styles.stepwiseRegionSelectInput)}
                    faramElementName="station"
                    wardsHidden
                    stations={this.props.riverStations}
                    // autoFocus
                />
            ),
        },
        dataRange: {
            component: () => (
                <div className={styles.activeView}>
                    <PastDateRangeInput
                        faramElementName="dataDateRange"
                        error={this.state.error}
                        // autoFocus
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
        // isFiltered: getIsFiltered(key, this.props.filters),
        isFiltered: getIsFiltered(key, this.state.faramValues),
    })

    private handleResetFiltersButtonClick = () => {
        this.setState({ activeView: undefined,
            faramValues: {
                dataDateRange: {
                    rangeInDays: 7,
                    startDate: undefined,
                    endDate: undefined,
                },
                station: {},
            } });

        const { setDataArchiveRiverFilter } = this.props;
        const { faramValues } = this.state;
        if (faramValues) {
            setDataArchiveRiverFilter({ dataArchiveRiverFilters: faramValues });
        }
    }

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleFaramChange = (faramValues: DARiverFiltersElement) => {
        // const { setFilters } = this.props;
        // setFilters({ filters: faramValues });
        this.setState({ faramValues });
    }

    private handleSubmitClick = () => {
        const { setDataArchiveRiverFilter } = this.props;
        const { faramValues } = this.state;
        const { dataDateRange } = faramValues || {};
        const { rangeInDays, startDate = '', endDate = '' } = dataDateRange || {};
        let faramError = '';
        if (rangeInDays === 'custom') {
            if (!startDate || !endDate) {
                faramError = 'Date values are empty';
                this.setState({ error: faramError });
            } else if (!isValidDate(startDate) || !isValidDate(endDate)) {
                faramError = 'Invalid Date Values';
                this.setState({ error: faramError });
            } else if (startDate > endDate) {
                faramError = 'Start date cannot be greater than End date';
                this.setState({ error: faramError });
            } else if (getDateDiff(startDate, endDate) > 365) {
                faramError = 'Date range cannot be greater than one year';
                this.setState({ error: faramError });
            }
        }
        if (faramValues && !faramError) {
            this.setState({ error: '' });
            setDataArchiveRiverFilter({ dataArchiveRiverFilters: faramValues });
        }
    }

    private getTabs = memoize(
        (
            extraContent: React.ReactNode,
            hideLocationFilter,
            hideDataRangeFilter,
        ): {
            [key in TabKey]?: string;
        } => {
            const tabs = {
                station: 'Stations',
                dataRange: 'Data range',
                others: 'Others',
            };

            if (!extraContent) {
                delete tabs.others;
            }

            if (hideLocationFilter) {
                delete tabs.station;
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
            hideLocationFilter,
        } = this.props;

        const { faramValues: fv } = this.state;

        const tabs = this.getTabs(
            extraContent,
            hideLocationFilter,
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
                        schema={riverFilterSchema}
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

export default connect(mapStateToProps, mapDispatchToProps)(RiverFilters);
