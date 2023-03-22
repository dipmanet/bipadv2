/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import {
    Bar, BarChart,
    CartesianGrid,
    Label,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import Hexagon from 'react-hexagon';
import VRLegend from '#views/VizRisk/Jugal/Components/VRLegend';
import styles from '../styles.scss';
// import NavButtons from '#views/VizRisk/Common/NavButtons';
import NavButtons from '../../Components/NavButtons';

interface ComponentProps { }

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

class SlideFourPane extends React.PureComponent<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showLandcover: false,
            fullhazardTitle: [],
            hazardTitle: [],
            chartData: [],
            nonZeroArr: [],

        };
    }


    // public handlePopulationClick = (clickedItem: string) => {
    //     this.setState({ clickedItem });
    // };

    public componentDidMount() {
        const {
            incidentList,
            incidentFilterYear,
            clickedItem,
        } = this.props;
        const chartData = this
            .getChartData(clickedItem, incidentFilterYear, incidentList);
        this.setState({ chartData });
        const nonZeroArr = this
            .getArrforDesc(clickedItem, chartData, incidentList);
        const fullhazardTitle = [...new Set(incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];
        this.setState({ fullhazardTitle });
        this.setState({ nonZeroArr });
    }

    public componentDidUpdate(prevProps) {
        const {
            incidentList,
            incidentFilterYear,
            getIncidentData,
            clickedItem,
        } = this.props;

        const { chartData } = this.state;
        if (prevProps.incidentFilterYear !== incidentFilterYear) {
            getIncidentData(incidentFilterYear, clickedItem);
            this.setState({
                chartData: this
                    .getChartData(clickedItem, incidentFilterYear, incidentList),
            });
            this.setState({
                nonZeroArr: this
                    .getArrforDesc(
                        clickedItem,
                        this.getChartData(clickedItem, incidentFilterYear, incidentList),
                        incidentList,
                    ),
            });
        }
        if (prevProps.clickedItem !== clickedItem) {
            // getIncidentData(incidentFilterYear);
            getIncidentData(incidentFilterYear, clickedItem);
            this.setState({
                chartData: this
                    .getChartData(clickedItem, incidentFilterYear, incidentList),
            });
            this.setState({
                nonZeroArr: this
                    .getArrforDesc(
                        clickedItem,
                        this.getChartData(clickedItem, incidentFilterYear, incidentList),
                        incidentList,
                    ),
            });
        }
    }

    public getChartData = (clickedItem, incidentFilterYear, incidentList) => {
        let fullhazardTitle = [];

        if (clickedItem !== 'all') {
            fullhazardTitle = [clickedItem];
        } else {
            fullhazardTitle = [...new Set(incidentList.features.map(
                item => item.properties.hazardTitle,
            ))];
        }
        return fullhazardTitle.map(item => ({
            name: item,
            Total: incidentList.features
                .filter(
                    ht => ht.properties.hazardTitle === item
                        && new Date(ht.properties.incidentOn)
                            .getFullYear() === Number(incidentFilterYear),
                )
                .length,
        }));
    }

    public getArrforDesc = (clickedItem, chartData, incidentList) => {
        let fullhazardTitle = [];

        if (clickedItem !== 'all') {
            fullhazardTitle = [clickedItem];
        } else {
            fullhazardTitle = [...new Set(incidentList.features.map(
                item => item.properties.hazardTitle,
            ))];
        }
        const arr = fullhazardTitle.map((item) => {
            if (chartData.filter(n => n.name === item).length > 0) {
                if (chartData.filter(n => n.name === item)[0].Total !== 0) {
                    return item;
                }
            }
            return null;
        });
        return arr.filter(n => n !== null);
    }

    public getDescription = () => {
        const { nonZeroArr, chartData } = this.state;
        const { clickedItem } = this.props;
        if (clickedItem === 'all') {
            if (nonZeroArr.length > 0) {
                return nonZeroArr.map((item, i) => {
                    if (
                        i === nonZeroArr.length - 1
                        && i === 0
                        // && chartData.filter(n => n.name === item)[0]
                        && chartData.filter(n => n.name === item)[0].Total !== 0) {
                        return ` ${item} `;
                    }
                    if (
                        i !== nonZeroArr.length - 1
                        && i === 0
                        // && chartData.filter(n => n.name === item)[0]
                        && chartData.filter(n => n.name === item)[0].Total !== 0) {
                        return ` ${item} `;
                    }
                    if (
                        i === nonZeroArr.length - 1
                        // && chartData.filter(n => n.name === item)[0]
                        && chartData.filter(n => n.name === item)[0].Total !== 0) {
                        return ` and ${item} `;
                    }
                    if (
                        i !== nonZeroArr.length - 1
                        // && chartData.filter(n => n.name === item)[0]
                        && chartData.filter(n => n.name === item)[0].Total !== 0) {
                        return `, ${item} `;
                    }
                    return '';
                });
            }
        } else {
            return ` of ${clickedItem} `;
        }
        return '';
    }

    public render() {
        // const { clickedItem } = this.state;
        const {
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            pagenumber,
            totalPages,
            incidentList,
            clickedItem,
            handleIncidentItemClick,
            incidentFilterYear,
            incidentDetailsData,
            incidentData,
        } = this.props;

        const {
            hazardTitle,
            chartData,
            fullhazardTitle,
            nonZeroArr,
        } = this.state;

        return (
            <div className={styles.vrSideBar}>
                {
                    chartData.length > 0
                    && (
                        <>
                            <h1>Past Disaster Events in Jugal Rural Municipality</h1>
                            <p>
                                In the year
                                {' '}
                                {incidentFilterYear}
                                {' '}
                                , total

                                {' '}
                                {chartData
                                    .reduce((a, b) => ({ Total: a.Total + b.Total || 0 })).Total}
                                {' '}
                                incidents
                                {' '}
                                {nonZeroArr.length > 0 ? ' of ' : ''}
                                {
                                    this.getDescription()
                                }

                                have been reported in Jugal Rural Municipality.

                                These incidents have caused
                                {' '}
                                {incidentDetailsData.peopleDeathCount}
                                {' '}
                                deaths and
                                {' '}
                                {incidentDetailsData.infrastructureDestroyedHouseCount}
                                {' '}
                                houses were destroyed.
                            </p>

                            <ResponsiveContainer className={styles.respContainer} width="100%" height={'75%'}>
                                <BarChart
                                    width={300}
                                    height={700}
                                    data={chartData}
                                    layout="vertical"
                                    margin={{ left: 20, right: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number">
                                        <Label
                                            value="No. of incidents"
                                            offset={0}
                                            position="insideBottom"
                                            style={{
                                                textAnchor: 'middle',
                                                fill: 'rgba(255, 255, 255, 0.87)',
                                            }}
                                        />
                                    </XAxis>
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fill: '#94bdcf' }}
                                    />
                                    <Bar
                                        dataKey="Total"
                                        fill="rgb(0,219,95)"
                                        barSize={15}
                                        label={{ position: 'right', fill: '#ffffff' }}
                                        tick={{ fill: '#94bdcf' }}
                                        radius={[0, 15, 15, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </>
                    )
                }

                <VRLegend>

                    <div className={styles.incidentsLegendsContainer}>
                        <div className={styles.hazardItemContainer}>
                            <button
                                type="button"
                                className={clickedItem === 'all'
                                    ? styles.legendBtnSelected
                                    : styles.legendBtn
                                }
                                onClick={() => handleIncidentItemClick('all')}
                            >
                                <Hexagon
                                    style={{
                                        stroke: '#fff',
                                        strokeWidth: 50,
                                        fill: clickedItem === 'all' ? '#ffffff' : '#036ef0',
                                    }}
                                    className={styles.educationHexagon}
                                />
                                Showing All
                            </button>
                        </div>
                        {
                            fullhazardTitle.length > 0
                            && fullhazardTitle.map(item => (
                                <div className={styles.hazardItemContainer}>
                                    <button
                                        type="button"
                                        className={clickedItem === item
                                            ? styles.legendBtnSelected
                                            : styles.legendBtn
                                        }
                                        onClick={() => handleIncidentItemClick(item)}
                                        key={item}
                                    >
                                        <Hexagon
                                            style={{
                                                stroke: '#fff',
                                                strokeWidth: 50,
                                                fill: clickedItem === item ? '#ffffff' : '#036ef0',
                                            }}
                                            className={styles.educationHexagon}
                                        />
                                        {item}
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                </VRLegend>

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

export default SlideFourPane;
