import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    Line,
    Pie,
    Cell,
    CartesianGrid,
} from 'recharts';
import { GeoJSON } from '../GeoJSON';
import VizRiskContext, { VizRiskContextProps } from '#components/VizRiskContext';
import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';
import Icon from '#rscg/Icon';

import * as PageTypes from '#store/atom/page/types';
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

import styles from './styles.scss';
import RightPane from './RightPane';

interface State {
    hoveredAlertId: AlertElement['id'] | undefined;
    hoveredEventId: EventElement['id'] | undefined;
    hazardTypes: PageTypes.HazardType[] | undefined;
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const colorGrade = [
    '#918b61',
    // '#5aa8a3',
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

class SlideOne extends React.PureComponent<Props, State> {
    public static contextType = VizRiskContext;

    public constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
        };
    }

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
        const { currentPage } = this.context;

        const {
            municipalities,
            wards,
        } = this.props;

        const mapping = [];
        // if (municipalities) {
        //     municipalities.map((item) => {
        //         const { id } = item;
        //         if (id !== 58007) {
        //             mapping.push({ id, value: 1 });
        //         } else { mapping.push({ id, value: 0 }); }
        //         return null;
        //     });
        // }
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

        const mapStyle = 'mapbox://styles/ankur20/ckkwdvg544to217orazo712ra';
        return (
            <div className={styles.vzMainContainer}>
                <Map
                    mapStyle={mapStyle}
                    mapOptions={{
                        logoPosition: 'top-left',
                        minZoom: 3,
                        maxZoom: 17,
                    }}
                    flyTo={[81.123711, 28.436586, 11]}
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
                <RightPane />
            </div>
        );
    }
}

export default connect(mapStateToProps)(SlideOne);
