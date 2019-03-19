import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import Loss from '#components/Loss';

import FormattedDate from '#rscv/FormattedDate';

import { mapToList } from '@togglecorp/fujs';


import { toTitleCase } from '#utils/common';

import styles from './styles.scss';


const emptyObject = {};
const emptyList = [];


const propTypes = {
    incident: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    wardsMap: PropTypes.object,
};

const defaultProps = {
    incident: '{}',
    wardsMap: {},
};

export default class Tooltip extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    memoizedJSONParse = memoize(JSON.parse)

    render() {
        const { incident: incidentString } = this.props;
        const incident = this.memoizedJSONParse(incidentString);
        const { wardsMap } = this.props;

        const {
            title,
            inducer,
            cause,
            source,
            verified,
            reportedOn,

            hazard: { title: hazardType } = emptyObject,
            incidentOn,
            wards = emptyList,
            streetAddress: geoareaName,
            event: {
                title: eventTitle = '-',
            } = {},

            loss = emptyObject,

            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
            id, point, createdOn, polygon, hazardInfo,

            ...misc
        } = incident;

        const wardNames = wards.map(x => (wardsMap[x] || {}).title);

        // FIXME: move to constants
        const inducerText = {
            artificial: 'Artificial',
            natural: 'Natural',
        };

        // FIXME: memoize later
        const miscInfo = mapToList(
            misc,
            (value, key) => ({ key: toTitleCase(key), value: value.toString() }),
        );

        return (
            <div className={styles.tooltip}>
                <h2 className={styles.heading}>
                    {title}
                </h2>
                <GeoOutput
                    geoareaName={geoareaName}
                    className={styles.geoareaName}
                />
                <DateOutput
                    className={styles.incidentDate}
                    date={incidentOn}
                />
                <div className={styles.hr} />
                <TextOutput
                    className={styles.commonInfo}
                    label="Verified"
                    value={verified}
                />
                <TextOutput
                    className={styles.commonInfo}
                    label="Source"
                    value={source}
                />
                <TextOutput
                    className={styles.inducer}
                    label="Inducer"
                    value={inducerText[inducer]}
                />
                <TextOutput
                    className={styles.cause}
                    label="Cause"
                    value={cause}
                />
                <TextOutput
                    className={styles.commonInfo}
                    label="Hazard"
                    value={hazardType}
                />
                <TextOutput
                    className={styles.commonInfo}
                    label="Event"
                    value={eventTitle}
                />
                <TextOutput
                    className={styles.commonInfo}
                    label="Reported On"
                    value={
                        <FormattedDate
                            mode="dd-MM-yyyy hh:mm:ss"
                            value={reportedOn}
                        />
                    }
                />
                <Loss
                    className={styles.loss}
                    label="Loss"
                    loss={loss}
                />
                <div className={styles.hr} />
                <b> Misc </b>
                <TextOutput
                    className={styles.commonInfo}
                    label="Wards"
                    value={wardNames.join(', ')}
                />
                {
                    // FIXME: use List
                    miscInfo.map(x => (
                        <TextOutput
                            className={styles.commonInfo}
                            key={x.key}
                            label={x.key}
                            value={x.value}
                        />
                    ))
                }
            </div>
        );
    }
}
