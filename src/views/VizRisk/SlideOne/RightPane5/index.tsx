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
import demographicsData from '../../demographicsData';
import CustomChartLegend from '#views/VizRisk/CustomChartLegend';
import ScalableVectorGraphics from '#rscv/ScalableVectorGraphics';
import ManWoman from '#views/VizRisk/SlideOne/Icons/ManWoman.svg';

import ElevationIcon from '#views/VizRisk/SlideOne/Icons/ElevationFromSea.svg';

interface ComponentProps {}

type ReduxProps = ComponentProps & PropsFromAppState & PropsFromDispatch;
type Props = NewProps<ReduxProps, Params>;
const COLORS = ['#00afe9', '#016cc3', '#00aca1', '#ff5ba5', '#ff6c4b', '#016cc3'];

class SlideFourPane extends React.PureComponent<Props, State> {
    public render() {
        const chartData = demographicsData.demographicsData;
        return (
            <div className={styles.vrSideBar}>
                <h1>Flood Exposure </h1>

                <p>
                    Exposure is one of the critical drivers of long term
                    flood damages and loss in Rajapur area. To understand
                    the exposure of assets and people, this visualization
                    allows the super imposition of the flood hazard maps for
                    different return period of flood with critical infrastructures.
                    Return period indicates the average interval of time within which
                    the flood of that magnitude will occur. Simply, its a probability
                    of experiencing a given water depth within a single year; i.e. depths
                    shown by the ‘1-in-100 year’ layer have a 1-in-100
                    (or 1%) chance of occurrence in any given year.
                </p>
                <p>
                    This viz-risk helps understand the population, elements
                    and assets that are exposed to modeled flood hazard in
                    the region. Important implication from this viz-risk is
                    that the impact from the flood can be greatly reduced
                    through flood-sensitive land use planning.  Here, the dense
                    settlement areas that are at proximity to Karnali river
                    lying in flood hazard zone might face major human loss and
                    economic damage in future floods.
                </p>

            </div>
        );
    }
}

export default SlideFourPane;
