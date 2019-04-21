import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import ReactSVG from 'react-svg';

import { _cs, reverseRoute } from '@togglecorp/fujs';

import { iconNames } from '#constants';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import GeoOutput from '#components/GeoOutput';
import { getHazardColor, getHazardIcon } from '#utils/domain';
import { getYesterday } from '#utils/common';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: undefined,
};

const isRecent = (date, recentDay) => {
    const yesterday = getYesterday(recentDay);
    const timestamp = new Date(date).getTime();
    return timestamp > yesterday;
};

export default class IncidentItem extends React.PureComponent {
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
            recentDay,
        } = this.props;

        const verifiedIconClass = verified ?
            _cs(styles.icon, iconNames.check, styles.verified) :
            _cs(styles.icon, iconNames.close, styles.notVerified);

        const icon = getHazardIcon(hazardTypes, hazard);
        const isNew = isRecent(incidentOn, recentDay);

        return (
            <Link
                className={_cs(
                    className,
                    styles.incidentItem,
                    isNew && styles.new,
                )}
                to={reverseRoute(':incidentId/response', { incidentId })}
            >
                <div className={styles.left}>
                    <ReactSVG
                        className={styles.svgContainer}
                        path={icon}
                        svgClassName={styles.icon}
                        style={{
                            color: getHazardColor(hazardTypes, hazard),
                        }}
                    />
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
                            alwaysVisible
                        />
                        <GeoOutput
                            className={styles.geoOutput}
                            geoareaName={streetAddress}
                            alwaysVisible
                        />
                        <TextOutput
                            label="Source"
                            value={source}
                            alwaysVisible
                        />
                    </div>
                </div>
            </Link>
        );
    }
}
