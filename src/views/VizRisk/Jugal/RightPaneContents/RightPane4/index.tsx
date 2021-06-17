import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import { isDefined } from '@togglecorp/fujs';
import styles from './styles.scss';
import NavButtons from '../../Components/NavButtons';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

const ciRef = {
    'Water sources': 'Water Source',
    'Trade and business (groceries, meat, textiles)': 'Trade and business',
    'Industry/ hydropower': 'Industry',
    'Hotel/resort/homestay': 'Hotel or Restaurant',
    Health: 'Hospital',
    'Government Buildings': 'Government Building',
    Bridge: 'Bridge',
    'Community buildings': 'Community Building',
    'Cultural heritage sites': 'Cultural Heritage',
    Finance: 'Financial Institution',
    Education: 'Education Instution',
};

class SlideFourPane extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            chartData: [],
        };
    }

    public componentDidMount() {
        const { CIData: criticalinfrastructures } = this.props;
        if (isDefined(criticalinfrastructures.features)) {
            const categoriesCriticalArr = [...new Set(criticalinfrastructures.features.map(
                item => item.properties.CI,
            ))];
            const categoriesCritical = categoriesCriticalArr.filter(item => item !== undefined);
            const chartD = categoriesCritical.map(item => ({
                name: ciRef[item],
                Total: criticalinfrastructures.features
                    .filter(ci => ci.properties.CI === item).length,
            }));
            this.setState({ chartData: chartD });
        }
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.CIData !== this.props.CIData) {
            const { CIData: criticalinfrastructures } = this.props;
            if (isDefined(criticalinfrastructures.features)) {
                const categoriesCriticalArr = [...new Set(criticalinfrastructures.features.map(
                    item => item.properties.CI,
                ))];
                const categoriesCritical = categoriesCriticalArr.filter(item => item !== undefined);

                const chartD = categoriesCritical.map(item => ({
                    name: ciRef[item],
                    Total: criticalinfrastructures.features
                        .filter(ci => ci.properties.CI === item).length,
                }));
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ chartData: chartD });
            }
        }
    }

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

                Community Infrastructures are socially, economically or
                operationally essential to the functioning of a society or
                community, both in routine circumstances and in the extreme
                circumstances of an emergency.
                </p>
                <p>
                All of the residential and governmental buildings,
                religious and cultural sites, financial institutions,
                critical infrastructures such as hospitals, schools,
                bridges in the municipality are at constant threat to
                various hazards every year.
                </p>
                <ResponsiveContainer className={styles.respContainer} width="100%" height={600}>
                    <BarChart
                        width={300}
                        height={600}
                        data={this.state.chartData}
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
