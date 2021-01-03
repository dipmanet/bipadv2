import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { _cs, mapToList, isNotDefined } from '@togglecorp/fujs';
import Page from '#components/Page';


import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import CommonMap from '#components/CommonMap';
import * as PageTypes from '#store/atom/page/types';
import ChoroplethMap from '#components/ChoroplethMap';

import LayerSwitch from '#components/LayerSwitch';
import LayerToggle from '#components/LayerToggle';

import {
    AlertElement,
    EventElement,
    FiltersElement,
} from '#types';

import {
    mapStyleSelector,
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    hazardTypesSelector,
} from '#selectors';

import styles from './styles.scss';

interface State {
    hoveredAlertId: AlertElement['id'] | undefined;
    hoveredEventId: EventElement['id'] | undefined;
    hazardTypes: PageTypes.HazardType[] | undefined;
}

interface Params {
    triggerAlertRequest: (timeout: number) => void;
    triggerEventRequest: (timeout: number) => void;
}
interface ComponentProps {}
interface PropsFromAppState {
    alertList: PageTypes.Alert[];
    eventList: PageTypes.Event[];
    hazardTypes: Obj<PageTypes.HazardType>;
    filters: FiltersElement;
}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const colorGrade = [
    '#e6facb',
    '#5aa8a3',
];

const mapStateToProps = state => ({
    mapStyle: mapStyleSelector(state),
    regions: regionsSelector(state),
    provinces: provincesSelector(state),
    districts: districtsSelector(state),
    municipalities: municipalitiesSelector(state),
    wards: wardsSelector(state),
    hazardTypes: hazardTypesSelector(state),
});

class VizRisk extends React.PureComponent<Props, State> {
    public generateColor = memoize((maxValue, minValue, colorMapping) => {
        const newColor = [];
        const { length } = colorMapping;
        const range = maxValue - minValue;
        colorMapping.forEach((color, i) => {
            const val = minValue + ((i * range) / (length - 1));
            newColor.push(val);
            newColor.push(color);
        });
        return newColor;
    });

    public generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...color,
        ],
    }))

    public generateMapState1 = memoize((regionLevel, regions) => {
        const accessor = (
            (isNotDefined(regionLevel) && 'province')
            || (regionLevel === 1 && 'district')
            || (regionLevel === 2 && 'municipality')
            || (regionLevel === 3 && 'ward')
        );
        const projects = [];
        const mapping = {};
        projects.forEach((project) => {
            const values = project[accessor];
            Object.keys(values).forEach((id) => {
                mapping[id] = (mapping[id] || 0) + 1;
            });
        });

        const selectedRegion = (
            (isNotDefined(regionLevel) && regions.provinces)
            || (regionLevel === 1 && regions.districts)
            || (regionLevel === 2 && regions.municipalities)
            || (regionLevel === 3 && regions.wards)
        );

        return mapToList(
            selectedRegion,
            (_, key) => ({ id: key, value: mapping[key] || 0 }),
        );
    });

    // public generateMapState = memoize((municipalities) => {

    // });

    public render() {
        const {
            regions,
            municipalities,
        } = this.props;
        const projects = [];
        const regionLevel = 3;

        const mapping = [];
        // Object.keys(municipalities).forEach(municipality => console.log(municipality));
        if (municipalities) {
            municipalities.map((item) => {
                const { id } = item;
                if (id !== 58007) {
                    mapping.push({ id, value: 1 });
                } else { mapping.push({ id, value: 0 }); }
                return null;
            });
        }
        console.log('mapping: ', mapping);

        // const mapState = this.generateMapState(regionLevel, regions);
        // const maxValue = Math.max(1, ...mapState.map(item => item.value));
        const color = this.generateColor(1, 0, colorGrade);
        const colorPaint = this.generatePaint(color);

        const {
            mapStyle,
        } = this.props;
        return (
            <div className={styles.vzMainContainer}>
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
                    {/* <CommonMap
                        sourceKey="viz-risk-test"
                        region={{ adminLevel: 2, geoarea: 65 }}
                    /> */}
                    <ChoroplethMap
                        paint={colorPaint}
                        sourceKey={'vizrisk'}
                        region={{ adminLevel: 2, geoarea: 65 }}
                        mapState={mapping}
                    />
                    <LayerSwitch
                        className={styles.layerSwitch}
                    />
                    <LayerToggle />
                </Map>

                <Page
                    hideMap
                    hideFilter
                />
                <div className={styles.vrSideBar}>
                    <h1> Rajpur Municipality </h1>
                    <p>
                        {' '}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud
                        exercitation

                    </p>
                    <h2>Climate</h2>
                    <p>
                        {' '}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                        occaecat cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum

                    </p>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(VizRisk);
