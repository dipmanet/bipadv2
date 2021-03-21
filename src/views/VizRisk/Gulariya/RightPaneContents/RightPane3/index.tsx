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
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/Rajapur/Icons/ManWoman.svg';
import Male from '#views/VizRisk/Rajapur/Icons/male.svg';
import Female from '#views/VizRisk/Rajapur/Icons/female.svg';
import Home from '#views/VizRisk/Rajapur/Icons/homeNew.svg';

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
                Gulariya Municipality is divided into 12 wards with
                a total population of 71,991 equating to around 13,831 families.
                Male population is larger than female with the total male and female
                population counting to 36972 and 35019 respectively. Ward number 4 has
                the largest number of families that equals to 1786 while ward number 5
                has the least comprising of only 782 number of families.
                </p>


                <div className={styles.iconRow}>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={ManWoman}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>71,991</div>
                            <div className={styles.iconText}>
                                Total Population
                            </div>

                        </div>
                    </div>
                    <div className={styles.infoIconsContainer}>
                        <ScalableVectorGraphics
                            className={styles.infoIconHH}
                            src={Home}
                        />
                        <div className={styles.descriptionCotainer}>
                            <div className={styles.iconTitle}>13,831</div>
                            <div className={styles.iconText}>
                             Total Family Count
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
                            <div className={styles.iconTitle}>36,972</div>
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
                            <div className={styles.iconTitle}>35,019</div>
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
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
                        <Bar dataKey="MalePop" stackId="a" fill="#ffbf00" />
                        <Bar dataKey="FemalePop" stackId="a" fill="#00d725" />
                        <Bar dataKey="TotalFamilyCount" fill="#347eff" />
                        {/* <Bar background label dataKey="foo" fill="#8884d8" /> */}
                    </BarChart>
                </ResponsiveContainer>
                {/* <SourceInfo /> */}
                <Disclaimer />

            </div>
        );
    }
}

export default SlideThreePane;
