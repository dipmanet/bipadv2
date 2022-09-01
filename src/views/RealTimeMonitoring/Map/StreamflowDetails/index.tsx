/* eslint-disable max-len */
import React from 'react';
import { doesObjectHaveNoData, _cs } from '@togglecorp/fujs';
import PlotlyComponent from 'react-plotly.js';
import { Table } from 'semantic-ui-react';

import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

import { Translation } from 'react-i18next';
import {
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';
import {
    getResults,
    isAnyRequestPending,
} from '#utils/request';
import ListView from '#rscv/List/ListView';
import LoadingAnimation from '#rscv/LoadingAnimation';
import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';
import { KeyValue } from '#types';
import SummaryItem from '#components/SummaryItem';

import styles from './styles.scss';
import { filterDataByReturnPeriod } from '#views/RealTimeMonitoring/utils';
import Button from '#rsca/Button';

interface OwnProps {
    handleModalClose: () => void;
    id: number;
}
interface Params { }
interface State { }

interface Value {
    maxValue: number;
    minValue: number;
    hresValue: number;
    meanValue: number;
    stdDevLowerValue: number;
    stdDevUpperValue: number;
}

interface ReturnPeriod {
    max: number;
    '2years': number;
    '10years': number;
    '20years': number;

}

interface FlowData {
    date: string;
    values: Value;
}

interface StreamflowData {
    comid: number;
    data: FlowData[];
    returnPeriod: ReturnPeriod;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    streamflowGetRequest: {
        url: '/streamflow/',
        method: methods.GET,
        query: ({ props: { id } }) => ({ comid: id }),
        onMount: true,
    },
};

type Props = NewProps<OwnProps, Params>
const keySelector = (d: KeyValue) => d.key;
class StreamflowDetails extends React.PureComponent<Props> {
    private getChartData = (data: FlowData[] = []) => (
        data.map((d) => {
            const { date, values } = d;
            return {
                date: new Date(date).getTime(),
                HRES: values.hresValue,
                mean: values.meanValue,
                'STD Upper Value': values.stdDevUpperValue,
                'STD Lower Value': values.stdDevLowerValue,
                min: values.minValue,
                max: values.maxValue,
                flow: [
                    values.minValue,
                    values.maxValue,
                ],
                std: [
                    values.stdDevLowerValue,
                    values.stdDevUpperValue,
                ],
            };
        })
    )

    private getReturnPeriod = (data: ReturnPeriod) => {
        if (doesObjectHaveNoData(data)) {
            return [];
        }
        return Object.entries(data).map(([key, value]) => ({
            key,
            label: key,
            value,
        }));
    }

    private rendererParams = (_: string, data: KeyValue) => ({ data });

    public render() {
        const {
            id,
            handleModalClose,
            requests,
            language,
        } = this.props;

        const streamflowData: StreamflowData[] = getResults(requests, 'streamflowGetRequest');
        const chartData = this.getChartData((streamflowData[0] || {}).data);
        const returnPeriod: KeyValue[] = this.getReturnPeriod(
            (streamflowData[0] || {}).returnPeriod,
        ).sort((val1, val2) => val1.value - val2.value);

        const pending = isAnyRequestPending(requests);

        const minDate = Math.min(...chartData.map(meanData => meanData.date));
        const maxDate = Math.max(...chartData.map(meanData => meanData.date));

        console.log('returnPeriod', returnPeriod);

        const data = [
            {
                type: 'scatter', // all "bar" chart attributes: #bar
                x: chartData.map(meanData => new Date(meanData.date)), // more about "x": #bar-x
                y: chartData.map(meanData => meanData.mean), // #bar-y
                name: 'Mean', // #bar-name
                fill: 'tonexty',
                line: {
                    color: 'blue',
                    width: 2,
                },
            },
            {
                type: 'scatter', // all "bar" chart attributes: #bar
                x: chartData.map(meanData => new Date(meanData.date)), // more about "x": #bar-x
                y: chartData.map(meanData => meanData.max), // #bar-y
                name: 'Max',
                fill: 'tonexty',
                line: {
                    color: 'rgb(152, 251, 152)',
                    width: 0,
                },

            },
            {
                type: 'scatter', // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
                x: chartData.map(meanData => new Date(meanData.date)), // more about "x": #scatter-x
                y: chartData.map(meanData => meanData.min), // #scatter-y
                name: 'Min',
                fill: 'tonexty',
                line: {
                    color: 'rgb(152, 251, 152)',
                    width: 1,
                },
            },

            {
                name: 'HRES',
                x: chartData.map(meanData => new Date(meanData.date)),
                y: chartData.map(meanData => meanData.HRES),
                type: 'scatter',
                line: {
                    color: 'black',
                    width: 2,
                },
            },
        ];
        const layout1 = {
            title: 'Forecast at Date (Time Zone: UTC) ',
            autosize: true,
            height: 700,
            shapes: [
                {
                    type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    x0: new Date(minDate),
                    y0: filterDataByReturnPeriod(returnPeriod, '50years'),
                    x1: new Date(maxDate),
                    y1: filterDataByReturnPeriod(returnPeriod, 'max'),
                    line: {
                        width: 0,
                    },
                    fillcolor: 'rgba(128, 0, 128, 0.4)',
                },
                {
                    type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    x0: new Date(minDate),
                    y0: filterDataByReturnPeriod(returnPeriod, '20years'),
                    x1: new Date(maxDate),
                    y1: filterDataByReturnPeriod(returnPeriod, '50years'),
                    line: {
                        width: 0,
                    },
                    fillcolor: 'rgba(255, 0, 0, 0.4)',
                },
                {
                    type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    x0: new Date(minDate),
                    y0: filterDataByReturnPeriod(returnPeriod, '10years'),
                    x1: new Date(maxDate),
                    y1: filterDataByReturnPeriod(returnPeriod, '20years'),
                    line: {
                        width: 0,
                    },
                    fillcolor: 'rgba(255, 149, 6, 0.4)',
                },
                {
                    type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    x0: new Date(minDate),
                    y0: filterDataByReturnPeriod(returnPeriod, '5years'),
                    x1: new Date(maxDate),
                    y1: filterDataByReturnPeriod(returnPeriod, '10years'),
                    line: {
                        width: 0,
                    },
                    fillcolor: 'rgba(255, 219,88, 0.4)',
                },
            ],
            xaxis: {
                title: 'Dates',
            },
            yaxis: {
                title: 'Streamflow (m3/s)',
                range: [0, filterDataByReturnPeriod(returnPeriod, 'max')],
            },
        };

        const config = {
            showLink: false,
            displayModeBar: true,
        };
        return (
            <Translation>
                {
                    t => (
                        <Modal
                            // closeOnEscape
                            // onClose={handleModalClose}
                            className={_cs(styles.streamflowModal,
                                language === 'np' && styles.languageFont)}
                        >

                            <ModalHeader
                                title={`Streamflow Details for River ${id}`}
                                rightComponent={(
                                    <DangerButton
                                        transparent
                                        iconName="close"
                                        onClick={handleModalClose}
                                        title={t('Close Modal')}
                                    />
                                )}
                            />
                            <ModalBody className={styles.body}>
                                {pending && <LoadingAnimation />}
                                {!pending && (
                                    <div className={styles.streamflow}>
                                        <header className={styles.header}>
                                            <h3 className={styles.heading}>
                                                {t('Return Period')}
                                            </h3>
                                        </header>
                                        <ListView
                                            className={styles.returnPeriod}
                                            keySelector={keySelector}
                                            data={returnPeriod}
                                            renderer={SummaryItem}
                                            rendererParams={this.rendererParams}
                                        />
                                        <header className={styles.header}>
                                            <h3 className={styles.heading}>
                                                {t('Streamflow')}
                                            </h3>
                                            <Button
                                                title="Download Chart"
                                                className={styles.chartDownload}
                                                transparent
                                                disabled={pending}
                                                onClick={this.handleSaveClick}
                                                iconName="download"
                                            />
                                        </header>
                                        <ResponsiveContainer
                                            className={styles.chart}
                                            id="streamflowChart"
                                        >
                                            <ComposedChart
                                                data={chartData}
                                            >
                                                <XAxis
                                                    dataKey="date"
                                                    type="number"
                                                    scale="time"
                                                    domain={['dataMin', 'dataMax']}
                                                    tickFormatter={value => new Date(value).toDateString()}
                                                />
                                                <YAxis
                                                    type="number"
                                                />
                                                <Tooltip
                                                    labelFormatter={value => `Date: ${new Date(value)}`}
                                                />
                                                <Legend verticalAlign="top" />
                                                <Area
                                                    type="monotone"
                                                    dataKey="flow"
                                                    stroke="none"
                                                    fill="#90ed7d"
                                                    legendType="square"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="std"
                                                    stroke="none"
                                                    fill="#33a02c"
                                                    legendType="square"
                                                />
                                                <Line
                                                    strokeWidth={2}
                                                    type="monotone"
                                                    dataKey="STD Upper Value"
                                                    stroke="#33a02c"
                                                    dot={false}
                                                />
                                                <Line
                                                    strokeWidth={2}
                                                    type="monotone"
                                                    dataKey="STD Lower Value"
                                                    stroke="#33a02c"
                                                    dot={false}
                                                />
                                                <Line
                                                    strokeWidth={2}
                                                    type="monotone"
                                                    dataKey="min"
                                                    stroke="#90ed7d"
                                                    dot={false}
                                                />
                                                <Line
                                                    strokeWidth={2}
                                                    type="monotone"
                                                    dataKey="max"
                                                    stroke="#90ed7d"
                                                    dot={false}
                                                />
                                                <Line
                                                    strokeWidth={2}
                                                    type="monotone"
                                                    dataKey="HRES"
                                                    stroke="#434348"
                                                    dot={false}
                                                />
                                                <Line
                                                    strokeWidth={2}
                                                    type="monotone"
                                                    dataKey="mean"
                                                    stroke="#1f78b4"
                                                    dot={false}
                                                />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </ModalBody>
                        </Modal>
                    )
                }
            </Translation>

        );
    }
}

export default createRequestClient(requestOptions)(StreamflowDetails);
