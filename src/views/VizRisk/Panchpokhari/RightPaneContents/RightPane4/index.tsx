import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';
import NavButtons from '../../Components/NavButtons';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;

const ciRef = {
    Health: 'Hospitals',
    Governance: 'Government Buildings',
    Bridge: 'Bridges',
    Cultural: 'Cultural Heritages',
    Finance: 'Financial Institutions',
    Education: 'Education Institutions',
    Tourism: 'Hotels / Restaurants',
};

class SlideFourPane extends React.PureComponent<Props, State> {
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
                item => item.properties.Type,
            ))];
            const categoriesCritical = categoriesCriticalArr.filter(item => item !== undefined);
            const chartD = categoriesCritical.map(item => ({
                name: ciRef[item],
                Total: criticalinfrastructures.features
                    .filter(ci => ci.properties.Type === item).length,
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
                Critical Infrastructures are crucial even during the time of crisis.
                The residential and governmental buildings, religious and cultural
                sites, banking institutions, as well as critical infrastructures
                such as hospitals, schools, bridges in the municipality are at
                constant threat every year.
                </p>

                <ResponsiveContainer className={styles.respContainer} width="100%" height={350}>
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
