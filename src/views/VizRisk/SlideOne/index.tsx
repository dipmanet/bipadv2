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

const lineData = [
    {
        name: 'Jan', AvgMax: 23, DailyAvg: 15, AvgMin: 7,
    },
    {
        name: 'Feb', AvgMax: 30, DailyAvg: 19, AvgMin: 9,
    },
    {
        name: 'Mar', AvgMax: 35, DailyAvg: 23, AvgMin: 11,
    },
    {
        name: 'Apr', AvgMax: 40, DailyAvg: 28, AvgMin: 16,
    },
    {
        name: 'May', AvgMax: 41, DailyAvg: 32, AvgMin: 23,
    },
    {
        name: 'Jun', AvgMax: 40, DailyAvg: 33, AvgMin: 26,
    },
    {
        name: 'Jul', AvgMax: 37, DailyAvg: 31.5, AvgMin: 26,
    },
    {
        name: 'Aug', AvgMax: 33, DailyAvg: 29, AvgMin: 25,
    },
    {
        name: 'Sep', AvgMax: 33, DailyAvg: 27.5, AvgMin: 22,
    },
    {
        name: 'Oct', AvgMax: 33, DailyAvg: 23.5, AvgMin: 14,
    },
    {
        name: 'Nov', AvgMax: 31, DailyAvg: 20, AvgMin: 9,
    },
    {
        name: 'Dev', AvgMax: 27, DailyAvg: 17, AvgMin: 7,
    },
];

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

    public componentDidUpdate() {
        this.setMapEvents(this.context.map);
    }

    public generatePaint = memoize(color => ({
        'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'value'],
            ...color,
        ],
        'fill-opacity': 0,
    }))

    public handleInfoClick = () => {
        console.log(this.state.showInfo);
        const { showInfo } = this.state;
        if (showInfo) {
            this.setState({ showInfo: false });
        } else {
            this.setState({ showInfo: true });
        }
    };

    private setMapEvents = memoize((map: unknown) => {
        if (!map) {
            return;
        }

        map.flyTo({
            center: [
                -74.5 + (Math.random() - 0.5) * 10,
                40 + (Math.random() - 0.5) * 10,
            ],
            essential: true,
        });
    });

    public render() {
        const { currentPage } = this.context;

        const {
            municipalities,
        } = this.props;

        const {
            showInfo,
        } = this.state;

        const mapping = [];
        if (municipalities) {
            municipalities.map((item) => {
                const { id } = item;
                if (id !== 58007) {
                    mapping.push({ id, value: 1 });
                } else { mapping.push({ id, value: 0 }); }
                return null;
            });
        }
        const color = this.generateColor(1, 0, colorGrade);
        const colorPaint = this.generatePaint(color);

        // const mapStyle = 'mapbox://styles/mapbox/dark-v10';
        // const mapStyle = 'mapbox://styles/ankur20/ckkbbar9b0qtz17ruot7qt9nj';
        const mapStyle = 'mapbox://styles/ankur20/ckkfa1ai212pf17ru8g36j1nb';

        return (
            <div className={styles.vzMainContainer}>
                <Map
                    mapStyle={mapStyle}
                    mapOptions={{
                        logoPosition: 'top-left',
                        minZoom: 5,
                    }}
                    flyTo
                    scaleControlShown
                    scaleControlPosition="bottom-right"

                    navControlShown
                    navControlPosition="bottom-right"
                >
                    <MapContainer className={styles.map2} />

                    <VizriskMap
                        paint={colorPaint}
                        sourceKey={'vizrisk'}
                        region={{ adminLevel: 0, geoarea: 0 }}
                        mapState={mapping}
                    />
                </Map>

                <div className={styles.vrSideBar}>
                    <h1> Rajpur Municipality </h1>
                    <p>
                        {' '}
                        Rajapur municipality lies in the Terai region of Bardiya
                        district in Province five. It covers a total area of 127.08
                        square km, and runs an elevation of 142mto 154m from sea level.

                    </p>
                    <h2>Climate</h2>
                    <p>
                        {' '}
                        Rajapur experiences a lower tropical climate with an average
                        maximum temperature of 41 degree celcius in winter. Summer lasts from
                        Chaitra while there is extreme winter in Mangshir, Poush and Magh.
                        Monsoon starts here a bit early from the last week of Jesth till Ashwin
                        bringing the heavy downpours. Overall in a year, Rajapur experiences
                        average annual rainfall of 1900mm.

                    </p>
                    <div className={styles.chartsContainer}>
                        <ResponsiveContainer className={styles.respContainer}>
                            <LineChart
                                margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
                                data={lineData}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                />
                                <XAxis dataKey="name" />
                                <YAxis dataKey="AvgMax" domain={[0, 45]} />
                                <Legend iconType="square" iconSize={10} />
                                <Line type="monotone" dataKey="AvgMax" stroke="#0069a5" />
                                <Line type="monotone" dataKey="DailyAvg" stroke="#00a1e1" />
                                <Line type="monotone" dataKey="AvgMin" stroke="#00a69b" />
                            </LineChart>

                        </ResponsiveContainer>
                    </div>
                    <div className={styles.iconContainer}>
                        <div
                            className={showInfo ? styles.bottomInfo : styles.bottomInfoHide}
                        >
                            Source: Rajapur Municipality Profile
                        </div>
                        <button type="button" className={styles.infoContainerBtn} onClick={this.handleInfoClick}>
                            <Icon
                                name="info"
                                className={styles.closeIcon}
                            />
                        </button>
                    </div>

                </div>

            </div>
        );
    }
}

export default connect(mapStateToProps)(SlideOne);
