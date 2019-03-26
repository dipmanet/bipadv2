import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import ReactSVG from 'react-svg';

import { _cs, reverseRoute } from '@togglecorp/fujs';

import { iconNames } from '#constants';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import GeoOutput from '#components/GeoOutput';
import { hazardIcons } from '#resources/data';
import { getHazardColor } from '#utils/domain';

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
                hazard,
                id: incidentId,
            },
            hazardTypes,
        } = this.props;

        const verifiedIconClass = verified ?
            _cs(styles.icon, iconNames.check, styles.verified) :
            _cs(styles.icon, iconNames.close, styles.notVerified);

        const icon = hazardIcons[hazard];

        return (
            <Link
                className={_cs(className, styles.incidentItem)}
                to={reverseRoute(':incidentId/response', { incidentId })}
            >
                <div className={styles.left}>
                    { icon ? (
                        <ReactSVG
                            className={styles.svgContainer}
                            path={icon}
                            svgClassName={styles.icon}
                            style={{
                                color: getHazardColor(hazardTypes, hazard),
                            }}
                        />
                    ) : (
                        <div
                            className={_cs(
                                iconNames.alert,
                                styles.defaultIcon,
                            )}
                        />
                    )}
                </div>
                <div className={styles.right}>
                    <header className={styles.header}>
                        <h3
                            title={title}
                            className={styles.heading}
                        >
                            { title }
                        </h3>
                        <span className={verifiedIconClass} />
                    </header>
                    <div className={styles.content}>
                        <DateOutput
                            value={incidentOn}
                        />
                        <GeoOutput
                            className={styles.geoOutput}
                            geoareaName={streetAddress}
                        />
                        <TextOutput
                            label="Source"
                            value={source}
                        />
                    </div>
                </div>
            </Link>
        );
    }
}
