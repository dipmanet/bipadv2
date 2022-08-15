/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import React, { useContext } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Legend,
    Label,
    Tooltip,
} from 'recharts';
import { MainPageDataContext } from '#views/VizRisk/RatnaNagar/context';
import CommonToolTip from '../../Legends/CommonToolTip';
import styles from './styles.scss';

interface Props {
    barTitle?: string;
    barData: object[];
}

const CommonBarChart = (props: Props) => {
    const { barTitle, barData } = props;
    const {
        requiredQuery,
        currentHeaderVal,
        setCurrentRechartsItem,
    } = useContext(MainPageDataContext);

    const BarWithBorder = (borderHeight: number, borderColor: string) => (propsBar: any) => {
        const { fill, x, y, width, height } = propsBar;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} strokeWidth={60} stroke="transparent" fill={fill} />
                <rect x={x} y={y} width={width + 500} height={borderHeight} strokeWidth={60} stroke="transparent" fill={borderColor} />
            </g>
        );
    };

    return (
        <div className={styles.mainBarChart}>
            <div className={styles.infoReset}>
                <h3 className={styles.barTitle}>
                    Current Selected Chart Value:
                    {
                        requiredQuery && !!currentHeaderVal
                            && Object.values(requiredQuery[currentHeaderVal])[0]
                            ? Object.values(requiredQuery[currentHeaderVal])[0]
                            : ' Please Select Value'
                    }
                </h3>
                <button
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCurrentRechartsItem('')}
                    type="submit"
                >
                    Reset
                </button>
            </div>
            <h3 className={styles.barTitle}>
                {barTitle === 'Flood return period'
                    ? 'Number of households likely to be inundated' : barTitle}

            </h3>
            <ResponsiveContainer
                width={'100%'}
                height={400}
            >
                <BarChart
                    width={200}
                    height={400}
                    data={barData}
                    layout="vertical"
                    margin={{ left: 45, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.5} />
                    <XAxis type="number" tick={{ fill: '#94bdcf' }}>
                        <Label
                            value="Number of households"
                            offset={-10}
                            position="insideBottom"
                            style={{
                                textAnchor: 'middle',
                                fill: 'rgba(255, 255, 255, 0.87)',
                                // margin: '10px',
                            }}
                        />
                    </XAxis>
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#94bdcf' }}
                    >
                        {barTitle === 'Flood return period'
                            && (
                                <Label
                                    value="Flood return period"
                                    offset={-10}
                                    position="insideLeft"
                                    angle={-90}
                                    style={{
                                        textAnchor: 'middle',
                                        fill: 'rgba(255, 255, 255, 0.87)',
                                    }}
                                />
                            )
                        }

                    </YAxis>
                    <Tooltip
                        cursor={{ fill: '#00000050' }}
                        content={CommonToolTip}
                    />
                    <Bar
                        onClick={e => setCurrentRechartsItem((prevState: string) => {
                            if (prevState === e.name) {
                                return '';
                            }
                            return e.name;
                        })}
                        dataKey="count"
                        fill="#a8fffb"
                        barSize={15}
                        shape={BarWithBorder(60, 'transparent')}
                    // tick={{ fill: '#94bdcf' }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CommonBarChart;
