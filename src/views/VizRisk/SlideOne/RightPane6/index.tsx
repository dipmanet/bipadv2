import React from 'react';
import memoize from 'memoize-one';

import {
    Bar, BarChart,
    CartesianGrid, Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip, XAxis, YAxis,
} from 'recharts';
import styles from './styles.scss';

import criticalInfraData from '../../criticalInfraData';

import ElevationIcon from '#views/VizRisk/SlideOne/Icons/ElevationFromSea.svg';

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
                    In Rajapur, there are 54 schools and 16 temple/cultral
                    sites that can be converted into temporary shelter or
                    evcuation shelter during flood events. In addition,
                    there are 9 evacuation centers. During the times of
                    a disaster, these areas are crucial for the evacuation and
                    also these areas could be benefiical especially for the
                    evacuees who cannot easily return to their homes and would
                    require further recovery assitance.
                </p>
                <ResponsiveContainer className={styles.respContainer} width="100%" height={'20%'}>
                    <BarChart
                        width={350}
                        height={600}
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, bottom: 10, right: 10, left: 10 }}
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
                            barCategoryGap={20}
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
                            Modeling Exposure Through Earth Observations Routines
                            (METEOR) ,UK Space Agency, https://meteor-project.org/
                        </li>
                        <li>
                            Risk Nexus, Urgent case for recovery. What we can
                            learn from the August 2014 Karnali River floods in Nepal.
                            Zurich Insurance Group Ltd and ISET-International, 2015
                        </li>
                        <li>
                             Central Bureau of Statistics, 2011
                        </li>
                        <li>
                             Rajapur Municipality Profile, 2075
                        </li>
                    </ul>
                )
                }


            </div>
        );
    }
}

export default SlideFivePane;
