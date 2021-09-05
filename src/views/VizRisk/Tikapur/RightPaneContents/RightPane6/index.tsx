import React from 'react';

import {
    Bar, BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';

import criticalInfraData from '#views/VizRisk/Tikapur/Data/criticalInfraData';

const chartData = criticalInfraData.safeShelterData;

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFivePane extends React.PureComponent<Props, State> {
    public constructor(props) {
        super();
        this.state = {
            showReferences: true,
        };
    }

    public handleRefClick = () => {
        this.setState(prevState => ({
            showReferences: !prevState.showReferences,
        }));
    }

    public render() {
        const { showReferences } = this.state;
        return (
            <div className={styles.vrSideBar}>
                <h1>Evacuation Centers </h1>
                <p>
                Evacuation centers provide temporary shelter
                for people displaced from their homes following
                a flooding event. The schools and cultural heritage
                sites can also be used for evacuation during floods.
                However, their functionality during floods is contingent
                upon several factors including building types and their
                exposure, whether they are located in flood-prone or flood
                safe areas.
                </p>
                <p>
                A present, the data on safe shelter is not available
                and therefore not visualized on the map
                </p>
                <ResponsiveContainer className={styles.respContainer} width="100%" height={400}>
                    <BarChart
                        width={350}
                        // height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, bottom: 10, right: 10, left: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: '#94bdcf' }} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: '#94bdcf' }}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="Total"
                            fill="#ffbf00"
                            // barCategoryGap={20}
                            barSize={80}
                            label={{ position: 'insideRight' }}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <button
                    className={styles.referencesBtn}
                    type="button"
                    onClick={this.handleRefClick}
                >
                References
                </button>
                {showReferences && (
                    <ul className={styles.referencesText}>

                        <li>
                        Modeling Exposure Through Earth Observations Routines (METEOR),
                         UK Space Agency, https://meteor-project.org/
                        </li>
                        <li>
                        OpenStreetMap
                        </li>
                        <li>
                        Department of Hydrology and Meteorology (DHM)
                        </li>
                        <li>
                        Tikapur Municipality Profile, 2021
                        </li>

                    </ul>
                )
                }

                {/* <SourceInfo /> */}
            </div>
        );
    }
}

export default SlideFivePane;
