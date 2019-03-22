import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import DistanceOutput from '#components/DistanceOutput';

import { iconNames } from '#constants';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    distance: PropTypes.number.isReqired,
    point: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const defaultProps = {
    distance: 0,
};

export default class ResourceItem extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    handleShareButton = () => {
    }

    render() {
        const {
            className,
            title,
            distance,
            point: {
                coordinates,
            },
        } = this.props;

        const googleLink = `https://www.google.com/maps/?q=${coordinates[1]},${coordinates[0]}&ll=${coordinates[1]},${coordinates[0]}&=13z`;

        return (
            <div className={_cs(styles.resource, className)}>
                <div className={styles.leftContainer}>
                    <div className={styles.title}>
                        { title }
                    </div>
                    <DistanceOutput
                        value={distance / 1000}
                    />
                </div>
                <div className={styles.rightContainer}>
                    <a
                        className={styles.link}
                        href={googleLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className={iconNames.share} />
                    </a>
                </div>
            </div>
        );
    }
}
