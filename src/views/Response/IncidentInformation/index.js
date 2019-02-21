import React from 'react';
import PropTypes from 'prop-types';

import TextOutput from '#components/TextOutput';
import GeoOutput from '#components/GeoOutput';
import DateOutput from '#components/DateOutput';
import PeopleLoss from '#components/PeopleLoss';

import { _cs } from '@togglecorp/fujs';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: undefined,
};

const emptyList = [];
const emptyObject = {};

export default class IncidentInformation extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            className,
            incident: {
                title,
                inducer,
                cause,
                incident_on: incidentOn,
                geoareaName,
                loss: {
                    peoples = emptyList,
                } = emptyObject,
            },
        } = this.props;

        const inducerText = {
            artificial: 'Artificial',
            natural: 'Natural',
        };

        return (
            <div className={_cs(styles.incidentInformation, className)}>
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
                    className={styles.inducer}
                    label="Inducer"
                    value={inducerText[inducer]}
                />
                <TextOutput
                    className={styles.cause}
                    label="Cause"
                    value={cause}
                />
                <PeopleLoss
                    className={styles.peopleLoss}
                    label="People loss"
                    peopleList={peoples}
                />
            </div>
        );
    }
}
