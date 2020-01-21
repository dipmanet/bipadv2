import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Slider from 'react-input-slider';
import {
    methods,
    NewProps,
    ClientAttributes,
    createRequestClient,
} from '@togglecorp/react-rest-request';

import RiskDescription from '#components/RiskDescription';
import Loading from '#components/Loading';
import LayerSelectionItem from '#components/LayerSelectionItem';

import { description } from './description.json';
import Map from './Map';
import RiskItem from './RiskItem';

import { LayerWithGroup, LayerGroup } from '#store/atom/page/types';
import {
    RiskData,
} from '#types';

import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';

import styles from './styles.scss';


interface OwnProps {
    className?: string;
    layerList: LayerWithGroup[];
    layerGroupList: LayerGroup[];
}
interface Params {
}

interface State {
    // selectedLayerId: number | undefined;
    metricValues: {};
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params>} = {
    riskGetRequest: {
        url: '/earthquake-riskscore/',
        method: methods.GET,
        onMount: true,
    },
};

type Props = NewProps<OwnProps, Params>

const metrices = {
    hdiScore: 'HDI',
    maxScore: 'Maximum fatalities',
    medScore: 'Median fatalities',
    remoteScore: 'Remoteness',
    specificityScore: 'Specificity',
    pctScore: 'Freq',
};

const metricKeys = Object.keys(metrices);


class Risk extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            metricValues: {
                hdiScore: 1,
                maxScore: 1,
                medScore: 1,
                remoteScore: 1,
                specificityScore: 1,
                pctScore: 1,
            },
        };
    }

    private handleMetricSliderChange = (key, value) => {
        const { metricValues } = this.state;

        const newMetricValues = { ...metricValues };
        newMetricValues[key] = value;
        this.setState({ metricValues: newMetricValues });
    }

    private getRiskData = (riskDataRaw, metricScores) => {
        const riskScoreData = riskDataRaw.map((rd) => {
            let riskScore = 0;

            metricKeys.forEach((m) => {
                riskScore += (rd.data[m] || 0) * metricScores[m];
            });

            return {
                data: { riskScore },
                district: rd.district,
                rank: rd.data.rank,
            };
        });

        return riskScoreData;
    }

    public render() {
        const {
            className,
            requests,
        } = this.props;

        const pending = isAnyRequestPending(requests);
        const riskDataRaw = getResults(requests, 'riskGetRequest') as RiskData[];
        const riskData = this.getRiskData(riskDataRaw, this.state.metricValues);

        return (
            <>
                <Loading pending={pending} />
                <div className={_cs(styles.risk, className)}>
                    <header className={styles.header}>
                        <h4 className={styles.heading}>
                            Durham Earthquake
                        </h4>
                    </header>
                    <div className={styles.description}>
                        The map represents the spatial distribution of total
                        relative seismic risk for Nepal. The data is calculated
                        as a normalized sum of six different risk metrics:

                        <div className={styles.metric}>
                            a) percentage of scenarios with at least one fatality
                        </div>
                        <div className={styles.metric}>
                            b) median fatalities for all scenarios that cause fatalities
                        </div>
                        <div className={styles.metric}>
                            c) maximum fatalities
                        </div>
                        <div className={styles.metric}>
                            d) specificity of fatalities for all scenarios that cause fatalities
                        </div>
                        <div className={styles.metric}>
                            e) remoteness score and
                        </div>
                        <div className={styles.metric}>
                            f) HDI.
                        </div>
                        All data are the property of Durham University.
                    </div>
                    <div className={styles.options}>
                        { metricKeys.map(m => (
                            <div
                                key={m}
                                className={styles.metricInput}
                            >
                                <div className={styles.label}>
                                    { metrices[m] }
                                </div>
                                <Slider
                                    axis="x"
                                    xmin={0}
                                    xmax={2}
                                    xstep={1}
                                    x={this.state.metricValues[m]}
                                    onChange={({ x }) => this.handleMetricSliderChange(m, x)}
                                    styles={{
                                        track: {
                                            height: 5,
                                            width: '90%',
                                        },
                                        thumb: { cursor: 'pointer' },
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <Map
                        data={riskData}
                    />
                </div>
            </>
        );
    }
}

export default createRequestClient(requestOptions)(Risk);
