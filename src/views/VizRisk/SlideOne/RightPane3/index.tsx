import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import demographicsData from '../../demographicsData';
import CustomChartLegend from '#views/VizRisk/CustomChartLegend';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/SlideOne/Icons/ManWoman.svg';
import Male from '#views/VizRisk/SlideOne/Icons/male.svg';
import Female from '#views/VizRisk/SlideOne/Icons/female.svg';
import Home from '#views/VizRisk/SlideOne/Icons/home.svg';

import ElevationIcon from '#views/VizRisk/SlideOne/Icons/ElevationFromSea.svg';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideThreePane extends React.PureComponent<Props, State> {
    public renderLegend = (props) => {
        const { payload } = props;
        return (
            <div className={styles.climateLegendContainer}>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMax} />
                    <div className={styles.legendText}>
                       Male Pop
                        <sup>n</sup>
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendMin} />
                    <div className={styles.legendText}>
                    Female Pop
                        <sup>n</sup>
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendDaily} />
                    <div className={styles.legendText}>
                       Total Household
                    </div>
                </div>
            </div>
        );
    }

    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Demography</h1>
                {/* <p>
                    {' '}
                        Rajapur has the total population of 55,584 with the
                        male and female population being 25,519 and 30,065
                        respectively. Total household number counts to 12,138.
                        Ward number 4 has the largest household number that equals to 1639
                        while ward number 7 has the least comprising of only
                        766 number of household. However, the population is highest in
                        ward number 4 and lowest in ward number 7.

                </p> */}
                <p>
                    The chloropleth map represents the household distribution per ward.
                    The wards with the highest household number have darker colors
                    while the lowest household wards have lighter colors. Ward number
                    4 has the largest household number that equals to 1693 while ward
                    number 7 has the least comprising of only 766 number of household.
                </p>
                <p>
                    Upon hovering over each ward, the population density per 0.25*0.25
                    km area is shown. More darker the color, more dense the
                    population in the area and viceversa.
                </p>
                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={ManWoman}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>55,584</div>
                            <div className={styles.iconText}>
                                Total Population
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={Home}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>12,138</div>
                            <div className={styles.iconText}>
                             Total Household Number
                            </div>

                        </div>
                    </div>
                </div>


                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={Male}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>25,519</div>
                            <div className={styles.iconText}>
                             Male Population
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={Female}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>30,065</div>
                            <div className={styles.iconText}>
                             Female Population
                            </div>

                        </div>
                    </div>
                </div>


                <ResponsiveContainer width="100%" height={'50%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
                        <Bar dataKey="MalePop" stackId="a" fill="#ffbf00" />
                        <Bar dataKey="FemalePop" stackId="a" fill="#00d725" />
                        <Bar dataKey="TotalHousehold" fill="#347eff" />
                        {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default SlideThreePane;
