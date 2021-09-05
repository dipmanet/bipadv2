/* eslint-disable max-len */
import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import demographicsData from '#views/VizRisk/Gulariya/Data/demographicsData';

import Disclaimer from '../../Components/Disclaimer';

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
                Dense settlements exist in some of the core urban areas, especially in ward 4. Most of the region comprises mostly peri-urban and rural settlements with a low density of population.
                </p>
                <p>
                Gulariya Municipality has a total population of 71,991. Ward number 4 has the highest population with 1786 families. Ward number 5 has the least population (4335) with 782 families.
                </p>


                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer} style={{ flex: '1' }}>
                        {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={ManWoman}
                        /> */}
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>71,991</div>
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
                            <div className={styles.iconTitle}>13,831</div>
                            <div className={styles.iconText}>
                             Total Household Number
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
                            <div className={styles.iconTitle}>36,972</div>
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
                            <div className={styles.iconTitle}>35,019</div>
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
                             Other population
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
