import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import {
    ResponsiveContainer,
    PieChart,
    Label,
    Tooltip,
    Pie,
    Cell,
    Sector,
} from 'recharts';
import CustomChartLegend from '#views/VizRisk/Tikapur/Components/CustomChartLegend';

import {
    mapStyleSelector,
    regionsSelector,
    provincesSelector,
    districtsSelector,
    municipalitiesSelector,
    wardsSelector,
    hazardTypesSelector,
} from '#selectors';
import CustomLabel from './CustomLabel';

import styles from './styles.scss';

const data = [
    { name: 'Agricultural land', value: 74.71 },
    { name: 'Forest', value: 14.91 },
    { name: 'Water bodies', value: 6.11 },
    { name: 'Other', value: 18.2 },
    { name: 'Buildings', value: 1.69 },
    { name: 'Grassland', value: 1.34 },
    { name: 'Sand', value: 1.06 },
    // { name: 'Meadows', value: 0.83 },
].sort(({ value: a }, { value: b }) => b - a);
const COLORS_CHART = [
    '#d3e378', // agriculture
    '#f3f2f2', // other
    '#00a811', // forest
    '#0765AA', // water bodies
    '#F2F2F2', // building
    '#effdc9', // sand
    '#4ad391', // meadow
    '#4ad391', // grassland
];


interface State {
    activeIndex: number;
    selected: number;
    showInfo: boolean;
}

interface ComponentProps { }

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

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

    public CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <p>{`${((payload[0].value / 118.022) * 100).toFixed(2)} % `}</p>
                </div>
            );
        }
        return null;
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
                    Out of a total area of 118 sq. km, 63.3% of the land
                    is used for agriculture. Forests cover 12.6%, water
                    bodies cover 5.2% and buildings cover 1.4% of the land
                    area. Other areas in Tikapur are covered by sand, meadow,
                    and shrubs.
                </p>
                <ResponsiveContainer className={styles.respContainer} height={200}>
                    <PieChart
                        width={200}
                        height={150}
                        margin={{ top: 15, bottom: 15, left: 5, right: 5 }}
                    >
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={this.renderActiveShape}
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={0}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                            onClick={this.onPieEnter}
                            stroke="none"
                        >
                            {
                                data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${entry.name}`}
                                        fill={COLORS_CHART[index % COLORS_CHART.length]}
                                    />
                                ))
                            }
                            <Label
                                width={30}
                                position="center"
                                content={(
                                    <CustomLabel
                                        value1={`${data[activeIndex].value} sq km`}
                                        value2={` / ${((data[activeIndex].value / 118.022)
                                            * 100).toFixed(2)}%`}
                                    />
                                )}
                            />
                        </Pie>
                        <Tooltip content={this.CustomTooltip} />
                    </PieChart>
                </ResponsiveContainer>

                <div className={styles.customChartLegend}>
                    <CustomChartLegend
                        text={data[0].name}
                        barColor={COLORS_CHART[0]}
                        background={'#eee'}
                        data={'74.71 sq km / 63.30'}
                        selected={activeIndex === 0}
                    />
                    <CustomChartLegend
                        text={data[1].name}
                        barColor={COLORS_CHART[1]}
                        background={'#eee'}
                        data={'18.2 sq km / 15.42'}
                        selected={activeIndex === 1}
                    />

                    <CustomChartLegend
                        text={data[2].name}
                        barColor={COLORS_CHART[2]}
                        background={'#eee'}
                        data={'14.91 sq km / 12.63'}
                        selected={activeIndex === 2}
                    />
                    <CustomChartLegend
                        text={data[3].name}
                        barColor={COLORS_CHART[3]}
                        background={'#eee'}
                        data={'6.11 sq km / 5.18'}
                        selected={activeIndex === 3}
                    />
                    <CustomChartLegend
                        text={data[4].name}
                        barColor={COLORS_CHART[4]}
                        background={'#eee'}
                        data={'1.69 sq km / 1.43'}
                        selected={activeIndex === 4}
                    />
                    <CustomChartLegend
                        text={data[5].name}
                        barColor={COLORS_CHART[5]}
                        background={'#eee'}
                        data={'1.06 sq km / 0.90'}
                        selected={activeIndex === 5}
                    />
                    <CustomChartLegend
                        text={data[6].name}
                        barColor={COLORS_CHART[6]}
                        background={'#eee'}
                        data={'0.83 sq km / 0.70'}
                        selected={activeIndex === 6}
                    />
                    {/* <CustomChartLegend
                        text={data[7].name}
                        barColor={COLORS_CHART[7]}
                        background={'#eee'}
                        data={'0.51 sq km / 0.43'}
                        selected={activeIndex === 7}
                    /> */}


                </div>
                {/* <SourceInfo /> */}

            </div>
        );
    }
}

export default connect(mapStateToProps)(RightPane);
