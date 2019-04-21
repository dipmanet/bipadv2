import React from 'react';
import PropTypes from 'prop-types';
import { _cs, reverseRoute, mapToList } from '@togglecorp/fujs';
import { Link } from '@reach/router';

import FormattedDate from '#rscv/FormattedDate';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import Loss from '#components/Loss';
import { toTitleCase } from '#utils/common';

import styles from './styles.scss';


const emptyObject = {};
const emptyList = [];


const propTypes = {
    incident: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    wardsMap: PropTypes.object,
};

const defaultProps = {
    incident: {},
    wardsMap: {},
};

export default class IncidentInfo extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        const {
            incident,
            wardsMap,
            className,
            hideLink,
        } = this.props;

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
                title: eventTitle,
            } = {},

            loss = emptyObject,

            // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
            id, point, createdOn, polygon, hazardInfo,

            ...misc
        } = incident;

        const verifiedText = verified ? 'Yes' : 'No';
        const wardNames = wards.map(x => (wardsMap[x] || {}).title);

        // FIXME: move to constants
        const inducerText = {
            artificial: 'Non Natural',
            natural: 'Natural',
        };

        // FIXME: memoize later
        const miscInfo = mapToList(
            misc,
            (value, key) => ({ key: toTitleCase(key), value: value.toString() }),
        );

        return (
            <div className={_cs(styles.tooltip, className)}>
                <h2 className={styles.heading}>
                    {title}
                </h2>
                { !hideLink &&
                    <Link
                        className={styles.gotoResponseLink}
                        to={reverseRoute('/incidents/:incidentId/response', { incidentId: id })}
                    >
                        Go to response
                    </Link>
                }
                <DateOutput
                    className={styles.incidentDate}
                    date={incidentOn}
                />
                <GeoOutput
                    geoareaName={geoareaName}
                    className={styles.geoareaName}
                />
                <div className={styles.hr} />
                <TextOutput
                    className={styles.commonInfo}
                    label="Verified"
                    value={verifiedText}
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
                            mode="yyyy-MM-dd hh:mm"
                            value={reportedOn}
                        />
                    }
                />
                <Loss
                    className={styles.loss}
                    label="Loss"
                    loss={loss}
                />
                { miscInfo.length !== 0 && (
                    <React.Fragment>
                        <div className={styles.hr} />
                        <b> Misc </b>
                        <TextOutput
                            className={styles.commonInfo}
                            label="Wards"
                            value={wardNames.join(', ')}
                        />
                        {
                            // FIXME: use List
                            // FIXME: may need to differentiate number and string
                            miscInfo.map(x => (
                                <TextOutput
                                    className={styles.commonInfo}
                                    key={x.key}
                                    label={x.key}
                                    value={x.value}
                                />
                            ))
                        }
                    </React.Fragment>
                )}
            </div>
        );
    }
}
