import React from 'react';
import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import Hexagon from 'react-hexagon';
import styles from './styles.scss';
import demographicsData from '#views/VizRisk/Rajapur/Data/demographicsData';
import NavButtons from '../../Components/NavButtons';
import VRLegend from '#views/VizRisk/Jugal/Components/VRLegend';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFourPane extends React.PureComponent<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showLandcover: false,
        };
    }

    public handleShowLandCover= () => {
        this.setState(
            prevState => ({
                showLandcover: !prevState.showLandcover,
            }),
        );
    }

    // public handlePopulationClick = (clickedItem: string) => {
    //     this.setState({ clickedItem });
    // };

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
        } = this.props;

        console.log('incidents list ', incidentList);
        const hazardTitle = [...new Set(incidentList.features.map(
            item => item.properties.hazardTitle,
        ))];

        const chartData = hazardTitle.map(item => ({
            name: item,
            Total: incidentList.features
                .filter(
                    ht => ht.properties.hazardTitle === item
                && new Date(ht.properties.incidentOn).getFullYear() === Number(incidentFilterYear),
                )
                .length,
        }));


        return (
            <div className={styles.vrSideBar}>
                <h1>Past Disaster Events in Jugal Rural Municipality</h1>
                <p>
                    Jugal rural municipality has had 43 landslide and 2
                    earthquake incidents in the past 10 years. These incidents
                    caused the loss of lives of 3664 people and 133 people went missing.
                    These incidents damaged 90050 houses and affected 2776 houses and caused
                    an estimated loss of NPR 28815000.
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={'75%'}>
                    <BarChart
                        width={300}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
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
                            hazardTitle.length > 0
                            && hazardTitle.map(item => (
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
