/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import memoize from 'memoize-one';
import { Sector } from 'recharts';
import VizRiskContext from '#components/VizRiskContext';
import styles from './styles.scss';

interface State {
    showInfo: boolean;
}

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;


class LeftPaneContainer extends React.PureComponent<Props, State> {
    public static contextType = VizRiskContext;

    public constructor(props: Props) {
        super(props);

        this.state = {
            showInfo: false,
            activeIndex: 0,
        };
    }

    public componentDidMount() {
        const {
            incidentList,
            incidentFilterYear,
            clickedItem,
        } = this.props;
        // const chartData = this
        //     .getChartData(clickedItem, incidentFilterYear, incidentList);
        // this.setState({ chartData });
        // const nonZeroArr = this
        //     .getArrforDesc(clickedItem, chartData, incidentList);
        // const fullhazardTitle = [...new Set(incidentList.features.map(
        //     item => item.properties.hazardTitle,
        // ))];
        // this.setState({ fullhazardTitle });
        // this.setState({ nonZeroArr });
    }

    public componentDidUpdate(prevProps) {
        const {
            incidentList,
            incidentFilterYear,
            getIncidentData,
            clickedItem,
        } = this.props;

        // if (prevProps.incidentFilterYear !== incidentFilterYear) {
        //     getIncidentData(incidentFilterYear, clickedItem);
        //     this.setState({ chartData: this
        //         .getChartData(clickedItem, incidentFilterYear, incidentList) });
        //     this.setState({ nonZeroArr: this
        //         .getArrforDesc(
        //             clickedItem,
        //             this.getChartData(clickedItem, incidentFilterYear, incidentList),
        //             incidentList,
        //         ) });
        // }
        // if (prevProps.clickedItem !== clickedItem) {
        //     // getIncidentData(incidentFilterYear);
        //     getIncidentData(incidentFilterYear, clickedItem);
        //     this.setState({ chartData: this
        //         .getChartData(clickedItem, incidentFilterYear, incidentList) });
        //     this.setState({ nonZeroArr: this
        //         .getArrforDesc(
        //             clickedItem,
        //             this.getChartData(clickedItem, incidentFilterYear, incidentList),
        //             incidentList,
        //         ) });
        // }
    }

    public customTooltipRain = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Avg Rainfall: ${payload[0].payload.Rainfall} mm`}</p>

                </div>
            );
        }

        return null;
    };

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

    public customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <p>{`${((payload[0].value / 134.653) * 100).toFixed(2)} % `}</p>
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


    // dynamic texts function


    // public renderLegend = (props) => {
    //     const { payload } = props;
    //     return (
    //         <div className={styles.climateLegendContainer}>
    //             <div className={styles.climatelegend}>
    //                 <div className={styles.legendMax} />
    //                 <div className={styles.legendText}>
    //                    Avg Max
    //                 </div>
    //             </div>
    //             <div className={styles.climatelegend}>
    //                 <div className={styles.legendMin} />
    //                 <div className={styles.legendText}>
    //                    Avg Min
    //                 </div>
    //             </div>
    //             <div className={styles.climatelegend}>
    //                 <div className={styles.legendDaily} />
    //                 <div className={styles.legendText}>
    //                    Daily Avg
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // public getChartData = (clickedItem, incidentFilterYear, incidentList) => {
    //     let fullhazardTitle = [];

    //     if (clickedItem !== 'all') {
    //         fullhazardTitle = [clickedItem];
    //     } else {
    //         fullhazardTitle = [...new Set(incidentList.features.map(
    //             item => item.properties.hazardTitle,
    //         ))];
    //     }
    //     return fullhazardTitle.map(item => ({
    //         name: item,
    //         Total: incidentList.features
    //             .filter(
    //                 ht => ht.properties.hazardTitle === item
    //             && new Date(ht.properties.incidentOn).getFullYear()
    // === Number(incidentFilterYear),
    //             )
    //             .length,
    //     }));
    // }

    // public getDescription= () => {
    //     const { nonZeroArr, chartData } = this.state;
    //     const { clickedItem } = this.props;
    //     console.log('clickedItem', clickedItem);
    //     if (clickedItem === 'all') {
    //         if (nonZeroArr.length > 0) {
    //             return nonZeroArr.map((item, i) => {
    //                 if (
    //                     i === nonZeroArr.length - 1
    //                         && i === 0
    //                         // && chartData.filter(n => n.name === item)[0]
    //                         && chartData.filter(n => n.name === item)[0].Total !== 0) {
    //                     return ` ${item} `;
    //                 }
    //                 if (
    //                     i !== nonZeroArr.length - 1
    //                         && i === 0
    //                         // && chartData.filter(n => n.name === item)[0]
    //                         && chartData.filter(n => n.name === item)[0].Total !== 0) {
    //                     return ` ${item} `;
    //                 }
    //                 if (
    //                     i === nonZeroArr.length - 1
    //                         // && chartData.filter(n => n.name === item)[0]
    //                         && chartData.filter(n => n.name === item)[0].Total !== 0) {
    //                     return ` and ${item} `;
    //                 }
    //                 if (
    //                     i !== nonZeroArr.length - 1
    //                         // && chartData.filter(n => n.name === item)[0]
    //                         && chartData.filter(n => n.name === item)[0].Total !== 0) {
    //                     return `, ${item} `;
    //                 }
    //                 return '';
    //             });
    //         }
    //     } else {
    //         return ` of ${clickedItem} `;
    //     }
    //     return '';
    // }

    // public getArrforDesc = (clickedItem, chartData, incidentList) => {
    //     let fullhazardTitle = [];

    //     if (clickedItem !== 'all') {
    //         fullhazardTitle = [clickedItem];
    //     } else {
    //         fullhazardTitle = [...new Set(incidentList.features.map(
    //             item => item.properties.hazardTitle,
    //         ))];
    //     }
    //     console.log('fullhazardTitle', fullhazardTitle);
    //     const arr = fullhazardTitle.map((item) => {
    //         if (chartData.filter(n => n.name === item).length > 0) {
    //             if (chartData.filter(n => n.name === item)[0].Total !== 0) {
    //                 return item;
    //             }
    //         }
    //         return null;
    //     });
    //     console.log('arr', arr);
    //     return arr.filter(n => n !== null);
    // }

    public renderLegend = (props) => {
        const { payload } = props;
        return (
            <div className={styles.climateLegendContainer}>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMax} />
                    <div className={styles.legendText}>
                       Avg Max
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMin} />
                    <div className={styles.legendText}>
                       Avg Min
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendDaily} />
                    <div className={styles.legendText}>
                       Daily Avg
                    </div>
                </div>
            </div>
        );
    }

    public render() {
        const { render } = this.props;
        const { activeIndex } = this.state;

        return (
            <>
                {
                    render({
                        customTooltip: this.customTooltip,
                        customTooltipRain: this.customTooltipRain,
                        renderLegend: this.renderLegend,
                        onPieEnter: this.onPieEnter,
                        renderActiveShape: this.renderActiveShape,
                        activeIndex,
                    })
                }
            </>
        );
    }
}

export default LeftPaneContainer;
