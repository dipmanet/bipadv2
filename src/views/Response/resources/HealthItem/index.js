import React from 'react';
import PropTypes from 'prop-types';

import { _cs } from '@togglecorp/fujs';
import Button from '#rsca/Button';
import DistanceOutput from '#components/DistanceOutput';

import { iconNames } from '#constants';

import styles from './styles.scss';

export default class Finance extends React.PureComponent {
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
