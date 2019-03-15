import React from 'react';
import { _cs, reverseRoute } from '@togglecorp/fujs';
import { Link } from '@reach/router';

import DateOutput from '#components/DateOutput';
import GeoOutput from '#components/GeoOutput';
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
                incidentOn,
                streetAddress,
                geoareaName,
                id: incidentId,
            },
        } = this.props;

        // FIXME:
        return (
            <Link
                className={_cs(className, styles.incidentItem)}
                to={reverseRoute(':incidentId/response', { incidentId })}
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
                    geoareaName={streetAddress}
                />
                <DateOutput
                    className={styles.dateOutput}
                    date={incidentOn}
                />
            </Link>
        );
    }
}
