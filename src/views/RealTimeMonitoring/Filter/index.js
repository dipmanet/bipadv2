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
    { icon: '■', color: '#03A9F4', label: 'Below Warning Level' },
    { icon: '■', color: '#3F51B5', label: 'Above Warning Level' },
    { icon: '■', color: '#9C27B0', label: 'Above Danger Level' },
];

const riverLegendItems = [
    { icon: '●', color: '#00C853', label: 'Steady And Below Warning Level' },
    { icon: '●', color: '#304FFE', label: 'Steady And Above Warning Level' },
    { icon: '●', color: '#C51162', label: 'Steady And Above Danger Level' },
    { icon: '▲', color: '#00C853', label: 'Rising And Below Warning Level' },
    { icon: '▲', color: '#304FFE', label: 'Rising And Above Warning Level' },
    { icon: '▲', color: '#C51162', label: 'Rising AND Above Danger Level' },
    { icon: '▼', color: '#00C853', label: 'Falling And Below Warning Level' },
    { icon: '▼', color: '#304FFE', label: 'Falling And Above Warning Level' },
    { icon: '▼', color: '#C51162', label: 'Falling And Below Danger Level' },

];

const earthquakeLegendItems = [
    { icon: '●', color: '#a50f15', label: 'Great (Magnitude 8 or more)' },
    { icon: '●', color: '#de2d26', label: 'Major (Magnitude 7 or more)' },
    { icon: '●', color: '#fb6a4a', label: 'Strong (Magnitude 6 or more)' },
    { icon: '●', color: '#fc9272', label: 'Moderate (Magnitude 5 or more)' },
    { icon: '●', color: '#fcbba1', label: 'Light (Magnitude 4 or more)' },
    { icon: '●', color: '#fee5d9', label: 'Minor (Magnitude 3 or more)' },
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
                            { showRain &&
                                <div className={styles.container}>
                                    <h4 className={styles.heading}>
                                        Rain
                                    </h4>
                                    <Legend
                                        className={styles.legend}
                                        data={rainLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={() => ''}
                                    />
                                </div>
                            }
                            { showRiver &&
                                <div className={styles.container}>
                                    <h4 className={styles.heading}>
                                        River
                                    </h4>
                                    <Legend
                                        className={styles.legend}
                                        data={riverLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={() => ''}
                                    />
                                </div>
                            }
                            { showEarthquake &&
                                <div className={styles.container}>
                                    <h4 className={styles.heading}>
                                        Earthquake
                                    </h4>
                                    <Legend
                                        className={styles.legend}
                                        data={earthquakeLegendItems}
                                        itemClassName={styles.legendItem}
                                        keySelector={itemSelector}
                                        iconSelector={iconSelector}
                                        labelSelector={legendLabelSelector}
                                        colorSelector={legendColorSelector}
                                        emptyComponent={() => ''}
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
