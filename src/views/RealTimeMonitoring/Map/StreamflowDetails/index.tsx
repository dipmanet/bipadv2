/* eslint-disable max-len */
import React from 'react';
import { doesObjectHaveNoData } from '@togglecorp/fujs';
import PlotlyComponent from 'react-plotly.js';
import { Table } from 'semantic-ui-react';
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
        } = this.props;

        const streamflowData: StreamflowData[] = getResults(requests, 'streamflowGetRequest');
        const chartData = this.getChartData((streamflowData[0] || {}).data);
        const returnPeriod: KeyValue[] = this.getReturnPeriod(
            (streamflowData[0] || {}).returnPeriod,
        ).sort((val1, val2) => val1.value - val2.value);

        const pending = isAnyRequestPending(requests);

        const minDate = Math.min(...chartData.map(meanData => meanData.date));
        const maxDate = Math.max(...chartData.map(meanData => meanData.date));
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
            <Modal
                // closeOnEscape
                // onClose={handleModalClose}
                className={styles.streamflowModal}
            >
                <ModalHeader
                    title={`Streamflow Details for River ${id}`}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={handleModalClose}
                            title="Close Modal"
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    {pending && <LoadingAnimation />}
                    {!pending && (
                        <div className={styles.streamflow}>

                            <div className={styles.returnPeriod}>
                                <Table celled structured className={styles.returnPeriodTable}>
                                    <Table.Row>
                                        <Table.HeaderCell className={styles.headerTitle}>
                                            Discharge(m3/s)
                                        </Table.HeaderCell>
                                        {returnPeriod.map(value => (
                                            <Table.Cell className={styles.headerTitle}>
                                                {value.value}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.HeaderCell className={styles.headerTitle}>
                                            Return Period
                                        </Table.HeaderCell>
                                        {returnPeriod.map(value => (
                                            <Table.Cell className={styles.headerTitle}>
                                                {value.label}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                </Table>
                            </div>
                            {/* <ListView
                                className={styles.returnPeriod}
                                keySelector={keySelector}
                                data={returnPeriod}
                                renderer={SummaryItem}
                                rendererParams={this.rendererParams}
                            /> */}
                            <header className={styles.header}>
                                <h3 className={styles.heading}>
                                    Streamflow
                                </h3>
                            </header>
                            <PlotlyComponent
                                className="chart"
                                data={data}
                                layout={layout1}
                                config={config}
                            />

                        </div>
                    )}
                </ModalBody>
            </Modal>
        );
    }
}

export default createRequestClient(requestOptions)(StreamflowDetails);
