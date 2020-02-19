import React from 'react';
import { doesObjectHaveNoData } from '@togglecorp/fujs';
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
import TextOutput from '#components/TextOutput';
import LoadingAnimation from '#rscv/LoadingAnimation';
import DangerButton from '#rsca/Button/DangerButton';
import Modal from '#rscv/Modal';
import ModalHeader from '#rscv/Modal/Header';
import ModalBody from '#rscv/Modal/Body';

import styles from './styles.scss';

interface OwnProps {
    handleModalClose: () => void;
    id: number;
}
interface Params {}
interface State {}

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

interface KeyValue {
    key: string;
    label: string;
    value: number;
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

    private rendererParams = (_: string, data: KeyValue) => ({
        label: data.label,
        value: data.value,
        isNumericaValue: true,
    });

    public render() {
        const {
            id,
            handleModalClose,
            requests,
        } = this.props;

        const streamflowData: StreamflowData[] = getResults(requests, 'streamflowGetRequest');
        console.warn('streamflowData', streamflowData);
        const chartData = this.getChartData((streamflowData[0] || {}).data);
        const returnPeriod: KeyValue[] = this.getReturnPeriod(
            (streamflowData[0] || {}).returnPeriod,
        );
        console.warn('return', returnPeriod);
        const pending = isAnyRequestPending(requests);
        return (
            <Modal
                closeOnEscape
                onClose={handleModalClose}
                className={styles.streamflowModal}
            >
                <ModalHeader
                    title={`River Id: ${id}`}
                    rightComponent={(
                        <DangerButton
                            transparent
                            iconName="close"
                            onClick={handleModalClose}
                        />
                    )}
                />
                <ModalBody className={styles.body}>
                    { pending && <LoadingAnimation /> }
                    <div className={styles.content}>
                        <ListView
                            className={styles.returnPeriod}
                            keySelector={keySelector}
                            data={returnPeriod}
                            renderer={TextOutput}
                            rendererParams={this.rendererParams}
                        />
                        <ResponsiveContainer className={styles.chart}>
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
                </ModalBody>
            </Modal>
        );
    }
}

export default createRequestClient(requestOptions)(StreamflowDetails);
