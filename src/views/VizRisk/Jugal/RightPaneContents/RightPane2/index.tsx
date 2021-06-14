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
import CustomChartLegend from '#views/VizRisk/Jugal/Components/CustomChartLegend';

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
import NavButtons from '../../Components/NavButtons';
import LandCover from './LandCoverChartData';

const demoChartdata = LandCover.chartData;


const COLORS_CHART = [
    '#d3e378',
    '#b4b4b4',
    '#00a811',
    '#2b4253',
    '#d5d3d3',
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
                    <p>{`${((payload[0].value / 127.02) * 100).toFixed(2)} % `}</p>
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
        const {
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            pagenumber,
            totalPages,
        } = this.props;
        return (
            <div className={styles.vrSideBar}>

                <h1>Land Cover</h1>
                <p>
                    Out of a total area of 595.94 square km, 34.08% of
                    the land is covered by forests, 9.1% by glaciers,
                    8.5% by farmland and scree. Other areas in the rural
                    municipality is covered by builtup area, meadow, grassland,
                    water bodies, scrub, fell and other uncategorized areas in OpenStreetMap.
                </p>
                <div className={styles.customChartLegend}>

                    <ResponsiveContainer className={styles.respContainer} height={200}>
                        <PieChart
                            width={200}
                            height={150}
                            margin={{ top: 15, bottom: 15, left: 5, right: 5 }}
                        >
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={this.renderActiveShape}
                                data={demoChartdata}
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
                                    demoChartdata.map(entry => <Cell key={`cell-${entry.name}`} fill={entry.color} />)
                                }
                                <Label
                                    width={30}
                                    position="center"
                                    content={(
                                        <CustomLabel
                                            value1={`${demoChartdata[activeIndex].value} sq km`}
                                            value2={` / ${((demoChartdata[activeIndex].value / demoChartdata[0].total) * 100).toFixed(2)}%`}
                                        />
                                    )}
                                />
                            </Pie>
                            <Tooltip content={this.CustomTooltip} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* <div className={styles.customChartLegend}>
                    <CustomChartLegend
                        text={demoChartdata[0].name}
                        barColor={COLORS_CHART[0]}
                        background={'#eee'}
                        data={'94.07 sq km / 74.06'}
                        selected={activeIndex === 0}
                    />

                    <CustomChartLegend
                        text={demoChartdata[2].name}
                        barColor={COLORS_CHART[2]}
                        background={'#eee'}
                        data={'5.99 sq km / 4.72'}
                        selected={activeIndex === 2}
                    />
                    <CustomChartLegend
                        text={demoChartdata[3].name}
                        barColor={COLORS_CHART[3]}
                        background={'#eee'}
                        data={'5.18 sq km / 4.08'}
                        selected={activeIndex === 3}
                    />
                    <CustomChartLegend
                        text={demoChartdata[4].name}
                        barColor={COLORS_CHART[4]}
                        background={'#444'}
                        data={'0.959 sq km / 0.75'}
                        selected={activeIndex === 4}
                        builtupArea
                    />
                    <CustomChartLegend
                        text={demoChartdata[1].name}
                        barColor={COLORS_CHART[1]}
                        background={'#444'}
                        data={'21.5 sq km / 16.93'}
                        selected={activeIndex === 1}
                    />

                </div> */}

                <div className={styles.customChartLegend}>
                    {demoChartdata.map((item, i) => (
                        <CustomChartLegend
                            text={item.name}
                            barColor={item.color}
                            background={'#777'}
                            data={`${item.value} sq km / ${(item.value / item.total * 100).toFixed(2)}`}
                            selected={activeIndex === i}
                        />
                    ))}
                </div>
                <NavButtons
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    disableNavLeftBtn={disableNavLeftBtn}
                    disableNavRightBtn={disableNavRightBtn}
                    pagenumber={pagenumber}
                    totalPages={totalPages}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(RightPane);
