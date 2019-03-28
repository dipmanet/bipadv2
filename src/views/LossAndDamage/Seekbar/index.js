import React from 'react';
import PropTypes from 'prop-types';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import SparkLine from '#rscz/SparkLine';
import styles from './styles.scss';

const propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    progress: PropTypes.number,
};

const defaultProps = {
    start: 0,
    end: 0,
    progress: 0,
};

const emptyList = [];
const emptyObject = {};

const bucketDuration = 1000 * 60 * 60 * 24;
const bucketedList = [];

const groupList = (lst, getBucketValue) => {
    const mem = {};

    const identifierList = lst.map(getBucketValue);

    identifierList.forEach((key, index) => {
        if (mem[key]) {
            mem[key].push(lst[index]);
        } else {
            mem[key] = [lst[index]];
        }
    });
    const start = Math.min(...identifierList);
    const end = Math.max(...identifierList);

    const output = [];
    for (let i = start; i <= end; i += 1) {
        output.push({ key: i, value: mem[i] || [] });
    }
    return output;
};

const DAY = 1000 * 60 * 60 * 24;

export default class Seekbar extends React.PureComponent {
    groupByIncidentCount = memoize((incidentList, duration) => {
        if (incidentList.length === 0) {
            return emptyList;
        }

        const mappedLst = incidentList
            .filter(incident => !!incident.incidentOn)
            .map(incident => ({
                ...incident,
                timestamp: new Date(incident.incidentOn).getTime(),
            }));


        return groupList(
            mappedLst,
            item => Math.floor(item.timestamp / DAY),
        ).map(
            item => ({
                value: item.value.length,
                label: (
                    <div>
                        <div>
                            Incident count: <strong>{item.value.length}</strong>
                        </div>
                        <div>
                            Date: {(new Date(item.key * DAY)).toLocaleDateString()}
                        </div>
                    </div>
                ),
            }),
        );
    })

    render() {
        const {
            className,
            progress: progressFromProps,
            start: startFromProps,
            end: endFromProps,
            data,
        } = this.props;

        // const progress = Math.min(100, Math.max(0, progressFromProps));
        const start = Math.min(100, Math.max(0, startFromProps));
        const end = Math.min(100, Math.max(0, endFromProps));

        const groupedIncidents = this.groupByIncidentCount(data, 1000 * 60 * 60 * 24 * 7);

        return (
            <div className={_cs(className, styles.seekbar)}>
                <div className={styles.graphContainer}>
                    <SparkLine
                        circleRadius={3}
                        className={styles.sparkLine}
                        data={groupedIncidents}
                    />
                </div>
                <div
                    style={{
                        left: `${start}%`,
                        width: `${end - start}%`,
                        // width: `${progress}%`,
                    }}
                    className={styles.progress}
                />
            </div>
        );
    }
}
