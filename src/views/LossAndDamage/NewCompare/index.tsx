/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';

import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';
import Faram, {
    requiredCondition,
} from '@togglecorp/faram';

import Button from '#rsca/Button';
import Modal from '#rscv/Modal';

import LossDetails from '#components/LossDetails';
import GeoResolve from '#components/GeoResolve';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import {
    mapStyleSelector,
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    hazardTypesSelector,
} from '#selectors';

import { saveChart } from '#utils/common';

import { getSanitizedIncidents, metricMap } from '../common';

import styles from './styles.scss';
import AreaChartVisual from '../AreaChart';
import BarChartVisual from '../Barchart';
import HazardWise from '../HazardWise';
import { createSingleList } from '#components/RegionSelectInput/util.js';
import Dropdown from '../DropDown';

import {
    tooltipRenderer,
    generateOverallDataset,
    colorGrade,
    generateColor,
    generateMapState,
    generatePaint,
} from '../utils/utils';
import ChoroplethMap from '#components/ChoroplethMap';
import { legendItems } from '../Legend';

const propTypes = {
};

const defaultProps = {
};

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
    regions: regionsSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    hazardTypes: hazardTypesSelector(state),
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

class NewCompare extends React.PureComponent {
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

    messageForNoData = (noData) => {
        const noOptionSelected = 'No comparison is made';
        const nodataAvailable = 'Data is not available';
        return (
            <div className={styles.preComparisionMessage}>
                <h3 className={styles.headerText}>{noData ? nodataAvailable : noOptionSelected}</h3>
                <p className={styles.textOption}>
                    {
                        `Try selecting ${noData ? 'a region' : 'different section'} to compare`
                    }
                </p>
            </div>
        );
    }

    render() {
        const {
            className,
            lossAndDamageList,
            mapStyle,
            minDate,
            regions,
            closeModal,
            getDataAggregatedByYear,
            selectOption,
            valueOnclick,
            getHazardsCount,
            hazardTypes,
            provinces,
            municipalities,
            districts,
            setSelectOption,
            setVAlueOnClick,
            currentSelection,
            handleSaveClick,
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

        const RegionOptions = createSingleList(provinces, districts, municipalities)
            .map(region => ({
                adminLevel: region.adminLevel,
                geoarea: region.id,
                label: region.title,
            }));

        const dropDownClickHandler = (item, index, elementName) => {
            const data = { adminLevel: item.adminLevel, geoarea: item.geoarea };
            this.setState({ faramValues: { ...faramValues, [elementName]: data } });
        };

        const clearValues = (element: string) => {
            this.setState({ faramValues: { ...faramValues, [element]: null } });
        };

        const filterGeoArea = (value) => {
            const totalData = createSingleList(provinces, districts, municipalities);
            if (value) {
                const filteredData = totalData.filter(item => item.adminLevel === value.adminLevel
                    && item.id === value.geoarea);

                return filteredData;
            }
            return [];
        };

        const mapStateValue = (Region, Incidents) => {
            const geoareas = filterGeoArea(Region);
            const regionLevel = Region && Region.adminLevel;

            const {
                mapping,
                aggregatedStat,
            } = generateOverallDataset(Incidents, regionLevel);

            const mapState = Object.values(mapping).map(item => ({
                id: geoareas[0].id,
                value: item[currentSelection.key],
            }));

            return mapState;
        };
        const colorRange = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const item of legendItems) {
            colorRange.push(item.value, item.color);
        }
        const colorPaint = generatePaint(colorRange);

        return (
            <Modal className={_cs(className, styles.comparative)
            }
            >
                <div className={styles.regionHead}>
                    <h1 className={styles.compareText}>
                        COMPARE
                    </h1>
                    <Button
                        title="Download Chart"
                        className={styles.chartDownload}
                        transparent
                        disabled={!region1 && !region2}
                        onClick={() => handleSaveClick('comparative', 'compare')}
                        iconName="download"
                    />
                    <Button
                        onClick={closeModal}
                        iconName="close"
                        className={styles.closeButton}
                    />
                </div>
                <header className={styles.header}>
                    <div
                        className={styles.regionSelectionForm}
                    >
                        <Dropdown
                            elementName="region1"
                            label="Enter a Location to compare"
                            className={styles.regionInput}
                            placeholder="Select an Option"
                            dropdownOption={RegionOptions}
                            icon={false}
                            dropDownClickHandler={dropDownClickHandler}
                            deleteicon
                            clearValues={clearValues}
                        />
                        <Dropdown
                            elementName="region2"
                            label="Enter a Location to compare"
                            className={styles.regionInput}
                            placeholder="Select an Option"
                            dropdownOption={RegionOptions}
                            icon={false}
                            dropDownClickHandler={dropDownClickHandler}
                            deleteicon
                            clearValues={clearValues}

                        />
                    </div>
                </header>
                <div
                    className={styles.content}
                >
                    {(!region1 && !region2) ? (
                        this.messageForNoData(false)
                    ) : (
                        <div className={styles.comparisionContainer}>
                            <div className={styles.mapContainer}>
                                {isRegionValid(faramValues.region1)
                                    && region1Incidents.length > 0
                                    ? (
                                        <Map
                                            mapStyle={mapStyle}
                                            mapOptions={{
                                                logoPosition: 'top-left',
                                                minZoom: 5,
                                            }}
                                            // debug

                                            scaleControlShown
                                            scaleControlPosition="bottom-right"

                                            navControlShown
                                            navControlPosition="bottom-right"
                                        >
                                            <MapContainer className={styles.map1} />
                                            <ChoroplethMap
                                                sourceKey="comparative-first"
                                                paint={colorPaint}
                                                mapState={
                                                    mapStateValue(
                                                        faramValues.region1,
                                                        region1Incidents,
                                                    )
                                                }
                                                region={faramValues.region1}
                                                tooltipRenderer={prop => tooltipRenderer(
                                                    prop,
                                                    currentSelection.name,
                                                )}
                                                isDamageAndLoss
                                            />
                                        </Map>
                                    )
                                    : this.messageForNoData(true)
                                }
                                {isRegionValid(faramValues.region2)
                                    && region2Incidents.length > 0
                                    ? (
                                        <Map
                                            mapStyle={mapStyle}
                                            mapOptions={{
                                                logoPosition: 'top-left',
                                                minZoom: 5,
                                            }}
                                            // debug

                                            scaleControlShown
                                            scaleControlPosition="bottom-right"

                                            navControlShown
                                            navControlPosition="bottom-right"
                                        >
                                            <MapContainer className={styles.map2} />
                                            <ChoroplethMap
                                                sourceKey="comparative-second"
                                                paint={colorPaint}
                                                mapState={
                                                    mapStateValue(
                                                        faramValues.region2,
                                                        region2Incidents,
                                                    )
                                                }
                                                region={faramValues.region2}
                                                tooltipRenderer={prop => tooltipRenderer(
                                                    prop,
                                                    currentSelection.name,
                                                )}
                                                isDamageAndLoss
                                            />
                                        </Map>
                                    ) : this.messageForNoData(true)
                                }
                            </div>
                            <div
                                className={styles.visualizations}
                                id="comparative"
                            >
                                <div className={styles.otherVisualizations}>
                                    {isRegionValid(faramValues.region1)
                                        && region1Incidents.length > 0
                                        ? (
                                            <BarChartVisual
                                                className={styles.region1Container}
                                                data={region1Incidents}
                                                regionRadio={region1}
                                                selectOption={selectOption}
                                                valueOnclick={valueOnclick}
                                            />
                                        )
                                        : <div />
                                    }
                                    {isRegionValid(faramValues.region2)
                                        && region2Incidents.length > 0
                                        ? (
                                            <BarChartVisual
                                                className={styles.region2Container}
                                                data={region2Incidents}
                                                regionRadio={region2}
                                                selectOption={selectOption}
                                                valueOnclick={valueOnclick}
                                            />
                                        ) : <div />
                                    }
                                </div>
                                <div className={styles.otherVisualizations}>
                                    {isRegionValid(faramValues.region1)
                                        && region1Incidents.length > 0
                                        ? (
                                            <div className={styles.region1Container}>
                                                <AreaChartVisual
                                                    data={getDataAggregatedByYear(region1Incidents)}
                                                    selectOption={selectOption}

                                                />
                                            </div>
                                        ) : <div />
                                    }
                                    {isRegionValid(faramValues.region2)
                                        && region2Incidents.length > 0
                                        ? (
                                            <div className={styles.region2Container}>
                                                <AreaChartVisual
                                                    data={getDataAggregatedByYear(region2Incidents)}
                                                    selectOption={selectOption}

                                                />
                                            </div>
                                        ) : <div />
                                    }
                                </div>
                                <div className={styles.otherVisualizations}>
                                    {isRegionValid(faramValues.region1)
                                        && region1Incidents.length > 0
                                        ? (
                                            <div className={styles.region1Container}>
                                                <HazardWise
                                                    // eslint-disable-next-line max-len
                                                    data={getHazardsCount(region1Incidents, hazardTypes)}
                                                    selectOption={selectOption}

                                                />
                                            </div>
                                        ) : <div />
                                    }
                                    {isRegionValid(faramValues.region2)
                                        && region2Incidents.length > 0
                                        ? (
                                            <div className={styles.region2Container}>
                                                <HazardWise
                                                    // eslint-disable-next-line max-len
                                                    data={getHazardsCount(region2Incidents, hazardTypes)}
                                                    selectOption={selectOption}

                                                />
                                            </div>
                                        ) : <div />
                                    }
                                </div>
                                {
                                    (region1Incidents.length > 0 || region2Incidents.length > 0)
                                    && (
                                        <p className={styles.hazardText}>
                                            Data source : nepal police,drr portal
                                        </p>
                                    )
                                }

                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

export default connect(mapStateToProps)(NewCompare);
