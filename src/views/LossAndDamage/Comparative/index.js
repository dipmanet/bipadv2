import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    listToMap,
    isNotDefined,
} from '@togglecorp/fujs';
import { connect } from 'react-redux';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';
import { lossMetrics } from '#utils/domain';
import LossDetails from '#components/LossDetails';
import GeoResolve from '#components/GeoResolve';

import Map from '#rscz/Map';

import {
    mapStyleSelector,
} from '#selectors';
import CommonMap from '#components/CommonMap';
import TextOutput from '#components/TextOutput';
import RegionSelectInput from '#components/RegionSelectInput';
import Button from '#rsca/Button';

import {
    getSanitizedIncidents,
    getGroupMethod,
    getGroupedIncidents,
} from '../common';

import Visualizations from './Visualizations';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
});

const emptyObject = {};
const emptyList = [];

const isValidIncident = (
    { ward, district, municipality, province },
    { adminLevel, geoarea },
) => {
    switch (adminLevel) {
        case 1:
            return geoarea === province;
        case 2:
            return geoarea === district;
        case 3:
            return geoarea === municipality;
        case 4:
            return geoarea === ward;
        default:
            return false;
    }
};

const isRegionValid = region => (
    region && region.adminLevel && region.geoarea
);

class Comparative extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            faramValues: {},
            faramErrors: {},
            // comparisionStarted: false,
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
            this.mapControls = mapControls;
            this.previousMapControlDisplay = mapControls.style.display;
            mapControls.style.display = 'none';
        }
    }

    componentWillUnmount() {
        if (this.mapControls) {
            this.mapControls.style.display = this.previousMapControlDisplay;
        }
    }

    filterIncidents = (incidents = emptyList, regions, region) => {
        if (!region) {
            return [];
        }

        const sanitizedIncidents = getSanitizedIncidents(incidents, regions, {}).filter(
            params => (
                isNotDefined(region)
                    || isNotDefined(region.adminLevel)
                    || isValidIncident(params, region)
            ),
        );

        return sanitizedIncidents;
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
            // comparisionStarted: true,
        });
    }

    handleFaramValidationFailure = (faramErrors) => {
        this.setState({ faramErrors });
    }

    render() {
        const {
            className,
            mapStyle,
            lossAndDamageList,
            regions,
            minDate,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            // comparisionStarted,
        } = this.state;

        const {
            region1,
            region2,
        } = faramValues;

        const region1Incidents = this.filterIncidents(lossAndDamageList, regions, region1);
        const region2Incidents = this.filterIncidents(lossAndDamageList, regions, region2);

        return (
            <div className={_cs(styles.comparative, className)}>
                <Faram
                    className={styles.regionSelectionForm}
                    onChange={this.handleFaramChange}
                    onValidationFailure={this.handleFaramValidationFailure}
                    // onValidationSuccess={this.handleFaramValidationSuccess}
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
                </Faram>
                <div className={styles.comparisionContainer}>
                    <div className={styles.titleContainer}>
                        { isRegionValid(faramValues.region1) &&
                            <h2>
                                <GeoResolve data={region1} />
                            </h2>
                        }
                        { isRegionValid(faramValues.region2) &&
                            <h2>
                                <GeoResolve data={region2} />
                            </h2>
                        }
                    </div>
                    <div className={styles.mapContainer}>
                        { isRegionValid(faramValues.region1) &&
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
                        }
                        { isRegionValid(faramValues.region2) &&
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
                        }
                    </div>
                    <div className={styles.visualizations}>
                        <div className={styles.aggregatedStats}>
                            { isRegionValid(faramValues.region1) &&
                                <LossDetails
                                    className={styles.aggregatedStat}
                                    data={region1Incidents}
                                    minDate={minDate}
                                />
                            }
                            { isRegionValid(faramValues.region2) &&
                                <LossDetails
                                    className={styles.aggregatedStat}
                                    data={region2Incidents}
                                    minDate={minDate}
                                />
                            }
                        </div>
                        <div className={styles.otherVisualizations}>
                            { isRegionValid(faramValues.region1) &&
                                <div className={styles.region1Container}>
                                    <Visualizations
                                        lossAndDamageList={region1Incidents}
                                    />
                                </div>
                            }
                            { isRegionValid(faramValues.region2) &&
                                <div className={styles.region2Container}>
                                    <Visualizations
                                        lossAndDamageList={region2Incidents}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Comparative);
