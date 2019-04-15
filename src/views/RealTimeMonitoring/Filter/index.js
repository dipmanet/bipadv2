import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Faram from '@togglecorp/faram';
import { _cs } from '@togglecorp/fujs';

import Button from '#rsca/Button';
import ListSelection from '#rsci/ListSelection';
import Legend from '#rscz/Legend';

import {
    setRealTimeFiltersAction,
} from '#actionCreators';
import {
    realTimeFiltersSelector,
} from '#selectors';

import CollapsibleView from '#components/CollapsibleView';
import RegionSelectInput from '#components/RegionSelectInput';
import { iconNames } from '#constants';

import styles from './styles.scss';

const realTimeKeySelector = d => d.id;
const realTimeLabelSelector = d => d.title;

const rainLegendItems = [
    { icon: '■', color: '#6FD1FD', label: 'Below Warning Level' },
    { icon: '■', color: '#7482CF', label: 'Above Warning Level' },
    { icon: '■', color: '#9C27B0', label: 'Above Danger Level' },
];

const riverLegendItems = [
    { icon: '●', color: '#53FF9A', label: 'Steady & Below Warning Level' },
    { icon: '●', color: '#5770FE', label: 'Steady & Above Warning Level' },
    { icon: '●', color: '#C51162', label: 'Steady & Above Danger Level' },
    { icon: '▲', color: '#53FF9A', label: 'Rising & Below Warning Level' },
    { icon: '▲', color: '#5770FE', label: 'Rising & Above Warning Level' },
    { icon: '▲', color: '#C51162', label: 'Rising & Above Danger Level' },
    { icon: '▼', color: '#53FF9A', label: 'Falling & Below Warning Level' },
    { icon: '▼', color: '#5770FE', label: 'Falling & Above Warning Level' },
    { icon: '▼', color: '#C51162', label: 'Falling & Below Danger Level' },

];

const earthquakeLegendItems = [
    { icon: '●', color: '#a50f15', label: 'Great (8 or more)' },
    { icon: '●', color: '#de2d26', label: 'Major (7 or more)' },
    { icon: '●', color: '#fb6a4a', label: 'Strong (6 or more)' },
    { icon: '●', color: '#fc9272', label: 'Moderate (5 or more)' },
    { icon: '●', color: '#fcbba1', label: 'Light (4 or more)' },
    { icon: '●', color: '#fee5d9', label: 'Minor (3 or more)' },
];

const pollutionLegendItems = [
    { icon: '●', color: '#009966', label: 'Good (12 or less)' },
    { icon: '●', color: '#ffde33', label: 'Moderate (35.4 or less)' },
    { icon: '●', color: '#ff9933', label: 'Unhealthy for Sensitive Groups (55.4 or less)' },
    { icon: '●', color: '#cc0033', label: 'Unhealthy (150.4 or less)' },
    { icon: '●', color: '#660099', label: 'Very Unhealthy (350.4 or less)' },
    { icon: '●', color: '#7e0023', label: 'Hazardous (500.4 or less)' },
];

const itemSelector = d => d.label;
const iconSelector = d => d.icon;
const legendColorSelector = d => d.color;
const legendLabelSelector = d => d.label;

const propTypes = {
    setFilters: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string,
    realTimeList: PropTypes.array.isRequired,
    rainPending: PropTypes.bool,
    riverPending: PropTypes.bool,
    earthquakePending: PropTypes.bool,
};


const defaultProps = {
    className: '',
    rainPending: true,
    riverPending: true,
    earthquakePending: true,
};

const mapStateToProps = state => ({
    filters: realTimeFiltersSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setFilters: params => dispatch(setRealTimeFiltersAction(params)),
});


class RealTimeMonitoringFilter extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static schema = {
        fields: {
            region: [],
        },
    }

    constructor(props) {
        super(props);

        this.state = {
            showFilters: true,
        };
    }

    handleShowFiltersButtonClick = () => {
        this.setState({ showFilters: true });
    }

    handleHideFiltersButtonClick = () => {
        this.setState({ showFilters: false });
    }

    handleFaramChange = (faramValues, faramErrors) => {
        this.props.setFilters({
            faramValues,
            faramErrors,
            pristine: false,
        });
    }

    handleFaramFailure = (faramErrors) => {
        this.props.setFilters({
            faramErrors,
            pristine: true,
        });
    }

    handleFaramSuccess = (_, values) => {
        // console.warn('Filters', values);
    }

    render() {
        const {
            className,
            filters: {
                faramValues,
                faramErrors,
            },
            rainPending,
            riverPending,
            earthquakePending,
            showRain,
            showRiver,
            showEarthquake,
            showPollution,
            realTimeList,
        } = this.props;

        const { showFilters } = this.state;

        return (
            <CollapsibleView
                className={_cs(styles.filter, className)}
                expanded={showFilters}
                collapsedViewContainerClassName={styles.showFilterButtonContainer}
                collapsedView={
                    <Button
                        onClick={this.handleShowFiltersButtonClick}
                        iconName={iconNames.filter}
                        title="Show filters"
                    />
                }
                expandedViewContainerClassName={styles.filtersContainer}
                expandedView={
                    <React.Fragment>
                        <header className={styles.header}>
                            <h4 className={styles.heading}>
                                Filters
                            </h4>
                            <Button
                                onClick={this.handleHideFiltersButtonClick}
                                iconName={iconNames.chevronUp}
                                title="Hide Filters"
                                transparent
                            />
                        </header>
                        <Faram
                            className={styles.filterForm}
                            onChange={this.handleFaramChange}
                            onValidationFailure={this.handleFaramValidationFailure}
                            onValidationSuccess={this.handleFaramValidationSuccess}
                            schema={RealTimeMonitoringFilter.schema}
                            value={faramValues}
                            error={faramErrors}
                            disabled={false}
                        >
                            <RegionSelectInput
                                faramElementName="region"
                            />
                            <ListSelection
                                label="Realtime data"
                                className={styles.realTimeSourcesInput}
                                faramElementName="realtimeSources"
                                options={realTimeList}
                                keySelector={realTimeKeySelector}
                                labelSelector={realTimeLabelSelector}
                            />
                        </Faram>
                        <div className={styles.legendsContainer}>
                            { (showRain || showRiver || showEarthquake || showPollution) &&
                                <h4>Legend</h4>
                            }
                            { showRain &&
                                <div className={styles.container}>
                                    <h5 className={styles.heading}>
                                        Rain
                                    </h5>
                                    <Legend
                                        className={styles.legend}
                                        data={rainLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={null}
                                    />
                                </div>
                            }
                            { showRiver &&
                                <div className={styles.container}>
                                    <h5 className={styles.heading}>
                                        River
                                    </h5>
                                    <Legend
                                        className={styles.legend}
                                        data={riverLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={null}
                                    />
                                </div>
                            }
                            { showEarthquake &&
                                <div className={styles.container}>
                                    <h5 className={styles.heading}>
                                        Earthquake
                                    </h5>
                                    <Legend
                                        className={styles.legend}
                                        data={earthquakeLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={null}
                                    />
                                </div>
                            }
                            { showPollution &&
                                <div className={styles.container}>
                                    <h5 className={styles.heading}>
                                        Pollution (PM <sub>2.5</sub>)
                                    </h5>
                                    <Legend
                                        className={styles.legend}
                                        data={pollutionLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={null}
                                    />
                                </div>
                            }
                        </div>
                    </React.Fragment>
                }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeMonitoringFilter);
