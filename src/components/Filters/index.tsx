import React from 'react';
import Redux from 'redux';
import { connect } from 'react-redux';
import { _cs } from '@togglecorp/fujs';
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
}

interface PropsFromAppState {
    filters: FiltersElement;
}

interface PropsFromDispatch {
    setFilters: typeof setFiltersAction;
}

interface State {
    activeView?: string | undefined;
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
    location: 'map',
    hazard: 'warning',
    dataRange: 'calendar',
    others: 'filter',
};

const FilterIcon = ({
    isActive,
    className,
    ...otherProps
}: {
    isActive?: boolean;
    className?: string;
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

    private handleTabClick = (activeView: string) => {
        this.setState({ activeView });
    }

    private getFilterTabRendererParams = (key: TabKey, title: string) => ({
        name: iconNames[key],
        title,
        className: styles.icon,
    })

    private handleCloseCurrentFilterButtonClick = () => {
        this.setState({ activeView: undefined });
    }

    private handleFaramChange = (faramValues: FiltersElement) => {
        const { setFilters } = this.props;
        setFilters({ filters: faramValues });
    }

    private getTabs = memoize(
        (extraContent: React.ReactNode): {
            [key in TabKey]?: string;
        } => (
            extraContent ? ({
                location: 'Location',
                hazard: 'Hazard',
                dataRange: 'Data range',
                others: 'Others',
            }) : ({
                location: 'Location',
                hazard: 'Hazard',
                dataRange: 'Data range',
            })
        ),
    )

    public render() {
        const {
            className,
            filters: faramValues,
            extraContent,
        } = this.props;

        const { activeView } = this.state;
        const tabs = this.getTabs(extraContent);

        return (
            <div className={_cs(styles.filters, className)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        Filters
                    </h3>
                </header>
                <div className={styles.content}>
                    <ScrollTabs
                        tabs={tabs}
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
                                    { tabs[activeView] }
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
