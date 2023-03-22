import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import demographicsData from '#views/VizRisk/Tikapur/Data/demographicsData';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/Tikapur/Icons/ManWoman.svg';
import Male from '#views/VizRisk/Tikapur/Icons/male.svg';
import Female from '#views/VizRisk/Tikapur/Icons/female.svg';
import Home from '#views/VizRisk/Tikapur/Icons/home.svg';
import styles from './styles.scss';

import Disclaimer from '../../Components/Disclaimer';

interface ComponentProps { }

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
                    <div className={styles.legendOther} />
                    <div className={styles.legendText}>
                        Other Pop
                        <sup>n</sup>
                    </div>
                </div>
                <div className={styles.climatelegend}>
                    <div className={styles.legendDaily} />
                    <div className={styles.legendText}>
                        Total Family Count
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
                <p>
                    Ward 1 of the municipality is a planned core-urban
                    area and is densely populated. The rest of the municipality
                    consists of peripheral peri-urban settlements and rural
                    areas with a low density of population.
                </p>
                <p>
                    Tikapur Municipality has a total population of  98,651
                    with 50,405 males and 48,246 females. The total household
                    number counts to 18,620. Ward number 1 has the largest
                    household number of 9823, while ward number 9 has the least
                    comprising of only 743 households.
                </p>
                <p>
                    This map allows viewing the population distribution within
                    each ward and helps to locate the region of dense and sparse
                    settlements.
                </p>


                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer} style={{ flex: '1' }}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={ManWoman}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>98,651</div>
                            <div className={styles.iconText}>
                                Total Population
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer} style={{ flex: '3' }}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIconHH}
                            src={Home}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>18,620</div>
                            <div className={styles.iconText}>
                                Total Family Count
                            </div>

                        </div>
                    </div>
                </div>


                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer} style={{ flex: '1' }}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={Male}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>50,405</div>
                            <div className={styles.iconText}>
                                Male Population
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer} style={{ flex: '1', marginLeft: '5px' }}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={Female}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>48,246</div>
                            <div className={styles.iconText}>
                                Female Population
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer} style={{ flex: '2' }}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={Female}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>0</div>
                            <div className={styles.iconText}>
                                Other Population
                            </div>

                        </div>
                    </div>
                </div>


                <ResponsiveContainer width="100%" height={600}>
                    <BarChart
                        width={350}
                        // height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} interval={0} />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
                        <Bar dataKey="MalePop" stackId="a" fill="#ffbf00" />
                        <Bar dataKey="FemalePop" stackId="a" fill="#00d725" radius={[0, 20, 20, 0]} />
                        <Bar dataKey="OtherPop" stackId="a" fill="#EB7C21" radius={[0, 20, 20, 0]} />
                        <Bar dataKey="TotalFamilyCount" fill="#347eff" radius={[0, 20, 20, 0]} />
                        {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>
                {/* <SourceInfo /> */}
                <Disclaimer disclamer={'Disclaimer: Temporarily there is an inconsistency in the map layers due to different data sources'} />

            </div>
        );
    }
}

export default SlideThreePane;
