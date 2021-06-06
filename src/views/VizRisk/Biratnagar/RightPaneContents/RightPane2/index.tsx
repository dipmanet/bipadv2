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
import Disclaimer from '../../Components/Disclaimer';

const data = [
    { name: 'Agricultural land', value: 35.68 },
    { name: 'Forest', value: 2.77 },
    { name: 'Grassland', value: 0.18 },
    { name: 'Meadow', value: 0.24 },
    { name: 'Commercial Area', value: 1.14 },
    { name: 'Industrial Area', value: 0.67 },
    { name: 'Water bodies', value: 0.61 },
    { name: 'Other', value: 4.5 },
    { name: 'Buildings', value: 31.71 },
].sort(({ value: a }, { value: b }) => b - a);

const COLORS_CHART = [
    '#d3e378', // agriculture
    '#F2F2F2', // building
    '#d5d3d3', // other
    '#00a811', // forest
    '#e8f278', // commercial area
    '#d7ab3c', // Industrial area
    '#0765AA', // water bodies
    '#4ad391', // grassland
    '#afeb0a', // meadow


];


interface State {
    activeIndex: number;
    selected: number;
    showInfo: boolean;
}

interface ComponentProps {}

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
            console.log('payload', payload);
            // console.log('payload', payload);
            return (
                <div className={styles.customTooltip}>
                    <p>{`${((payload[0].value / 77.5) * 100).toFixed(2)} % `}</p>
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
        console.log('This is final formal>>>', data);
        return (
            <div className={styles.vrSideBar}>

                <h1>Land Cover</h1>

                {/* <p>
                    {' '}
                    Located in the Terai region and lying close to water bodies,
                    Rajapur has fertile and arable land.

                </p> */}
                <p>
                Out of a total area of 118 square km, 36.34% of the land is used
                for agriculture.Forests cover 12.94%, water bodies cover 7.71%
                and buildings cover 0.94% of the land.However, 47.6% of land in
                Tikapur is uncategorized or still unmapped in OpenStreetMap.
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
                                        value2={` / ${((data[activeIndex].value / 77.5)
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
                        data={'35.68 sq km / 46.04'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[1].name}
                        barColor={COLORS_CHART[1]}
                        background={'#eee'}
                        data={'31.71 sq km / 40.92'}
                        selected={activeIndex === 1}
                    />

                    <CustomChartLegend
                        text={data[2].name}
                        barColor={COLORS_CHART[2]}
                        background={'#eee'}
                        data={'4.5 sq km / 5.81'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[3].name}
                        barColor={COLORS_CHART[3]}
                        background={'#eee'}
                        data={'2.77 sq km / 3.57'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[4].name}
                        barColor={COLORS_CHART[4]}
                        background={'#eee'}
                        data={'1.14 sq km / 1.47'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[5].name}
                        barColor={COLORS_CHART[5]}
                        background={'#eee'}
                        data={'0.67 sq km / 0.86'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[6].name}
                        barColor={COLORS_CHART[6]}
                        background={'#eee'}
                        data={'0.61 sq km / 0.79'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[7].name}
                        barColor={COLORS_CHART[7]}
                        background={'#eee'}
                        data={'0.24 sq km / 0.31'}
                        selected={activeIndex === 1}
                    />
                    <CustomChartLegend
                        text={data[7].name}
                        barColor={COLORS_CHART[7]}
                        background={'#eee'}
                        data={'0.18 sq km / 0.23'}
                        selected={activeIndex === 1}
                    />
                </div>
                {/* <SourceInfo /> */}
                {/* <Disclaimer /> */}
            </div>
        );
    }
}

export default connect(mapStateToProps)(RightPane);
