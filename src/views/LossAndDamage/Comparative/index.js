import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    listToMap,
} from '@togglecorp/fujs';
import { connect } from 'react-redux';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';
import { lossMetrics } from '#utils/domain';

import Map from '#rscz/Map';

import {
    mapStyleSelector,
} from '#selectors';
import CommonMap from '#components/CommonMap';
import TextOutput from '#components/TextOutput';
import RegionSelectInput from '#components/RegionSelectInput';
import Button from '#rsca/Button';

import {
    getGroupMethod,
    getSanitizedIncidents,
    getGroupedIncidents,
    getAggregatedStats,
} from '../common';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
});

const emptyObject = {};

class Comparative extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            faramValues: {},
            faramErrors: {},
            comparisionStarted: false,
        };

        this.schema = {
            fields: {
                region1: [requiredCondition],
                region2: [requiredCondition],
            },
        };
    }

    componentDidMount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            this.previousMapControlDisplay = mapControls.style.display;
            mapControls.style.display = 'none';
        }
    }

    componentWillUnmount() {
        const mapControls = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];

        if (mapControls) {
            mapControls.style.display = this.previousMapControlDisplay;
        }
    }

    handleFaramChange = (faramValues, faramErrors) => {
        this.setState({
            faramValues,
            faramErrors,
        });
    }

    handleFaramValidationSuccess = (faramValues) => {
        this.setState({
            faramValues,
            comparisionStarted: true,
        });
    }

    handleFaramValidationFailure = (faramErrors) => {
        this.setState({ faramErrors });
    }

    generateOverallDataset = memoize((incidents, regions, region) => {
        if (!incidents || incidents.length <= 0) {
            return {
                mapping: [],
                sanitizedIncidents: [],
            };
        }

        const sanitizedIncidents = getSanitizedIncidents(incidents, regions);

        const groupFn = getGroupMethod(region.adminLevel);
        const regionGroupedIncidents = getGroupedIncidents(
            sanitizedIncidents,
            groupFn,
        );

        const listToMapGroupedItem = groupedIncidents => (
            listToMap(
                groupedIncidents,
                incident => incident.key,
                incident => incident,
            )
        );
        const mapping = listToMapGroupedItem(regionGroupedIncidents);

        return {
            mapping,
            sanitizedIncidents,
            aggregatedStat: regionGroupedIncidents[region.geoarea],
        };
    })

    renderAggregatedStat = ({
        data,
        className,
    }) => (
        <div className={className}>
            { lossMetrics.map(metric => (
                <TextOutput
                    className={styles.statMetric}
                    key={metric.key}
                    label={metric.label}
                    value={data[metric.key]}
                    isNumericValue
                    type="block"
                />
            ))}
        </div>
    )

    render() {
        const {
            className,
            mapStyle,
            lossAndDamageList,
            regions,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            comparisionStarted,
        } = this.state;

        const {
            region1,
            region2,
        } = faramValues;

        const dataset1 = region1
            ? this.generateOverallDataset(lossAndDamageList, regions, region1)
            : emptyObject;
        const dataset2 = region2
            ? this.generateOverallDataset(lossAndDamageList, regions, region2)
            : emptyObject;


        const AggregatedStat = this.renderAggregatedStat;

        return (
            <div className={_cs(styles.comparative, className)}>
                <Faram
                    className={styles.regionSelectionForm}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    onValidationSuccess={this.handleFaramValidationSuccess}
                    schema={this.schema}
                    value={faramValues}
                    error={faramErrors}
                    disabled={false}
                >
                    <RegionSelectInput
                        label="First location"
                        className={styles.regionInput}
                        faramElementName="region1"
                        showHintAndError
                    />
                    <RegionSelectInput
                        label="Second location"
                        className={styles.regionInput}
                        faramElementName="region2"
                        showHintAndError
                        disabled={!faramValues.region1}
                    />
                    <Button
                        type="submit"
                        disabled={!faramValues.region1 || !faramValues.region2}
                    >
                        Start comparision
                    </Button>
                </Faram>
                { comparisionStarted && (
                    <div className={styles.comparisionContainer}>
                        <div className={styles.mapContainer}>
                            <Map
                                className={styles.map1}
                                mapStyle={mapStyle}
                                fitBoundsDuration={200}
                                minZoom={5}
                                logoPosition="bottom-left"

                                showScaleControl
                                scaleControlPosition="bottom-right"

                                showNavControl
                                navControlPosition="bottom-right"
                            >
                                <CommonMap
                                    region={faramValues.region1}
                                />
                            </Map>
                            <Map
                                className={styles.map2}
                                mapStyle={mapStyle}
                                fitBoundsDuration={200}
                                minZoom={5}
                                logoPosition="bottom-left"

                                showScaleControl
                                scaleControlPosition="bottom-right"

                                showNavControl
                                navControlPosition="bottom-right"
                            >
                                <CommonMap
                                    region={faramValues.region2}
                                />
                            </Map>
                        </div>
                        <div className={styles.visualizations}>
                            <div className={styles.aggregatedStats}>
                                <AggregatedStat
                                    className={styles.aggregatedStat1}
                                    data={dataset1.aggregatedStat}
                                />
                                <AggregatedStat
                                    className={styles.aggregatedStat1}
                                    data={dataset2.aggregatedStat}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Comparative);
