import React from 'react';
import { _cs, reverseRoute } from '@togglecorp/fujs';
import { Link } from '@reach/router';

import { iconNames } from '#constants';

import TextOutput from '#components/TextOutput';
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
                source,
                verified,
                id: incidentId,
            },
        } = this.props;

        const verifiedIconClass = verified ?
            `${iconNames.check} ${styles.verified}` :
            `${iconNames.close} ${styles.notVerified}`;

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
                <DateOutput
                    className={styles.dateOutput}
                    date={incidentOn}
                />
                <span className={verifiedIconClass} />
                <GeoOutput
                    className={styles.geoOutput}
                    geoareaName={streetAddress}
                />
                <TextOutput
                    label="Source"
                    value={source}
                />
            </Link>
        );
    }
}
