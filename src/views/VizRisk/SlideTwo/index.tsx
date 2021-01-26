import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    ResponsiveContainer,
    PieChart,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    Line,
    Pie,
    Cell,
    CartesianGrid,
} from 'recharts';
import Page from '#components/Page';

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
import GeoJSON from '../GeoJSON';

import styles from './styles.scss';

const data = [
    { name: 'Built up areas', value: 9.73 },
    { name: 'Agricultural land', value: 103.24 },
    { name: 'Forest', value: 6.03 },
    { name: 'Sandy area', value: 3.90 },
    { name: 'Water bodies', value: 3.29 },
];
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b'];


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
        'fill-opacity': 0,
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

        const mapStyle = 'mapbox://styles/ankur20/ckkcdfgkg26jp18qvi3i4ynrf';
        // const mapStyle = 'mapbox://styles/mapbox/dark-v10';

        return (
            <div className={styles.vzMainContainer}>
                {/* <VrLegend title={'Spatial Data'}>
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
                </VrLegend> */}
                {/* <Map
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
                        settlementData={GeoJSON.rajapurSettlement}
                    />
                </Map> */}

                <Map
                    mapStyle={mapStyle}
                    mapOptions={{
                        logoPosition: 'top-left',
                        minZoom: 7,
                    }}
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
                        settlementData={GeoJSON.rajapurSettlement}
                    />
                </Map>


                <Page
                    hideMap
                    hideFilter
                />
                <div className={styles.vrSideBar}>

                    <h1>Rajapur through Spatial Lens</h1>

                    <p>
                        {' '}
                        Located in the Terai region nd lying close to water bodies,
                        Rajapur has fertile and arable land. Out of total area of
                        127.08 square km, 81.24% of land is used for agriculture.
                        Built-in area covers 7.66% of land while water bodies occupies
                        3.29% of total land in Rajapur.

                    </p>
                    <ResponsiveContainer>
                        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                            <Pie
                                data={data}
                                cx={150}
                                cy={140}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {
                                    data.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />)
                                }
                            </Pie>
                            <Legend verticalAlign="top" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(SlideTwo);
