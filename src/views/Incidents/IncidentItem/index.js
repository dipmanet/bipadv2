import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import DateOutput from '#components/DateOutput';
import GeoOutput from '#components/GeoOutput';
import { reverseRoute } from '@togglecorp/fujs';
import { routes } from '#constants';
import _cs from '#cs';
import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {};

export default class Incidents extends React.PureComponent {
    static propTypes = propTypes
    static defaultProps = defaultProps

    render() {
        const {
            className,
            data: {
                title,
                incident_on: incidentOn,
                geoareaName,
                pk: incidentId,
            },
        } = this.props;

        return (
            <Link
                className={_cs(className, styles.incidentItem)}
                to={reverseRoute(routes.response.path, { incidentId })}
            >
                <header className={styles.header}>
                    <h3
                        title={title}
                        className={styles.heading}
                    >
                        { title }
                    </h3>
                </header>
                <GeoOutput
                    className={styles.geoOutput}
                    geoareaName={geoareaName}
                />
                <DateOutput
                    className={styles.dateOutput}
                    date={incidentOn}
                />
            </Link>
        );
    }
}
