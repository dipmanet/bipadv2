import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import styles from '../../styles.scss';
import Demo from '../../Data/demographicsData';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/Tikapur/Icons/ManWoman.svg';
import Male from '#views/VizRisk/Tikapur/Icons/male.svg';
import Female from '#views/VizRisk/Tikapur/Icons/female.svg';
import Home from '#views/VizRisk/Tikapur/Icons/home.svg';

const demoChartdata = Demo.demographicsData;


const LeftPane4 = () => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <h2>{payload[0].payload.name}</h2>
                    <p>{`Male Population: ${payload[0].payload.MalePop}`}</p>
                    <p>{`Female Population: ${payload[0].payload.FemalePop}`}</p>
                    <p>{`Total Households: ${payload[0].payload.FamilyCount}`}</p>

                </div>
            );
        }

        return null;
    };

    const renderLegendDemo = () => (
        <div className={styles.climateLegendContainer}>
            <div className={styles.climatelegend}>
                <div className={styles.legendMale} />
                <div className={styles.legendText}>
                       Male Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendFemale} />
                <div className={styles.legendText}>
                    Female Pop
                    <sup>n</sup>
                </div>
            </div>
            <div className={styles.climatelegend}>
                <div className={styles.legendTotHH} />
                <div className={styles.legendText}>
                       Total Household
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.vrSideBar}>
            <h1>Demography</h1>
            <p className={styles.narrativeText}>
                Barhabise municipality has a total population of 26,114
                with 13257 males and 128537 females residing in a total
                of 7660 households. Ward 3 has the largest number of
                households (1195) while ward 1 has the least number of
                households (310).
            </p>
            <div className={styles.iconRow}>
                <div className={styles.infoIconsContainer}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={ManWoman}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>26,114</div>
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
                        <div className={styles.iconTitle}>7,660</div>
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
                        <div className={styles.iconTitle}>13,257</div>
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
                        <div className={styles.iconTitle}>12,853</div>
                        <div className={styles.iconText}>
                             Female Population
                        </div>

                    </div>
                </div>
            </div>


            <div className={styles.climateChart}>
                <ResponsiveContainer height={demoChartdata.length * 40 + 60} width={'100%'}>
                    <BarChart
                        data={demoChartdata}
                        layout="vertical"
                        margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} />
                        <Tooltip
                            content={CustomTooltip}
                        />
                        <Legend iconType="square" iconSize={10} align="center" content={renderLegendDemo} />
                        <Bar
                            dataKey="MalePop"
                            fill="#ffbf00"
                            barSize={10}
                            stackId="a"
                        />
                        <Bar
                            dataKey="FemalePop"
                            radius={[0, 10, 10, 0]}
                            fill="#00d725"
                            barSize={10}
                            stackId="a"

                        />
                        <Bar
                            dataKey="FamilyCount"
                            radius={[0, 10, 10, 0]}
                            fill="#347eff"
                            barSize={10}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>


    );
};

export default LeftPane4;
