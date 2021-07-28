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
import styles from './styles.scss';
import Demo from '../../Data/demographicsData';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/Tikapur/Icons/ManWoman.svg';
import Male from '#views/VizRisk/Tikapur/Icons/male.svg';
import Female from '#views/VizRisk/Tikapur/Icons/female.svg';
import Home from '#views/VizRisk/Tikapur/Icons/home.svg';

const demoChartdata = Demo.demographicsData;

interface Props{
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;

}


const LeftPane4 = (props: Props) => {
    // const { data: {
    //     renderLegendDemo,
    // } } = props;

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
            <p>
            Bhotekoshi Rural Municipality has a total population
            of 16,631 with 8431 males and 8200 females residing
            in a total of 4183 households. Ward 2 has the largest
            number of households (1431) while ward 3 has the least
            number of households(302). (Data Source: Census 2011)
            </p>
            <div className={styles.iconRow}>
                <div className={styles.infoIconsContainer}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={ManWoman}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>16,631</div>
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
                        <div className={styles.iconTitle}>4,183</div>
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
                        <div className={styles.iconTitle}>8,431</div>
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
                        <div className={styles.iconTitle}>8,200</div>
                        <div className={styles.iconText}>
                             Female Population
                        </div>

                    </div>
                </div>
            </div>


            <div className={styles.chartContainer}>
                <ResponsiveContainer height={600} width={350}>
                    <BarChart
                        // width={350}
                        // height={600}
                        data={demoChartdata}
                        layout="vertical"
                        margin={{ top: 30, bottom: 10, right: 20, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#94bdcf' }} />
                        <Tooltip />
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
