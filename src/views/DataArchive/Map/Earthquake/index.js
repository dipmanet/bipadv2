import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';


import styles from './styles.scss';

import CommonMap from '#components/CommonMap';
import {
    getMapPaddings,
    mapStyles,
} from '#constants';
import MapSource from '#re-map/MapSource';
import MapLayer from '#re-map/MapSource/MapLayer';
import MapTooltip from '#re-map/MapTooltip';
import {
    districtsSelector,
    eqFiltersSelector,
    municipalitiesSelector,
    provincesSelector,
} from '#selectors';
import Tooltip from './Tooltip';

const EarthquakeToolTip = ({ renderer: Renderer, params }) => (
    <Renderer {...params} />
);

const mapStateToProps = state => ({
    eqFilters: eqFiltersSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
});

const getRegionDetails = (region) => {
    const { adminLevel, geoarea } = region;
    const regionDetail = {
        regionLevel: adminLevel,
        provinceLevel: undefined,
        districtLevel: undefined,
        municipalityLevel: undefined,
    };
    if (adminLevel === 1) {
        regionDetail.provinceLevel = geoarea;
    }
    if (adminLevel === 2) {
        regionDetail.districtLevel = geoarea;
    }
    if (adminLevel === 3) {
        regionDetail.municipalityLevel = geoarea;
    }
    return regionDetail;
};

const getRegionBoundings = (region, provinces, districts, municipalities) => {
    // const nepalBounds = [
    //     80.05858661752784, 26.347836996368667,
    //     88.20166918432409, 30.44702867091792,
    // ];

    const { adminLevel, geoarea } = region;
    const geoAreas = (
        (adminLevel === 1 && provinces)
        || (adminLevel === 2 && districts)
        || (adminLevel === 3 && municipalities)
    );
    if (!geoAreas) {
        // return nepalBounds;
        return null;
    }
    const geoArea = geoAreas.find(g => g.id === geoarea);
    if (!geoArea) {
        // return nepalBounds;
        return null;
    }
    return geoArea.bbox;
};

const earthquakeToGeojson = (earthquakeList) => {
    const geojson = {
        type: 'FeatureCollection',
        features: earthquakeList
            .filter(earthquake => earthquake.point)
            .map(earthquake => ({
                id: earthquake.id,
                type: 'Feature',
                geometry: {
                    ...earthquake.point,
                },
                properties: {
                    earthquakeId: earthquake.id,
                    address: earthquake.address,
                    description: earthquake.description,
                    eventOn: earthquake.eventOn,
                    magnitude: earthquake.magnitude,
                    date: Date.parse(earthquake.eventOn) || 1,
                },
            }))
            .sort((a, b) => (a.properties.magnitude - b.properties.magnitude)),
    };
    return geojson;
};
class EarthquakeMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getEarthquakeFeatureCollection = memoize(earthquakeToGeojson);

    getBoundsPadding = memoize((leftPaneExpanded, rightPaneExpanded) => {
        const mapPaddings = getMapPaddings();

        if (leftPaneExpanded && rightPaneExpanded) {
            return mapPaddings.bothPaneExpanded;
        }

        if (leftPaneExpanded) {
            return mapPaddings.leftPaneExpanded;
        }

        if (rightPaneExpanded) {
            return mapPaddings.rightPaneExpanded;
        }

        return mapPaddings.noPaneExpanded;
    });

    handleEarthquakeClick = (feature, lngLat) => {
        const {
            properties: {
                address,
                description,
                eventOn,
                magnitude,
            },
        } = feature;

        this.setState({
            tooltipRenderer: Tooltip,
            tooltipParams: {
                address,
                description,
                eventOn,
                magnitude,
            },
            coordinates: lngLat,
        });

        return true;
    }

    handleTooltipClose = () => {
        this.setState({
            tooltipRenderer: null,
            coordinates: undefined,
            tooltipParams: null,
        });
    }

    render() {
        const { data,
            rightPaneExpanded,
            leftPaneExpanded,
            eqFilters: { region },
            provinces,
            districts,
            municipalities } = this.props;

        const {
            tooltipRenderer,
            tooltipParams,
            coordinates,
        } = this.state;

        const earthquakeFeatureCollection = this.getEarthquakeFeatureCollection(
            data,
        );
        const boundsPadding = this.getBoundsPadding(leftPaneExpanded, rightPaneExpanded);
        const tooltipOptions = {
            closeOnClick: true,
            closeButton: false,
            offset: 8,
        };
        const { regionLevel,
            provinceLevel,
            districtLevel,
            municipalityLevel } = getRegionDetails(region);
        const regionBoundings = getRegionBoundings(
            region,
            provinces,
            districts,
            municipalities,
        );
        return (
            <div className={styles.dataArchiveEarthquakeMap}>
                <CommonMap
                    sourceKey="dataArchiveEarthquake"
                    boundsPadding={boundsPadding}
                    regionFromComp={regionLevel}
                    provinceFromComp={provinceLevel}
                    districtFromComp={districtLevel}
                    municipalityFromComp={municipalityLevel}
                    boundingsFromComp={regionBoundings}
                />
                { coordinates && (
                    <MapTooltip
                        coordinates={coordinates}
                        tooltipOptions={tooltipOptions}
                        onHide={this.handleTooltipClose}
                    >
                        <EarthquakeToolTip
                            renderer={tooltipRenderer}
                            params={tooltipParams}
                        />
                    </MapTooltip>
                )}
                <MapSource
                    sourceKey="real-time-earthquake-points"
                    sourceOptions={{ type: 'geojson' }}
                    geoJson={earthquakeFeatureCollection}
                    supportHover
                >
                    <React.Fragment>
                        <MapLayer
                            layerKey="real-time-earthquake-points-fill"
                            onClick={this.handleEarthquakeClick}
                            layerOptions={{
                                type: 'circle',
                                property: 'earthquakeId',
                                paint: mapStyles.earthquakePoint.fill,
                            }}
                        />
                        <MapLayer
                            layerKey="real-time-earthquake-text"
                            layerOptions={{
                                type: 'symbol',
                                property: 'earthquakeId',
                                layout: mapStyles.archiveEarthquakeText.layout,
                                paint: mapStyles.archiveEarthquakeText.paint,
                            }}
                        />
                    </React.Fragment>
                </MapSource>
            </div>
        );
    }
}

export default connect(mapStateToProps, [])(EarthquakeMap);
