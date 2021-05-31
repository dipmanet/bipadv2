import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import CIData from './ci';
import NavButtons from '../../Components/NavButtons';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

const criticalinfrastructures = CIData.data;

const categoriesCritical = [...new Set(criticalinfrastructures.features.map(
    item => item.properties.CI,
))];

const chartData = categoriesCritical.map(item => ({
    name: item,
    Total: criticalinfrastructures.features.filter(ci => ci.properties.CI === item).length,
}));

class SlideFourPane extends React.PureComponent<Props, State> {
    public render() {
        const {
            payload,
            handleNext,
            handlePrev,
            disableNavLeftBtn,
            disableNavRightBtn,
            disableNav,
            RightBtn,
            pagenumber,
            totalPages,
        } = this.props;

        return (
            <div className={styles.vrSideBar}>
                <h1>Community Infrastructures</h1>
                <p>
                Visualization of critical infrastructures available in Jugal
                Rural Municipalities in the form of infographics .
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
                            barSize={20}
                            label={{ position: 'right', fill: '#ffffff' }}
                            tick={{ fill: '#94bdcf' }}
                            radius={[0, 20, 20, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
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
