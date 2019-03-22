import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

import { _cs, reverseRoute } from '@togglecorp/fujs';

import { iconNames } from '#constants';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import GeoOutput from '#components/GeoOutput';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: undefined,
};

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
                source,
                verified,
                id: incidentId,
            },
        } = this.props;

        const verifiedIconClass = verified ?
            `${iconNames.check} ${styles.verified}` :
            `${iconNames.close} ${styles.notVerified}`;

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
