import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import Page from '#components/Page';
import VrLegend from '../VRLegend';
import Legend from '#rscz/Legend';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

import * as PageTypes from '#store/atom/page/types';
import VizriskMap from '#components/VizriskMap';

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
    '#ffedb8',
];
const itemSelector = (d: { label: string }) => d.label;
const legendLabelSelector = (d: { label: string }) => d.label;
const legendColorSelector = (d: { color: string }) => d.color;
const classNameSelector = (d: { style: string }) => d.style;

const vrLegendItems = [
    { color: '#2373a9', label: 'Settlement', style: styles.symbol },
    { color: '#FDD835', label: 'River', style: styles.symbol },
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

class SlideTwo extends React.PureComponent<Props, State> {
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
        'fill-opacity': 0.85,
    }))

    public render() {
        const {
            wards,
        } = this.props;

        const mapping = [];
        if (wards) {
            wards.map((item) => {
                const { id } = item;
                if (item.municipality === 58007) {
                    mapping.push({ id, value: 1 });
                }
                return null;
            });
        }
        const color = this.generateColor(1, 0, colorGrade);
        const colorPaint = this.generatePaint(color);

        const {
            mapStyle,
        } = this.props;
        return (
            <div className={styles.vzMainContainer}>
                <VrLegend title={'Spatial Data'}>
                    <Legend
                        className={styles.legend}
                        data={vrLegendItems}
                        itemClassName={styles.legendItem}
                        keySelector={itemSelector}
                            // iconSelector={iconSelector}
                        labelSelector={legendLabelSelector}
                        symbolClassNameSelector={classNameSelector}
                        colorSelector={legendColorSelector}
                        emptyComponent={null}
                    />
                </VrLegend>
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

                    <VizriskMap
                        paint={colorPaint}
                        sourceKey={'vizrisk'}
                        region={{ adminLevel: 3, geoarea: 58007 }}
                        mapState={mapping}
                    />
                </Map>

                <Page
                    hideMap
                    hideFilter
                />
                <div className={styles.vrSideBar}>

                    <h1>This is Slide two</h1>

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

export default connect(mapStateToProps)(SlideTwo);
