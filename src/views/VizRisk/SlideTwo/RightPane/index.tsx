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
import CustomChartLegend from '../../CustomChartLegend';
import Icon from '#rscg/Icon';

import Map from '#re-map';
import MapContainer from '#re-map/MapContainer';

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
import GeoJSON from '../../GeoJSON';

import styles from './styles.scss';

const data = [
    { name: 'Built up areas', value: 0.959 },
    { name: 'Agricultural land', value: 94.07 },
    { name: 'Forest', value: 5.99 },
    { name: 'Roads', value: 1 },
    { name: 'Water bodies', value: 1 },
    { name: 'Irrigation Canals', value: 1 },
];
const COLORS = ['#29768a', '#a9c282', '#57673b', '#29768a', '#1a6074', '#52b3cb'];


interface State {
    activeIndex: number;
    selected: number;
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const colorGrade = [
    '#ffedb8',
];

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

class RightPane extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            activeIndex: 0,
            selected: 0,
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
        'fill-opacity': 0,
    }))

    public onPieEnter = (piedata, index) => {
        this.setState({
            activeIndex: index,
        });
    };

    public renderActiveShape = (props) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius - 4}
                    outerRadius={outerRadius + 4}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    paddingAngle={3}
                    fill={fill}
                />
            </g>
        );
    };

    public handleInfoClick = () => {
        const { showInfo } = this.state;
        if (showInfo) {
            this.setState({ showInfo: false });
        } else {
            this.setState({ showInfo: true });
        }
    };

    public render() {
        const { activeIndex, showInfo } = this.state;

        return (
            <div className={styles.vrSideBar}>

                <h1>Land Cover</h1>

                <p>
                    {' '}
                        Located in the Terai region and lying close to water bodies,
                        Rajapur has fertile and arable land. Out of total area of
                        127.08 square km, 81.24% of land is used for agriculture.
                        Built-in area covers 7.66% of land while water bodies occupies
                        3.29% of total land in Rajapur.

                </p>
                <ResponsiveContainer height={200}>
                    <PieChart
                        width={200}
                        height={150}
                        margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    >
                        {/* <text className={styles.pieTotal} x={180} y={100}
                        textAnchor="middle" dominantBaseline="middle">
                         127.08 sq km
                        </text> */}
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={this.renderActiveShape}
                            data={data}
                                // cx={150}
                            // cy={50}
                            innerRadius={70}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                            onClick={this.onPieEnter}
                            stroke="none"
                        >
                            {
                                data.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />)
                            }
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className={styles.customChartLegend}>
                    <CustomChartLegend
                        text={data[0].name}
                        barColor={COLORS[0]}
                        background={'#509fb3'}
                        data={'9.73 sq km / 7.66'}
                        selected={activeIndex === 0}
                    />
                    <CustomChartLegend
                        text={data[1].name}
                        barColor={COLORS[1]}
                        background={'#667a46'}
                        data={'103.24 sq km / 81.24'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[2].name}
                        barColor={COLORS[2]}
                        background={'#8fa36c'}
                        data={'6.03 sq km / 4.74'}
                        selected={activeIndex === 2}
                    />
                    <CustomChartLegend
                        text={data[3].name}
                        barColor={COLORS[3]}
                        background={'#4ea5bb'}
                        data={'3.90 sq km / 3.07'}
                        selected={activeIndex === 3}
                    />
                    <CustomChartLegend
                        text={data[4].name}
                        barColor={COLORS[4]}
                        background={'#3488a0'}
                        data={'4.19 sq km / 3.29'}
                        selected={activeIndex === 4}
                    />
                    <CustomChartLegend
                        text={data[5].name}
                        barColor={COLORS[5]}
                        background={'#2f7e92'}
                        data={'4.19 sq km / 3.29'}
                        selected={activeIndex === 5}
                    />
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
        );
    }
}

export default connect(mapStateToProps)(RightPane);
