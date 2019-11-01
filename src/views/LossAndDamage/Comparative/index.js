import React from 'react';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';
import { connect } from 'react-redux';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import Page from '#components/Page';
import LossDetails from '#components/LossDetails';
import GeoResolve from '#components/GeoResolve';

import MapContainer from '#rscz/Map/MapContainer';
import Map from '#rscz/Map';

import {
    mapStyleSelector,
} from '#selectors';
import CommonMap from '#components/CommonMap';
import RegionSelectInput from '#components/RegionSelectInput';

import { getSanitizedIncidents } from '../common';

import Visualizations from './Visualizations';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
});

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
            rightPaneExpanded: true,
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
        const mapControlsBottomRight = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
        const mapControlsTopLeft = document.getElementsByClassName('mapboxgl-ctrl-top-left')[0];

        if (mapControlsBottomRight) {
            this.mapControlsBottomRight = mapControlsBottomRight;
            this.previousMapControlBottomRightDisplay = mapControlsBottomRight.style.display;
            mapControlsBottomRight.style.display = 'none';
        }

        if (mapControlsTopLeft) {
            this.mapControlsTopLeft = mapControlsTopLeft;
            this.previousMapControlTopLeftDisplay = mapControlsTopLeft.style.display;
            mapControlsTopLeft.style.display = 'none';
        }
    }

    componentWillUnmount() {
        if (this.mapControlsBottomRight) {
            this.mapControlsBottomRight.style.display = this.previousMapControlBottomRightDisplay;
        }

        if (this.mapControlsTopLeft) {
            this.mapControlsTopLeft.style.display = this.previousMapControlTopLeftDisplay;
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
            lossAndDamageList,
            mapStyle,
            minDate,
            regions,
        } = this.props;

        const {
            faramValues,
            faramErrors,
            rightPaneExpanded,
        } = this.state;

        const {
            region1,
            region2,
        } = faramValues;

        const region1Incidents = this.filterIncidents(lossAndDamageList, regions, region1);
        const region2Incidents = this.filterIncidents(lossAndDamageList, regions, region2);

        return (
            <div className={_cs(className, styles.comparative)}>
                <Page
                    leftContent={null}
                />
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
                { (!region1 && !region2) ? (
                    <div className={styles.preComparisionMessage}>
                        Please select locations to start the comparison
                    </div>
                ) : (
                    <div className={styles.comparisionContainer}>
                        <div className={styles.titleContainer}>
                            { isRegionValid(faramValues.region1) && (
                                <h2>
                                    <GeoResolve data={region1} />
                                </h2>
                            )}
                            { isRegionValid(faramValues.region2) && (
                                <h2>
                                    <GeoResolve data={region2} />
                                </h2>
                            )}
                        </div>
                        <div className={styles.mapContainer}>
                            { isRegionValid(faramValues.region1) && (
                                <Map
                                    mapStyle={mapStyle}
                                    fitBoundsDuration={200}
                                    minZoom={5}
                                    logoPosition="bottom-left"

                                    showScaleControl
                                    scaleControlPosition="bottom-right"

                                    showNavControl
                                    navControlPosition="bottom-right"
                                >
                                    <MapContainer className={styles.map1} />
                                    <CommonMap
                                        region={faramValues.region1}
                                    />
                                </Map>
                            )}
                            { isRegionValid(faramValues.region2) && (
                                <Map
                                    mapStyle={mapStyle}
                                    fitBoundsDuration={200}
                                    minZoom={5}
                                    logoPosition="bottom-left"

                                    showScaleControl
                                    scaleControlPosition="bottom-right"

                                    showNavControl
                                    navControlPosition="bottom-right"
                                >
                                    <MapContainer className={styles.map2} />
                                    <CommonMap
                                        region={faramValues.region2}
                                    />
                                </Map>
                            )}
                        </div>
                        <div className={styles.visualizations}>
                            <div className={styles.aggregatedStats}>
                                { isRegionValid(faramValues.region1) && (
                                    <LossDetails
                                        className={styles.aggregatedStat}
                                        data={region1Incidents}
                                        minDate={minDate}
                                    />
                                )}
                                { isRegionValid(faramValues.region2) && (
                                    <LossDetails
                                        className={styles.aggregatedStat}
                                        data={region2Incidents}
                                        minDate={minDate}
                                    />
                                )}
                            </div>
                            <div className={styles.otherVisualizations}>
                                { isRegionValid(faramValues.region1) && (
                                    <div className={styles.region1Container}>
                                        <Visualizations
                                            lossAndDamageList={region1Incidents}
                                        />
                                    </div>
                                )}
                                { isRegionValid(faramValues.region2) && (
                                    <div className={styles.region2Container}>
                                        <Visualizations
                                            lossAndDamageList={region2Incidents}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps)(Comparative);
