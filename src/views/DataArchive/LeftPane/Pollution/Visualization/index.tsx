import React from 'react';
import memoize from 'memoize-one';
import * as PageType from '#store/atom/page/types';
import AqiChart from './AqiChart';
import { groupList } from '#utils/common';

import styles from './styles.scss';

interface Props {
    pollutionList: PageType.DataArchivePollution[];
}

interface ChartData {
    key: string | number;
    label: string | number;
    good: number;
    moderate: number;
    unhealthyForSensitive: number;
    unhealthy: number;
    veryUnhealthy: number;
    hazardous: number;
}
const getAqiCount = (stationWise: {
    key: string | number;
    value: PageType.DataArchivePollution[];
}[]) => {
    const visualData = stationWise.map((s) => {
        const { key, value: stationWiseDate } = s;
        let good = 0;
        let moderate = 0;
        let unhealthyForSensitive = 0;
        let unhealthy = 0;
        let veryUnhealthy = 0;
        let hazardous = 0;
        stationWiseDate.forEach((data) => {
            const { aqi } = data;
            if (aqi <= 50) {
                good += 1;
                return;
            }
            if (aqi <= 100) {
                moderate += 1;
                return;
            }
            if (aqi <= 150) {
                unhealthyForSensitive += 1;
                return;
            }
            if (aqi <= 200) {
                unhealthy += 1;
                return;
            }
            if (aqi <= 300) {
                veryUnhealthy += 1;
                return;
            }
            if (aqi > 300) {
                hazardous += 1;
            }
        });
        const { createdOn } = stationWiseDate[0];
        return {
            ...s,
            label: key,
            value: stationWiseDate.length,
            good,
            moderate,
            unhealthyForSensitive,
            unhealthy,
            veryUnhealthy,
            hazardous,
            createdOn,
        };
    });
    const sortedData = visualData.sort(
        (a, b) => (a.label < b.label ? -1 : 1),
    );
    return sortedData;
};

const getPollutionSummary = memoize(
    (pollutionList: PageType.DataArchivePollution[]): ChartData[] | undefined => {
        const stationWise = groupList(
            pollutionList.filter(e => e.title),
            pollution => pollution.title || '',
        );
        if (stationWise) {
            return getAqiCount(stationWise);
        }
        return undefined;
    },
);


const PollutionViz = (props: Props) => {
    const { pollutionList } = props;
    const pollutionSummary = getPollutionSummary(pollutionList);
    return (
        <div className={styles.pollutionViz}>
            {pollutionSummary && (
                <div className={styles.aqiChart}>
                    <AqiChart
                        downloadId="pollutionSummary"
                        stationWiseData={pollutionSummary}
                    />
                </div>
            )}
        </div>
    );
};

export default PollutionViz;
