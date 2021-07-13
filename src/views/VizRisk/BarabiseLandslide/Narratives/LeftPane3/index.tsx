import React from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import TempIcon from '#resources/icons/Temp.svg';
import AvgRainFall from '#resources/icons/RainFall.svg';
import ElevationIcon from '#resources/icons/ElevationFromSea.svg';
import styles from './styles.scss';

interface Props{
    handleNext: () => void;
    handlePrev: () => void;
    pagenumber: number;
    totalPages: number;
    pending: boolean;

}
const lineData = [
    {
        Max: 20.4, Min: 5.8, Avg: 13.1, name: 'Jan',
    },
    {
        Max: 23.4, Min: 7.6, Avg: 15.5, name: 'Feb',
    },
    {
        Max: 26, Min: 10.7, Avg: 18.35, name: 'Mar',
    },
    {
        Max: 30.5, Min: 12.7, Avg: 21.6, name: 'Apr',
    },
    {
        Max: 30.9, Min: 16.4, Avg: 23.65, name: 'May',
    },
    {
        Max: 31.2, Min: 20.8, Avg: 26, name: 'Jun',
    },
    {
        Max: 29.3, Min: 21.2, Avg: 25.25, name: 'Jul',
    },
    {
        Max: 32, Min: 21.4, Avg: 26.7, name: 'Aug',
    },
    {
        Max: 31.3, Min: 20.2, Avg: 25.75, name: 'Sep',
    },
    {
        Max: 32.1, Min: 18.2, Avg: 25.15, name: 'Oct',
    },
    {
        Max: 26.4, Min: 8.3, Avg: 17.35, name: 'Nov',
    },
    {
        Max: 23.6, Min: 4, Avg: 13.8, name: 'Dec',
    },
];

const rainfallData = [
    {
        name: 'Jan', Rainfall: 51.3,
    },
    {
        name: 'Feb', Rainfall: 34.2,
    },
    {
        name: 'Mar', Rainfall: 92.4,
    },
    {
        name: 'Apr', Rainfall: 92.4,
    },
    {
        name: 'May', Rainfall: 288,
    },
    {
        name: 'Jun', Rainfall: 658.5,
    },
    {
        name: 'Jul', Rainfall: 1109.5,
    },
    {
        name: 'Aug', Rainfall: 1049.4,
    },
    {
        name: 'Sep', Rainfall: 552.2,
    },
    {
        name: 'Oct', Rainfall: 21.6,
    },
    {
        name: 'Nov', Rainfall: 0,
    },
    {
        name: 'Dec', Rainfall: 0,
    },
];

const LeftPane1 = (props: Props) => {
    const { pending,
        totalPages,
        pagenumber,
        handleNext,
        handlePrev } = props;

    return (
        <div className={styles.vrSideBar}>
            <h1>
              Bahrabise Municipality
            </h1>
            <p>
                Barhabise Municipality is located in Sindhupalchowk
                district of Bagmati province. The municipality has
                9 wards and covers an area of 134.8 sq.km and is
                situated in the altitude range of 500 to 4000 m above sea
                level.
            </p>

            <div className={styles.iconRow}>
                <div className={styles.infoIconsContainer}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={TempIcon}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>32.1℃</div>
                        <div className={styles.iconText}>
                            Maximum
                            <br />
                            Temperature in Summer
                        </div>

                    </div>
                </div>
                <div className={styles.infoIconsContainer}>
                    {/* <ScalableVectorGraphics
                            className={styles.infoIcon}
                            src={TempIcon}
                        /> */}
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>4℃</div>
                        <div className={styles.iconText}>
                            Minimum
                            <br />
                            Temperature in Winter
                        </div>

                    </div>
                </div>
            </div>
            <div className={styles.iconRow}>
                <div className={styles.infoIconsContainer}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={AvgRainFall}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>3949.5 mm</div>
                        <div className={styles.iconText}>
                            Annual
                            Rainfall
                        </div>

                    </div>
                </div>
                <div className={styles.infoIconsContainerHidden}>
                    <ScalableVectorGraphics
                        className={styles.infoIcon}
                        src={ElevationIcon}
                    />
                    <div className={styles.descriptionCotainer}>
                        <div className={styles.iconTitle}>142m - 154m</div>
                        <div className={styles.iconText}>
                            Elevation from Sea Level
                        </div>

                    </div>
                </div>
            </div>
            <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Temperature</p>
            <div className={styles.climateChart}>
                <ResponsiveContainer className={styles.chartContainer} height={300}>
                    <LineChart
                        margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                        data={lineData}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="name"
                            interval="preserveStart"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <YAxis
                            unit={'℃'}
                            axisLine={false}
                            domain={[0, 40]}
                            padding={{ top: 20 }}
                            tick={{ fill: '#94bdcf' }}
                            tickCount={10}
                            interval="preserveEnd"
                            allowDataOverflow
                        />
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegend} />
                        <Tooltip
                            content={this.CustomTooltip}
                        />
                        <Line type="monotone" dataKey="Max" stroke="#ffbf00" />
                        <Line type="monotone" dataKey="Avg" stroke="#00d725" />
                        <Line type="monotone" dataKey="Min" stroke="#347eff" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className={styles.climateChart}>
                <p style={{ marginBottom: '0px', marginTop: '30px', fontWeight: 'bold' }}> Rainfall</p>
                <ResponsiveContainer className={styles.chartContainer} height={300}>
                    <LineChart
                        margin={{ top: 0, right: 10, left: 10, bottom: 10 }}
                        data={rainfallData}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="name"
                            interval="preserveStart"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <YAxis
                            unit={'mm'}
                            axisLine={false}
                            domain={[0, 1150]}
                            padding={{ top: 20 }}
                            tick={{ fill: '#94bdcf' }}
                            tickCount={10}
                            interval="preserveEnd"
                            allowDataOverflow
                        />
                        <Legend iconType="square" iconSize={10} align="center" content={this.renderLegendRainfall} />
                        <Tooltip
                            content={this.CustomTooltipRain}
                        />
                        <Line type="monotone" dataKey="Rainfall" stroke="#ffbf00" />

                    </LineChart>
                </ResponsiveContainer>

            </div>

        </div>

    );
};

export default LeftPane1;
