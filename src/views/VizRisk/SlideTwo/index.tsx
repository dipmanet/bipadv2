import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    ResponsiveContainer,
    PieChart,
    Legend,
    Tooltip,
    Pie,
    Cell,
    Sector,
} from 'recharts';
import Page from '#components/Page';
import CustomChartLegend from '../CustomChartLegend';
import Icon from '#rscg/Icon';
import RightPane from './RightPane';
import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import VRLegend from '../VRLegend';
import VizriskMap from '#components/VizriskMap';

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


interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const colorGrade = [
    '#ffedb8',
];


const itemSelector = (d: { label: string }) => d.label;
const legendLabelSelector = (d: { label: string }) => d.label;
const legendColorSelector = (d: { color: string }) => d.color;
const classNameSelector = (d: { style: string }) => d.style;


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
        'fill-opacity': 1,
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

        const mapStyle = 'mapbox://styles/ankur20/ckkfa1ai212pf17ru8g36j1nb';

        return (
            <div className={styles.vzMainContainer}>
                <Map
                    mapStyle={mapStyle}
                    mapOptions={{
                        logoPosition: 'top-left',
                        zoom: 13,
                        maxZoom: 17,

                    }}
                    scaleControlShown
                    scaleControlPosition="bottom-right"
                    flyTo={[81.123711, 28.436586, 13]}
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
                <VRLegend>
                    <h2>SPATIAL DATA</h2>
                    <p className={styles.settlementIconContainer}>
                        <span>
                            <Icon
                                name="circle"
                                className={styles.settlementIcon}
                            />
                        </span>
                            Settlement

                    </p>
                    <p className={styles.riverIconContainer}>
                        <span className={styles.riverIcon}>
                                ___
                        </span>
                            River
                    </p>
                </VRLegend>
                <RightPane />
            </div>
        );
    }
}

export default connect(mapStateToProps)(SlideTwo);
